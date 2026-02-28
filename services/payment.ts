/**
 * Fake payment service (demo only).
 * - Validates card number via Luhn
 * - Simulates processing delay and 3DS requirement
 * - Returns deterministic outcomes for card numbers ending with:
 *   0001 → succeed
 *   0002 → decline
 *   0003 → 3DS fail
 */
import type { PaymentIntent, PaymentMethod } from '../models'
import { detectBrand, luhnCheck } from '../utils/luhn'
import { isoNow, safeId } from '../utils/format'

export type CreatePaymentInput = {
  amount: number
  currency: 'EUR'
  cardNumber: string
  expMonth: number
  expYear: number
  cvc: string
  holderName: string
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function tail4(s: string) {
  const digits = s.replace(/\D/g, '')
  return digits.slice(-4).padStart(4, '0')
}

export async function createPaymentIntent(input: CreatePaymentInput): Promise<{
  intent: PaymentIntent
  method: PaymentMethod
}> {
  const digits = input.cardNumber.replace(/\D/g, '')
  if (!luhnCheck(digits)) {
    return {
      intent: {
        id: safeId('pi'),
        amount: input.amount,
        currency: input.currency,
        status: 'failed',
        createdAt: isoNow(),
        failureReason: 'Invalid card number'
      },
      method: {
        id: safeId('pm'),
        brand: detectBrand(digits),
        last4: tail4(digits),
        expMonth: input.expMonth,
        expYear: input.expYear,
        holderName: input.holderName || 'Cardholder'
      }
    }
  }

  // Simulate “network” + provider processing
  await sleep(850)

  const last4 = tail4(digits)
  if (last4 === '0002') {
    return {
      intent: {
        id: safeId('pi'),
        amount: input.amount,
        currency: input.currency,
        status: 'failed',
        createdAt: isoNow(),
        failureReason: 'Card declined'
      },
      method: {
        id: safeId('pm'),
        brand: detectBrand(digits),
        last4,
        expMonth: input.expMonth,
        expYear: input.expYear,
        holderName: input.holderName || 'Cardholder'
      }
    }
  }

  // Most payments require 3DS in this demo
  return {
    intent: {
      id: safeId('pi'),
      amount: input.amount,
      currency: input.currency,
      status: 'requires_action',
      createdAt: isoNow()
    },
    method: {
      id: safeId('pm'),
      brand: detectBrand(digits),
      last4,
      expMonth: input.expMonth,
      expYear: input.expYear,
      holderName: input.holderName || 'Cardholder'
    }
  }
}

export async function confirm3DS(intentId: string, simulatedApproval: 'approve' | 'cancel', cardLast4: string): Promise<PaymentIntent> {
  await sleep(1200)

  if (simulatedApproval === 'cancel') {
    return {
      id: intentId,
      amount: 0,
      currency: 'EUR',
      status: 'failed',
      createdAt: isoNow(),
      failureReason: 'Authentication cancelled'
    }
  }

  if (cardLast4 === '0003') {
    return {
      id: intentId,
      amount: 0,
      currency: 'EUR',
      status: 'failed',
      createdAt: isoNow(),
      failureReason: 'Authentication failed'
    }
  }

  return {
    id: intentId,
    amount: 0,
    currency: 'EUR',
    status: 'succeeded',
    createdAt: isoNow()
  }
}
