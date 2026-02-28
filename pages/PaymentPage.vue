<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/checkout"></ion-back-button>
        </ion-buttons>
        <ion-title>Payment</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card">
        <ion-card-content>
          <div class="row">
            <div>
              <div style="font-weight: 900;">Pay securely</div>
              <div class="muted">Fake payment • Demo only</div>
            </div>
            <div class="mono total">{{ money(totalWithFee) }}</div>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list inset class="app-card">
        <ion-item>
          <ion-label position="stacked">Card number</ion-label>
          <ion-input v-model="cardNumber" inputmode="numeric" placeholder="4242 4242 4242 0001" />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Cardholder name</ion-label>
          <ion-input v-model="holderName" placeholder="Name on card" />
        </ion-item>

        <div class="grid">
          <ion-item>
            <ion-label position="stacked">Exp. month</ion-label>
            <ion-input v-model.number="expMonth" type="number" inputmode="numeric" placeholder="12" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Exp. year</ion-label>
            <ion-input v-model.number="expYear" type="number" inputmode="numeric" placeholder="2028" />
          </ion-item>
          <ion-item>
            <ion-label position="stacked">CVC</ion-label>
            <ion-input v-model="cvc" type="password" inputmode="numeric" placeholder="123" />
          </ion-item>
        </div>

        <ion-item lines="none">
          <ion-label>
            <strong>Tip</strong>
            <div class="muted">Use a Luhn-valid number. Ends with 0002 to decline.</div>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-card class="app-card">
        <ion-card-content>
          <ion-button expand="block" size="large" :disabled="!canSubmit" @click="pay">
            Pay {{ money(totalWithFee) }}
          </ion-button>
          <ion-button expand="block" fill="clear" @click="autofill">
            Autofill demo card
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-loading :is-open="loading" message="Contacting bank…" />
      <ion-toast :is-open="toastOpen" :message="toastMsg" @didDismiss="toastOpen = false" duration="2500" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonList, IonItem,
  IonLabel, IonInput, IonButton, IonLoading, IonToast
} from '@ionic/vue'
import { useBookingStore } from '../stores/booking'
import { createPaymentIntent } from '../services/payment'
import { formatMoney } from '../utils/format'

const router = useRouter()
const booking = useBookingStore()

const cardNumber = ref('')
const holderName = ref('')
const expMonth = ref<number>(12)
const expYear = ref<number>(2028)
const cvc = ref('')

const loading = ref(false)
const toastOpen = ref(false)
const toastMsg = ref('')

const serviceFee = computed(() => Math.max(0.49, Math.round(booking.passengers.length * 0.39 * 100) / 100))
const totalWithFee = computed(() => booking.total + serviceFee.value)

const canSubmit = computed(() => {
  return booking.selectedTrip && booking.selectedSeats.length >= 1 && booking.passengers.length >= 1 &&
    cardNumber.value.replace(/\D/g,'').length >= 12 &&
    expMonth.value >= 1 && expMonth.value <= 12 &&
    expYear.value >= new Date().getFullYear() &&
    cvc.value.trim().length >= 3
})

function money(v: number) {
  return formatMoney(v, 'EUR')
}

function autofill() {
  cardNumber.value = '4242 4242 4242 0001'
  holderName.value = 'Demo User'
  expMonth.value = 12
  expYear.value = 2028
  cvc.value = '123'
}

async function pay() {
  if (!booking.selectedTrip) return
  loading.value = true
  try {
    const { intent, method } = await createPaymentIntent({
      amount: Math.round(totalWithFee.value * 100) / 100,
      currency: 'EUR',
      cardNumber: cardNumber.value,
      expMonth: expMonth.value,
      expYear: expYear.value,
      cvc: cvc.value,
      holderName: holderName.value
    })

    if (intent.status === 'failed') {
      toastMsg.value = intent.failureReason || 'Payment failed'
      toastOpen.value = true
      return
    }

    // Save minimal state to session for 3DS screen
    sessionStorage.setItem('demo_pi_id', intent.id)
    sessionStorage.setItem('demo_pm_last4', method.last4)
    sessionStorage.setItem('demo_amount', String(Math.round(totalWithFee.value * 100) / 100))

    router.push('/payment/3ds')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.row {
  display:flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.total {
  font-weight: 900;
  font-size: 18px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  padding: 10px 16px 4px;
}
</style>
