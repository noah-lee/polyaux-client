import CustomAudioNode from "@/audio/custom";
import { clamp } from "@/utils/math";

class EffectNode extends CustomAudioNode {
  private _mix: number;

  readonly dry: GainNode;
  readonly wet: GainNode;

  constructor(audioContext: AudioContext, mix: number = 0.5, bypass?: boolean) {
    super(audioContext, bypass);

    this._mix = clamp(mix, 0, 1);
    this.dry = new GainNode(audioContext);
    this.wet = new GainNode(audioContext);

    this.wet.gain.value = this._mix;
    this.dry.gain.value = 1 - this._mix;

    this.wet.connect(this.output);
    this.dry.connect(this.output);
  }

  get mix() {
    return this._mix;
  }

  set mix(value: number) {
    const now = this.audioContext.currentTime;

    const clampedValue = clamp(value, 0, 1);

    this.wet.gain.setTargetAtTime(clampedValue, now, 0.01);
    this.dry.gain.setTargetAtTime(1 - clampedValue, now, 0.01);

    this._mix = clampedValue;
  }
}

export default EffectNode;
