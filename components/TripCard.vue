<template>
  <ion-card class="app-card" button @click="$emit('select')">
    <ion-card-header>
      <div class="row">
        <div>
          <ion-card-title class="mono">{{ trip.departTime }} → {{ trip.arriveTime }}</ion-card-title>
          <ion-card-subtitle class="muted">{{ from?.city }} • {{ to?.city }} • {{ duration }}</ion-card-subtitle>
        </div>
        <div class="price mono">{{ price }}</div>
      </div>
    </ion-card-header>
    <ion-card-content>
      <div class="chips">
        <span class="badge-pill" style="background: rgba(47,111,237,0.12); color: var(--ion-color-primary)">
          {{ trip.operator }}
        </span>
        <span class="badge-pill" style="background: rgba(0,179,164,0.12); color: var(--ion-color-secondary)">
          {{ seatsLeft }} seats left
        </span>
      </div>

      <div class="amenities">
        <ion-chip v-for="a in trip.amenities" :key="a" outline>
          <ion-label>{{ a }}</ion-label>
        </ion-chip>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip, IonLabel } from '@ionic/vue'
import type { Trip, Stop } from '../models'
import { formatDuration, formatMoney } from '../utils/format'

const props = defineProps<{
  trip: Trip
  from?: Stop
  to?: Stop
}>()

defineEmits<{ (e: 'select'): void }>()

const duration = computed(() => formatDuration(props.trip.durationMin))
const price = computed(() => formatMoney(props.trip.price, props.trip.currency))
const seatsLeft = computed(() => Math.max(0, props.trip.bus.seatsTotal - props.trip.seatsTaken.length))
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.price {
  font-weight: 800;
  font-size: 18px;
}
.chips {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}
.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
