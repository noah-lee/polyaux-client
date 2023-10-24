import EffectNode from "@/audio/effect";
import { clamp } from "@/utils/math";

export type ReverbEffectNodeOptions = {
  decay?: number;
  mix?: number;
  bypass?: boolean;
};

class ReverbEffectNode extends EffectNode {
  private _convolverNode: ConvolverNode;
  private _decay: number;

  constructor(audioContext: AudioContext, options?: ReverbEffectNodeOptions) {
    super(audioContext, options?.mix, options?.bypass);

    this._convolverNode = new ConvolverNode(audioContext);
    this._decay = options?.decay ?? 1;
    this._convolverNode.buffer = generateImpulseResponse(
      audioContext,
      this._decay
    );

    this.input.connect(this._convolverNode);
    this._convolverNode.connect(this.wet);

    this.input.connect(this.dry);
  }

  get decay() {
    return this._decay;
  }

  set decay(decay: number) {
    const clampedDecay = clamp(decay, 0, 20);
    this._convolverNode.buffer = generateImpulseResponse(
      this.audioContext,
      clampedDecay
    );
    this._decay = clampedDecay;
  }
}

const generateImpulseResponse = (audioContext: AudioContext, decay: number) => {
  const duration = 3;
  const rate = audioContext.sampleRate;
  const length = Math.max(rate * decay, 1);
  const impulse = audioContext.createBuffer(2, length, rate);
  const impulseL = impulse.getChannelData(0);
  const impulseR = impulse.getChannelData(1);
  for (let i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, duration);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, duration);
  }
  return impulse;
};

export default ReverbEffectNode;
