import type { Stop, Trip } from '../models'

export const stops: Stop[] = [
  { id: 'HEL_C', city: 'Helsinki', name: 'Kamppi Terminal' },
  { id: 'ESP_C', city: 'Espoo', name: 'Leppävaara' },
  { id: 'TKU_C', city: 'Turku', name: 'Bus Station' },
  { id: 'TMP_C', city: 'Tampere', name: 'Central Station' },
  { id: 'POR_C', city: 'Pori', name: 'Travel Center' },
  { id: 'JYV_C', city: 'Jyväskylä', name: 'Matkakeskus' }
]

const baseAmenities = ['Wi‑Fi', 'Power', 'AC', 'WC'] as const

function t(id: string): Trip {
  // A small, consistent set of occupied seats for the seat map
  const occupied = [
    '1A','1B','2C','3D','4A','5B','6C','7A','8D','9B','10C'
  ]
  // Make some trips “busier”:
  const more = ['2A','2B','3A','3B','4C','4D','5A','5C','6A','6B','7C','7D','8A','8B','9C','9D']
  const seatsTaken = id.endsWith('B') ? [...occupied, ...more] : occupied

  // IDs encode from/to/date/time for demo stability
  const [fromStopId, toStopId, serviceDate, departTime, arriveTime, durationMin, price] =
    id.split('|') as [string,string,string,string,string,string,string]

  return {
    id,
    routeId: `${fromStopId}_${toStopId}`,
    fromStopId,
    toStopId,
    serviceDate,
    departTime,
    arriveTime,
    durationMin: Number(durationMin),
    price: Number(price),
    currency: 'EUR',
    seatsTaken,
    amenities: [...baseAmenities, ...(id.includes('XL') ? ['Extra legroom'] : []), ...(id.includes('USB') ? ['USB‑C'] : [])] as any,
    operator: id.includes('Nord') ? 'NordBus' : 'CityLink',
    bus: {
      model: id.includes('XL') ? 'Volvo 9700 XL' : 'Scania Touring',
      plate: id.includes('Nord') ? 'NDB-742' : 'CLK-118',
      seatsTotal: 44,
      seatLayout: '2-2'
    }
  }
}

// Generate “today + next few days” trips without relying on a date library
function yyyyMmDd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date()
const day0 = yyyyMmDd(today)
const day1 = yyyyMmDd(new Date(today.getTime() + 86400000))
const day2 = yyyyMmDd(new Date(today.getTime() + 2 * 86400000))

export const trips: Trip[] = [
  // HEL -> TKU
  t(`HEL_C|TKU_C|${day0}|08:10|10:35|145|16.90`),
  t(`HEL_C|TKU_C|${day0}|12:30|14:50|140|18.90|USB`),
  t(`HEL_C|TKU_C|${day0}|17:05|19:35|150|19.90|Nord|XL`),
  t(`HEL_C|TKU_C|${day1}|08:10|10:35|145|16.90`),
  t(`HEL_C|TKU_C|${day1}|17:05|19:35|150|19.90|Nord|XL`),
  t(`HEL_C|TKU_C|${day2}|12:30|14:50|140|18.90|USB`),

  // HEL -> TMP
  t(`HEL_C|TMP_C|${day0}|07:40|10:45|185|22.90|Nord`),
  t(`HEL_C|TMP_C|${day0}|15:15|18:25|190|24.90|XL`),
  t(`HEL_C|TMP_C|${day1}|07:40|10:45|185|22.90|Nord`),
  t(`HEL_C|TMP_C|${day2}|15:15|18:25|190|24.90|XL`),

  // TKU -> TMP
  t(`TKU_C|TMP_C|${day0}|09:20|12:10|170|21.90`),
  t(`TKU_C|TMP_C|${day1}|16:10|19:00|170|21.90|Nord|USB`),

  // HEL -> JYV
  t(`HEL_C|JYV_C|${day0}|10:00|13:25|205|28.90|Nord|USB`),
  t(`HEL_C|JYV_C|${day1}|10:00|13:25|205|28.90|Nord|USB`)
]

export function findStop(id: string): Stop | undefined {
  return stops.find(s => s.id === id)
}

export function findTrip(tripId: string): Trip | undefined {
  return trips.find(t => t.id === tripId)
}

export function searchTrips(fromStopId: string, toStopId: string, serviceDate: string): Trip[] {
  return trips
    .filter(t => t.fromStopId === fromStopId && t.toStopId === toStopId && t.serviceDate === serviceDate)
    .sort((a, b) => a.departTime.localeCompare(b.departTime))
}
