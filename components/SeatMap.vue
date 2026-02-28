<template>
  <div class="seatmap">
    <div class="legend">
      <span class="dot available"></span><span>Available</span>
      <span class="dot selected"></span><span>Selected</span>
      <span class="dot taken"></span><span>Taken</span>
    </div>

    <div class="bus">
      <div class="front">
        <div class="wheel"></div>
        <div class="wheel"></div>
        <div class="driver">Driver</div>
      </div>

      <div class="rows">
        <div v-for="row in rows" :key="row" class="row">
          <button
            v-for="seat in seatsForRow(row)"
            :key="seat"
            class="seat"
            :class="{ taken: isTaken(seat), selected: isSelected(seat) }"
            :disabled="isTaken(seat)"
            @click="toggle(seat)"
          >
            {{ seat }}
          </button>
          <div class="aisle"></div>
          <button
            v-for="seat in seatsForRowRight(row)"
            :key="seat"
            class="seat"
            :class="{ taken: isTaken(seat), selected: isSelected(seat) }"
            :disabled="isTaken(seat)"
            @click="toggle(seat)"
          >
            {{ seat }}
          </button>
        </div>
      </div>
    </div>

    <ion-note class="muted">
      Tip: Select one seat per passenger. Adding seats automatically adds passenger forms.
    </ion-note>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonNote } from '@ionic/vue'

const props = defineProps<{
  takenSeats: string[]
  selectedSeats: string[]
  seatsTotal: number
}>()

const emit = defineEmits<{ (e: 'toggle', seat: string): void }>()

// 44 seats => 11 rows of 4 seats (2-2)
const rows = computed(() => {
  const rows = Math.ceil(props.seatsTotal / 4)
  return Array.from({ length: rows }, (_, i) => i + 1)
})

function seatLabel(row: number, col: 'A' | 'B' | 'C' | 'D') {
  return `${row}${col}`
}

function seatsForRow(row: number) {
  return [seatLabel(row, 'A'), seatLabel(row, 'B')]
}
function seatsForRowRight(row: number) {
  return [seatLabel(row, 'C'), seatLabel(row, 'D')]
}

function isTaken(seat: string) {
  return props.takenSeats.includes(seat)
}
function isSelected(seat: string) {
  return props.selectedSeats.includes(seat)
}
function toggle(seat: string) {
  emit('toggle', seat)
}
</script>

<style scoped>
.seatmap {
  display: grid;
  gap: 12px;
}
.legend {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}
.dot.available { background: rgba(47,111,237,0.25); border: 1px solid rgba(47,111,237,0.6); }
.dot.selected { background: rgba(0,179,164,0.55); border: 1px solid rgba(0,179,164,0.9); }
.dot.taken { background: rgba(0,0,0,0.18); border: 1px solid rgba(0,0,0,0.35); }

.bus {
  border-radius: 18px;
  background: #fff;
  box-shadow: var(--app-shadow);
  border: 1px solid rgba(0,0,0,0.06);
  padding: 12px;
}
.front {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.wheel {
  width: 18px; height: 18px; border-radius: 999px;
  background: rgba(0,0,0,0.12);
}
.driver {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(0,0,0,0.06);
}
.rows {
  display: grid;
  gap: 8px;
}
.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr) 18px repeat(2, 1fr);
  gap: 8px;
  align-items: center;
}
.aisle {
  height: 1px;
}
.seat {
  border: 1px solid rgba(47,111,237,0.35);
  background: rgba(47,111,237,0.10);
  border-radius: 10px;
  padding: 10px 6px;
  font-size: 12px;
  font-weight: 700;
}
.seat.taken {
  border-color: rgba(0,0,0,0.20);
  background: rgba(0,0,0,0.10);
  color: rgba(0,0,0,0.45);
}
.seat.selected {
  border-color: rgba(0,179,164,0.85);
  background: rgba(0,179,164,0.25);
}
.seat:disabled {
  cursor: not-allowed;
}
</style>
