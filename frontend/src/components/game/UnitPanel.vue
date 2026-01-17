<template>
  <div class="panel-content flex-column">
    <div class="unit-selection-area">
      <div class="panel-header">
        <Crosshair class="pulse-icon" :size="16" />
        <h3>TACTICAL UNITS // 部署单位</h3>
      </div>
      <div class="unit-list-container">
        <div class="match-list"> 
          <div 
            v-for="unit in unitTypes" 
            :key="unit.type"
            class="match-item unit-card" 
            :class="{ 
              'is-active': selectedUnit === unit.type, 
              'is-depleted': unit.count === 0,
              'shake-trigger': shakingUnit === unit.type 
            }"
            @click="handleUnitClick(unit)"
          >
            <div class="result-bar"></div>
            
            <div class="unit-icon-wrapper">
              <component :is="unit.icon" :size="18" />
            </div>
            
            <div class="match-content" style="flex: 1;">
              <div class="match-info row-between">
                <span class="unit-label">{{ unit.label }}</span>
                <span class="result-badge" :class="getBadgeClass(unit.count)">
                  {{ unit.count === -1 ? '∞' : (unit.count === 0 ? 'EMPTY' : 'x' + unit.count) }}
                </span>
              </div>
              <div class="match-meta">
                CODE: {{ unit.type.toUpperCase() }} 
                <span v-if="unit.count === 0" class="alert-text">// OFFLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="system-log-area">
      <div class="panel-header small">
        <span>SYSTEM LOG // 战术日志</span>
      </div>
      <div class="log-terminal" ref="logRef">
         <TransitionGroup name="list">
           <div v-for="(log) in gameLogs" :key="log.id" class="terminal-line">
             <span class="time">[{{ log.time }}]</span>
             <span class="cmd">> {{ log.text }}</span>
           </div>
         </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { Crosshair } from 'lucide-vue-next';

const props = defineProps({
  unitTypes: Array,
  selectedUnit: String,
  gameLogs: Array
});

const emit = defineEmits(['select-unit']);

const logRef = ref(null);
const shakingUnit = ref(null); // 用于记录当前正在抖动的单位ID

// 处理点击逻辑
const handleUnitClick = (unit) => {
  if (unit.count === 0) {
    // 1. 如果数量为0，触发抖动 

//[Image of a warning sign]

    triggerShake(unit.type);
    // 这里如果想加“错误音效”，可以调用 playSound('error')
  } else {
    // 2. 正常选择
    emit('select-unit', unit.type);
  }
};

// 触发抖动动画
const triggerShake = (type) => {
  shakingUnit.value = type;
  // 动画时长 0.4s 后重置，以便下次点击还能抖
  setTimeout(() => {
    shakingUnit.value = null;
  }, 400);
};

// 获取徽章样式
const getBadgeClass = (count) => {
  if (count === -1) return 'win-badge'; // 无限
  if (count === 0) return 'danger-badge'; // 耗尽 (红)
  return 'win-badge'; // 正常 (青)
};

watch(() => props.gameLogs.length, () => {
  nextTick(() => {
    if (logRef.value) logRef.value.scrollTop = logRef.value.scrollHeight;
  });
});
</script>

<style scoped>
/* 全局颜色引用 (假设你的根文件有这些变量，如果没有，这里兜底定义) */
:root {
  --danger: #ef4444; /* 警告红 */
  --primary: #00f3ff;
}

/* 面板通用样式 */
.panel-content { display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 15px; box-sizing: border-box; }
.panel-header { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); }
.panel-header h3 { margin: 0; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
.pulse-icon { color: #00f3ff; animation: pulse-opacity 2s infinite; }

/* 单位卡片容器 */
.unit-selection-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.unit-list-container { flex: 1; overflow-y: auto; padding: 10px; }
.match-list { display: flex; flex-direction: column; gap: 8px; }

/* === 核心卡片样式 === */
.match-item.unit-card {
  position: relative; display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.03); 
  padding: 10px; border-radius: 4px; overflow: hidden; cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
}

/* 悬停效果：耗尽时悬停不变亮，反而显示禁止手势 */
.match-item.unit-card:hover { transform: translateX(4px); background: rgba(255,255,255,0.08); }
.match-item.unit-card.is-depleted:hover { transform: none; cursor: not-allowed; border-color: rgba(239, 68, 68, 0.5); }

/* 激活状态 (选中) */
.match-item.unit-card.is-active { background: rgba(0, 243, 255, 0.05); border-color: rgba(0, 243, 255, 0.4); box-shadow: inset 0 0 10px rgba(0, 243, 255, 0.05); }

/* === 耗尽状态 (警告红) === */
.match-item.unit-card.is-depleted {
  background: rgba(239, 68, 68, 0.05); /* 淡淡的红色背景 */
  border-color: rgba(239, 68, 68, 0.2);
  opacity: 0.8;
}
.match-item.unit-card.is-depleted .unit-icon-wrapper { color: #ef4444; opacity: 0.5; }
.match-item.unit-card.is-depleted .unit-label { color: #888; text-decoration: line-through; }
.match-item.unit-card.is-depleted .result-bar { background: #ef4444; box-shadow: none; opacity: 0.5; }

/* 侧边条 */
.result-bar { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: transparent; transition: 0.3s; }
.is-active .result-bar { background: #00f3ff; box-shadow: 0 0 8px #00f3ff; }

.unit-icon-wrapper { color: rgba(255,255,255,0.5); display: flex; align-items: center; transition: 0.3s; }
.is-active .unit-icon-wrapper { color: #00f3ff; transform: scale(1.1); }

.match-info { font-size: 13px; font-weight: 600; display: flex; justify-content: space-between; width: 100%; }
.match-meta { font-size: 9px; color: rgba(255,255,255,0.5); font-family: monospace; display: flex; justify-content: space-between; }
.alert-text { color: #ef4444; font-weight: bold; animation: pulse-opacity 1s infinite; }

/* 徽章样式 */
.result-badge { font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 2px; }
.win-badge { color: #00f3ff; background: rgba(0, 243, 255, 0.1); }
.loss-badge { color: #666; background: rgba(255,255,255,0.05); }
.danger-badge { color: #ef4444; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); }

/* === 抖动动画 === */
.shake-trigger {
  animation: horizontal-shaking 0.3s cubic-bezier(.36,.07,.19,.97) both;
  border-color: #ef4444 !important; /* 抖动时边框变红亮 */
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}

@keyframes horizontal-shaking {
  0% { transform: translateX(0); }
  25% { transform: translateX(5px); }
  50% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

/* 日志区 */
.system-log-area { height: 180px; display: flex; flex-direction: column; background: #000; border-top: 1px solid rgba(255,255,255,0.1); }
.log-terminal { flex: 1; overflow-y: auto; padding: 10px; font-family: 'Consolas', monospace; font-size: 11px; scrollbar-width: thin; scrollbar-color: #333 #000; display: flex; flex-direction: column; gap: 4px; }
.terminal-line { display: flex; gap: 8px; opacity: 0.8; }
.terminal-line .time { color: #555; white-space: nowrap; }
.terminal-line .cmd { color: #00f3ff; word-break: break-all; }
.panel-header.small { padding: 6px 15px; background: rgba(0,0,0,0.6); border-top: 1px solid rgba(255,255,255,0.1); }
.panel-header.small span { font-size: 10px; color: #00f3ff; letter-spacing: 1px; font-weight: bold; }
@keyframes pulse-opacity { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>