<template>
  <div class="panel-content glass-panel">
    
    <div class="panel-header">
      <div class="header-left">
        <Activity :size="18" class="pulse-icon" />
        <h3>战绩分析 // COMBAT DATA</h3>
      </div>
      <div class="header-right">
        <span class="id-badge">ID: {{ playerId.slice(-4) }}</span>
      </div>
    </div>

    <div class="scroll-container custom-scroll">
      
      <div class="overview-section">
        
        <div class="radar-box">
          <svg viewBox="0 0 100 100" class="radar-svg">
            <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" class="radar-grid" />
            <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" class="radar-grid inner" />
            <polygon points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5" class="radar-grid core" />
            <polygon :points="radarPoints" class="radar-data" />
            <circle cx="50" cy="5" r="1.5" class="radar-point" />
            <circle cx="95" cy="27.5" r="1.5" class="radar-point" />
            <circle cx="95" cy="72.5" r="1.5" class="radar-point" />
            <circle cx="50" cy="95" r="1.5" class="radar-point" />
            <circle cx="5" cy="72.5" r="1.5" class="radar-point" />
            <circle cx="5" cy="27.5" r="1.5" class="radar-point" />
          </svg>
          <div class="radar-label top">进攻</div>
          <div class="radar-label tr">防御</div>
          <div class="radar-label br">机动</div>
          <div class="radar-label bottom">经济</div>
          <div class="radar-label bl">战术</div>
          <div class="radar-label tl">运势</div>
        </div>

        <div class="rating-box">
          <div class="rank-letter" :data-rank="commanderRank">{{ commanderRank }}</div>
          <div class="rank-title">指挥官评级</div>
          
          <div class="win-rate-bar-group">
            <div class="wr-label">
              <span>综合胜率</span>
              <span class="highlight">{{ animatedWinRate }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${animatedWinRate}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="data-grid">
        <div class="data-card" v-for="(item, index) in statsData" :key="index">
          <div class="card-label">{{ item.label }}</div>
          <div class="card-value" :class="{ 'text-gold': item.isHighlight }">
            <component v-if="item.icon" :is="item.icon" :size="14" class="inline-icon" />
            {{ item.value }}
          </div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="battle-log-section">
        <div class="section-title">
          <div class="title-left">
            <History :size="14" />
            <span>近期战绩 // HISTORY</span>
          </div>
          <span class="log-count">近5场</span>
        </div>

        <div class="match-list">
          <div 
            v-for="(match, index) in recentMatches" 
            :key="match.id" 
            class="match-item"
            :class="match.result === 'win' ? 'is-win' : 'is-loss'"
            :style="{ animationDelay: `${index * 50}ms` }" 
          >
            <div class="result-dot"></div>
            
            <div class="match-content">
              <div class="match-vs">
                <span class="vs-label">VS</span>
                <span class="opponent">{{ match.opponent }}</span>
              </div>
              <div class="match-details">
                <span class="time">{{ match.date }}前</span>
                <span class="separator">/</span>
                <span class="turns">共 {{ match.moves }} 手</span>
              </div>
            </div>

            <div class="result-text">
               <span v-if="match.result === 'win'">胜利</span>
               <span v-else>战败</span>
            </div>
            
            <div class="used-core-mini" title="核心偏好">
              <component :is="getUnitIcon(match.unit)" :size="14" />
            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { Activity, Crosshair, History, Zap, Shield, Circle } from 'lucide-vue-next';

const playerId = "9527-ALPHA-X";
const animatedWinRate = ref(0);
const targetWinRate = 68;

// 数据汉化
const statsData = reactive([
  { label: '累计场次', value: 142, isNumber: true },
  { label: '最高连胜', value: 5, isNumber: true, isHighlight: true }, // 连胜用高亮色
  { label: '核心偏好', value: '狙击模组', icon: Crosshair },
  { label: '平均回合', value: 24, isNumber: true }
]);

const recentMatches = ref([
  { id: 1, opponent: 'TacticalBot_01', result: 'win', date: '10分钟', moves: 24, unit: 'archer' },
  { id: 2, opponent: 'DragonSlayer', result: 'loss', date: '2小时', moves: 45, unit: 'normal' },
  { id: 3, opponent: 'DeepBlue', result: 'win', date: '1天', moves: 18, unit: 'cavalry' },
  { id: 4, opponent: 'AlphaGo', result: 'loss', date: '2天', moves: 52, unit: 'shield' },
  { id: 5, opponent: 'NoobMaster', result: 'win', date: '3天', moves: 12, unit: 'archer' },
]);

const commanderRank = computed(() => {
  if (targetWinRate >= 80) return 'S';
  if (targetWinRate >= 65) return 'A';
  if (targetWinRate >= 50) return 'B';
  return 'C';
});

// 能力值 (进攻, 防御, 速度, 经济, 战术, 运气)
const abilities = { atk: 85, def: 60, spd: 90, eco: 70, tac: 80, lck: 40 };

const radarPoints = computed(() => {
  const scale = 0.45; 
  const cx = 50, cy = 50;
  // 六边形坐标计算
  const p1 = `${cx},${cy - abilities.atk * scale}`; 
  const p2 = `${cx + abilities.def * scale * 0.866},${cy - abilities.def * scale * 0.5}`; 
  const p3 = `${cx + abilities.spd * scale * 0.866},${cy + abilities.spd * scale * 0.5}`; 
  const p4 = `${cx},${cy + abilities.eco * scale}`; 
  const p5 = `${cx - abilities.tac * scale * 0.866},${cy + abilities.tac * scale * 0.5}`; 
  const p6 = `${cx - abilities.lck * scale * 0.866},${cy - abilities.lck * scale * 0.5}`; 
  return `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;
});

const getUnitIcon = (type) => {
  const map = { archer: Crosshair, cavalry: Zap, shield: Shield, normal: Circle };
  return map[type] || Circle;
};

const animateValue = (obj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    if (typeof obj === 'function') obj(current);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
};

onMounted(() => {
  animateValue((val) => animatedWinRate.value = val, 0, targetWinRate, 1500);
});
</script>

<style scoped>
/* 容器 */
.panel-content {
  display: flex; flex-direction: column; height: 100%;
  background: rgba(10, 15, 20, 0.5); /* 稍微深一点，突出内容 */
  overflow: hidden;
}

.scroll-container {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  padding: 15px; display: flex; flex-direction: column; gap: 20px;
}

/* 头部优化 */
.panel-header {
  padding: 12px 16px; 
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(255,255,255,0.02);
}
.header-left { display: flex; align-items: center; gap: 8px; }
.panel-header h3 { margin: 0; font-size: 12px; font-weight: 800; color: #aaa; letter-spacing: 1px; }
.pulse-icon { color: var(--primary, #00f3ff); animation: pulse 2s infinite; }

/* 右侧 ID 标签：更加收敛 */
.id-badge {
  font-family: monospace; font-size: 10px; color: #555; 
  background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.05);
}

/* === 1. 雷达图区域 === */
.overview-section { display: flex; gap: 10px; height: 140px; }

.radar-box { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; }
.radar-svg { width: 100%; height: 100%; overflow: visible; }
.radar-grid { fill: none; stroke: #333; stroke-width: 1; }
.radar-grid.inner, .radar-grid.core { stroke: rgba(255,255,255,0.05); }
.radar-data { 
  fill: rgba(0, 243, 255, 0.2); stroke: var(--primary, #00f3ff); stroke-width: 2; 
  filter: drop-shadow(0 0 5px var(--primary, #00f3ff));
  animation: radar-grow 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}
.radar-point { fill: #fff; }

.radar-label { position: absolute; font-size: 10px; color: #888; font-weight: bold; transform: scale(0.9); }
.top { top: -5px; } .bottom { bottom: -5px; } 
.tr { top: 20%; right: -5px; } .tl { top: 20%; left: -5px; }
.br { bottom: 20%; right: -5px; } .bl { bottom: 20%; left: -5px; }

/* 评级盒子 */
.rating-box {
  width: 110px; display: flex; flex-direction: column; justify-content: center; align-items: center;
  background: rgba(255,255,255,0.02); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05);
  padding: 10px 5px;
}
.rank-letter {
  font-size: 42px; font-weight: 900; line-height: 1; margin-bottom: 4px;
  background: linear-gradient(135deg, #fff 0%, #888 100%); -webkit-background-clip: text; color: transparent;
  text-shadow: 0 0 15px rgba(255,255,255,0.2);
}
.rank-letter[data-rank="S"] { 
  background: linear-gradient(135deg, #ffd700, #ffaa00); -webkit-background-clip: text; color: transparent;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4); 
}
.rank-title { font-size: 9px; color: #555; letter-spacing: 0.5px; margin-bottom: 8px; }

.win-rate-bar-group { width: 100%; padding: 0 5px; }
.wr-label { display: flex; justify-content: space-between; font-size: 9px; color: #888; margin-bottom: 3px; }
.wr-label .highlight { color: var(--primary, #00f3ff); font-weight: bold; }
.progress-track { width: 100%; height: 4px; background: #222; border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--primary, #00f3ff); box-shadow: 0 0 5px var(--primary, #00f3ff); transition: width 1s ease; }

/* === 2. 数据网格 === */
.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.data-card {
  background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 4px;
  display: flex; flex-direction: column; gap: 2px;
  border-left: 2px solid transparent; transition: 0.2s;
}
.data-card:hover { background: rgba(255,255,255,0.06); border-left-color: var(--primary, #00f3ff); }
.card-label { font-size: 10px; color: #666; }
.card-value { font-size: 13px; font-weight: bold; color: #ddd; display: flex; align-items: center; }
.inline-icon { margin-right: 4px; color: var(--primary, #00f3ff); }
.text-gold { color: #fbbf24; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); width: 100%; }

/* === 3. 战况列表 === */
.battle-log-section { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.section-title { display: flex; justify-content: space-between; align-items: center; color: #777; font-size: 11px; }
.title-left { display: flex; align-items: center; gap: 6px; font-weight: 700; }
.log-count { font-family: monospace; background: rgba(255,255,255,0.05); padding: 1px 4px; border-radius: 2px; font-size: 9px; }

.match-list { display: flex; flex-direction: column; gap: 5px; }

.match-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; background: rgba(0,0,0,0.2); 
  border: 1px solid rgba(255,255,255,0.03); border-radius: 4px; 
  transition: 0.2s;
  animation: slideIn 0.4s ease-out backwards;
}
.match-item:hover { background: rgba(255,255,255,0.05); transform: translateX(2px); }

/* 胜负圆点：更简约 */
.result-dot { width: 6px; height: 6px; border-radius: 50%; }
.is-win .result-dot { background: #4ade80; box-shadow: 0 0 6px #4ade80; }
.is-loss .result-dot { background: #ef4444; box-shadow: 0 0 6px #ef4444; }

.match-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.match-vs { font-size: 12px; font-weight: bold; color: #eee; }
.vs-label { color: #555; font-size: 10px; margin-right: 4px; }
.match-details { font-size: 10px; color: #666; font-family: monospace; }
.separator { margin: 0 2px; color: #444; }

/* 战果文字 */
.result-text { font-size: 11px; font-weight: bold; }
.is-win .result-text { color: #4ade80; }
.is-loss .result-text { color: #ef4444; }

/* 使用的小图标 */
.used-core-mini { 
  color: #555; padding: 2px;
  display: flex; align-items: center; justify-content: center;
}
.match-item:hover .used-core-mini { color: var(--primary, #00f3ff); }

/* 滚动条美化 */
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* 动画 */
@keyframes radar-grow { from { transform: scale(0); opacity: 0; transform-origin: center; } to { transform: scale(1); opacity: 1; transform-origin: center; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes slideIn { from { opacity: 0; transform: translateX(-5px); } to { opacity: 1; transform: translateX(0); } }
</style>