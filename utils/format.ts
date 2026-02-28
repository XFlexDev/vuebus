export function formatMoney(amount: number, currency: 'EUR' = 'EUR'): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h <= 0) return `${m} min`
  return `${h}h ${String(m).padStart(2, '0')}m`
}

export function isoNow(): string {
  return new Date().toISOString()
}

export function safeId(prefix: string): string {
  const rand = Math.random().toString(16).slice(2)
  return `${prefix}_${Date.now().toString(16)}_${rand}`
}
