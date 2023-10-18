export const getAveragePower = (data: Float32Array) => {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    sum += data[i] ** 2;
  }

  return sum / data.length;
};

export const toDecibel = (value: number) => {
  return 20 * Math.log10(value);
};

export const fromDecibel = (decibel: number) => {
  return 10 ** (decibel / 20);
};
