<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Help</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list inset class="app-card">
        <ion-item>
          <ion-label>
            <strong>Is the payment real?</strong>
            <div class="muted">No. This app simulates payments for demo purposes.</div>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <strong>Where are my tickets stored?</strong>
            <div class="muted">In your browser’s localStorage (demo wallet).</div>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-label>
            <strong>Can I change seats after purchase?</strong>
            <div class="muted">Not in this demo. You can clear the wallet and rebook.</div>
          </ion-label>
        </ion-item>
        <ion-item lines="none">
          <ion-label>
            <strong>Refunds</strong>
            <div class="muted">Demo policy: full refund up to 24h before departure.</div>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-card class="app-card">
        <ion-card-content>
          <ion-button expand="block" size="large" @click="router.push('/tabs/home')">
            Back to search
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonCard, IonCardContent, IonButton } from '@ionic/vue'
const router = useRouter()
</script>
