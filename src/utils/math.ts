export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

export const percentage = (value: number, min: number, max: number) => {
  return (value - min) / (max - min)
}

export const linearToExponential = (
  linearValue: number,
  exponentialMin: number,
  exponentialMax: number,
  linearMin: number,
  linearMax: number,
  power: number = 2
) => {
  return (
    Math.pow(linearMax - linearMin, -power) *
      (exponentialMax - exponentialMin) *
      Math.pow(linearValue - linearMin, power) +
    exponentialMin
  )
}

export const exponentialToLinear = (
  exponentialValue: number,
  exponentialMin: number,
  exponentialMax: number,
  linearMin: number,
  linearMax: number,
  power: number = 2
) => {
  return (
    Math.pow(
      (exponentialValue - exponentialMin) /
        (Math.pow(linearMax - linearMin, -power) *
          (exponentialMax - exponentialMin)),
      1 / power
    ) + linearMin
  )
}

export const movingAverage = (values: number[], window: number) => {
  if (values.length < window) {
    return
  }
  const result = []
  for (let i = window; i <= values.length; i++) {
    const windowValues = values.slice(i - window, i)
    const windowSum = windowValues.reduce((sum, curr) => sum + curr, 0)
    result.push(windowSum / window)
  }
  return result
}

// Reference: https://corporatefinanceinstitute.com/resources/capital-markets/weighted-moving-average-wma/
export const weightedMovingAverage = (values: number[], window?: number) => {
  const count = window || values.length
  return (
    values.reduce((prev, curr, index) => curr * (index + 1) + prev, 0) /
    ((count * (count + 1)) / 2)
  )
}

export const rxx = (data: Float32Array | Uint8Array, lag: number) => {
  let correlation = 0
  for (let i = 0; i < data.length - lag; i++) {
    correlation += data[i] * data[i + lag]
  }
  return correlation
}

export const autocorrelation = (data: Float32Array | Uint8Array) => {
  const correlations = []
  for (let lag = 0; lag < data.length; lag++) {
    correlations[lag] = rxx(data, lag)
  }
  return correlations
}

export const maximumAbsoluteScaling = (data: number[]) => {
  const max = Math.abs(Math.max(...data))
  return data.map((value) => value / max)
}

export const normalize = (
  data: number[] | Float32Array | Uint8Array,
  min: number = 0,
  max: number = 1
) => {
  let currentMin = data[0]
  let currentMax = data[0]

  for (let i = 1; i < data.length; i++) {
    currentMin = data[i] < currentMin ? data[i] : currentMin
    currentMax = data[i] > currentMax ? data[i] : currentMax
  }

  const currentRange = currentMax - currentMin
  const normalizedRange = max - min

  return data.map(
    (value) => ((value + currentMin) / currentRange) * normalizedRange - min
  )
}

export const maxCorrelationIndex = (correlations: number[]) => {
  let maxCorrelation = 0
  let maxCorrelationIndex = 0

  let threshold = correlations[0] * 0.5
  let direction = 'down'

  for (let i = 1; i < correlations.length; i++) {
    const previousCorrelation = correlations[i - 1]
    const currentCorrelation = correlations[i]

    // Switch correlation direction
    if (
      direction === 'down' &&
      currentCorrelation > previousCorrelation &&
      currentCorrelation > threshold
    ) {
      direction = 'up'
    }

    // Max correlation value for this period
    if (direction === 'up' && currentCorrelation < previousCorrelation) {
      if (previousCorrelation > maxCorrelation) {
        maxCorrelation = previousCorrelation
        maxCorrelationIndex = i - 1
      }
      threshold = currentCorrelation * 0.5
      direction = 'down'
    }
  }

  return { value: maxCorrelation, index: maxCorrelationIndex }
}
