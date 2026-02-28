<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/tickets"></ion-back-button>
        </ion-buttons>
        <ion-title>Ticket</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card v-if="!ticket" class="app-card">
        <ion-card-content>
          <div style="font-weight:900;">Ticket not found</div>
          <ion-button expand="block" style="margin-top:12px;" @click="router.replace('/tabs/tickets')">
            Back
          </ion-button>
        </ion-card-content>
      </ion-card>

      <template v-else>
        <ion-card class="app-card">
          <ion-card-content>
            <div class="top">
              <div>
                <div style="font-weight:900;">Boarding pass</div>
                <div class="muted">Ref <span class="mono">{{ ticket.paymentRef }}</span></div>
              </div>
              <div class="mono" style="font-weight:900;">{{ money(ticket.total) }}</div>
            </div>
          </ion-card-content>
        </ion-card>

        <div style="display:grid; place-items:center; padding: 10px 16px;">
          <TicketQRCode :value="ticket.qrPayload" />
          <div class="muted" style="margin-top:10px; text-align:center;">
            Show this QR code when boarding.
          </div>
        </div>

        <ion-list inset class="app-card">
          <ion-item>
            <ion-label>Seats</ion-label>
            <ion-note slot="end" class="mono">{{ ticket.seats.join(', ') }}</ion-note>
          </ion-item>
          <ion-item>
            <ion-label>Passengers</ion-label>
            <ion-note slot="end" class="mono">{{ ticket.passengers.length }}</ion-note>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Purchased</ion-label>
            <ion-note slot="end" class="mono">{{ new Date(ticket.purchasedAt).toLocaleString() }}</ion-note>
          </ion-item>
        </ion-list>

        <ion-card class="app-card">
          <ion-card-content>
            <ion-button expand="block" size="large" @click="toast('Added to Wallet (demo)')">
              Add to Wallet
            </ion-button>
            <ion-button expand="block" fill="clear" @click="toast('Share link copied (demo)')">
              Share
            </ion-button>
          </ion-card-content>
        </ion-card>
      </template>

      <ion-toast :is-open="toastOpen" :message="toastMsg" @didDismiss="toastOpen = false" duration="2200" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonNote, IonToast
} from '@ionic/vue'
import TicketQRCode from '../components/TicketQRCode.vue'
import { useTicketsStore } from '../stores/tickets'
import { formatMoney } from '../utils/format'

const route = useRoute()
const router = useRouter()
const wallet = useTicketsStore()

const ticketId = computed(() => String(route.params.ticketId || ''))
const ticket = computed(() => wallet.get(decodeURIComponent(ticketId.value)))

const toastOpen = ref(false)
const toastMsg = ref('')

function money(v: number) {
  return formatMoney(v, 'EUR')
}

function toast(msg: string) {
  toastMsg.value = msg
  toastOpen.value = true
}
</script>

<style scoped>
.top {
  display:flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}
</style>
