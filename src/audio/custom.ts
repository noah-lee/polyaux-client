class CustomAudioNode extends GainNode {
  readonly audioContext: AudioContext

  private _bypass: boolean

  private prefix: GainNode
  readonly input: GainNode
  readonly output: GainNode

  constructor(audioContext: AudioContext, bypass?: boolean) {
    super(audioContext)

    this.audioContext = audioContext

    this._bypass = bypass ?? false

    this.prefix = new GainNode(audioContext)
    this.input = new GainNode(audioContext)
    this.output = new GainNode(audioContext)

    this.connect(this.prefix)
    this.route()

    this.connect = this._customConnect
    this.disconnect = this._customDisconnect
  }

  private _customConnect(
    node: AudioNode | AudioParam,
    output?: number,
    input?: number
  ) {
    if (node instanceof AudioNode) {
      return this.output.connect(node, output, input)
    }
    return this.output
  }

  private _customDisconnect() {
    this.output.disconnect()
  }

  private route() {
    if (!this.bypass) {
      this.prefix.connect(this.input)
    } else {
      this.prefix.connect(this.output)
    }
  }

  get bypass() {
    return this._bypass
  }

  set bypass(bypass: boolean) {
    this._bypass = bypass
    this.prefix.disconnect()
    this.route()
  }
}

export default CustomAudioNode
