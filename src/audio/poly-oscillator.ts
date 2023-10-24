import MonoOscillator from "@/audio/mono-oscillator";
import { clamp } from "@/utils/math";

export type PolyOscillatorSettings = {
  voices?: number;
  type?: OscillatorType;
  gain?: number;
  octave?: number;
  disabled?: boolean;
};

class PolyOscillator {
  readonly audioContext: AudioContext;

  private _voices: number;

  private monoSynths: MonoOscillator[];

  constructor(audioContext: AudioContext, options?: PolyOscillatorSettings) {
    this.audioContext = audioContext;

    this._voices = options?.voices ?? 8;

    this.monoSynths = Array(clamp(this._voices, 1, 16))
      .fill(0)
      .map(() => new MonoOscillator(audioContext, options));
  }

  connect(node: AudioNode, output?: number, input?: number) {
    this.monoSynths.forEach((monoSynth) =>
      monoSynth.connect(node, output, input),
    );
  }

  disconnect() {
    this.monoSynths.forEach((monoSynth) => monoSynth.disconnect());
  }

  get type() {
    return this.monoSynths[0].type;
  }

  set type(type: OscillatorType) {
    this.monoSynths.forEach((monoSynth) => (monoSynth.type = type));
  }

  get gain() {
    return this.monoSynths[0].gain;
  }

  set gain(gain: number) {
    this.monoSynths.forEach((monoSynth) => (monoSynth.gain = gain));
  }

  get octave() {
    return this.monoSynths[0].octave;
  }

  set octave(octave: number) {
    this.monoSynths.forEach((monoSynth) => (monoSynth.octave = octave));
  }

  get disabled() {
    return this.monoSynths[0].disabled;
  }

  set disabled(disabled: boolean) {
    this.monoSynths.forEach((monoSynth) => (monoSynth.disabled = disabled));
  }

  start(frequency: number, attack = 0, decay = 0, sustain = 1) {
    const playing = this.monoSynths.find(
      (monoSynth) => monoSynth.playing && monoSynth.frequency === frequency,
    );

    if (playing) {
      return;
    }

    const available = this.monoSynths.find((monoSynth) => !monoSynth.playing);

    if (!available) {
      return;
    }

    available.start(frequency, attack, decay, sustain);
  }

  stop(frequency: number, release = 0) {
    const playing = this.monoSynths.find(
      (monoSynth) => monoSynth.playing && monoSynth.frequency === frequency,
    );

    if (!playing) {
      return;
    }

    playing.stop(release);
  }

  get playing() {
    return this.monoSynths.map((monoSynth) => monoSynth.playing);
  }

  get frequency() {
    return this.monoSynths.map((monoSynth) => monoSynth.frequency);
  }
}

export default PolyOscillator;
