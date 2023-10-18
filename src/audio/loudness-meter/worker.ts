const MOMENTARY_BLOCK_DURATION = 0.4;
const SHORT_BLOCK_DURATION = 3;
const CHANNEL_WEIGHTINGS = [1, 1, 1, 1.41, 1.41]; // L, R, C, LS, RS
const ABSOLUTE_THRESHOLD = -70;

const meanSquare = (values: Float32Array) => {
  let sum = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    sum += Math.pow(values[i], 2);
  }
  return sum / values.length;
};

const sum = (values: number[]) => {
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum;
};

const channelWeighting = (powers: number[]) => {
  return powers.map((power, channel) => power * CHANNEL_WEIGHTINGS[channel]);
};

const powersToLoudness = (powers: number[]) => {
  return -0.691 + 10 * Math.log10(sum(channelWeighting(powers)));
};

const measurementsToMeanPowers = (measurements: Measurement[]) => {
  const sumPowers = measurements.reduce(
    (acc, curr) =>
      curr.powers.map((power, channel) => power + (acc[channel] ?? 0)),
    [] as number[],
  );

  const meanPowers = sumPowers.map(
    (sumPower) => sumPower / measurements.length,
  );

  return meanPowers;
};

const blocksToIntegratedLoudness = (blocks: Block[]) => {
  const measurements = blocks.map(
    (block) => new Measurement(block.extractFrames()),
  );

  const absoluteMeasurements = measurements.filter(
    (measurement) => measurement.loudness >= ABSOLUTE_THRESHOLD,
  );

  const absoluteMeanPowers = measurementsToMeanPowers(absoluteMeasurements);

  const relativeThreshold = powersToLoudness(absoluteMeanPowers) - 10;

  const relativeMeasurements = absoluteMeasurements.filter(
    (measurement) => measurement.loudness >= relativeThreshold,
  );

  const relativeMeanPowers = measurementsToMeanPowers(relativeMeasurements);

  return powersToLoudness(relativeMeanPowers);
};

const blocksToMaxLoudness = (blocks: Block[]) => {
  const measurements = blocks.map(
    (block) => new Measurement(block.extractFrames()),
  );

  const loudnesses = measurements.map((measurement) => measurement.loudness);

  return loudnesses.reduce(
    (max, loudness) => Math.max(max, loudness),
    -Number.MAX_VALUE,
  );
};

class Measurement {
  powers: number[];
  loudness: number;

  constructor(frames: Float32Array[]) {
    this.powers = frames.map((samples) => meanSquare(samples));
    this.loudness = powersToLoudness(this.powers);
  }
}

class Bin {
  size: number;

  count: number;
  samples: Float32Array;

  constructor(size: number) {
    this.size = size;

    this.count = 0;
    this.samples = new Float32Array(this.size);
  }

  add(channelBlock: Float32Array) {
    const remaining = this.size - this.count;
    const remainder = channelBlock.slice(0, remaining);
    this.samples.set(remainder, this.count);
    this.count += remainder.length;
  }

  get full() {
    return this.count === this.size;
  }
}

class Block {
  numberOfChannels: number;
  size: number;

  count: number;
  bins: Bin[];

  constructor(numberOfChannels: number, size: number) {
    this.numberOfChannels = numberOfChannels;
    this.size = size;

    this.count = 0;
    this.bins = Array(this.numberOfChannels)
      .fill(0)
      .map(() => new Bin(this.size));
  }

  add(block: Float32Array[]) {
    this.bins.forEach((bin, channel) => bin.add(block[channel]));
    this.count += block[0].length;
  }

  extractFrames() {
    return this.bins.map((bin) => bin.samples);
  }

  get full() {
    return this.count > this.size;
  }
}

class LoudnessWorker {
  numberOfChannels: number;
  bufferSize: number;
  momentarySize: number;
  shortSize: number;
  marginSize: number;
  processedSize: number;
  marginCount: number;

  partialMomentaryBlocks: Block[];
  momentaryBlocks: Block[];

  partialShortBlocks: Block[];
  shortBlocks: Block[];

  constructor() {
    this.numberOfChannels = 0;
    this.bufferSize = 0;

    this.momentarySize = 0;
    this.shortSize = 0;
    this.marginSize = 0;

    this.processedSize = 0;
    this.marginCount = 0;

    this.partialMomentaryBlocks = [];
    this.momentaryBlocks = [];

    this.partialShortBlocks = [];
    this.shortBlocks = [];
  }

  initialize(numberOfChannels: number, bufferSize: number, sampleRate: number) {
    this.numberOfChannels = numberOfChannels;
    this.bufferSize = bufferSize;

    this.momentarySize = MOMENTARY_BLOCK_DURATION * sampleRate;
    this.shortSize = SHORT_BLOCK_DURATION * sampleRate;
    this.marginSize = this.momentarySize * 0.25; // 75% overlap

    this.processedSize = 0;
    this.marginCount = 0;

    this.partialMomentaryBlocks = [
      new Block(this.numberOfChannels, this.momentarySize),
    ];
    this.momentaryBlocks = [];

    this.partialShortBlocks = [
      new Block(this.numberOfChannels, this.shortSize),
    ];
    this.shortBlocks = [];
  }

  process(chunk: Float32Array[]) {
    const chunkSize = chunk[0].length;

    if (this.marginCount + chunkSize >= this.marginSize) {
      this.partialMomentaryBlocks.push(
        new Block(this.numberOfChannels, this.momentarySize),
      );
      this.partialShortBlocks.push(
        new Block(this.numberOfChannels, this.shortSize),
      );
    }

    this.partialMomentaryBlocks = this.partialMomentaryBlocks.filter(
      (block) => {
        if (block.full) {
          this.momentaryBlocks.push(block);
          return false;
        } else {
          block.add(chunk);
          return true;
        }
      },
    );

    this.partialShortBlocks = this.partialShortBlocks.filter((block) => {
      if (block.full) {
        this.shortBlocks.push(block);
        return false;
      } else {
        block.add(chunk);
        return true;
      }
    });

    this.processedSize = this.processedSize + chunkSize;

    this.marginCount = (this.marginCount + chunkSize) % this.marginSize;

    postMessage({
      type: "progress",
      value: { progress: (this.processedSize / this.bufferSize) * 0.8 },
    });

    if (this.processedSize >= this.bufferSize) {
      this.calculate();
    }
  }

  calculate() {
    const integrated = blocksToIntegratedLoudness(this.momentaryBlocks);

    postMessage({
      type: "progress",
      value: { progress: 0.9 },
    });

    const short = blocksToMaxLoudness(this.shortBlocks);

    postMessage({
      type: "progress",
      value: { progress: 0.95 },
    });

    const momentary = blocksToMaxLoudness(this.momentaryBlocks);

    postMessage({
      type: "progress",
      value: { progress: 1 },
    });

    postMessage({
      type: "complete",
      value: {
        integrated,
        short,
        momentary,
      },
    });
  }

  reset() {}
}

const loudnessWorker = new LoudnessWorker();

onmessage = (event: MessageEvent) => {
  const { type, value } = event.data;

  switch (type) {
    case "initialize":
      loudnessWorker.initialize(
        value.numberOfChannels,
        value.bufferSize,
        value.sampleRate,
      );
      break;
    case "process":
      loudnessWorker.process(value.chunk);
      break;
    default:
    // No default
  }
};
