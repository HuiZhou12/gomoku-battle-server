<template>
  <Transition name="modal-zoom">
    <div class="game-over-modal" :class="isWin ? 'mode-win' : 'mode-loss'">
      
      <div class="modal-backdrop"></div>
      
      <div class="result-card glass-panel">
        
        <div class="card-header">
          <span class="header-deco">/// END OF LINE ///</span>
          <span class="time-stamp">{{ timeString }}</span>
        </div>

        <div class="title-section">
          <h1 class="main-title" :data-text="titleText">
            {{ titleText }}
          </h1>
          <h2 class="sub-title">
            {{ isWin ? 'TARGET NEUTRALIZED // 目标肃清' : 'SYSTEM CRITICAL // 系统宕机' }}
          </h2>
        </div>

        <div class="h-divider"></div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="label">TURN COUNT</span>
            <span class="value">{{ turnCount }}</span>
          </div>
          <div class="stat-item">
            <span class="label">TACTICAL RATING</span>
            <span class="value">{{ isWin ? 'S+' : 'F' }}</span>
          </div>
          <div class="stat-item">
            <span class="label">EXP GAINED</span>
            <span class="value highlight">{{ isWin ? '+250' : '+10' }} XP</span>
          </div>
        </div>

        <div class="action-bar">
          <button class="action-btn large primary-btn" @click="$emit('return')">
            <span class="btn-text">RETURN TO BASE // 返回基地</span>
          </button>
          <button class="action-btn large secondary-btn" @click="$emit('retry')">
             RE-DEPLOY // 重新部署
          </button>
        </div>

        <div class="corner-deco top-left"></div>
        <div class="corner-deco bottom-right"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onUnmounted } from 'vue';
import store from '../../store/index'


const props = defineProps({
  winner: String,
  myId: String,
  turnCount: Number
});

defineEmits(['return', 'retry']);

const isWin = computed(() => props.winner === props.myId);
const titleText = computed(() => isWin.value ? 'VICTORY' : 'DEFEATED');
const timeString = new Date().toLocaleTimeString('en-GB');

onUnmounted(() => {
  const matchStore = store.matchStore();
  matchStore.removeMatchInfo();
});
</script>

<style scoped>
.game-over-modal {
  position: absolute; inset: 0; z-index: 100;
  display: flex; justify-content: center; align-items: center;
  overflow: hidden;
}

.modal-backdrop {
  position: absolute; inset: 0;
  background: rgba(5, 5, 10, 0.7);
  backdrop-filter: blur(8px);
  transition: all 0.5s;
}
.mode-win .modal-backdrop { background: radial-gradient(circle, rgba(0, 243, 255, 0.2), rgba(0,0,0,0.8)); }
.mode-loss .modal-backdrop { background: radial-gradient(circle, rgba(255, 42, 109, 0.2), rgba(0,0,0,0.9)); }

.result-card {
  position: relative; width: 500px;
  background: rgba(10, 15, 25, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  display: flex; flex-direction: column; gap: 20px;
  clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);
  box-shadow: 0 0 50px rgba(0,0,0,0.5);
  animation: card-entry 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes card-entry {
  0% { opacity: 0; transform: perspective(1000px) rotateX(20deg) scale(0.8); }
  100% { opacity: 1; transform: perspective(1000px) rotateX(0deg) scale(1); }
}

.mode-win .result-card { border-color: #00f3ff; box-shadow: 0 0 30px rgba(0, 243, 255, 0.2); }
.mode-loss .result-card { border-color: #ef4444; box-shadow: 0 0 30px rgba(255, 42, 109, 0.2); }

.card-header { display: flex; justify-content: space-between; font-size: 10px; color: #666; font-family: monospace; letter-spacing: 2px; }
.title-section { text-align: center; margin: 10px 0; }
.main-title {
  font-size: 64px; font-weight: 900; margin: 0; line-height: 1;
  letter-spacing: 4px; font-style: italic; position: relative;
}

.mode-win .main-title {
  color: #fff;
  text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff;
  background: linear-gradient(180deg, #fff, #00f3ff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.mode-loss .main-title {
  color: #ef4444; text-shadow: 2px 2px 0px #000;
  animation: glitch-skew 1s infinite linear alternate-reverse;
}
.mode-loss .main-title::before, .mode-loss .main-title::after {
  content: attr(data-text); position: absolute; left: 0; width: 100%; height: 100%;
  background: #050510; opacity: 0.5;
}
.mode-loss .main-title::before { left: 2px; text-shadow: -1px 0 #00f3ff; clip: rect(24px, 550px, 90px, 0); animation: glitch-anim-2 3s infinite linear alternate-reverse; }
.mode-loss .main-title::after { left: -2px; text-shadow: -1px 0 #ff2a6d; clip: rect(85px, 550px, 140px, 0); animation: glitch-anim 2.5s infinite linear alternate-reverse; }

.sub-title { font-size: 14px; letter-spacing: 4px; margin-top: 5px; opacity: 0.8; font-family: 'Rajdhani', sans-serif; }
.mode-win .sub-title { color: #00f3ff; } .mode-loss .sub-title { color: #ef4444; }

.h-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin: 20px 0; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center; }
.stat-item { display: flex; flex-direction: column; gap: 5px; }
.stat-item .label { font-size: 10px; color: #666; letter-spacing: 1px; }
.stat-item .value { font-size: 20px; font-weight: bold; font-family: monospace; color: #fff; }
.mode-win .value.highlight { color: #facc15; text-shadow: 0 0 10px rgba(250, 204, 21, 0.5); }

.action-bar { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
.primary-btn {
  height: 50px; background: #00f3ff; color: #000; font-weight: 800; font-size: 16px; cursor: pointer; border: none;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: all 0.2s;
}
.primary-btn:hover { background: #fff; box-shadow: 0 0 20px #00f3ff; }
.mode-loss .primary-btn { background: #ef4444; color: #fff; }
.mode-loss .primary-btn:hover { background: #fff; color: #000; box-shadow: 0 0 20px #ef4444; }

.secondary-btn { border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #aaa; cursor: pointer; }
.secondary-btn:hover { border-color: #fff; color: #fff; }

.corner-deco { position: absolute; width: 20px; height: 20px; border: 2px solid; pointer-events: none; }
.top-left { top: 0; left: 0; border-right: 0; border-bottom: 0; border-color: #00f3ff; }
.bottom-right { bottom: 0; right: 0; border-left: 0; border-top: 0; border-color: #00f3ff; }
.mode-loss .corner-deco { border-color: #ef4444; }

/* 动画部分省略了重复定义，直接复用或在此处添加 keyframes */
@keyframes glitch-skew { 0% { transform: skew(0deg); } 20% { transform: skew(-2deg); } 40% { transform: skew(2deg); } 60% { transform: skew(0deg); } 80% { transform: skew(3deg); } 100% { transform: skew(0deg); } }
@keyframes glitch-anim { 0% { clip: rect(14px, 9999px, 86px, 0); } 100% { clip: rect(32px, 9999px, 92px, 0); } }
@keyframes glitch-anim-2 { 0% { clip: rect(65px, 9999px, 100px, 0); } 100% { clip: rect(20px, 9999px, 80px, 0); } }

/* Transition */
.modal-zoom-enter-active, .modal-zoom-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-zoom-enter-from, .modal-zoom-leave-to { opacity: 0; transform: scale(0.8); filter: blur(10px); }
</style>