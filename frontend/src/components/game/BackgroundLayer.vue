<template>
  <div class="background-layer" :class="{ 'is-enemy': isEnemyTurn }">
    <div class="ambient-glow"></div>

    <div class="grid-bg"></div>

    <div class="particles">
      <div v-for="n in 15" :key="n" class="particle"></div>
    </div>

    <div class="interference-layer"></div>

    <div class="danger-vignette"></div>

    <div class="scanlines"></div>
    
    <div class="vignette"></div>
  </div>
</template>

<script setup>
defineProps({ isEnemyTurn: Boolean });
</script>

<style scoped>
.background-layer {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  overflow: hidden;
  transition: all 1.5s ease-in-out; /* 状态切换时的平滑过渡 */
  
  /* === 定义变量：默认青色模式 === */
  --bg-color: rgba(0, 243, 255, 0.15);
  --grid-color: rgba(0, 243, 255, 0.1);
  --breathe-rate: 8s; /* 呼吸慢 */
}

/* === 敌方回合：切换为红色警戒模式 === */
.background-layer.is-enemy {
  --bg-color: rgba(255, 42, 109, 0.15); /* 霓虹红 */
  --grid-color: rgba(255, 42, 109, 0.2);
  --breathe-rate: 2s; /* 呼吸急促 */
}

/* 1. 环境光：增加呼吸感 */
.ambient-glow {
  position: absolute; inset: -50%;
  background: radial-gradient(circle at 50% 50%, var(--bg-color), transparent 70%);
  filter: blur(80px);
  animation: bg-breathe var(--breathe-rate) infinite alternate ease-in-out;
  transition: background 1.5s;
}

/* 2. 3D 网格：敌方回合会变红且轻微变形 */
.grid-bg {
  position: absolute; inset: -50%;
  
  /* [改动1] 纹理改为“点阵/十字”，而非实线，减少视觉干扰 */
  background-image: radial-gradient(var(--grid-color) 2px, transparent 2px);
  background-size: 50px 50px; /* 间距拉大，更透气 */
  
  transform: perspective(600px) rotateX(20deg) scale(1.5);
  
  /* [改动2] 关键！中间挖空，四周渐显 */
  /* transparent 0% -> 40% (中间完全透明) */
  /* black 80% (边缘显示) */
  mask-image: radial-gradient(circle at 50% 50%, transparent 40%, black 90%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 40%, black 90%);

  transition: all 1.5s;
}
/* 敌方回合网格稍微拉近一点，增加压迫感 */
.background-layer.is-enemy .grid-bg {
  transform: perspective(500px) rotateX(25deg) scale(1.6);
  /* 敌方回合可以让中间的“空洞”稍微收缩一点，压迫感强一点 */
  mask-image: radial-gradient(circle at 50% 50%, transparent 30%, black 90%);
  -webkit-mask-image: radial-gradient(circle at 50% 50%, transparent 30%, black 90%);
  
  filter: drop-shadow(0 0 5px rgba(255, 42, 109, 0.5));
}

/* 3. 粒子系统 (复用之前的，颜色稍微适配一下) */
.particles { position: absolute; inset: 0; }
.particle {
  position: absolute; width: 2px; height: 2px; background: rgba(255,255,255,0.5); border-radius: 50%;
  opacity: 0; animation: float-up 10s infinite linear;
}
/* 这里稍微偷懒省略了 nth-child，实际使用时保留你原本的随机定位代码即可 */
.particle:nth-child(2n) { animation-duration: 7s; }
.particle:nth-child(3n) { animation-duration: 12s; }

/* 4. [新增] 干扰层：电子云/噪点 */
.interference-layer {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(255, 42, 109, 0.1) 3px,
    transparent 4px
  );
  opacity: 0; /* 默认隐藏 */
  mix-blend-mode: color-dodge;
  pointer-events: none;
}
/* 敌方回合触发干扰动画 */
.background-layer.is-enemy .interference-layer {
  animation: glitch-flash 4s infinite; /* 随机闪烁 */
}

/* 5. [新增] 红色警戒边缘 */
.danger-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(circle, transparent 60%, rgba(255, 0, 0, 0.4) 120%);
  opacity: 0;
  transition: opacity 1s;
  mix-blend-mode: overlay;
}
.background-layer.is-enemy .danger-vignette {
  opacity: 1;
  animation: pulse-border 1.5s infinite alternate;
}

/* 扫描线和暗角保持不变 */
.scanlines {
  position: absolute; inset: 0; opacity: 0.15;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  pointer-events: none;
}
.vignette { position: absolute; inset: 0; background: radial-gradient(circle, transparent 50%, #000 100%); opacity: 0.8; }

/* === 动画定义 === */

@keyframes bg-breathe {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.1); opacity: 0.9; }
}

@keyframes float-up {
  0% { transform: translateY(110vh) scale(0); opacity: 0; }
  20% { opacity: 0.5; }
  100% { transform: translateY(-10vh) scale(1); opacity: 0; }
}

/* 电子云/故障闪烁 - 模拟信号接触不良 */
@keyframes glitch-flash {
  0%, 90% { opacity: 0; transform: translateY(0); }
  92% { opacity: 0.3; transform: translateY(10px); } /* 突然出现 */
  93% { opacity: 0; transform: translateY(-10px); }
  96% { opacity: 0.5; transform: translateY(5px); } /* 再次闪烁 */
  100% { opacity: 0; transform: translateY(0); }
}

/* 边缘红光报警 - 急促的脉冲 */
@keyframes pulse-border {
  0% { box-shadow: inset 0 0 50px rgba(255, 42, 109, 0); }
  100% { box-shadow: inset 0 0 150px rgba(255, 42, 109, 0.3); }
}
</style>