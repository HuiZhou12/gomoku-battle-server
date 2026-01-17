<template>
  <div class="lobby-container">
    <div class="background-layer">
      <div class="grid-bg"></div>
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="scanlines"></div>
      <div class="vignette"></div>
    </div>

    <header class="top-bar glass-panel slide-down">
      <div class="brand">
        <div class="logo-box">
          <Gamepad2 class="icon-brand" :size="24" />
        </div>
        <div class="brand-text">
          <span class="main">TACTICAL</span>
          <span class="sub">TERMINAL // <span class="online-dot" :class="{ offline: !isOnline }"></span>{{ isOnline? 'ONLINE' : 'OFFLINE'}}</span>
        </div>
      </div>

      <div class="user-status">
        <NetworkMonitor />

        <div class="divider-v"></div>

        <div class="profile-pill">
          <div class="avatar-ring">
            <img :src="userInfo.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Commander'" />
          </div>
          <div class="user-meta">
            <span class="username">{{ userInfo.username || '指挥官' }}</span>
            <span class="uid">UID: {{ (userInfo.id || '9527').toString().slice(-4) }}</span>
          </div>
          
          <div class="action-icons">
            <button class="icon-btn" title="设置"><Settings :size="18" /></button>
            <button class="icon-btn danger" title="登出" @click="handleLogout"><LogOut :size="18" /></button>
          </div>
        </div>
      </div>
    </header>

    <main class="dashboard-grid">
      
      <section class="panel left-panel slide-in-left">
        <BattleStats :player-id="userInfo.id?.toString()" />
      </section>

      <section class="panel center-panel scale-in">
        
        <div class="rank-display" @click="showRankModal = true">
          <div class="holo-pedestal">
            <div class="ring-outer"></div>
            <div class="ring-inner"></div>
            <Trophy :size="80" class="rank-icon" />
          </div>
          
          <div class="rank-info">
            <h2 class="rank-name">GOLD COMMANDER IV</h2>
            <div class="score-pill">
              <span class="label">RATING</span>
              <span class="value">{{ userInfo.score || 2050 }}</span>
            </div>
            <div class="click-hint">CLICK FOR DETAILS // 点击查看详情</div>
          </div>
        </div>

        <DeployButton 
          :isMatching="isMatching"
          @update="refresh" 
        />

        <div class="server-status">
          <span>SERVER: ASIA-01</span>
          <span>LATENCY: 24ms</span>
          <span>PLAYERS: 14,203</span>
        </div>
        
      </section>

      <section class="panel right-panel slide-in-right">
        <SocialPanel />
      </section>

    </main>

    <CyberModal v-if="showRankModal" title="TACTICAL TIER SYSTEM // 战术等级" @close="showRankModal = false">
      <RankTierList :currentScore="userInfo.score || 2050" />
    </CyberModal>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store/index';
// 图标
import { Gamepad2, Settings, LogOut, Trophy } from 'lucide-vue-next';
import NetworkMonitor from '../components/dashboard/NetworkMonitor.vue';
import BattleStats from '../components/dashboard/StatsPanel.vue'; 
import SocialPanel from '../components/dashboard/SocialPanel.vue'; 
import DeployButton from '../components/dashboard/DeployButton.vue';
import CyberModal from '../components/rank/CyberModal.vue';
import RankTierList from '../components/rank/RankTierList.vue';

// 服务与工具
import { connectWebSocket, disconnectWebSocket, sendMessage } from "../services/webSocketMin"
import { useCyberNotify } from '../composables/useCyberNotify';
import { com } from '../proto/game_pb';

const router = useRouter();
const accountStore = store.accountInfoStore();
const matchStore = store.matchStore();
const { notify } = useCyberNotify();

const userInfo = ref({});
const isMatching = ref(false);
const showRankModal = ref(false);
const isOnline = computed(() => accountStore.isOnline);
const protobuf = com.gomokumaster.proto; // 导入 的protobuf 文件
const refresh = (val) => { 
  isMatching.value = val;
}

watch(() => isMatching.value, (val) => {
    if (val) startMatchmaking();
    else stopMatchmaking();
});

watch(() => matchStore.getMatchStatus, (val) => {
  console.log(val);
    if(matchStore.isMatched && val === protobuf.GameStatus.STARTED){
        notify('MATCH FOUND // 匹配成功', 'success');
        router.push(`/game/${matchStore.getMachId}`);
        matchStore.isMatched = false;
    }
});

const startMatchmaking = () => {
  const message = protobuf.GamePacket.create({
    type: protobuf.MsgType.MATCH_REQ
  })
  sendMessage(message);
  notify('SEARCHING FOR OPPONENT... // 正在检索对手', 'success');
};

const stopMatchmaking = () => {
    let message = protobuf.GamePacket.create({
    type: protobuf.MsgType.MATCH_CANCEL
  })
  sendMessage(message);
  notify('MATCHMAKING ABORTED // 匹配已取消', 'warning');
};

const handleLogout = () => {
  accountStore.logout();
  disconnectWebSocket();
  notify('SYSTEM LOGOUT // 安全退出', 'success');
  setTimeout(() => router.push('/login'), 500);
};

onMounted(() => {
  userInfo.value = accountStore.getAccountInfo;
  connectWebSocket(`ws://47.106.72.70/ws?token=${accountStore.getToken}`);
});
</script>

<style scoped>

.lobby-container {
  height: 100vh; width: 100vw;
  background-color: #050510;
  color: #fff;
  overflow: hidden; position: relative;
  display: flex; flex-direction: column;
  font-family: 'Rajdhani', sans-serif; 
}

/* 背景层 */
.background-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.grid-bg {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(500px) rotateX(20deg) scale(1.5) translateY(-50px);
  opacity: 0.2; mask-image: radial-gradient(circle, #000 0%, transparent 80%);
}
.glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.4; }
.orb-1 { width: 600px; height: 600px; background: #00f3ff; top: -300px; left: 10%; animation: float 10s infinite ease-in-out; }
.orb-2 { width: 500px; height: 500px; background: #bc13fe; bottom: -200px; right: 5%; animation: float 12s infinite ease-in-out reverse; }
.scanlines {
  position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px);
  opacity: 0.1; pointer-events: none;
}
.vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 40%, #000 100%); opacity: 0.8; }

/* === 2. 顶部导航栏 (优化版) === */
.top-bar {
  height: 70px; display: flex; justify-content: space-between; align-items: center;
  padding: 0 40px; z-index: 10; 
  background: rgba(5, 5, 16, 0.7); backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.brand { display: flex; align-items: center; gap: 15px; }
.logo-box { 
  width: 40px; height: 40px; background: rgba(0, 243, 255, 0.1); border: 1px solid #00f3ff;
  display: flex; justify-content: center; align-items: center; color: #00f3ff; box-shadow: 0 0 15px rgba(0,243,255,0.2);
}
.brand-text .main { font-weight: 900; font-size: 20px; letter-spacing: 2px; color: #fff; }
.brand-text .sub { font-size: 10px; color: #888; letter-spacing: 2px; display: flex; align-items: center; gap: 6px; }
.online-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 5px #4ade80; }
.online-dot.offline {
  background: #f87171;
  box-shadow: none;
  opacity: 0.8;
}

.user-status { display: flex; align-items: center; gap: 20px; }
.divider-v { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }

.profile-pill { 
  display: flex; align-items: center; gap: 15px; padding: 6px 15px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 30px;
}
.avatar-ring { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #00f3ff; overflow: hidden; }
.avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
.user-meta { display: flex; flex-direction: column; line-height: 1.2; margin-right: 10px; }
.username { font-weight: 700; font-size: 14px; color: #fff; }
.uid { font-size: 10px; color: #666; font-family: monospace; }
.action-icons { display: flex; gap: 5px; }
.icon-btn { 
  background: none; border: none; color: #666; cursor: pointer; padding: 4px; transition: 0.2s; border-radius: 4px;
}
.icon-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.icon-btn.danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

/* === 3. 主Grid布局 === */
.dashboard-grid {
  flex: 1; display: grid; grid-template-columns: 320px 1fr 320px; /* 增加侧边栏宽度适应新组件 */
  gap: 30px; padding: 30px 40px; z-index: 5;
}

.panel { display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; height: 100%; }
.center-panel { justify-content: center; align-items: center; position: relative; gap: 40px; }

/* === 4. 中间全息段位展示 (核心特效) === */
.rank-display { 
  position: relative; display: flex; flex-direction: column; align-items: center; 
  cursor: pointer; transition: 0.3s;
}
.rank-display:hover { transform: translateY(-5px); }

/* 全息底座 */
.holo-pedestal { position: relative; width: 160px; height: 160px; display: flex; justify-content: center; align-items: center; }
.rank-icon { 
  color: #fbbf24; filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.4)); 
  animation: float-icon 4s ease-in-out infinite;
}
.ring-outer {
  position: absolute; width: 100%; height: 100%; border: 1px dashed rgba(251, 191, 36, 0.3); border-radius: 50%;
  animation: spin 10s linear infinite;
}
.ring-inner {
  position: absolute; width: 70%; height: 70%; border: 1px solid rgba(251, 191, 36, 0.5); border-radius: 50%;
  border-left-color: transparent; border-right-color: transparent;
  animation: spin-reverse 6s linear infinite;
}

.rank-info { text-align: center; margin-top: 20px; }
.rank-name { 
  font-size: 36px; font-weight: 900; margin: 0; letter-spacing: 2px;
  background: linear-gradient(180deg, #fff, #fbbf24); -webkit-background-clip: text; color: transparent;
  text-shadow: 0 10px 20px rgba(0,0,0,0.5);
}
.score-pill { 
  display: inline-flex; gap: 8px; background: rgba(251, 191, 36, 0.1); 
  padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(251, 191, 36, 0.3);
  margin-top: 10px; font-family: monospace;
}
.score-pill .label { color: #fbbf24; font-weight: bold; }
.score-pill .value { color: #fff; }

.click-hint { 
  margin-top: 15px; font-size: 10px; color: #666; letter-spacing: 2px; opacity: 0; transition: 0.3s;
}
.rank-display:hover .click-hint { opacity: 1; transform: translateY(5px); }

/* 服务器底部状态 */
.server-status {
  position: absolute; bottom: 0; display: flex; gap: 20px;
  font-family: monospace; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 1px;
}

/* 动画 Keyframes */
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
@keyframes float-icon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }

/* 进场动画 */
.slide-down { animation: slideDown 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
.slide-in-left { animation: slideLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s backwards; }
.slide-in-right { animation: slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s backwards; }
.scale-in { animation: scaleUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s backwards; }

@keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideLeft { from { transform: translateX(-30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* 响应式 */
@media (max-width: 1200px) {
  .dashboard-grid { grid-template-columns: 1fr; overflow-y: auto; }
  .left-panel, .right-panel { display: none; } /* 移动端隐藏侧边栏 */
  .center-panel { height: auto; padding: 40px 0; }
  .orb-1, .orb-2 { opacity: 0.2; }
}
</style>