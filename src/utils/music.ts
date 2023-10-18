export enum Tone {
  WHOLE,
  SEMI,
}

export const noteKeys: { noteKey: string; frequency: number; tone: Tone }[] = [
  {
    noteKey: "a",
    frequency: 261.63,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "w",
    frequency: 277.18,
    tone: Tone.SEMI,
  },
  {
    noteKey: "s",
    frequency: 293.66,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "e",
    frequency: 311.13,
    tone: Tone.SEMI,
  },
  {
    noteKey: "d",
    frequency: 329.63,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "f",
    frequency: 349.23,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "t",
    frequency: 369.99,
    tone: Tone.SEMI,
  },
  {
    noteKey: "g",
    frequency: 392,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "y",
    frequency: 415.3,
    tone: Tone.SEMI,
  },
  {
    noteKey: "h",
    frequency: 440,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "u",
    frequency: 466.16,
    tone: Tone.SEMI,
  },
  {
    noteKey: "j",
    frequency: 493.88,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "k",
    frequency: 523.25,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "o",
    frequency: 554.37,
    tone: Tone.SEMI,
  },
  {
    noteKey: "l",
    frequency: 587.33,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "p",
    frequency: 622.25,
    tone: Tone.SEMI,
  },
  {
    noteKey: ";",
    frequency: 659.25,
    tone: Tone.WHOLE,
  },
  {
    noteKey: "'",
    frequency: 698.46,
    tone: Tone.WHOLE,
  },
];

const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Reference: https://math.stackexchange.com/questions/930232/how-to-find-the-number-of-semitones-between-two-frequencies
export const getClosestNote = (
  frequency: number,
  referenceFrequency: number = 440,
  referenceNote: string = "A"
) => {
  const semitoneOffset = Math.round(
    12 * Math.log2(frequency / referenceFrequency)
  );

  const referenceNoteOffset = NOTE_NAMES.indexOf(referenceNote);

  const note =
    NOTE_NAMES[
      ((semitoneOffset % NOTE_NAMES.length) +
        NOTE_NAMES.length +
        referenceNoteOffset) %
        NOTE_NAMES.length
    ];

  return note;
};

export const getClosestOctave = (
  frequency: number,
  referenceFrequency: number = 440,
  referenceNote: string = "A",
  referenceOctave: number = 4
) => {
  const semitoneOffset = Math.round(
    12 * Math.log2(frequency / referenceFrequency)
  );

  const referenceNoteOffset = NOTE_NAMES.indexOf(referenceNote);

  const octave =
    Math.floor((semitoneOffset + referenceNoteOffset) / 12) + referenceOctave;

  return octave;
};

// Reference https://pages.mtu.edu/~suits/NoteFreqCalcs.html
export const getClosestNoteFrequency = (
  frequency: number,
  referenceFrequency: number = 440
) => {
  const semitoneRatio = 2 ** (1 / 12);

  const semitoneOffset = Math.round(
    12 * Math.log2(frequency / referenceFrequency)
  );

  const noteFrequency = referenceFrequency * semitoneRatio ** semitoneOffset;

  return noteFrequency;
};

export const getCentsOffset = (
  frequency: number,
  referenceFrequency: number
) => {
  return 1200 * Math.log2(frequency / referenceFrequency);
};
