<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/results">
        </ion-buttons>
        <ion-title>Passengers</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card" v-if="trip && from && to">
        <ion-card-content>
          <div class="row">
            <div>
              <div style="font-weight: 900;">{{ from.city }} → {{ to.city }}</div>
              <div class="muted">{{ trip.serviceDate }} • {{ trip.departTime }} → {{ trip.arriveTime }}</div>
              <div class="muted">Seats: <span class="mono">{{ booking.selectedSeats.join(', ') }}</span></div>
            </div>
            <div class="mono" style="font-weight: 900;">{{ money(booking.total) }}</div>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list inset class="app-card">
        <ion-item lines="full">
          <ion-label>
            <strong>Passenger details</strong>
            <div class="muted">One passenger per seat</div>
          </ion-label>
          <ion-button slot="end" fill="clear" @click="addPassenger" :disabled="booking.passengers.length >= booking.selectedSeats.length">
            Add
          </ion-button>
        </ion-item>

        <div v-for="(p, idx) in booking.passengers" :key="idx">
          <ion-item>
            <ion-label position="stacked">Full name</ion-label>
            <ion-input
              :value="p.fullName"
              @ionInput="set(idx, { ...p, fullName: String(($event.target as any).value || '') })"
              placeholder="e.g., Alex Example"
            />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input
              type="email"
              :value="p.email"
              @ionInput="set(idx, { ...p, email: String(($event.target as any).value || '') })"
              placeholder="name@email.com"
            />
          </ion-item>
          <ion-item lines="full">
            <ion-label position="stacked">Phone (optional)</ion-label>
            <ion-input
              type="tel"
              :value="p.phone"
              @ionInput="set(idx, { ...p, phone: String(($event.target as any).value || '') })"
              placeholder="+358 …"
            />
          </ion-item>

          <div class="inline-actions">
            <div class="muted">Seat <span class="mono">{{ booking.selectedSeats[idx] || '—' }}</span></div>
            <ion-button fill="clear" color="danger" @click="remove(idx)" :disabled="booking.passengers.length <= 1">
              Remove
            </ion-button>
          </div>

          <ion-item-divider v-if="idx < booking.passengers.length - 1"></ion-item-divider>
        </div>
      </ion-list>

      <ion-card class="app-card">
        <ion-card-content>
          <ion-button expand="block" size="large" :disabled="!canContinue" @click="router.push('/checkout')">
            Continue to checkout
          </ion-button>
          <div class="muted" style="margin-top: 8px; font-size: 12px;">
            We’ll email your tickets after payment (demo).
          </div>
        </ion-card-content>
      </ion-card>

      <ion-toast :is-open="toastOpen" :message="toastMsg" @didDismiss="toastOpen = false" duration="2400" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonList,
  IonItem, IonItemDivider, IonLabel, IonInput, IonButton, IonToast
} from '@ionic/vue'
import { useBookingStore } from '../stores/booking'
import { findStop } from '../data/mock'
import { formatMoney } from '../utils/format'

const router = useRouter()
const booking = useBookingStore()

const trip = computed(() => booking.selectedTrip)
const from = computed(() => trip.value ? findStop(trip.value.fromStopId) : undefined)
const to = computed(() => trip.value ? findStop(trip.value.toStopId) : undefined)

const toastOpen = ref(false)
const toastMsg = ref('')

const canContinue = computed(() => {
  if (!trip.value) return false
  if (booking.selectedSeats.length < 1) return false
  if (booking.passengers.length !== booking.selectedSeats.length) return false
  return booking.passengers.every(p => p.fullName.trim().length >= 2 && p.email.includes('@'))
})

function money(v: number) {
  return formatMoney(v, 'EUR')
}

function set(idx: number, p: any) {
  booking.setPassenger(idx, p)
}

function addPassenger() {
  if (booking.passengers.length >= booking.selectedSeats.length) {
    toastMsg.value = 'Add another seat to add a passenger.'
    toastOpen.value = true
    return
  }
  booking.addPassenger()
}

function remove(idx: number) {
  booking.removePassenger(idx)
}
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}
.inline-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 14px;
}
</style>
