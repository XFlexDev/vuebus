<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/payment"></ion-back-button>
        </ion-buttons>
        <ion-title>Confirm</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card">
        <ion-card-content>
          <div style="font-weight: 900; font-size: 18px;">3‑D Secure</div>
          <div class="muted" style="margin-top: 6px;">
            Approve the payment in your bank app.<br />
            (Simulated)
          </div>

          <div class="panel">
            <div class="muted">Amount</div>
            <div class="mono big">{{ amountText }}</div>
            <div class="muted" style="margin-top: 6px;">Card •••• {{ last4 }}</div>
            <div class="countdown mono">00:{{ String(seconds).padStart(2, '0') }}</div>
          </div>

          <div class="actions">
            <ion-button expand="block" color="success" size="large" @click="approve">
              Approve
            </ion-button>
            <ion-button expand="block" fill="clear" color="medium" @click="cancel">
              Cancel
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-loading :is-open="loading" message="Finalizing…" />
      <ion-toast :is-open="toastOpen" :message="toastMsg" @didDismiss="toastOpen = false" duration="2400" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonButton, IonLoading, IonToast
} from '@ionic/vue'
import { confirm3DS } from '../services/payment'
import { useBookingStore } from '../stores/booking'
import { useTicketsStore } from '../stores/tickets'
import { findStop } from '../data/mock'
import { formatMoney, isoNow, safeId } from '../utils/format'
import type { Ticket } from '../models'

const router = useRouter()
const booking = useBookingStore()
const wallet = useTicketsStore()

const piId = ref(sessionStorage.getItem('demo_pi_id') || safeId('pi'))
const last4 = ref(sessionStorage.getItem('demo_pm_last4') || '4242')
const amount = ref(Number(sessionStorage.getItem('demo_amount') || booking.total || 0))

const amountText = computed(() => formatMoney(amount.value, 'EUR'))

const seconds = ref(30)
let timer: any

const loading = ref(false)
const toastOpen = ref(false)
const toastMsg = ref('')

onMounted(() => {
  timer = setInterval(() => {
    seconds.value -= 1
    if (seconds.value <= 0) {
      clearInterval(timer)
      cancel()
    }
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})

async function approve() {
  loading.value = true
  try {
    const intent = await confirm3DS(piId.value, 'approve', last4.value)
    if (intent.status !== 'succeeded') {
      toastMsg.value = intent.failureReason || 'Payment failed'
      toastOpen.value = true
      router.replace({ path: '/payment/result', query: { status: 'failed', reason: intent.failureReason || 'failed' } })
      return
    }

    // Build ticket payload
    if (!booking.selectedTrip) {
      router.replace('/tabs/home')
      return
    }

    const trip = booking.selectedTrip
    const from = findStop(trip.fromStopId)
    const to = findStop(trip.toStopId)

    const qrPayload = JSON.stringify({
      v: 1,
      issuer: 'BusTicket Demo',
      tripId: trip.id,
      from: from?.city,
      to: to?.city,
      date: trip.serviceDate,
      depart: trip.departTime,
      seats: booking.selectedSeats,
      passengers: booking.passengers.map(p => p.fullName),
      bookingRef: booking.bookingRef
    })

    const ticket: Ticket = {
      id: safeId('tkt'),
      tripId: trip.id,
      passengers: booking.passengers,
      seats: booking.selectedSeats,
      total: amount.value,
      currency: 'EUR',
      purchasedAt: isoNow(),
      paymentRef: piId.value,
      qrPayload
    }

    wallet.add(ticket)
    booking.resetFlow()

    router.replace({ path: '/payment/result', query: { status: 'succeeded', ticketId: ticket.id } })
  } finally {
    loading.value = false
  }
}

async function cancel() {
  loading.value = true
  try {
    const intent = await confirm3DS(piId.value, 'cancel', last4.value)
    router.replace({ path: '/payment/result', query: { status: 'failed', reason: intent.failureReason || 'cancelled' } })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.panel {
  margin-top: 14px;
  border-radius: 14px;
  padding: 14px;
  background: rgba(0,0,0,0.04);
}
.big {
  font-size: 22px;
  font-weight: 900;
  margin-top: 4px;
}
.countdown {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 900;
  opacity: 0.75;
}
.actions {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
</style>
