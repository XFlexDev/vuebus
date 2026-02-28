export type Stop = {
  id: string
  city: string
  name: string
}

export type Amenity = 'Wi‑Fi' | 'Power' | 'AC' | 'WC' | 'Extra legroom' | 'USB‑C'

export type Bus = {
  model: string
  plate: string
  seatsTotal: number
  seatLayout: '2-2'
}

export type Trip = {
  id: string
  routeId: string
  fromStopId: string
  toStopId: string
  serviceDate: string // YYYY-MM-DD
  departTime: string // HH:mm
  arriveTime: string // HH:mm
  durationMin: number
  price: number
  currency: 'EUR'
  seatsTaken: string[] // e.g., "1A"
  amenities: Amenity[]
  operator: string
  bus: Bus
}

export type Passenger = {
  fullName: string
  email: string
  phone?: string
}

export type PaymentMethod = {
  id: string
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Unknown'
  last4: string
  expMonth: number
  expYear: number
  holderName: string
}

export type PaymentIntentStatus = 'requires_action' | 'processing' | 'succeeded' | 'failed'
export type PaymentIntent = {
  id: string
  amount: number
  currency: 'EUR'
  status: PaymentIntentStatus
  createdAt: string
  failureReason?: string
}

export type Ticket = {
  id: string
  tripId: string
  passengers: Passenger[]
  seats: string[]
  total: number
  currency: 'EUR'
  purchasedAt: string
  paymentRef: string
  qrPayload: string
}
