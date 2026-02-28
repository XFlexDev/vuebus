<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list inset class="app-card">
        <ion-item>
          <ion-label>Dark mode</ion-label>
          <ion-toggle :checked="dark" @ionChange="onDarkToggle(($event.detail as any).checked)"></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Push notifications</ion-label>
          <ion-toggle :checked="push" @ionChange="push = ($event.detail as any).checked"></ion-toggle>
        </ion-item>

        <ion-item button @click="router.push('/help')">
          <ion-label>Help & FAQs</ion-label>
        </ion-item>

        <ion-item lines="none">
          <ion-label>
            <strong>About</strong>
            <div class="muted">BusTicket Demo • Vue + Ionic</div>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-card class="app-card">
        <ion-card-content>
          <div class="muted" style="font-size: 12px;">
            Note: Push notifications and wallet features are demo placeholders.
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonToggle, IonCard, IonCardContent } from '@ionic/vue'

const router = useRouter()
const dark = ref(false)
const push = ref(false)

function setDark(v: boolean) {
  dark.value = v
  document.body.classList.toggle('dark', v)
}

function onDarkToggle(v: boolean) {
  setDark(v)
  localStorage.setItem('demo_dark', v ? '1' : '0')
}

onMounted(() => {
  const saved = localStorage.getItem('demo_dark') === '1'
  setDark(saved)
})
</script>
