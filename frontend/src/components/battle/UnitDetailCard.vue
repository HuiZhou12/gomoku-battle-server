<template>
  <Transition name="hud-pop">
    <div v-if="unit" class="unit-detail-float glass-panel" :key="unit.id" 
      :class="{ 'ghost-view': isGhost }"
    >
      
      <svg class="tactical-line" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="0" cy="100" r="3" fill="#00f3ff" />
        <path d="M 0 100 L 20 80 L 80 80" fill="none" stroke="#00f3ff" stroke-width="1" opacity="0.6" />
      </svg>

      <div class="float-content">
        <div class="dock-header">
          <span class="unit-id">ID:{{ unit.id.toString().slice(-4) }}</span>
          <span class="unit-type-code">{{ unit.type }}</span>
        </div>
        
        <div class="dock-body">
          <div class="visual-box">
            <div class="icon-wrapper" :class="unit.skillCd > 0 ? 'status-cooldown' : 'status-ready'">
              <component :is="getIcon(unit.type)" :size="28" />
            </div>
          </div>
          
          <div class="data-panel">
            <div class="unit-title">{{ getLabel(unit.type) }}</div>
            
            <div class="cooldown-section">
              <div class="cd-label">
                <span>CHARGE</span>
                <span :class="unit.skillCd > 0 ? 'text-warn' : 'text-cyan'">
                  {{ unit.skillCd > 0 ? `${unit.skillCd}T` : 'MAX' }}
                </span>
              </div>
              <div class="charge-bar">
                <div 
                  v-for="n in getMaxCd(unit.type)" 
                  :key="n" 
                  class="charge-cell"
                  :class="{ 'filled': n > unit.skillCd, 'warning': unit.skillCd > 0 }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="skill-info">
           {{ getDesc(unit.type) }}
        </div>
      </div>
      
    </div>
  </Transition>
</template>

<script setup>
import { Circle, Crosshair, Shield, Zap } from 'lucide-vue-next';
import {com } from '../../proto/game_pb';
const protobuf = com.gomokumaster.proto;
const props = defineProps({ 
  unit: Object,
  isGhost: Boolean 
});


const getIcon = (type) => {
  console.log('获取图标类型：', type);
  switch (type) {
    case protobuf.PieceType.NORMAL:
      return Circle;
    case protobuf.PieceType.ARCHER:
      return Crosshair;
    case protobuf.PieceType.CAVALRY:
      return Zap;
    case protobuf.PieceType.SHIELD:
      return Shield;
    default:
      return Circle;
  }
};

const getLabel = (type) => {
  switch (type) {
    case protobuf.PieceType.NORMAL:
      return 'CORE';
    case protobuf.PieceType.ARCHER:
      return 'SNIPER';
    case protobuf.PieceType.CAVALRY:
      return 'RUSH';
    case protobuf.PieceType.SHIELD:
      return 'SHIELD';
    default:
      return 'UNKNOWN';
  }
};

const getMaxCd = (type) => {
  switch (type) {
    case protobuf.PieceType.NORMAL:
      return 1;
    case protobuf.PieceType.ARCHER:
      return 4;
    case protobuf.PieceType.CAVALRY:
      return 5;
    case protobuf.PieceType.SHIELD:
      return 6;
    default:
      return 5;
  }

};

const getDesc = (type) => {
  switch (type) {
    case protobuf.PieceType.NORMAL:
      return '链路节点。无特殊机能。';
    case protobuf.PieceType.ARCHER:
      return '打击 2 格范围内的敌方目标。';
    case protobuf.PieceType.CAVALRY:
      return '直线突进，摧毁路径末端目标。';
    case protobuf.PieceType.SHIELD:
      return '保护周围 8 格友军免受打击。';
    default:
      return '未知核心，无数据。';
  }
};
</script>

<style scoped>
/* 浮动容器 */
.unit-detail-float {
  position: fixed;
  z-index: 100;
  pointer-events: none; 
  transition: opacity 0.3s ease, transform 0.3s ease; 
}
/* 幽灵模式样式 */
.ghost-view {
  opacity: 0.15; /* 变得非常透明，几乎隐形 */
  transform: scale(0.95); /* 微微缩小，避让的感觉 */
  filter: blur(2px); /* 加一点模糊，仿佛对焦在背景上 */
}

/* 战术引线 */
.tactical-line {
  position: absolute;
  bottom: 0; left: -80px; /* 根据实际位置微调，让圆点对准棋子 */
  width: 80px; height: 80px;
  overflow: visible;
  pointer-events: none;
}

/* 卡片内容区 */
.float-content {
  background: rgba(10, 15, 25, 0.9);
  border: 1px solid rgba(0, 243, 255, 0.3);
  border-left: 3px solid #00f3ff;
  padding: 10px;
  width: 200px; /* 稍微紧凑一点 */
  border-radius: 0 8px 8px 8px;
  backdrop-filter: blur(5px);
}

.dock-header { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 8px; }
.unit-id, .unit-type-code { font-family: monospace; font-size: 9px; color: rgba(255,255,255,0.5); }

.dock-body { display: flex; gap: 10px; align-items: center; }
.visual-box { display: flex; align-items: center; justify-content: center; }
.status-ready { color: #00f3ff; }
.status-cooldown { color: #555; }

.data-panel { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.unit-title { font-weight: 700; color: #fff; font-size: 12px; }

.cooldown-section { display: flex; flex-direction: column; gap: 2px; }
.cd-label { display: flex; justify-content: space-between; font-size: 8px; color: #888; font-family: monospace; }
.text-cyan { color: #00f3ff; }
.text-warn { color: #fbbf24; }

.charge-bar { display: flex; gap: 1px; height: 4px; background: rgba(0,0,0,0.5); }
.charge-cell { flex: 1; background: #333; transform: skewX(-15deg); transition: 0.3s; }
.charge-cell.filled { background: #00f3ff; box-shadow: 0 0 5px #00f3ff; }
.charge-cell.warning.filled { background: #fbbf24; box-shadow: none; }

.skill-info { margin-top: 8px; font-size: 10px; color: #aaa; line-height: 1.3; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 5px; }

/* 弹窗动画：带缩放和位移，更有科技感 */
.hud-pop-enter-active, .hud-pop-leave-active { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.hud-pop-enter-from, .hud-pop-leave-to { opacity: 0; transform: scale(0.8) translate(-10px, 10px); }
</style>