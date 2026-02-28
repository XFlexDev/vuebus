<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Bus Ticket</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="goHelp">
            <ion-icon :icon="helpCircleOutline" slot="icon-only" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="hero">
        <div class="headline">Where to next?</div>
        <div class="sub">Book seats in seconds • Mobile-first experience</div>
      </div>

      <ion-card class="app-card">
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">From</ion-label>
            <ion-select v-model="from" interface="action-sheet">
              <ion-select-option v-for="s in stops" :key="s.id" :value="s.id">
                {{ s.city }} — {{ s.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">To</ion-label>
            <ion-select v-model="to" interface="action-sheet">
              <ion-select-option v-for="s in stops" :key="s.id" :value="s.id" :disabled="s.id === from">
                {{ s.city }} — {{ s.name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Date</ion-label>
            <ion-datetime-button datetime="datePicker"></ion-datetime-button>
          </ion-item>

          <ion-modal keep-contents-mounted>
            <ion-datetime
              id="datePicker"
              presentation="date"
              :prefer-wheel="true"
              v-model="dateValue"
            ></ion-datetime>
          </ion-modal>

          <div class="actions">
            <ion-button expand="block" size="large" @click="search">
              Search trips
            </ion-button>
            <ion-button expand="block" fill="clear" @click="swap">
              Swap cities
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card class="app-card promos">
        <ion-card-content>
          <div class="promo-line">
            <span class="badge-pill" style="background: rgba(0,179,164,0.12); color: var(--ion-color-secondary)">NEW</span>
            <strong>Wallet tickets</strong> with QR codes
          </div>
          <div class="promo-line muted">Try a demo purchase with the fake payment flow.</div>
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
  IonCard, IonCardContent, IonItem, IonLabel, IonSelect, IonSelectOption,
  IonButton, IonDatetime, IonDatetimeButton, IonModal, IonButtons, IonIcon
} from '@ionic/vue'
import { helpCircleOutline } from 'ionicons/icons'
import { stops } from '../data/mock'
import { useBookingStore } from '../stores/booking'

const router = useRouter()
const booking = useBookingStore()

const from = ref(booking.fromStopId)
const to = ref(booking.toStopId)

// Ionic datetime uses ISO string; store YYYY-MM-DD in booking store
const dateValue = ref(new Date(booking.serviceDate + 'T12:00:00').toISOString())

const dateYMD = computed(() => {
  const d = new Date(dateValue.value)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

function swap() {
  const a = from.value
  from.value = to.value
  to.value = a
}

function search() {
  booking.setSearch(from.value, to.value, dateYMD.value)
  router.push('/results')
}

function goHelp() {
  router.push('/help')
}
</script>

<style scoped>
.hero {
  padding: 18px 16px 6px;
}
.headline {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: -0.02em;
}
.sub {
  margin-top: 6px;
  opacity: 0.75;
}
.actions {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}
.promos .promo-line {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 6px 0;
}
</style>
