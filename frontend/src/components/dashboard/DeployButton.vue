<template>
  <div class="deploy-wrapper" @click="toggleMatch" :class="{ 'is-matching': isMatching }">
    
    <div class="ring outer-scale"></div>
    
    <div class="ring middle-mechanical"></div>
    
    <div class="ring inner-data"></div>

    <div class="core-btn">
      <div class="radar-sweep"></div>
      
      <div class="content-box">
        <Swords :size="42" class="main-icon" :class="{ 'shake': isMatching }" />
        
        <div class="main-text" :data-text="btnLabel">
          {{ btnLabel }}
        </div>
        
        <div class="sub-text">
          {{ isMatching ? 'SEARCHING TARGET...' : 'RANKED PROTOCOL' }}
        </div>
        
        <div class="status-bar" v-if="isMatching">
          <div class="bar-fill"></div>
        </div>
      </div>
      
      <div class="border-glow"></div>
    </div>
    
    <div class="decor-line top"></div>
    <div class="decor-line bottom"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Swords } from 'lucide-vue-next';

const props = defineProps({ isMatching: Boolean });
const emit = defineEmits(['update']);

const btnLabel = computed(() => props.isMatching ? 'ABORT' : 'ENGAGE');

const toggleMatch = () => {
  emit('update', !props.isMatching);
};
</script>

<style scoped>
/* ================== 容器 ================== */
.deploy-wrapper {
  position: relative;
  width: 240px; height: 240px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer;
  user-select: none;
  --theme-color: #00f3ff; /* 默认青色 */
  --shadow-color: rgba(0, 243, 255, 0.4);
}

/* ================== 状态切换：匹配模式 (变色/加速) ================== */
.deploy-wrapper.is-matching {
  --theme-color: #ff2a6d; /* 变为警报红 */
  --shadow-color: rgba(255, 42, 109, 0.6);
}

.deploy-wrapper.is-matching .outer-scale { animation-duration: 2s; border-color: rgba(255, 42, 109, 0.3); }
.deploy-wrapper.is-matching .middle-mechanical { animation-duration: 3s; border-top-color: var(--theme-color); }
.deploy-wrapper.is-matching .radar-sweep { opacity: 1; }
.deploy-wrapper.is-matching .core-btn { box-shadow: 0 0 50px var(--shadow-color), inset 0 0 20px var(--theme-color); }

/* ================== 核心按钮 ================== */
.core-btn {
  width: 150px; height: 150px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex; justify-content: center; align-items: center;
  position: relative; z-index: 10;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 30px rgba(0,0,0,0.5), inset 0 0 10px rgba(0, 243, 255, 0.1);
}

/* 悬停效果 */
.deploy-wrapper:hover .core-btn {
  transform: scale(1.05);
  border-color: var(--theme-color);
  box-shadow: 0 0 40px var(--shadow-color);
}
.deploy-wrapper:active .core-btn { transform: scale(0.95); }

/* 内容布局 */
.content-box {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  color: var(--theme-color);
  transition: color 0.3s;
}

.main-icon { transition: transform 0.3s; }
.deploy-wrapper:hover .main-icon { transform: scale(1.2) rotate(-15deg); }
.shake { animation: shake-icon 0.5s infinite; }

.main-text {
  font-size: 24px; font-weight: 900; letter-spacing: 2px; margin-top: 5px;
  position: relative; font-family: 'Rajdhani', sans-serif;
}
.sub-text {
  font-size: 10px; opacity: 0.6; font-family: monospace; letter-spacing: 1px; margin-top: 2px;
}

/* 故障文字特效 (Hover时触发) */
.deploy-wrapper:hover .main-text::before,
.deploy-wrapper:hover .main-text::after {
  content: attr(data-text);
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: #000; opacity: 0.8;
}
.deploy-wrapper:hover .main-text::before {
  left: 2px; text-shadow: -1px 0 #ff00c1; clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 2s infinite linear alternate-reverse;
}
.deploy-wrapper:hover .main-text::after {
  left: -2px; text-shadow: -1px 0 #00fff9; clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 2s infinite linear alternate-reverse;
}

/* ================== 装饰光环 ================== */
.ring {
  position: absolute; border-radius: 50%;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  pointer-events: none;
  transition: border-color 0.5s;
}

/* 1. 外围刻度 */
.outer-scale {
  width: 230px; height: 230px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  animation: spin 60s linear infinite;
}

/* 2. 中层机械臂 */
.middle-mechanical {
  width: 190px; height: 190px;
  border: 2px solid transparent;
  border-top: 2px solid var(--theme-color);
  border-bottom: 2px solid var(--theme-color);
  opacity: 0.5;
  animation: spin 10s linear infinite;
}

/* 3. 内层数据环 */
.inner-data {
  width: 165px; height: 165px;
  border: 1px dotted var(--theme-color);
  opacity: 0.3;
  animation: spin-reverse 5s linear infinite;
}

/* ================== 特效层 ================== */
/* 雷达扫描 */
.radar-sweep {
  position: absolute; inset: -20%; /* [优化] 让它比容器稍微大一点，防止边缘露馅 */
  /* [优化] 更平滑的拖尾渐变 */
  background: conic-gradient(from 0deg, transparent 0%, transparent 60%, var(--theme-color) 100%);
  opacity: 0; 
  border-radius: 50%;
  
  /* [修复] 使用专属的 rotate-center 动画，不再位移 */
  animation: rotate-center 1.5s linear infinite;
  
  transition: opacity 0.3s;
  mix-blend-mode: screen; /* [优化] 让光效叠加更通透 */
}

/* 边缘流光 */
.border-glow {
  position: absolute; inset: 0; border-radius: 50%;
  box-shadow: inset 0 0 20px var(--theme-color);
  opacity: 0.2;
}

/* 匹配时的进度条 */
.status-bar {
  width: 40px; height: 3px; background: rgba(0,0,0,0.5);
  margin-top: 6px; overflow: hidden; border-radius: 2px;
}
.bar-fill {
  width: 100%; height: 100%; background: var(--theme-color);
  animation: loading-bar 1.5s infinite ease-in-out;
}

/* 装饰线 */
.decor-line {
  position: absolute; width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, var(--theme-color), transparent);
  left: 50%; opacity: 0; transition: 0.5s;
}
.decor-line.top { top: -20px; }
.decor-line.bottom { bottom: -20px; }
.deploy-wrapper:hover .decor-line { height: 60px; opacity: 1; }

/* ================== 动画 Keyframes ================== */
@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes spin-reverse { from { transform: translate(-50%, -50%) rotate(360deg); } to { transform: translate(-50%, -50%) rotate(0deg); } }
@keyframes shake-icon { 0% { transform: translate(1px, 1px) rotate(0deg); } 10px { transform: translate(-1px, -2px) rotate(-1deg); } 20% { transform: translate(-3px, 0px) rotate(1deg); } 30% { transform: translate(3px, 2px) rotate(0deg); } 40% { transform: translate(1px, -1px) rotate(1deg); } 50% { transform: translate(-1px, 2px) rotate(-1deg); } 60% { transform: translate(-3px, 1px) rotate(0deg); } 70% { transform: translate(3px, 1px) rotate(-1deg); } 80% { transform: translate(-1px, -1px) rotate(1deg); } 90% { transform: translate(1px, 2px) rotate(0deg); } 100% { transform: translate(1px, -2px) rotate(-1deg); } }
@keyframes glitch-anim { 0% { clip: rect(38px, 9999px, 81px, 0); transform: skew(0.8deg); } 5% { clip: rect(66px, 9999px, 67px, 0); transform: skew(0.76deg); } 10% { clip: rect(98px, 9999px, 15px, 0); transform: skew(0.83deg); } 15% { clip: rect(32px, 9999px, 83px, 0); transform: skew(0.01deg); } 20% { clip: rect(63px, 9999px, 4px, 0); transform: skew(0.43deg); } 25% { clip: rect(8px, 9999px, 91px, 0); transform: skew(0.39deg); } 30% { clip: rect(35px, 9999px, 31px, 0); transform: skew(0.56deg); } 35% { clip: rect(69px, 9999px, 99px, 0); transform: skew(0.25deg); } 40% { clip: rect(4px, 9999px, 73px, 0); transform: skew(0.56deg); } 45% { clip: rect(95px, 9999px, 28px, 0); transform: skew(0.67deg); } 50% { clip: rect(11px, 9999px, 86px, 0); transform: skew(0.92deg); } 55% { clip: rect(37px, 9999px, 25px, 0); transform: skew(0.05deg); } 60% { clip: rect(61px, 9999px, 70px, 0); transform: skew(0.08deg); } 65% { clip: rect(83px, 9999px, 98px, 0); transform: skew(0.06deg); } 70% { clip: rect(100px, 9999px, 60px, 0); transform: skew(0.02deg); } 75% { clip: rect(8px, 9999px, 36px, 0); transform: skew(0.34deg); } 80% { clip: rect(74px, 9999px, 3px, 0); transform: skew(0.12deg); } 85% { clip: rect(25px, 9999px, 4px, 0); transform: skew(0.33deg); } 90% { clip: rect(34px, 9999px, 68px, 0); transform: skew(0.19deg); } 95% { clip: rect(85px, 9999px, 36px, 0); transform: skew(0.48deg); } 100% { clip: rect(54px, 9999px, 24px, 0); transform: skew(0.57deg); } }
@keyframes glitch-anim2 { 0% { clip: rect(8px, 9999px, 89px, 0); transform: skew(0.97deg); } 5% { clip: rect(87px, 9999px, 32px, 0); transform: skew(0.81deg); } 10% { clip: rect(17px, 9999px, 46px, 0); transform: skew(0.86deg); } 15% { clip: rect(76px, 9999px, 61px, 0); transform: skew(0.16deg); } 20% { clip: rect(40px, 9999px, 6px, 0); transform: skew(0.24deg); } 25% { clip: rect(25px, 9999px, 67px, 0); transform: skew(0.53deg); } 30% { clip: rect(56px, 9999px, 16px, 0); transform: skew(0.8deg); } 35% { clip: rect(30px, 9999px, 36px, 0); transform: skew(0.39deg); } 40% { clip: rect(22px, 9999px, 77px, 0); transform: skew(0.4deg); } 45% { clip: rect(38px, 9999px, 5px, 0); transform: skew(0.89deg); } 50% { clip: rect(42px, 9999px, 62px, 0); transform: skew(0.21deg); } 55% { clip: rect(52px, 9999px, 14px, 0); transform: skew(0.22deg); } 60% { clip: rect(41px, 9999px, 59px, 0); transform: skew(0.38deg); } 65% { clip: rect(98px, 9999px, 57px, 0); transform: skew(0.79deg); } 70% { clip: rect(16px, 9999px, 7px, 0); transform: skew(0.38deg); } 75% { clip: rect(61px, 9999px, 38px, 0); transform: skew(0.7deg); } 80% { clip: rect(81px, 9999px, 51px, 0); transform: skew(0.96deg); } 85% { clip: rect(19px, 9999px, 30px, 0); transform: skew(0.1deg); } 90% { clip: rect(82px, 9999px, 64px, 0); transform: skew(0.96deg); } 95% { clip: rect(63px, 9999px, 55px, 0); transform: skew(0.94deg); } 100% { clip: rect(13px, 9999px, 65px, 0); transform: skew(0.01deg); } }
@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
/* [新增] 纯旋转动画 (给雷达和不需要位移的元素用) */
@keyframes rotate-center {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>