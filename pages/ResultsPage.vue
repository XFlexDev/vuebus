<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Trips</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <div class="summary">
        <div class="route">{{ from?.city }} → {{ to?.city }}</div>
        <div class="meta muted">{{ booking.serviceDate }}</div>
      </div>

      <ion-list v-if="results.length" lines="none">
        <TripCard
          v-for="t in results"
          :key="t.id"
          :trip="t"
          :from="from"
          :to="to"
          @select="selectTrip(t.id)"
        />
      </ion-list>

      <ion-card v-else class="app-card">
        <ion-card-content>
          <div style="font-weight: 800; font-size: 18px;">No trips found</div>
          <div class="muted" style="margin-top: 6px;">Try another date or route.</div>
          <ion-button expand="block" style="margin-top: 12px;" @click="router.push('/tabs/home')">
            Back to search
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonList, IonCard, IonCardContent, IonButton
} from '@ionic/vue'
import TripCard from '../components/TripCard.vue'
import { findStop, searchTrips } from '../data/mock'
import { useBookingStore } from '../stores/booking'

const router = useRouter()
const booking = useBookingStore()

const from = computed(() => findStop(booking.fromStopId))
const to = computed(() => findStop(booking.toStopId))

const results = computed(() => searchTrips(booking.fromStopId, booking.toStopId, booking.serviceDate))

function selectTrip(tripId: string) {
  router.push(`/trip/${encodeURIComponent(tripId)}`)
}
</script>

<style scoped>
.summary {
  padding: 14px 16px 6px;
}
.route {
  font-size: 20px;
  font-weight: 900;
}
.meta {
  margin-top: 4px;
}
</style>
