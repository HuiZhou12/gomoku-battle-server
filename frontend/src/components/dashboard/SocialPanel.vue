<template>
  <div class="panel-content glass-panel">
    
    <div class="section-block friend-section">
      <div class="panel-header">
        <div class="header-left">
          <Users :size="16" class="icon-cyan"/>
          <h3>SQUAD LIST // 在线战友</h3>
        </div>
        <div class="header-right">
          <span class="count-badge">5/20</span>
        </div>
      </div>

      <div class="friend-list custom-scroll">
        <div v-for="i in 5" :key="i" class="friend-card">
          <div class="card-deco-corner"></div>

          <div class="friend-avatar-box">
            <div class="avatar-ring" :class="{ 'spinning': i === 2 }"></div>
            <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=Friend${i}`" />
            <div class="status-dot online"></div>
          </div>

          <div class="friend-info">
            <div class="info-top">
              <span class="name">Operative_0{{i}}</span>
              <span class="level-tag">LV.{{ 20 + i * 3 }}</span>
            </div>
            <div class="info-bottom">
              <span class="status-text" :class="i === 2 ? 'text-warn' : 'text-muted'">
                {{ i === 2 ? 'IN MATCH' : 'IDLE' }}
              </span>
              <span class="win-rate">WR: {{ 45 + i }}%</span>
            </div>
          </div>

          <div class="action-group">
            <button class="action-btn secondary" title="发送通讯">
              <MessageSquare :size="12"/>
            </button>
            <button class="action-btn primary" title="发起决斗邀请">
              <Swords :size="14"/>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="section-block broadcast-section">
      <div class="panel-header small">
        <div class="header-left">
           <Radio :size="14" class="pulse-icon"/>
           <span>GLOBAL FEED // 战术播报</span>
        </div>
        <div class="live-dot"></div>
      </div>
      
      <div class="broadcast-terminal custom-scroll">
        <div class="scan-overlay"></div>
        
        <div v-for="(log, index) in broadcastLogs" :key="index" class="log-line">
          <span class="log-time">{{ log.time }}</span>
          
          <div class="log-body">
            <span v-if="log.type === 'SYSTEM'" class="log-content system">
              <span class="tag">[SYS]</span> {{ log.content }}
            </span>

            <span v-if="log.type === 'MATCH'" class="log-content match">
              <span class="user win">{{ log.winner }}</span> def. <span class="user">{{ log.loser }}</span>
            </span>

            <span v-if="log.type === 'RANK'" class="log-content rank">
              <span class="user highlight">{{ log.user }}</span> promoted to <span class="rank-name">[{{ log.rank }}]</span>
            </span>
          </div>
        </div>
        <div class="terminal-cursor">_</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Users, Swords, Radio, MessageSquare } from 'lucide-vue-next';

// 模拟数据
const broadcastLogs = ref([
  { type: 'SYSTEM', content: 'S1赛季排位系统已上线。', time: '10:00:01' },
  { type: 'RANK', user: 'DragonSlayer', rank: 'DIAMOND', time: '10:05:22' },
  { type: 'MATCH', winner: 'Hui_Master', loser: 'NoobPlayer', time: '10:12:45' },
  { type: 'MATCH', winner: 'AlphaGo', loser: 'KeJie_01', time: '10:14:11' },
  { type: 'SYSTEM', content: '检测到异常能量波动...', time: '10:15:30' },
]);
</script>

<style scoped>
/* 基础布局 */
.panel-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: rgba(10, 15, 20, 0.4); /* 整体深色底 */
}

.section-block { display: flex; flex-direction: column; }
.friend-section { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.broadcast-section { height: 220px; border-top: 1px solid rgba(0, 243, 255, 0.2); background: rgba(0, 0, 0, 0.4); position: relative; }

/* === Header 通用样式 === */
.panel-header {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex; justify-content: space-between; align-items: center;
}
.header-left { display: flex; align-items: center; gap: 8px; }
.panel-header h3 { margin: 0; font-size: 11px; font-weight: 800; color: #888; letter-spacing: 1.5px; }
.icon-cyan { color: var(--primary, #00f3ff); }
.count-badge { font-size: 10px; font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #aaa; }

.panel-header.small { padding: 8px 16px; background: rgba(0,0,0,0.6); }
.panel-header.small span { font-size: 10px; font-weight: bold; color: var(--primary, #00f3ff); letter-spacing: 1px; }

/* === 好友列表区 === */
.friend-list {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 好友卡片 (核心优化) */
.friend-card {
  position: relative;
  display: flex; align-items: center; gap: 12px;
  padding: 10px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 2px; /*稍微硬朗一点 */
  transition: all 0.2s ease;
  /* 切角效果 */
  clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
}

.friend-card:hover {
  background: linear-gradient(90deg, rgba(0, 243, 255, 0.08) 0%, rgba(0,0,0,0) 100%);
  border-color: rgba(0, 243, 255, 0.3);
  transform: translateX(2px);
}

/* 装饰角标 */
.card-deco-corner {
  position: absolute; top: 0; left: 0; width: 3px; height: 100%;
  background: rgba(255,255,255,0.1); transition: 0.2s;
}
.friend-card:hover .card-deco-corner { background: var(--primary, #00f3ff); box-shadow: 0 0 8px var(--primary, #00f3ff); }

/* 头像部分 */
.friend-avatar-box { position: relative; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; }
.friend-avatar-box img { width: 85%; height: 85%; border-radius: 50%; z-index: 2; border: 1px solid rgba(255,255,255,0.2); }
.avatar-ring {
  position: absolute; inset: 0; border: 1px dashed rgba(255,255,255,0.2); border-radius: 50%; z-index: 1;
}
.avatar-ring.spinning { border-color: #fbbf24; animation: spin 4s linear infinite; border-style: solid; border-top-color: transparent; }
.status-dot {
  position: absolute; bottom: 0; right: 0; width: 8px; height: 8px; background: #444; border: 1px solid #000; border-radius: 50%; z-index: 3;
}
.status-dot.online { background: #4ade80; box-shadow: 0 0 5px #4ade80; }

/* 信息部分 */
.friend-info { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
.info-top { display: flex; align-items: center; gap: 6px; }
.name { font-size: 13px; font-weight: 700; color: #eee; }
.level-tag { font-size: 9px; background: #333; padding: 1px 3px; border-radius: 2px; color: #888; font-family: monospace; border: 1px solid #444; }

.info-bottom { display: flex; justify-content: space-between; font-size: 10px; padding-right: 10px; }
.text-muted { color: #666; }
.text-warn { color: #fbbf24; }
.win-rate { color: #444; font-family: monospace; }
.friend-card:hover .win-rate { color: var(--primary, #00f3ff); }

/* 按钮组 */
.action-group { display: flex; gap: 4px; }
.action-btn {
  width: 26px; height: 26px; border-radius: 4px; border: none; cursor: pointer;
  display: flex; justify-content: center; align-items: center; transition: 0.2s;
}
.action-btn.secondary { background: rgba(255,255,255,0.05); color: #888; }
.action-btn.secondary:hover { background: rgba(255,255,255,0.2); color: #fff; }
.action-btn.primary { background: rgba(0, 243, 255, 0.1); color: var(--primary, #00f3ff); border: 1px solid rgba(0, 243, 255, 0.3); }
.action-btn.primary:hover { background: var(--primary, #00f3ff); color: #000; box-shadow: 0 0 8px var(--primary, #00f3ff); }

/* === 播报终端区 === */
.broadcast-terminal {
  flex: 1; padding: 10px 16px; overflow-y: auto; position: relative;
  font-family: 'Consolas', monospace; font-size: 11px;
}
/* 扫描线效果 */
.scan-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 3px);
  z-index: 0; opacity: 0.5;
}

.log-line { display: flex; gap: 8px; margin-bottom: 5px; position: relative; z-index: 1; opacity: 0.9; }
.log-time { color: #444; min-width: 50px; }
.log-body { flex: 1; word-break: break-all; }

.log-content.system { color: #fbbf24; }
.log-content.system .tag { background: #fbbf24; color: #000; padding: 0 2px; font-weight: bold; margin-right: 4px; border-radius: 2px; font-size: 10px; }

.log-content.match { color: #888; }
.log-content.match .user { color: #ddd; }
.log-content.match .user.win { color: var(--primary, #00f3ff); }

.log-content.rank { color: #d8b4fe; }
.log-content.rank .user { color: #fff; font-weight: bold; }
.log-content.rank .rank-name { border-bottom: 1px solid #d8b4fe; }

.terminal-cursor {
  display: inline-block; width: 6px; height: 12px; background: var(--primary, #00f3ff);
  animation: blink 1s step-end infinite; margin-top: 5px;
}

/* 动画 */
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.pulse-icon { animation: blink 2s infinite; color: var(--primary, #00f3ff); }

/* === 自定义滚动条 (Webkit) === */
.custom-scroll::-webkit-scrollbar { width: 4px; }
.custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
.custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(0, 243, 255, 0.3); }

/* 响应式微调 */
@media (max-width: 1400px) {
  .friend-info .win-rate { display: none; } /* 屏幕小时隐藏次要信息 */
}
</style>