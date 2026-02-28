import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Passenger, Trip } from '../models'
import { safeId } from '../utils/format'

export const useBookingStore = defineStore('booking', () => {
  const fromStopId = ref<string>('HEL_C')
  const toStopId = ref<string>('TKU_C')
  const serviceDate = ref<string>(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } as any)

  const selectedTrip = ref<Trip | null>(null)
  const selectedSeats = ref<string[]>([])
  const passengers = ref<Passenger[]>([{ fullName: '', email: '', phone: '' }])
  const bookingRef = ref<string>(safeId('bk'))

  const passengerCount = computed(() => passengers.value.length)

  function resetFlow() {
    selectedTrip.value = null
    selectedSeats.value = []
    passengers.value = [{ fullName: '', email: '', phone: '' }]
    bookingRef.value = safeId('bk')
  }

  function setSearch(from: string, to: string, date: string) {
    fromStopId.value = from
    toStopId.value = to
    serviceDate.value = date
  }

  function chooseTrip(trip: Trip) {
    selectedTrip.value = trip
    selectedSeats.value = []
    passengers.value = [{ fullName: '', email: '', phone: '' }]
    bookingRef.value = safeId('bk')
  }

  function toggleSeat(seat: string) {
    if (!selectedTrip.value) return
    const idx = selectedSeats.value.indexOf(seat)
    if (idx >= 0) {
      selectedSeats.value.splice(idx, 1)
      // keep passengers in sync if seats < passengers (trim extra passengers)
      while (passengers.value.length > selectedSeats.value.length && passengers.value.length > 1) {
        passengers.value.pop()
      }
      return
    }
    // Add seats up to passengers count; or auto-add passenger if adding more seats
    selectedSeats.value.push(seat)
    if (selectedSeats.value.length > passengers.value.length) {
      passengers.value.push({ fullName: '', email: '', phone: '' })
    }
  }

  function addPassenger() {
    passengers.value.push({ fullName: '', email: '', phone: '' })
  }

  function removePassenger(index: number) {
    if (passengers.value.length <= 1) return
    passengers.value.splice(index, 1)
    // If more seats than passengers, trim seats from the end
    while (selectedSeats.value.length > passengers.value.length) {
      selectedSeats.value.pop()
    }
  }

  function setPassenger(index: number, p: Passenger) {
    passengers.value[index] = p
  }

  const canContinueFromTrip = computed(() => {
    return !!selectedTrip.value && selectedSeats.value.length >= 1
  })

  const total = computed(() => {
    if (!selectedTrip.value) return 0
    return selectedTrip.value.price * passengers.value.length
  })

  return {
    fromStopId, toStopId, serviceDate,
    selectedTrip, selectedSeats, passengers, bookingRef,
    passengerCount, total,
    resetFlow, setSearch, chooseTrip, toggleSeat,
    addPassenger, removePassenger, setPassenger,
    canContinueFromTrip
  }
})
