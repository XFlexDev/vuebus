<template>
  <div class="qr-wrap app-card">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

const props = defineProps<{ value: string }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

async function render() {
  if (!canvasRef.value) return
  await QRCode.toCanvas(canvasRef.value, props.value, {
    margin: 2,
    width: 220,
    errorCorrectionLevel: 'M'
  })
}

onMounted(render)
watch(() => props.value, render)
</script>

<style scoped>
.qr-wrap {
  display: grid;
  place-items: center;
  background: #fff;
  padding: 14px;
}
</style>
