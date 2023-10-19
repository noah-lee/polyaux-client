import { clamp } from "@/utils/math";

type MonoOscillatorSettings = {
  type?: OscillatorType;
  gain?: number;
  octave?: number;
  disabled?: boolean;
};

class MonoOscillator {
  readonly audioContext: AudioContext;

  private _octave: number;
  private _disabled: boolean;

  private _oscillator: OscillatorNode;
  private _attenuator: GainNode;
  private _envelope: GainNode;
  private _gain: GainNode;
  private _frequency: number;
  private _playing: boolean;

  constructor(audioContext: AudioContext, options?: MonoOscillatorSettings) {
    this.audioContext = audioContext;

    this._octave = options?.octave ?? 0;
    this._disabled = options?.disabled ?? false;

    this._oscillator = new OscillatorNode(audioContext, {
      type: options?.type,
    });
    this._oscillator.start();

    this._attenuator = new GainNode(audioContext, { gain: 0.25 });

    this._envelope = new GainNode(audioContext, { gain: 0 });

    this._gain = new GainNode(audioContext, { gain: options?.gain ?? 0.5 });

    this._oscillator.connect(this._attenuator);
    this._attenuator.connect(this._envelope);
    this._envelope.connect(this._gain);

    this._playing = false;
    this._frequency = 440;
  }

  connect(node: AudioNode, output?: number, input?: number) {
    return this._gain.connect(node, output, input);
  }

  disconnect() {
    this._gain.disconnect();
  }

  get type() {
    return this._oscillator.type;
  }

  set type(type: OscillatorType) {
    this._oscillator.type = type;
  }

  get gain() {
    return this._gain.gain.value;
  }

  set gain(gain: number) {
    this._gain.gain.value = clamp(gain, 0, 1);
  }

  get frequency() {
    return this._frequency;
  }

  set frequency(frequency: number) {
    this._oscillator.frequency.value = frequency * 2 ** this.octave;
    this._frequency = frequency;
  }

  get octave() {
    return this._octave;
  }

  set octave(octave: number) {
    this._octave = clamp(octave, -3, 3);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(disabled: boolean) {
    if (disabled) {
      this.stop();
    }

    this._disabled = disabled;
  }

  start(frequency = 440, attack = 0, decay = 0, sustain = 1) {
    if (this.disabled) {
      return this.stop();
    }

    this.audioContext.resume();

    const now = this.audioContext.currentTime;

    this.frequency = frequency;

    this._envelope.gain.cancelScheduledValues(now);
    this._envelope.gain.setValueAtTime(0, now);
    this._envelope.gain.linearRampToValueAtTime(
      1,
      now + Math.max(attack, 0.015),
    );
    this._envelope.gain.linearRampToValueAtTime(sustain, now + attack + decay);

    this._playing = true;
  }

  stop(release = 0) {
    const now = this.audioContext.currentTime;

    this._envelope.gain.cancelAndHoldAtTime(now);
    this._envelope.gain.setTargetAtTime(0, now, release / 4);
    this._envelope.gain.setValueAtTime(0, now + release + 0.5);

    this._oscillator.frequency.setValueAtTime(0, now);

    this._playing = false;
  }

  get playing() {
    return this._playing;
  }
}

export default MonoOscillator;
