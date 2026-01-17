<template>
  <Transition name="modal-zoom">
    <div class="game-over-modal mode-pause" >
      
      <div class="modal-backdrop"></div>
      
      <div class="result-card glass-panel">
        
        <div class="card-header">
          <span class="header-deco">/// CONNECTION INTERRUPTED ///</span>
          <span class="time-stamp">{{ timeString }}</span>
        </div>

        <div class="title-section">
          <h1 class="main-title">
            WARNING
          </h1>
          <h2 class="sub-title">
            OPPONENT DISCONNECTED // 对方信号丢失
          </h2>
        </div>

        <div class="h-divider"></div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="label">CURRENT STATUS</span>
            <span class="value">WAITING</span>
          </div>
          <div class="stat-item">
            <span class="label">NETWORK INTEGRITY</span>
            <span class="value">UNSTABLE</span>
          </div>
          <div class="stat-item">
            <span class="label">AUTO-RESUME IN</span>
            <span class="value highlight">{{timeLeft}}s</span>
          </div>
        </div>

        <div class="passive-notice">
          系统正在尝试重新建立连接，请保持在线。<br>SYSTEM ATTEMPTING RECONNECTION. STAND BY.
        </div>

        <div class="corner-deco top-left"></div>
        <div class="corner-deco bottom-right"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isAlive = ref(true);
const timeLeft = ref(0);
const MAX_TIME = 120;

let timerInterval = null;

const startTimer = () => {
  stopTimer();
  timeLeft.value = MAX_TIME;

  timerInterval = setInterval(() => {
    if (!isAlive.value) return;

    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      stopTimer();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

onUnmounted(() => {
  isAlive.value = false;
  stopTimer();
});
onMounted(() => {
  isAlive.value = true;
  startTimer();
});
</script>


<style scoped>
/* 复用原有结构样式 */
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

/* ================== 新增：黄色/琥珀色主题定义 ================== */
/* 定义一个黄色变量方便统一修改，这里选用稍微带点橙色的琥珀黄，更有警示感 */
.mode-pause { --pause-color: #facc15; }

/* 1. 背景光晕改为黄色 */
.mode-pause .modal-backdrop { background: radial-gradient(circle, rgba(250, 204, 21, 0.2), rgba(0,0,0,0.9)); }

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

/* 2. 卡片边框和阴影改为黄色 */
.mode-pause .result-card { border-color: var(--pause-color); box-shadow: 0 0 30px rgba(250, 204, 21, 0.2); }

.card-header { display: flex; justify-content: space-between; font-size: 10px; color: #666; font-family: monospace; letter-spacing: 2px; }
.title-section { text-align: center; margin: 10px 0; }

.main-title {
  font-size: 64px; font-weight: 900; margin: 0; line-height: 1;
  letter-spacing: 4px; font-style: italic; position: relative;
}

/* 3. 主标题改为黄色发光风格 (参考了胜利界面的样式，但换了颜色) */
.mode-pause .main-title {
  color: var(--pause-color);
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.5), 0 0 20px rgba(250, 204, 21, 0.3);
}

.sub-title { font-size: 14px; letter-spacing: 4px; margin-top: 5px; opacity: 0.8; font-family: 'Rajdhani', sans-serif; }
/* 4. 副标题黄色 */
.mode-pause .sub-title { color: var(--pause-color); }

.h-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); margin: 20px 0; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center; }
.stat-item { display: flex; flex-direction: column; gap: 5px; }
.stat-item .label { font-size: 10px; color: #666; letter-spacing: 1px; }
.stat-item .value { font-size: 20px; font-weight: bold; font-family: monospace; color: #fff; }

/* 5. 数据高亮改为黄色 */
.mode-pause .value.highlight { color: var(--pause-color); text-shadow: 0 0 10px rgba(250, 204, 21, 0.5); }
/* 普通数值也稍微带点黄色倾向，融合感更好 */
.mode-pause .value { color: #fef08a; }

/* 新增：底部被动提示信息的样式，填补按钮移除后的空白 */
.passive-notice {
  margin-top: 20px;
  text-align: center; font-size: 12px; color: #888; line-height: 1.6;
  font-family: monospace;
  border-top: 1px solid rgba(250, 204, 21, 0.1);
  padding-top: 20px;
}

.corner-deco { position: absolute; width: 20px; height: 20px; border: 2px solid; pointer-events: none; }
.top-left { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.bottom-right { bottom: 0; right: 0; border-left: 0; border-top: 0; }
/* 6. 角标改为黄色 */
.mode-pause .corner-deco { border-color: var(--pause-color); }

/* Transition */
.modal-zoom-enter-active, .modal-zoom-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.modal-zoom-enter-from, .modal-zoom-leave-to { opacity: 0; transform: scale(0.8); filter: blur(10px); }
</style>