import { clamp } from "@/utils/math";

class AudioPlayer {
  audioContext: AudioContext;
  gainNode: GainNode;

  isPlaying: boolean;
  playTime: number;
  offsetTime: number;

  audioBuffer?: AudioBuffer;
  sourceNode?: AudioBufferSourceNode;

  private _onended?: (event: Event) => void;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;

    this.gainNode = new GainNode(this.audioContext);

    this.isPlaying = false;
    this.playTime = 0;
    this.offsetTime = 0;
  }

  reset() {
    this.isPlaying = false;
    this.playTime = 0;
    this.offsetTime = 0;
  }

  load(audioBuffer: AudioBuffer) {
    this.audioBuffer = audioBuffer;
    if (this.isPlaying) {
      this.stop();
    } else {
      this.reset();
    }
  }

  initialize() {
    if (!this.audioBuffer) {
      return;
    }

    this.sourceNode = new AudioBufferSourceNode(this.audioContext);
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    this.sourceNode.onended = (event) => {
      if (this.time >= this.duration) {
        this.reset();
      }
      this._onended?.(event);
    };
  }

  play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;

    this.initialize();
    this.sourceNode?.start(0, this.offsetTime);
    this.playTime = this.audioContext.currentTime;
  }

  pause() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;

    this.sourceNode?.stop();
    this.offsetTime += this.audioContext.currentTime - this.playTime;
  }

  stop() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;

    this.sourceNode?.stop();
    this.reset();
  }

  seek(time: number) {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.offsetTime = time;
    if (wasPlaying) {
      this.play();
    }
  }

  get duration() {
    return this.audioBuffer?.duration ?? 0;
  }

  get time() {
    if (this.isPlaying) {
      return this.audioContext.currentTime - this.playTime + this.offsetTime;
    } else {
      return this.offsetTime;
    }
  }

  get ready() {
    return !!this.audioBuffer;
  }

  get volume() {
    return this.gainNode.gain.value;
  }

  set volume(value: number) {
    const clampedValue = clamp(value, 0, 2);
    this.gainNode.gain.setTargetAtTime(
      clampedValue,
      this.audioContext.currentTime,
      0.05
    );
  }

  set onended(callback: (event: Event) => void) {
    this._onended = callback;
  }
}

export default AudioPlayer;
