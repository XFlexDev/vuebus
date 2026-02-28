<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/passengers"></ion-back-button>
        </ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card" v-if="trip && from && to">
        <ion-card-content>
          <div style="display:flex; justify-content: space-between; gap: 12px;">
            <div>
              <div style="font-weight: 900;">{{ from.city }} → {{ to.city }}</div>
              <div class="muted">{{ trip.serviceDate }} • {{ trip.departTime }} → {{ trip.arriveTime }}</div>
              <div class="muted">Seats: <span class="mono">{{ booking.selectedSeats.join(', ') }}</span></div>
            </div>
            <div class="mono" style="font-weight: 900;">{{ money(trip.price) }}</div>
          </div>
        </ion-card-content>
      </ion-card>

      <PriceBreakdown
        v-if="trip"
        :price-per-passenger="trip.price"
        :passengers="booking.passengers.length"
        currency="EUR"
      />

      <ion-list inset class="app-card">
        <ion-item lines="full">
          <ion-checkbox v-model="agree" justify="start"></ion-checkbox>
          <ion-label style="margin-left: 10px;">
            I agree to the <strong>Terms</strong> and <strong>Refund policy</strong>
            <div class="muted">Demo content</div>
          </ion-label>
        </ion-item>
        <ion-item lines="none" button @click="router.push('/help')">
          <ion-label>Need help?</ion-label>
          <ion-note slot="end">FAQs</ion-note>
        </ion-item>
      </ion-list>

      <ion-card class="app-card">
        <ion-card-content>
          <ion-button expand="block" size="large" :disabled="!canPay" @click="router.push('/payment')">
            Continue to payment
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonList, IonItem,
  IonLabel, IonNote, IonButton, IonCheckbox
} from '@ionic/vue'
import PriceBreakdown from '../components/PriceBreakdown.vue'
import { useBookingStore } from '../stores/booking'
import { findStop } from '../data/mock'
import { formatMoney } from '../utils/format'

const router = useRouter()
const booking = useBookingStore()
const trip = computed(() => booking.selectedTrip)
const from = computed(() => trip.value ? findStop(trip.value.fromStopId) : undefined)
const to = computed(() => trip.value ? findStop(trip.value.toStopId) : undefined)

const agree = ref(false)

const canPay = computed(() => !!trip.value && booking.passengers.length >= 1 && agree.value)

function money(v: number) {
  return formatMoney(v, 'EUR')
}
</script>
