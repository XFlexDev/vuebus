<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-card class="app-card">
        <ion-card-content>
          <div v-if="auth.isLoggedIn" class="row">
            <div>
              <div style="font-weight: 900;">{{ auth.user?.name }}</div>
              <div class="muted">{{ auth.user?.email }}</div>
            </div>
            <ion-button fill="clear" color="danger" @click="auth.logout()">
              Log out
            </ion-button>
          </div>

          <div v-else>
            <div style="font-weight: 900; font-size: 18px;">Sign in</div>
            <div class="muted" style="margin-top: 6px;">Demo auth • no real account needed</div>

            <ion-list style="margin-top: 10px;">
              <ion-item>
                <ion-label position="stacked">Email</ion-label>
                <ion-input v-model="email" type="email" placeholder="you@email.com" />
              </ion-item>
              <ion-item>
                <ion-label position="stacked">Password</ion-label>
                <ion-input v-model="password" type="password" placeholder="••••••••" />
              </ion-item>
            </ion-list>

            <ion-button expand="block" size="large" style="margin-top: 12px;" @click="login">
              Sign in
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list inset class="app-card">
        <ion-item button @click="router.push('/help')">
          <ion-label>Help</ion-label>
        </ion-item>
        <ion-item lines="none" button @click="router.push('/tabs/tickets')">
          <ion-label>My tickets</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardContent, IonButton, IonList, IonItem, IonLabel, IonInput
} from '@ionic/vue'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('miska@example.com')
const password = ref('')

function login() {
  auth.login(email.value, password.value)
}
</script>

<style scoped>
.row {
  display:flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
</style>
