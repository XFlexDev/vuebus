<template>
  <ion-list inset class="app-card">
    <ion-item lines="none">
      <ion-label>Fare</ion-label>
      <ion-note slot="end" class="mono">{{ fare }}</ion-note>
    </ion-item>
    <ion-item lines="none">
      <ion-label>Passengers</ion-label>
      <ion-note slot="end" class="mono">{{ count }}</ion-note>
    </ion-item>
    <ion-item lines="none">
      <ion-label>Service fee</ion-label>
      <ion-note slot="end" class="mono">{{ fee }}</ion-note>
    </ion-item>
    <ion-item lines="full">
      <ion-label><strong>Total</strong></ion-label>
      <ion-note slot="end" class="mono"><strong>{{ total }}</strong></ion-note>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonList, IonItem, IonLabel, IonNote } from '@ionic/vue'
import { formatMoney } from '../utils/format'

const props = defineProps<{
  pricePerPassenger: number
  passengers: number
  currency: 'EUR'
}>()

const serviceFeeAmount = computed(() => Math.max(0.49, Math.round(props.passengers * 0.39 * 100) / 100))
const fare = computed(() => formatMoney(props.pricePerPassenger, props.currency))
const fee = computed(() => formatMoney(serviceFeeAmount.value, props.currency))
const count = computed(() => `${props.passengers} ×`)
const total = computed(() => formatMoney(props.pricePerPassenger * props.passengers + serviceFeeAmount.value, props.currency))
</script>
