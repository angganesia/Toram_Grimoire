export function numberToFixed(number: number, digits: number): number {
  const base = Math.pow(10, digits)
  return Math.floor(number * base) / base
}

/**
 * Get random integer between min and max. (include min, not include max)
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export function normalizeInteger(value: string | number): number {
  if (typeof value !== 'number') {
    value = parseInt(value, 10)
  }
  if (Number.isNaN(value)) {
    value = 0
  }
  return value
}
