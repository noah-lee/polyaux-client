import CustomAudioNode from "@/audio/custom";

export type FilterNodeSettings = {
  type?: BiquadFilterType;
  frequency?: number;
  bypass?: boolean;
};

class FilterNode extends CustomAudioNode {
  private _filterNode: BiquadFilterNode;

  constructor(audioContext: AudioContext, options?: FilterNodeSettings) {
    super(audioContext, options?.bypass);

    this._filterNode = new BiquadFilterNode(audioContext, {
      type: options?.type,
      frequency: options?.frequency ?? 1000,
    });

    this.input.connect(this._filterNode);
    this._filterNode.connect(this.output);
  }

  get type() {
    return this._filterNode.type;
  }

  set type(type: BiquadFilterType) {
    this._filterNode.type = type;
  }

  get frequency() {
    return this._filterNode.frequency.value;
  }

  set frequency(frequency: number) {
    this._filterNode.frequency.value = frequency;
  }
}

export default FilterNode;
