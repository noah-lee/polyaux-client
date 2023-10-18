import EffectNode from "@/audio/effect";
import { clamp } from "@/utils/math";

type DistortionEffectNodeOptions = {
  amount?: number;
  mix?: number;
  bypass?: boolean;
};

class DistortionEffectNode extends EffectNode {
  private _distortionNode: WaveShaperNode;
  private _amount: number;

  constructor(
    audioContext: AudioContext,
    options?: DistortionEffectNodeOptions
  ) {
    super(audioContext, options?.mix, options?.bypass);

    this._distortionNode = new WaveShaperNode(audioContext);
    this._amount = options?.amount ?? 0;
    this._distortionNode.curve = getDistortionCurve(audioContext, this._amount);

    this.input.connect(this._distortionNode);
    this._distortionNode.connect(this.wet);

    this.input.connect(this.dry);
  }

  get amount() {
    return this._amount;
  }

  set amount(amount: number) {
    const clampedAmount = clamp(amount, 0, 1);
    this._distortionNode.curve = getDistortionCurve(
      this.audioContext,
      clampedAmount
    );
    this._amount = clampedAmount;
  }
}

export default DistortionEffectNode;

const getDistortionCurve = (audioContext: AudioContext, amount: number) => {
  amount = Math.min(amount, 0.9999);
  const samples = audioContext.sampleRate;
  const curve = new Float32Array(samples);
  const k = (2 * amount) / (1 - amount);
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
};
