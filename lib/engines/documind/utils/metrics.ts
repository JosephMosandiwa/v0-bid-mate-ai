const counters: Record<string, number> = {}

export function incr(metric: string, by = 1) {
  counters[metric] = (counters[metric] || 0) + by
}

export function getMetrics() {
  return { ...counters }
}

export function resetMetrics() {
  for (const k of Object.keys(counters)) delete counters[k]
}

export default { incr, getMetrics, resetMetrics }
