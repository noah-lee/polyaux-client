import CustomAudioNode from "@/audio/custom";
import { clamp } from "@/utils/math";

export type LfoNodeSettings = {
  type?: OscillatorType;
  frequency?: number;
  amplitude?: number;
  bypass?: boolean;
};

class LfoNode extends CustomAudioNode {
  private _oscillatorNode: OscillatorNode;
  private _amplitudeNode: GainNode;
  private _offsetNode: ConstantSourceNode;
  private _gainNode: GainNode;

  constructor(audioContext: AudioContext, options?: LfoNodeSettings) {
    super(audioContext, options?.bypass);

    this._oscillatorNode = new OscillatorNode(audioContext, {
      type: options?.type,
      frequency: options?.frequency ?? 2,
    });
    this._oscillatorNode.start();

    this._amplitudeNode = new GainNode(audioContext, {
      gain: options?.amplitude ?? 0.5,
    });

    this._offsetNode = new ConstantSourceNode(audioContext, { offset: -1 });
    this._offsetNode.start();

    this._gainNode = new GainNode(audioContext);

    this._oscillatorNode.connect(this._amplitudeNode); // -1 to 1
    this._offsetNode.connect(this._amplitudeNode); // -1 offset -> -2 to 0
    this._amplitudeNode.connect(this._gainNode.gain); // 0.5 multiplier -> -1 to 0
    this.input.connect(this._gainNode);
    this._gainNode.connect(this.output);
  }

  get type() {
    return this._oscillatorNode.type;
  }

  set type(type: OscillatorType) {
    this._oscillatorNode.type = type;
  }

  get frequency() {
    return this._oscillatorNode.frequency.value;
  }

  set frequency(frequency: number) {
    this._oscillatorNode.frequency.value = frequency;
  }

  get amplitude() {
    return this._amplitudeNode.gain.value;
  }

  set amplitude(amplitude: number) {
    this._amplitudeNode.gain.value = clamp(amplitude, 0, 1);
  }
}

export default LfoNode;
