<template>
  <div class="tier-list-container">
    <div 
      v-for="tier in tiers" 
      :key="tier.id"
      class="tier-row"
      :class="getTierStatus(tier)"
      :style="{ '--tier-color': tier.color }"
    >
      <div class="scan-line"></div>

      <div class="tier-icon-wrapper">
        <div class="icon-glow"></div>
        <component :is="tier.icon" :size="28" stroke-width="2" />
      </div>
      
      <div class="tier-info">
        <div class="tier-header">
          <span class="tier-name">{{ tier.name }}</span>
          <span v-if="getTierStatus(tier) === 'active'" class="current-pt">
            {{ currentScore }} <span class="divider">/</span> {{ tier.maxScore === 99999 ? '∞' : tier.maxScore }}
          </span>
        </div>
        
        <div class="tier-meta">
          <span class="range-text">RANGE: {{ tier.minScore }} - {{ tier.maxScore === 99999 ? '∞' : tier.maxScore }}</span>
        </div>

        <div v-if="getTierStatus(tier) === 'active'" class="progress-track">
          <div class="progress-bar" :style="{ width: calculateProgress(tier) + '%' }"></div>
        </div>
      </div>

      <div class="status-badge">
        <span v-if="getTierStatus(tier) === 'active'">CURRENT</span>
        <span v-else-if="getTierStatus(tier) === 'passed'">UNLOCKED</span>
        <span v-else class="locked-icon">
          <Lock :size="14" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Shield, Award, Medal, Crown, Gem, Hexagon, Lock } from 'lucide-vue-next';

const props = defineProps({
  currentScore: { type: Number, default: 0 }
});

// 段位配置表 (图标没变，颜色微调得更亮一点以配合暗黑背景)
const tiers = [
  { id: 1, name: 'IRON COMMANDER', minScore: 0, maxScore: 1000, icon: Hexagon, color: '#94a3b8' },
  { id: 2, name: 'BRONZE VANGUARD', minScore: 1000, maxScore: 1500, icon: Shield, color: '#d97706' },
  { id: 3, name: 'SILVER WARLORD', minScore: 1500, maxScore: 2000, icon: Medal, color: '#e5e7eb' },
  { id: 4, name: 'GOLD MARSHAL', minScore: 2000, maxScore: 2500, icon: Award, color: '#f59e0b' },
  { id: 5, name: 'DIAMOND OVERLORD', minScore: 2500, maxScore: 3000, icon: Gem, color: '#22d3ee' },
  { id: 6, name: 'GALACTIC LEGEND', minScore: 3000, maxScore: 99999, icon: Crown, color: '#d946ef' },
];

// 判断段位状态：'passed' (已过), 'active' (当前), 'locked' (未到)
const getTierStatus = (tier) => {
  if (props.currentScore >= tier.minScore && props.currentScore < tier.maxScore) return 'active';
  if (props.currentScore >= tier.maxScore) return 'passed';
  return 'locked';
};

// 计算当前段位的进度百分比
const calculateProgress = (tier) => {
  if (tier.maxScore === 99999) return 100; // 满级
  const total = tier.maxScore - tier.minScore;
  const current = props.currentScore - tier.minScore;
  return Math.min(100, Math.max(0, (current / total) * 100));
};
</script>

<style scoped>
.tier-list-container {
  display: flex; flex-direction: column; gap: 8px;
  width: 100%;
  padding: 10px;
  font-family: 'Rajdhani', sans-serif; /* 建议引入个科技字体，没有就用 sans-serif */
}

.tier-row {
  position: relative;
  display: flex; align-items: center; gap: 16px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6); /* 深色半透明底 */
  border: 1px solid rgba(255, 255, 255, 0.05);
  /* 右下角切角造型 */
  clip-path: polygon(
    0 0, 
    100% 0, 
    100% 70%, 
    calc(100% - 10px) 100%, 
    0 100%
  );
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* === 状态样式区分 === */

/* 1. 未解锁 (Locked) */
.tier-row.locked {
  opacity: 0.5;
  filter: grayscale(0.8);
  border-style: dashed;
}

/* 2. 已解锁 (Passed) */
.tier-row.passed {
  border-left: 2px solid var(--tier-color);
  background: linear-gradient(90deg, rgba(255,255,255,0.03), transparent);
}
.tier-row.passed .tier-icon-wrapper { color: var(--tier-color); }

/* 3. 当前段位 (Active) - 重点高亮 */
.tier-row.active {
  background: linear-gradient(90deg, rgba(var(--tier-color), 0.1), rgba(15, 23, 42, 0.9));
  border: 1px solid var(--tier-color);
  box-shadow: 0 0 15px -5px var(--tier-color);
  transform: scale(1.02) translateX(5px); /* 稍微突出一点 */
  z-index: 10;
}

/* 左侧图标区域 */
.tier-icon-wrapper {
  position: relative;
  width: 40px; height: 40px;
  display: flex; justify-content: center; align-items: center;
  color: #64748b; /* 默认灰色 */
  z-index: 2;
}

.tier-row.active .tier-icon-wrapper {
  color: #fff;
  filter: drop-shadow(0 0 8px var(--tier-color));
}

/* 只有 Active 状态下的背景光晕 */
.icon-glow {
  position: absolute; inset: 0;
  background: var(--tier-color);
  opacity: 0; border-radius: 50%;
  filter: blur(10px);
  transition: 0.3s;
}
.tier-row.active .icon-glow { opacity: 0.4; }

/* 中间文字信息 */
.tier-info { flex: 1; display: flex; flex-direction: column; gap: 2px; z-index: 2; }

.tier-header { display: flex; justify-content: space-between; align-items: flex-end; }

.tier-name {
  font-weight: 800; font-size: 15px; letter-spacing: 1px;
  color: #e2e8f0; text-transform: uppercase;
}
.tier-row.active .tier-name { color: var(--tier-color); text-shadow: 0 0 10px var(--tier-color); }

.range-text { font-size: 11px; color: #64748b; font-family: monospace; }
.current-pt { font-size: 12px; color: #fff; font-weight: bold; font-family: monospace; }
.divider { color: #475569; margin: 0 2px; }

/* 进度条 (仅 Active 显示) */
.progress-track {
  height: 3px; width: 100%;
  background: rgba(255,255,255,0.1);
  margin-top: 6px;
  border-radius: 2px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: var(--tier-color);
  box-shadow: 0 0 10px var(--tier-color);
  transition: width 0.5s ease-out;
}

/* 右侧徽章 */
.status-badge {
  font-size: 10px; font-weight: 700;
  color: var(--tier-color);
  letter-spacing: 0.5px;
  opacity: 0.8;
}
.tier-row.active .status-badge {
  background: var(--tier-color);
  color: #000;
  padding: 2px 6px;
  border-radius: 2px;
  box-shadow: 0 0 10px var(--tier-color);
}
.locked-icon { color: #475569; }

/* 扫描线动画装饰 (仅 Active) */
.scan-line {
  position: absolute; top: 0; left: 0; width: 4px; height: 100%;
  background: var(--tier-color);
  opacity: 0;
  transform: skewX(-20deg);
  filter: blur(2px);
}
.tier-row.active .scan-line {
  animation: scan 3s infinite linear;
  opacity: 0.5;
}

@keyframes scan {
  0% { left: -10%; opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { left: 120%; opacity: 0; }
}
</style>