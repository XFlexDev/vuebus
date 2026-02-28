<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Tickets</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" v-if="wallet.hasTickets" @click="clear">
            Clear
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card v-if="!wallet.hasTickets" class="app-card">
        <ion-card-content>
          <div style="font-weight: 900; font-size: 18px;">No tickets yet</div>
          <div class="muted" style="margin-top: 6px;">Book a trip and your tickets will show up here.</div>
          <ion-button expand="block" style="margin-top: 12px;" @click="router.push('/tabs/home')">
            Search trips
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-list v-else inset class="app-card">
        <ion-item v-for="t in wallet.tickets" :key="t.id" button @click="open(t.id)">
          <ion-label>
            <div style="font-weight: 900;">Ticket {{ t.id.slice(-6).toUpperCase() }}</div>
            <div class="muted">Purchased {{ new Date(t.purchasedAt).toLocaleString() }}</div>
            <div class="muted">Seats <span class="mono">{{ t.seats.join(', ') }}</span></div>
          </ion-label>
          <ion-note slot="end" class="mono">{{ money(t.total) }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonNote, IonButtons
} from '@ionic/vue'
import { useTicketsStore } from '../stores/tickets'
import { formatMoney } from '../utils/format'

const router = useRouter()
const wallet = useTicketsStore()

function open(id: string) {
  router.push(`/ticket/${encodeURIComponent(id)}`)
}

function money(v: number) {
  return formatMoney(v, 'EUR')
}

function clear() {
  wallet.clear()
}
</script>
