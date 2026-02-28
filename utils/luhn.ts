export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s+/g, '').replace(/-/g, '')
  if (!/^\d{12,19}$/.test(digits)) return false

  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

export function detectBrand(cardNumber: string): 'Visa' | 'Mastercard' | 'Amex' | 'Unknown' {
  const digits = cardNumber.replace(/\D/g, '')
  if (/^4/.test(digits)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  return 'Unknown'
}
