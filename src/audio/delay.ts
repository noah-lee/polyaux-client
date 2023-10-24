import EffectNode from "@/audio/effect";
import { clamp } from "@/utils/math";

export type DelayEffectNodeOptions = {
  delayTime?: number;
  feedback?: number;
  mix?: number;
  bypass?: boolean;
};

class DelayEffectNode extends EffectNode {
  private _delayNode: DelayNode;
  private _feedbackNode: GainNode;

  constructor(audioContext: AudioContext, options?: DelayEffectNodeOptions) {
    super(audioContext, options?.mix, options?.bypass);

    this._delayNode = new DelayNode(audioContext, {
      delayTime: options?.delayTime ?? 0.75,
      maxDelayTime: 5,
    });

    this._feedbackNode = new GainNode(audioContext, {
      gain: options?.feedback ?? 0.25,
    });

    this.input.connect(this.wet);
    this.wet.connect(this._delayNode);
    this._delayNode.connect(this._feedbackNode);
    this._feedbackNode.connect(this._delayNode);
    this._delayNode.connect(this.output);

    this.input.connect(this.dry);
  }

  get delayTime() {
    return this._delayNode.delayTime.value;
  }

  set delayTime(delayTime: number) {
    this._delayNode.delayTime.value = delayTime;
  }

  get feedback() {
    return this._feedbackNode.gain.value;
  }

  set feedback(feedback: number) {
    this._feedbackNode.gain.value = clamp(feedback, 0, 1);
  }
}

export default DelayEffectNode;
