<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content glass-panel">
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-decor-line"></div>
    </div>
  </div>
</template>

<script setup>
defineProps(['title']);
defineEmits(['close']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px);
  z-index: 100; display: flex; justify-content: center; align-items: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 500px; max-width: 90%;
  background: rgba(10, 10, 25, 0.9);
  border: 1px solid var(--primary);
  box-shadow: 0 0 30px rgba(0, 243, 255, 0.2);
  border-radius: 12px; position: relative; overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.modal-header {
  padding: 20px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.modal-header h3 { margin: 0; color: var(--primary); letter-spacing: 2px; text-transform: uppercase; }

.close-btn {
  background: none; border: none; color: var(--text-muted); font-size: 24px; cursor: pointer;
}
.close-btn:hover { color: #fff; }

.modal-body { padding: 20px; max-height: 70vh; overflow-y: auto; }

.modal-decor-line {
  height: 2px; width: 100%; background: linear-gradient(90deg, transparent, var(--primary), transparent);
  position: absolute; bottom: 0;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px) scale(0.95); } to { transform: translateY(0) scale(1); } }
</style>