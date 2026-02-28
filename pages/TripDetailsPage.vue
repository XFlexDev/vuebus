<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/results"></ion-back-button>
        </ion-buttons>
        <ion-title>Pick seats</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card" v-if="trip && from && to">
        <ion-card-content>
          <div class="top">
            <div>
              <div class="mono big">{{ trip.departTime }} → {{ trip.arriveTime }}</div>
              <div class="muted">{{ from.city }} • {{ to.city }} • {{ trip.serviceDate }}</div>
            </div>
            <div class="mono price">{{ money(trip.price) }}</div>
          </div>

          <div class="meta">
            <ion-chip outline>
              <ion-label>{{ trip.operator }}</ion-label>
            </ion-chip>
            <ion-chip outline>
              <ion-label>{{ trip.bus.model }}</ion-label>
            </ion-chip>
            <ion-chip outline>
              <ion-label>{{ trip.bus.plate }}</ion-label>
            </ion-chip>
          </div>
        </ion-card-content>
      </ion-card>

      <SeatMap
        v-if="trip"
        :taken-seats="trip.seatsTaken"
        :selected-seats="booking.selectedSeats"
        :seats-total="trip.bus.seatsTotal"
        @toggle="booking.toggleSeat"
      />

      <ion-card class="app-card" v-if="trip">
        <ion-card-content>
          <div class="row">
            <div>
              <div style="font-weight: 800;">Selected</div>
              <div class="muted">Seats: <span class="mono">{{ booking.selectedSeats.join(', ') || '—' }}</span></div>
              <div class="muted">Passengers: <span class="mono">{{ booking.passengers.length }}</span></div>
            </div>
            <ion-button :disabled="!booking.canContinueFromTrip" @click="continueFlow">
              Continue
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-toast :is-open="toastOpen" :message="toastMsg" @didDismiss="toastOpen = false" duration="2200" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonButton, IonChip, IonLabel, IonToast
} from '@ionic/vue'
import { findStop, findTrip } from '../data/mock'
import { useBookingStore } from '../stores/booking'
import SeatMap from '../components/SeatMap.vue'
import { formatMoney } from '../utils/format'

const route = useRoute()
const router = useRouter()
const booking = useBookingStore()

const tripId = computed(() => String(route.params.tripId || ''))
const trip = computed(() => findTrip(decodeURIComponent(tripId.value)))

const from = computed(() => trip.value ? findStop(trip.value.fromStopId) : undefined)
const to = computed(() => trip.value ? findStop(trip.value.toStopId) : undefined)

const toastOpen = ref(false)
const toastMsg = ref('')

watchEffect(() => {
  if (trip.value) booking.chooseTrip(trip.value)
})

function money(v: number) {
  return formatMoney(v, 'EUR')
}

function continueFlow() {
  if (!trip.value) return
  if (!booking.selectedSeats.length) {
    toastMsg.value = 'Select at least one seat'
    toastOpen.value = true
    return
  }
  router.push('/passengers')
}
</script>

<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}
.big {
  font-size: 20px;
  font-weight: 900;
}
.price {
  font-size: 18px;
  font-weight: 900;
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
