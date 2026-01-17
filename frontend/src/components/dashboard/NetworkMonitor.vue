<template>
  <div class="network-monitor" :class="pingStatus">
    <div class="corner-mark top-left"></div>
    <div class="corner-mark bottom-right"></div>

    <div class="icon-box">
      <Signal :size="14" class="signal-icon" />
      <div class="status-dot"></div>
    </div>

    <div class="ping-data">
      <div class="data-row">
        <span class="value">{{ currentPing }}</span>
        <span class="unit">MS</span>
      </div>
      <span class="label">LATENCY // RTT</span>
    </div>

    <div class="spectrum-visualizer">
      <div v-for="i in 5" :key="i" class="spec-bar" :style="{ height: getBarHeight(i) + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Signal } from 'lucide-vue-next';

const currentPing = ref(32);
let pingInterval = null;
// 用于模拟频谱条跳动
const randomSeed = ref(0); 

const pingStatus = computed(() => {
  if (currentPing.value < 60) return 'status-good';
  if (currentPing.value < 150) return 'status-warn';
  return 'status-bad';
});

// 模拟频谱高度
const getBarHeight = (i) => {
  // 基于 ping 值和随机数生成高度，让它看起来在动
  const base = Math.max(20, 100 - currentPing.value / 2); 
  return Math.min(100, Math.max(10, base * Math.random() + randomSeed.value % 20)); 
};

onMounted(() => {
  pingInterval = setInterval(() => {
    // 模拟 Ping 值波动
    const jitter = Math.random() > 0.9 ? 30 : 5;
    const base = 30;
    currentPing.value = base + Math.floor(Math.random() * jitter);
    
    // 刷新频谱动画种子
    randomSeed.value = Math.random() * 100;
  }, 1000); // 稍微加快一点刷新频率，让频谱动起来
});

onUnmounted(() => {
  if (pingInterval) clearInterval(pingInterval);
});
</script>

<style scoped>
.network-monitor {
  position: relative;
  display: flex; align-items: center; gap: 12px; 
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  /* 只有左上和右下有圆角，或者切角效果 */
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  font-family: 'Rajdhani', monospace; /* 建议使用的字体 */
  min-width: 140px;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
}

/* 状态颜色定义 */
.status-good { --status-color: #00f3ff; } /* 正常用青色更科幻，或者经典绿 #4ade80 */
.status-warn { --status-color: #facc15; }
.status-bad  { --status-color: #ff2a6d; }

.network-monitor {
  border-left: 2px solid var(--status-color);
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

/* 装饰角标 */
.corner-mark { position: absolute; width: 6px; height: 6px; border: 1px solid var(--status-color); opacity: 0.5; transition: 0.3s; }
.top-left { top: 0; left: 0; border-bottom: none; border-right: none; }
.bottom-right { bottom: 0; right: 0; border-top: none; border-left: none; }

/* 图标区 */
.icon-box { position: relative; display: flex; align-items: center; color: var(--status-color); }
.status-dot {
  position: absolute; bottom: 0; right: -2px; width: 4px; height: 4px; border-radius: 50%;
  background: var(--status-color);
  box-shadow: 0 0 5px var(--status-color);
  animation: pulse 2s infinite;
}

/* 数据区 */
.ping-data { display: flex; flex-direction: column; line-height: 1; align-items: flex-start; }
.data-row { display: flex; align-items: baseline; gap: 4px; }
.value { font-size: 18px; font-weight: 700; color: #fff; text-shadow: 0 0 5px var(--status-color); letter-spacing: 1px; }
.unit { font-size: 9px; color: var(--status-color); opacity: 0.8; font-weight: bold; }
.label { font-size: 8px; transform: scale(0.9); transform-origin: left; color: rgba(255,255,255,0.4); letter-spacing: 1px; margin-top: 2px; }

/* 频谱条区 */
.spectrum-visualizer {
  display: flex; align-items: flex-end; gap: 2px; height: 16px; margin-left: auto;
}
.spec-bar {
  width: 3px; background: var(--status-color); opacity: 0.4;
  transition: height 0.2s ease; /* 让高度变化稍微丝滑一点 */
  box-shadow: 0 0 5px var(--status-color);
}
/* 让最后一个条最亮，模拟实时数据 */
.spec-bar:last-child { opacity: 1; }

/* 动画 */
@keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0.4; } }

/* 警告状态下的特殊效果 */
.status-bad .network-monitor { border-color: var(--status-color); animation: shake 0.5s infinite; }
.status-bad .value { color: var(--status-color); }

</style>
.chat-box {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0; 
  overflow-y: auto; 
  padding-right: 5px; 
  height: 0; 
  scrollbar-width: thin;
  scrollbar-color: var(--primary) transparent;
}
.chat-box::-webkit-scrollbar { width: 4px; }
.chat-box::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
.chat-box::-webkit-scrollbar-track { background: transparent; }
