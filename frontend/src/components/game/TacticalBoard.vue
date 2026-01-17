<template>
  <div class="board-frame">
    <div class="frame-decor top-left"></div>
    <div class="frame-decor top-right"></div>
    <div class="frame-decor bottom-left"></div>
    <div class="frame-decor bottom-right"></div>
    
    <div class="board-container" :class="{ 'shake-trigger': shake }">
      <canvas 
        ref="boardCanvas" 
        @click="handleClick" 
        @mousemove="handleHover" 
        @mouseleave="hoverPos = null"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import  {com } from '../../proto/game_pb';

// --- 你的特效类保持不变 ---
class Effect { constructor(x, y, onComplete) { this.x = x; this.y = y; this.life = 1.0; this.onComplete = onComplete; this.dead = false; } update(dt) { this.life -= dt; if (this.life <= 0) { this.dead = true; if (this.onComplete) this.onComplete(); } } draw(ctx, cellSize, offset) {} }
class LaserEffect extends Effect { constructor(startX, startY, endX, endY, color) { super(startX, startY); this.sx = startX; this.sy = startY; this.ex = endX; this.ey = endY; this.color = color; this.life = 0.4; } draw(ctx, cellSize, offset) { const alpha = this.life * 2.5; ctx.save(); ctx.strokeStyle = this.color; ctx.lineWidth = 3 * this.life; ctx.globalAlpha = Math.min(alpha, 1); ctx.lineCap = 'round'; ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.beginPath(); ctx.moveTo(offset + this.sx * cellSize, offset + this.sy * cellSize); ctx.lineTo(offset + this.ex * cellSize, offset + this.ey * cellSize); ctx.stroke(); ctx.beginPath(); ctx.fillStyle = '#fff'; ctx.arc(offset + this.ex * cellSize, offset + this.ey * cellSize, 6 * this.life, 0, Math.PI*2); ctx.fill(); ctx.restore(); } }
class ExplosionEffect extends Effect { constructor(x, y, color) { super(x, y); this.color = color; this.life = 0.5; this.particles = []; for(let i=0; i<12; i++) { const angle = Math.random() * Math.PI * 2; const speed = 0.5 + Math.random(); this.particles.push({ vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, x:0, y:0, size: Math.random()*3+1 }); } } update(dt) { super.update(dt); this.particles.forEach(p => { p.x += p.vx * 15 * dt; p.y += p.vy * 15 * dt; p.size *= 0.9; }); } draw(ctx, cellSize, offset) { const cx = offset + this.x * cellSize; const cy = offset + this.y * cellSize; ctx.save(); ctx.fillStyle = this.color; this.particles.forEach(p => { ctx.globalAlpha = this.life; ctx.beginPath(); ctx.rect(cx + p.x * cellSize * 0.5 - p.size/2, cy + p.y * cellSize * 0.5 - p.size/2, p.size, p.size); ctx.fill(); }); ctx.restore(); } }

const props = defineProps({
  boardData: Array,
  myColor: Number,
  isMyTurn: Boolean,
  highlightData: { type: Object, default: () => ({ cells: [], type: null }) },
  selectedUnit: String
});

const emit = defineEmits(['move']);
const effects = ref([]); 
const shake = ref(false);
const GRID_SIZE = 15;
const boardCanvas = ref(null);
const ctx = ref(null);
const cellSize = ref(0);
const offset = ref(0);
const hoverPos = ref(null);
let animationFrameId = null;
let lastTime = Date.now();
const protobuf = com.gomokumaster.proto;

const COLORS = { 
  gridSafe: 'rgba(0, 243, 255, 0.15)', gridDanger: 'rgba(255, 42, 109, 0.2)', 
  self: '#00f3ff', enemy: '#bc13fe' 
};

// ... 其他原有逻辑保持不变 ...
const triggerShake = () => { shake.value = true; setTimeout(() => shake.value = false, 200); };
const playAction = (actionType, data) => {
  if (actionType === 'ARCHER_ATTACK') effects.value.push(new LaserEffect(data.fromX, data.fromY, data.toX, data.toY, COLORS.self));
  else if (actionType === 'KILL') effects.value.push(new ExplosionEffect(data.toX, data.toY, '#ef4444'));
};
const getGridScreenPos = (r, c) => {
  if (!boardCanvas.value) return { x: 0, y: 0 };
  const rect = boardCanvas.value.getBoundingClientRect();
  const cx = offset.value + c * cellSize.value;
  const cy = offset.value + r * cellSize.value;
  return { x: rect.left + cx, y: rect.top + cy };
};
const getX = (col) => offset.value + col * cellSize.value;
const getY = (row) => offset.value + row * cellSize.value;

defineExpose({ triggerShake, playAction, getGridScreenPos });

const initCanvas = () => {
  const canvas = boardCanvas.value;
  if(!canvas) return;
  const container = canvas.parentElement; 
  const size = Math.min(container.clientWidth, container.clientHeight);
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
  ctx.value = canvas.getContext('2d'); ctx.value.scale(dpr, dpr);
  offset.value = size / (GRID_SIZE + 1); cellSize.value = (size - 2 * offset.value) / (GRID_SIZE - 1);
  startRenderLoop();
};

const startRenderLoop = () => {
  const render = () => { drawScene(); animationFrameId = requestAnimationFrame(render); };
  render();
};

// === 核心渲染循环 ===
const drawScene = () => {
  if (!ctx.value || !boardCanvas.value) return;
  const c = ctx.value;
  const size = boardCanvas.value.width / (window.devicePixelRatio || 1);
  const now = Date.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  c.clearRect(0, 0, size, size);
  
  // 1. 绘制网格背景
  const breathSpeed = props.isMyTurn ? 0.003 : 0.001; 
  const intensity = 0.5 + Math.sin(now * breathSpeed) * 0.3;
  c.lineWidth = 1;
  c.strokeStyle = props.isMyTurn ? COLORS.gridSafe : COLORS.gridDanger;
  c.shadowColor = props.isMyTurn ? COLORS.self : '#ff2a6d';
  c.shadowBlur = props.isMyTurn ? 5 * intensity : 15 * intensity;
  
  c.beginPath();
  for (let i = 0; i < GRID_SIZE; i++) {
    const pos = offset.value + i * cellSize.value;
    c.moveTo(offset.value, pos); c.lineTo(size - offset.value, pos);
    c.moveTo(pos, offset.value); c.lineTo(pos, size - offset.value);
  }
  c.stroke();
  c.shadowBlur = 0;
  
  // 2. 绘制覆盖层 (Overlay)
  if (props.highlightData && props.highlightData.cells.length > 0) {
    drawOverlay(c, cellSize.value, offset.value, now);
  }

  // === 新增：3. 绘制电子连接线 (在棋子下方绘制) ===
  drawLinks(c, cellSize.value, offset.value, now);

  // 4. 绘制棋子
  for (let r = 0; r < GRID_SIZE; r++) { 
    for (let col = 0; col < GRID_SIZE; col++) { 
      const cell = props.boardData[r][col]; 
      if (cell) drawPiece(r, col, cell); 
    } 
  }

  // 5. 绘制 Ghost (鼠标悬停预览)
  if (hoverPos.value && props.isMyTurn && !props.boardData[hoverPos.value.r][hoverPos.value.c] && props.highlightData.cells.length === 0) {
    drawUnitIcon(hoverPos.value.r, hoverPos.value.c, props.selectedUnit, true);
  }

  // 6. 绘制特效
  for (let i = effects.value.length - 1; i >= 0; i--) {
    effects.value[i].update(dt);
    effects.value[i].draw(c, cellSize.value, offset.value);
    if (effects.value[i].dead) effects.value.splice(i, 1);
  }
};

// === 新增：电子链路绘制逻辑 ===
const drawLinks = (ctx, cs, off, time) => {
  ctx.save();
  ctx.lineWidth = 2;
  
  // 让线条有点忽明忽暗的电流感
  const pulse = 0.4 + Math.sin(time * 0.005) * 0.2; 
  
  // 遍历所有格子
  for(let r = 0; r < GRID_SIZE; r++) {
    for(let c = 0; c < GRID_SIZE; c++) {
      const current = props.boardData[r][c];
      if(!current) continue;

      const x1 = off + c * cs;
      const y1 = off + r * cs;
      const color = current.color === props.myColor ? COLORS.self : COLORS.enemy;

      // 检查右边
      if(c + 1 < GRID_SIZE) {
        const right = props.boardData[r][c+1];
        // 如果右边有棋子，且颜色相同 (是队友)，则画线
        if(right && right.color === current.color) {
           drawLinkLine(ctx, x1, y1, off + (c+1)*cs, y1, color, pulse);
        }
      }

      // 检查下边
      if(r + 1 < GRID_SIZE) {
        const bottom = props.boardData[r+1][c];
        // 如果下边有棋子，且颜色相同，则画线
        if(bottom && bottom.color === current.color) {
           drawLinkLine(ctx, x1, y1, x1, off + (r+1)*cs, color, pulse);
        }
      }
    }
  }
  ctx.restore();
};

const drawLinkLine = (ctx, x1, y1, x2, y2, color, alpha) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.shadowColor = color;
  ctx.shadowBlur = 5;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  
  // 在连接中心画一个小点，增加科技感
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = alpha + 0.2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
  ctx.fill();
};

// --- 原有的覆盖层绘制 ---
const drawOverlay = (ctx, cs, off, time) => {
  props.highlightData.cells.forEach(item => {
    const cx = off + item.c * cs;
    const cy = off + item.r * cs;
    ctx.save();
    if (item.type === 'range') {
      ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
      ctx.fillRect(cx - cs*0.45, cy - cs*0.45, cs*0.9, cs*0.9);
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.5)';
      const d = cs * 0.4;
      ctx.beginPath(); ctx.moveTo(cx-d, cy-d+5); ctx.lineTo(cx-d, cy-d); ctx.lineTo(cx-d+5, cy-d); ctx.stroke();
    } else if (item.type === 'path') {
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, cs * 0.15, 0, Math.PI * 2); ctx.stroke();
    } else if (item.type === 'target') {
      ctx.fillStyle = 'rgba(255, 42, 109, 0.2)';
      ctx.fillRect(cx - cs*0.45, cy - cs*0.45, cs*0.9, cs*0.9);
      if (hoverPos.value && hoverPos.value.r === item.r && hoverPos.value.c === item.c) {
        ctx.translate(cx, cy); ctx.rotate(time * 0.005);
        ctx.strokeStyle = '#ff2a6d'; ctx.lineWidth = 2; ctx.setLineDash([8, 6]);
        ctx.beginPath(); ctx.arc(0, 0, cs * 0.4, 0, Math.PI * 2); ctx.stroke();
        ctx.rotate(-time * 0.01); ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(0, -cs*0.5); ctx.lineTo(0, -cs*0.3); ctx.moveTo(0, cs*0.5); ctx.lineTo(0, cs*0.3); ctx.moveTo(-cs*0.5, 0); ctx.lineTo(-cs*0.3, 0); ctx.moveTo(cs*0.5, 0); ctx.lineTo(cs*0.3, 0); ctx.stroke();
      }
    }
    ctx.restore();
  });
};

const drawPiece = (r, col, cell) => {
  const c = ctx.value; const x = getX(col); const y = getY(r); 
  const isSelf = cell.color === props.myColor; 
  const baseColor = isSelf ? COLORS.self : COLORS.enemy;
  
  c.beginPath(); c.shadowBlur = 15; c.shadowColor = baseColor; 
  c.fillStyle = isSelf ? 'rgba(0, 243, 255, 0.15)' : 'rgba(188, 19, 254, 0.15)'; 
  c.arc(x, y, cellSize.value * 0.45, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
  
  c.beginPath(); c.lineWidth = 2; c.strokeStyle = baseColor; 
  c.arc(x, y, cellSize.value * 0.4, 0, Math.PI * 2); c.stroke();
  drawUnitIcon(r, col, cell.type, false, baseColor);
};

const drawUnitIcon = (r, c, type, isGhost, colorOverride) => {
  const ctxVal = ctx.value; const cx = getX(c); const cy = getY(r); const size = cellSize.value * 0.4;
  ctxVal.save(); ctxVal.translate(cx, cy);
  
  if(isGhost) { 
    const alpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.2;
    ctxVal.strokeStyle = `rgba(255,255,255,${alpha})`; ctxVal.setLineDash([3,3]); 
  } else { 
    ctxVal.strokeStyle = colorOverride; ctxVal.fillStyle = colorOverride; ctxVal.setLineDash([]); 
  }
  ctxVal.lineWidth = 1.5; ctxVal.beginPath();

  switch (type) {
    case protobuf.PieceType.ARCHER:
      ctxVal.arc(0, 0, size * 0.65, 0, Math.PI * 2); ctxVal.stroke();
      ctxVal.beginPath(); ctxVal.moveTo(0, -size * 0.85); ctxVal.lineTo(0, size * 0.85); ctxVal.moveTo(-size * 0.85, 0); ctxVal.lineTo(size * 0.85, 0); ctxVal.stroke();
      if (!isGhost) { ctxVal.beginPath(); ctxVal.arc(0, 0, size * 0.15, 0, Math.PI * 2); ctxVal.fill(); }
      break;
    case protobuf.PieceType.CAVALRY:
      ctxVal.moveTo(-size * 0.5, size * 0.2); ctxVal.lineTo(0, -size * 0.6); ctxVal.lineTo(size * 0.5, size * 0.2); ctxVal.stroke();
      ctxVal.beginPath(); ctxVal.moveTo(-size * 0.5, size * 0.6); ctxVal.lineTo(0, -size * 0.2); ctxVal.lineTo(size * 0.5, size * 0.6); ctxVal.stroke();
      ctxVal.beginPath(); ctxVal.moveTo(0, -size * 0.2); ctxVal.lineTo(0, size * 0.6); ctxVal.stroke();
      break;
    case protobuf.PieceType.SHIELD:
      ctxVal.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const hx = Math.cos(angle) * size * 0.7; const hy = Math.sin(angle) * size * 0.7;
        if (i === 0) ctxVal.moveTo(hx, hy); else ctxVal.lineTo(hx, hy);
      }
      ctxVal.closePath(); ctxVal.stroke();
      ctxVal.globalAlpha = 0.5; ctxVal.fillRect(-size * 0.25, -size * 0.25, size * 0.5, size * 0.5);
      break;
    default:
      // NORMAL 类型和其他默认
      ctxVal.arc(0, 0, size * 0.25, 0, Math.PI * 2); ctxVal.fill();
      ctxVal.beginPath(); ctxVal.arc(0, 0, size * 0.6, 0, Math.PI * 2); ctxVal.stroke();
      // 在圆环上加一个小点装饰
      ctxVal.beginPath(); ctxVal.arc(size * 0.6, 0, 1, 0, Math.PI * 2); ctxVal.fill();
      break;
  }
  ctxVal.restore();
};

const handleHover = (e) => {
  const rect = boardCanvas.value.getBoundingClientRect();
  const col = Math.round((e.clientX - rect.left - offset.value) / cellSize.value);
  const row = Math.round((e.clientY - rect.top - offset.value) / cellSize.value);
  if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) hoverPos.value = { r: row, c: col }; else hoverPos.value = null;
};

const handleClick = () => {
  if (!hoverPos.value || !props.isMyTurn) return; 
  const { r, c } = hoverPos.value; 
  emit('move', { r, c });
};

onMounted(() => { initCanvas(); window.addEventListener('resize', initCanvas); });
onUnmounted(() => { if (animationFrameId) cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', initCanvas); });
</script>

<style scoped>
.board-frame { width: 95%; height: 95%; position: relative; display: flex; justify-content: center; align-items: center; }
.frame-decor { position: absolute; width: 10px; height: 10px; border: 1px solid #00f3ff; opacity: 0.6; transition: 0.5s; }
.top-left { top: 0; left: 0; border-right: 0; border-bottom: 0; }
.top-right { top: 0; right: 0; border-left: 0; border-bottom: 0; }
.bottom-left { bottom: 0; left: 0; border-right: 0; border-top: 0; }
.bottom-right { bottom: 0; right: 0; border-left: 0; border-top: 0; }

:deep(.alert-mode) .frame-decor { border-color: #ef4444; box-shadow: 0 0 5px #ef4444; }

.board-container { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; }
.shake-trigger { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-2px, 0, 0); } 40%, 60% { transform: translate3d(2px, 0, 0); } }
</style>