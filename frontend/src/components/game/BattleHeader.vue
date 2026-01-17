<template>
  <header class="battle-hud glass-panel slide-down">
    
    <div class="player-pill self" :class="{ active: isMyTurn, 'urgent': isUrgent }">
      <div class="avatar-container">
        <div class="avatar-ring">
          <img :src="userInfo.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=me'" />
          <div class="scan-line" :class="{ 'panic-mode': isUrgent && isMyTurn }"></div> 
        </div>
        
        <svg class="hud-circle" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" class="hud-track"></circle>
          <circle cx="50" cy="50" r="45" class="hud-dash" 
            :style="isMyTurn ? circleStyle : {}"
            :class="{ spinning: isMyTurn && timeLeft > 0 }">
          </circle>
        </svg>
      </div>

      <div class="info">
        <div class="top-row">
          <span class="name">{{ userInfo.name }}</span>
          <span class="tag">CMD</span>
        </div>
        
        <div class="status-row">
           <div class="tech-bar">
             <div class="segment" v-for="n in 5" :key="n" 
                  :class="{ filled: isMyTurn && (timeLeft / 30) * 5 >= (n - 0.5) }">
             </div>
           </div>
           <span class="ping-text">MS: {{ currentPing }}</span>
        </div>
      </div>
      
      <div class="bg-deco">ALLY</div>
    </div>

    <div class="center-hud">
      <div class="turn-counter">
        <span class="label">ROUND</span>
        <span class="count">{{ formattedTurn }}</span>
      </div>
      
      <div class="vs-badge" :class="{ 'glitch-text': isTurnChanging }">VS</div>
      
      <div class="timer-box" :class="{ 'timer-urgent': isUrgent }">
        <span class="time">{{ formattedTime }}</span>
        <span class="time-label" v-if="timeLeft === 0">AUTO</span>
      </div>
    </div>

    <div class="player-pill enemy" :class="{ active: !isMyTurn }">
      <div class="bg-deco">HOSTILE</div>

      <div class="info align-right">
        <div class="top-row">
          <span class="tag enemy-tag">FOE</span>
          <span class="name">{{ opponentInfo.name || 'Unknown' }}</span>
        </div>
        
        <div class="status-row align-right">
          <span class="ping-text warning">SIG: STABLE</span>
          <div class="tech-bar enemy-bar">
             <div class="segment" v-for="n in 5" :key="n" :class="{ filled: !isMyTurn }"></div>
           </div>
        </div>
      </div>

      <div class="avatar-container">
        <div class="avatar-ring enemy-ring">
          <img :src="opponentInfo.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=enemy'" />
          <div class="scan-line red-scan"></div>
        </div>
        <svg class="hud-circle" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" class="hud-track enemy-track"></circle>
          <circle cx="50" cy="50" r="45" class="hud-dash enemy-dash spinning"></circle>
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  userInfo: { type: Object, default: () => ({ name: 'Commander' }) },
  opponentInfo: { type: Object, default: () => ({ name: 'Intruder' }) },
  isMyTurn: Boolean,
  isTurnChanging: Boolean,
  turnCount: { type: Number, default: 1 },
  isPaused: Boolean
});

// === 倒计时逻辑 ===
const MAX_TIME = 45;
const timeLeft = ref(MAX_TIME);
const timerInterval = ref(null);

// 格式化时间 00:29
const formattedTime = computed(() => {
  const t = timeLeft.value;
  return `00:${t < 10 ? '0' + t : t}`;
});

// 格式化回合数 01, 02...
const formattedTurn = computed(() => {
  const round = Math.floor(props.turnCount / 2) + 1;
  return round < 10 ? `0${round}` : round;
});

// 是否处于紧急状态 (最后 10秒)
const isUrgent = computed(() => timeLeft.value <= 10 && props.isMyTurn);

// SVG 圆环周长 (2 * PI * 45 ≈ 283)
const FULL_DASH_ARRAY = 283;
const circleStyle = computed(() => {
  // 计算进度比例
  const fraction = timeLeft.value / MAX_TIME;
  // 计算 dashoffset (从 0 到 283)
  const offset = FULL_DASH_ARRAY - (fraction * FULL_DASH_ARRAY);
  return {
    strokeDasharray: `${FULL_DASH_ARRAY}`,
    strokeDashoffset: offset
  };
});

// 启动计时器
const startTimer = () => {
  clearInterval(timerInterval.value);
  timeLeft.value = MAX_TIME;
  
  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      // 时间到，不清除 interval，前端保持 0，等待后端推送新的棋盘状态
      // 这里可以播放一个“超时警告”的音效
    }
  }, 1000);
};

// 监听回合数变化：一旦回合变了（无论是谁落子，或者超时自动落子），重置计时器
watch(() => props.isMyTurn, () => {
  startTimer();
});
// 监听暂停状态：暂停时停止计时器，恢复时重新启动计时器
watch(() => props.isPaused, (newVal) => {
  if (newVal) {
    clearInterval(timerInterval.value);
  } else {
    startTimer();
  }
});

// === 装饰性逻辑：Ping 值模拟 ===
// 不要把随机数写在 template 里，否则会导致 Vue 频繁更新 DOM 甚至报错
const currentPing = ref(12);
let pingTimer = null;

onMounted(() => {
  startTimer(); // 组件加载开始计时
  
  // 每 2 秒波动一次 Ping 值，更真实
  pingTimer = setInterval(() => {
    currentPing.value = Math.floor(Math.random() * 15) + 10;
  }, 2000);
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
  clearInterval(pingTimer);
});
</script>

<style scoped>
/* 这里只列出新增或修改的 CSS，原来的大部分保留 */

/* 计时器紧急状态 */
.timer-urgent {
  border-color: #ff0f39 !important;
  background: rgba(255, 15, 57, 0.2) !important;
  animation: pulse-red 0.5s infinite alternate;
}
.timer-urgent .time { color: #ff0f39; }

.time-label {
  font-size: 8px; color: #ff0f39; margin-left: 5px; font-weight: bold;
}

/* 玩家框紧急状态 */
.player-pill.self.urgent {
  border-left-color: #ff0f39;
  box-shadow: 0 0 15px rgba(255, 15, 57, 0.2);
}

/* SVG 进度条平滑过渡 */
.hud-dash {
  transition: stroke-dashoffset 1s linear; /* 关键：让圈圈平滑缩短，而不是一卡一卡的 */
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  stroke: #00f3ff;
}

/* 紧急状态下，扫描线变红变快 */
.panic-mode {
  background: linear-gradient(180deg, transparent, rgba(255, 15, 57, 0.6), transparent);
  animation: scan 1s infinite linear; /* 加速 */
}

@keyframes pulse-red {
  from { box-shadow: 0 0 5px #ff0f39; }
  to { box-shadow: 0 0 15px #ff0f39; }
}

/* 保持你原有的 CSS ... */
/* 记得把 .hud-dash 的 stroke-dasharray: 60 100 这种写死的去掉，交给 JS 计算 */
.battle-hud {
  height: 80px; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; z-index: 10;
  background: linear-gradient(180deg, rgba(5, 5, 16, 0.95) 0%, rgba(5, 5, 16, 0.7) 100%);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  backdrop-filter: blur(12px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.5);
}
.player-pill { 
  position: relative; display: flex; align-items: center; gap: 15px; padding: 10px 20px; 
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  background: rgba(255,255,255,0.03); 
  border-left: 2px solid #444; 
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
  min-width: 240px; overflow: hidden;
}
.player-pill.self.active { 
  border-left-color: #00f3ff; 
  background: linear-gradient(90deg, rgba(0,243,255,0.15), rgba(0,0,0,0)); 
  box-shadow: 0 0 20px rgba(0,243,255,0.05); transform: translateX(10px);
}
.player-pill.enemy.active { 
  border-right: 2px solid #bc13fe; border-left: none;
  background: linear-gradient(270deg, rgba(188, 19, 254, 0.15), rgba(0,0,0,0)); 
  box-shadow: 0 0 20px rgba(188,19,254,0.05); transform: translateX(-10px);
}
.bg-deco {
  position: absolute; bottom: -5px; right: 10px; font-size: 40px; font-weight: 900; font-style: italic;
  color: rgba(255,255,255,0.03); pointer-events: none; font-family: 'Impact', sans-serif;
}
.enemy .bg-deco { left: 10px; right: auto; }
.avatar-container { position: relative; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; }
.avatar-ring { 
  width: 36px; height: 36px; border-radius: 50%; overflow: hidden; position: relative; z-index: 2;
  border: 1px solid rgba(255,255,255,0.2);
}
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.scan-line {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(180deg, transparent, rgba(0, 243, 255, 0.5), transparent);
  opacity: 0.3; animation: scan 3s infinite linear;
}
.red-scan { background: linear-gradient(180deg, transparent, rgba(188, 19, 254, 0.5), transparent); }
@keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
.hud-circle { position: absolute; inset: -5px; width: 60px; height: 60px; z-index: 1; transform: rotate(-90deg); }
.hud-track { fill: none; stroke: #333; stroke-width: 2; opacity: 0.5; }
.hud-dash { fill: none; stroke-width: 2; opacity: 1; } 
.enemy-dash { stroke: #bc13fe; stroke-dasharray: 60 100; opacity: 1; }
.spinning { animation: spin-hud 4s linear infinite; }
@keyframes spin-hud { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -314; } }
.info { display: flex; flex-direction: column; justify-content: center; z-index: 2; flex: 1; }
.top-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.status-row { display: flex; align-items: center; gap: 10px; }
.align-right { align-items: flex-end; } 
.align-right .top-row { flex-direction: row-reverse; }
.align-right .status-row { flex-direction: row-reverse; }
.name { font-weight: 700; font-size: 15px; color: #fff; letter-spacing: 1px; }
.tag { font-size: 9px; padding: 1px 4px; background: rgba(0, 243, 255, 0.15); color: #00f3ff; border-radius: 2px; font-weight: bold; }
.enemy-tag { background: rgba(188, 19, 254, 0.15); color: #bc13fe; }
.tech-bar { display: flex; gap: 2px; }
.segment { width: 8px; height: 4px; background: #333; transform: skewX(-20deg); transition: background 0.3s; }
.segment.filled { background: #00f3ff; box-shadow: 0 0 5px #00f3ff; }
.enemy-bar .segment.filled { background: #bc13fe; box-shadow: 0 0 5px #bc13fe; }
.ping-text { font-size: 9px; color: #666; font-family: monospace; }
.ping-text.warning { color: #bc13fe; }
.center-hud { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.vs-badge { 
  font-weight: 900; font-size: 28px; font-style: italic; color: #fff; 
  text-shadow: 0 0 10px rgba(255,255,255,0.3);
}
.glitch-text { animation: glitch-anim 0.3s infinite; color: #ef4444; }
.turn-counter { font-size: 10px; color: #888; letter-spacing: 2px; display: flex; gap: 5px; }
.turn-counter .count { color: #00f3ff; font-weight: bold; }
.timer-box { 
  background: rgba(0,0,0,0.5); padding: 2px 8px; border-radius: 2px; border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; transition: all 0.3s;
}
.time { font-family: 'Consolas', monospace; font-size: 12px; color: #ccc; }
@keyframes glitch-anim { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
.slide-down { animation: slideDown 0.8s ease-out backwards; }
@keyframes slideDown { from { transform: translateY(-50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>