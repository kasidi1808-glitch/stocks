export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

export function asFiniteNumber(value: unknown): number | null {
  return isFiniteNumber(value) ? value : null
}
