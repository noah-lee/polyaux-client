class LoudnessMeter {
  offlineAudioContext: OfflineAudioContext | undefined;
  sourceNode: AudioBufferSourceNode | undefined;
  worker: Worker;

  onProgressCallback?: (progress: number) => void;
  onCompleteCallback?: (loudness: {
    integrated: number;
    short: number;
    momentary: number;
  }) => void;

  constructor() {
    this.worker = new Worker(new URL("worker", import.meta.url));

    this.worker.onmessage = (event) => {
      switch (event.data?.type) {
        case "complete":
          this.onCompleteCallback?.(event.data.value);
          break;
        case 'progress':
          this.onProgressCallback?.(event.data.value.progress)
          break
        default:
        // No default
      }
    };
  }

  load(audioBuffer: AudioBuffer) {
    this.offlineAudioContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate,
    );

    this.sourceNode = new AudioBufferSourceNode(this.offlineAudioContext);
    this.sourceNode.buffer = audioBuffer;

    const hsfNode = highShelfFilterNode(this.offlineAudioContext);
    const hpfNode = highPassFilterNode(this.offlineAudioContext);
    this.sourceNode.connect(hsfNode);
    hsfNode.connect(hpfNode);
    hpfNode.connect(this.offlineAudioContext.destination);

    this.worker.postMessage({
      type: "initialize",
      value: {
        numberOfChannels: audioBuffer.numberOfChannels,
        bufferSize: audioBuffer.length,
        sampleRate: audioBuffer.sampleRate,
      },
    });
  }

  async start() {
    if (!this.sourceNode || !this.offlineAudioContext) {
      return;
    }

    this.sourceNode.start();
    const kWeightedAudioBuffer =
      await this.offlineAudioContext.startRendering();
    const chunkSize = Math.ceil((50 / 1000) * kWeightedAudioBuffer.sampleRate);

    for (
      let frameIndex = 0;
      frameIndex < kWeightedAudioBuffer.length;
      frameIndex += chunkSize
    ) {
      const chunk = [];
      for (
        let channel = 0;
        channel < kWeightedAudioBuffer.numberOfChannels;
        channel++
      ) {
        chunk[channel] = new Float32Array(chunkSize);
        kWeightedAudioBuffer.copyFromChannel(
          chunk[channel],
          channel,
          frameIndex,
        );
      }
      this.worker.postMessage({ type: "process", value: { chunk: chunk } });
    }
  }

  terminate() {
    this.worker.terminate();
  }

  onProgress(callback: (progress: number) => void) {
    this.onProgressCallback = callback;
  }

  onComplete(
    callback: (loudness: {
      integrated: number;
      short: number;
      momentary: number;
    }) => void,
  ) {
    this.onCompleteCallback = callback;
  }
}

export default LoudnessMeter;

function highPassFilterCoefficients(sampleRate: number) {
  const f0 = 38.13547087602444;
  const Q = 0.5003270373238773;
  const K = Math.tan((Math.PI * f0) / sampleRate);

  const denominator1 = (2 * (K * K - 1)) / (1 + K / Q + K * K);
  const denominator2 = (1 - K / Q + K * K) / (1 + K / Q + K * K);
  const numerator0 = 1;
  const numerator1 = -2;
  const numerator2 = 1;

  return {
    numerators: [numerator0, numerator1, numerator2],
    denominators: [1, denominator1, denominator2],
  };
}

function highPassFilterNode(audioContext: BaseAudioContext) {
  const coefficients = highPassFilterCoefficients(audioContext.sampleRate);
  return audioContext.createIIRFilter(
    coefficients.numerators,
    coefficients.denominators,
  );
}

function highShelfFilterCoefficients(sampleRate: number) {
  const db = 3.999843853973347;
  const f0 = 1681.974450955533;
  const Q = 0.7071752369554196;
  const K = Math.tan((Math.PI * f0) / sampleRate);

  const Vh = Math.pow(10, db / 20);
  const Vb = Math.pow(Vh, 0.4996667741545416);

  const denominator0 = 1 + K / Q + K * K;
  const denominator1 = (2 * (K * K - 1)) / denominator0;
  const denominator2 = (1 - K / Q + K * K) / denominator0;
  const numerator0 = (Vh + (Vb * K) / Q + K * K) / denominator0;
  const numerator1 = (2 * (K * K - Vh)) / denominator0;
  const numerator2 = (Vh - (Vb * K) / Q + K * K) / denominator0;

  return {
    numerators: [numerator0, numerator1, numerator2],
    denominators: [1, denominator1, denominator2],
  };
}

function highShelfFilterNode(audioContext: BaseAudioContext) {
  const coefficients = highShelfFilterCoefficients(audioContext.sampleRate);
  return audioContext.createIIRFilter(
    coefficients.numerators,
    coefficients.denominators,
  );
}
