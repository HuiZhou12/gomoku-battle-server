<template>
  <div class="notification-container">
    <TransitionGroup name="cyber-list">
      <div 
        v-for="item in notifications" 
        :key="item.id" 
        class="cyber-toast"
        :class="item.type"
      >
        <div class="decor-bar"></div>
        <div class="icon-area">
          <component :is="getIcon(item.type)" :size="20" />
        </div>

        <div class="content-area">
          <div class="toast-title">{{ item.title }}</div>
          <div class="toast-msg">{{ item.message }}</div>
        </div>

        <div class="scan-line"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useCyberNotify } from '../composables/useCyberNotify';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-vue-next';

const { notifications } = useCyberNotify();

const getIcon = (type) => {
  const map = {
    success: CheckCircle2,
    error: ShieldAlert,
    warning: AlertTriangle,
    info: Info
  };
  return map[type] || Info;
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%); /* 居中显示，像HUD */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 380px;
  pointer-events: none; /* 让点击穿透，不阻挡游戏操作 */
}

.cyber-toast {
  pointer-events: auto;
  position: relative;
  background: rgba(10, 10, 20, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  clip-path: polygon(
    0 0, 
    100% 0, 
    100% 85%, 
    95% 100%, 
    0 100%
  ); /* 右下角切角设计 */
}

/* 颜色变体 */
.cyber-toast.success { border-color: #00f3ff; }
.cyber-toast.success .decor-bar { background: #00f3ff; box-shadow: 0 0 10px #00f3ff; }
.cyber-toast.success .icon-area { color: #00f3ff; }

.cyber-toast.error { border-color: #ff0055; }
.cyber-toast.error .decor-bar { background: #ff0055; box-shadow: 0 0 10px #ff0055; }
.cyber-toast.error .icon-area { color: #ff0055; }

.cyber-toast.warning { border-color: #fbbf24; }
.cyber-toast.warning .decor-bar { background: #fbbf24; box-shadow: 0 0 10px #fbbf24; }
.cyber-toast.warning .icon-area { color: #fbbf24; }

/* 内部布局 */
.decor-bar {
  width: 4px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.icon-area {
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-area {
  flex: 1;
}

.toast-title {
  font-family: monospace;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 4px;
}

.toast-msg {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  line-height: 1.4;
}

/* 扫描线动画 */
.scan-line {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent);
  transform: translateY(-100%);
  animation: scan 2s infinite;
  pointer-events: none;
}
@keyframes scan {
  100% { transform: translateY(100%); }
}

/* 进出场动画 (Vue Transition) */
.cyber-list-enter-active,
.cyber-list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 弹性效果 */
}

.cyber-list-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.cyber-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>