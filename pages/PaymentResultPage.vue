<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Result</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card">
        <ion-card-content>
          <div class="center">
            <ion-icon :icon="icon" class="bigicon" />
            <div class="title">{{ title }}</div>
            <div class="muted" style="text-align:center; max-width: 320px;">
              {{ message }}
            </div>
          </div>

          <div class="actions">
            <ion-button v-if="ticketId" expand="block" size="large" @click="openTicket">
              View ticket
            </ion-button>
            <ion-button expand="block" fill="clear" @click="goHome">
              Back to search
            </ion-button>
            <ion-button expand="block" fill="clear" color="medium" @click="router.push('/tabs/tickets')">
              Go to wallet
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonButton, IonIcon } from '@ionic/vue'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons'

const route = useRoute()
const router = useRouter()

const status = computed(() => String(route.query.status || 'failed'))
const ticketId = computed(() => String(route.query.ticketId || ''))

const ok = computed(() => status.value === 'succeeded')

const icon = computed(() => ok.value ? checkmarkCircleOutline : closeCircleOutline)
const title = computed(() => ok.value ? 'Payment successful' : 'Payment failed')
const message = computed(() => {
  if (ok.value) return 'Your ticket is in your wallet. Show the QR code when boarding.'
  return String(route.query.reason || 'Something went wrong. Please try again (demo).')
})

function openTicket() {
  router.replace(`/ticket/${encodeURIComponent(ticketId.value)}`)
}
function goHome() {
  router.replace('/tabs/home')
}
</script>

<style scoped>
.center {
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 10px 0;
}
.bigicon {
  font-size: 64px;
}
.title {
  font-weight: 900;
  font-size: 20px;
}
.actions {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}
</style>
