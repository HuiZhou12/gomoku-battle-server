<template>
  <div class="game-container" :class="{ 'alert-mode': !isMyTurn }" @mousemove="handleGlobalMouseMove">
    
    <BackgroundLayer :is-enemy-turn="!isMyTurn" />

    <BattleHeader 
      :user-info="userInfo"
      :opponent-info="opponentInfo"
      :is-my-turn="isMyTurn"
      :is-turn-changing="isTurnChanging"
      :isPaused="isPaused"
    />

    <main class="battle-grid">
      
      <section class="side-panel glass-panel slide-in-left">
        <UnitPanel 
          :unit-types="unitTypes"
          :selected-unit="selectedUnit"
          :game-logs="gameLogs"
          @select-unit="(t) => selectedUnit = t"
        />
      </section>

      <section class="center-stage scale-in">

      <!-- <UnitDetailCard 
        v-if="selectedBoardPiece" 
        :unit="selectedBoardPiece" 
        @close="clearSelection" 
        /> -->
        <UnitDetailCard class="" 
        v-if="selectedBoardPiece" 
        :unit="selectedBoardPiece" 
        :style="{ top: `${cardPosition.top}px`, left: `${cardPosition.left}px` }"
        :isGhost = "isCardGhost"
      />
      <TacticalBoard 
        ref="boardRef"
        :board-data="boardData"
        :my-color="myColor"
        :is-my-turn="isMyTurn"
        :highlight-data="highlightData" 
        @move="handleBoardInteraction"
      />
      </section>

      <section class="side-panel glass-panel slide-in-right">
        <CommsPanel 
          :chat-messages="chatMessages"
          @send-chat="handleSendChat"
          @surrender="handleSurrender"
        />
      </section>

    </main>
      <GameResultModal 
          v-if="gameOver"
          :winner="winner"
          :myId="myId"
          :turnCount="Math.floor(gameLogs.length / 2) + 1"
          @return="returnToLobby"
          @retry="location.reload()"
        />

      <Transition name="pause-anim">
        <PauseModal v-if="isPaused" />
      </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store/index';
import { Circle, Crosshair, Shield, Zap } from 'lucide-vue-next'; // 只保留图标定义
import { sendMessage } from "../services/webSocketMin";
import { connectWebSocket } from '../services/webSocketMin'
import { com } from '../proto/game_pb'; 

//子组件
import BackgroundLayer from '../components/game/BackgroundLayer.vue';
import BattleHeader from '../components/game/BattleHeader.vue';
import UnitPanel from '../components/game/UnitPanel.vue';
import CommsPanel from '../components/game/CommsPanel.vue';
import TacticalBoard from '../components/game/TacticalBoard.vue';
import GameResultModal from '../components/game/GameResultModal.vue';
import UnitDetailCard from '../components/battle/UnitDetailCard.vue';
import PauseModal from '../components/game/PauseModal.vue';


const GRID_SIZE  = 15;
const router = useRouter();
const accountStore = store.accountInfoStore();
const matchStore = store.matchStore();
const opponentInfo = matchStore.getOpponent;
const myColor = matchStore.getYourColor == "black" ? ref(1) : ref(2); 
const currentColor = computed(() => matchStore.getCurrentTurnId)
const isMyTurn = computed(() => {
  return currentColor.value === myColor.value
}
);
const protobuf = com.gomokumaster.proto;
const gameOver = computed(() => matchStore.gameOver);
const winner = computed(() => matchStore.winner);
const boardRef = ref(null); // 引用棋盘组件以调用 shake
const selectedBoardPiece = ref(null); // 当前选中的盘面棋子 (用于显示详情和技能)
const highlightData = reactive({ cells: [], type: null }); // 传给 Canvas 画覆盖层的
// 动画控制
const isTurnChanging = ref(false);
watch(isMyTurn, () => {
  isTurnChanging.value = true;
  setTimeout(() => isTurnChanging.value = false, 800);
});
const isPaused = computed(() => matchStore.isPaused);
const isCardGhost = ref(false); // 是否是 ghost 状态
// 数据定义
const boardData = computed(() => {
  const rawData = matchStore.getBoard
  if (!rawData || rawData.length === 0) return []

  return rawData.map(row => {
    // 这里要注意：Protobuf 的 repeated 字段如果是空的，有时候可能是 undefined，取决于生成的配置
    // 建议加个保护 row.pieces || []
    return (row.pieces || []).map(piece => {
      
      // 判断 pieceType (推荐，最稳健)
      // 如果你的 protobuf.js 配置是把 enum 转成 string，那就是 "EMPTY"
      // 如果是转成 int，那就是 0
      // 也可以同时判断 id 是否为空字符串
      if (piece.pieceType === 'EMPTY' || piece.pieceType === 0 || !piece.id) {
        return null;
      }
      return {
        x: piece.x,
        y: piece.y,
        id: piece.id,
        type: piece.pieceType,   
        color: piece.color,
        ownerId: piece.ownerId,
        isAlive: piece.isAlive,
        skillCd: piece.skillCd,
        maxCd: piece.maxCd,
      }
    })
  })
})


const userInfo = matchStore.getYourInfo;
const myId = ref(userInfo.id);

// 假设 matchStore 已经在上面定义好了

const unitTypes = computed(() => {
  const info = matchStore.getYourInfo || {}; 
  return [
    { type: 'NORMAL', label: '常规核心', icon: Circle, count: -1 },
    { 
      type: 'ARCHER', 
      label: '狙击模组', 
      icon: Crosshair, 
      count: info.remainingArcherCount ?? 0 
    },
    { 
      type: 'CAVALRY', 
      label: '突袭模组', 
      icon: Zap, 
      count: info.remainingCavalryCount ?? 0
    },
    { 
      type: 'SHIELD', 
      label: '偏导护盾', 
      icon: Shield, 
      count: info.remainingShieldCount ?? 0
    },
  ];
});
const selectedUnit = ref('NORMAL');

// 日志与聊天
let logIdCounter = 0;
const gameLogs = ref([
  { id: logIdCounter++, time: '00:00', text: 'SYSTEM INITIALIZED...' },
  { id: logIdCounter++, time: '00:01', text: 'WAITING FOR DEPLOYMENT.' }
]);
const chatMessages = computed(() =>{
  return matchStore.getChatMessages;
})

// 核心操作
const addLog = (text) => {
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: "2-digit", minute: "2-digit" });
  gameLogs.value.push({ id: logIdCounter++, time, text });
  if (gameLogs.value.length > 20) gameLogs.value.shift();
};

// 核心交互逻辑 
const handleBoardInteraction = ({ r, c }) => {
  const targetCell = boardData.value?.[r]?.[c];
  console.log('点击了棋盘格：', r, c, targetCell);
  //尝试选中
  if (!selectedBoardPiece.value) {
    if (targetCell && targetCell.color === myColor.value) {
      console.log('当前选中棋子为：', targetCell)
      // 选中己方棋子
      selectPiece(targetCell, r, c);
    } else if (!targetCell) {
      // 普通落子逻辑
      deployUnit(r, c);
    }
    return;
  }

  // 尝试释放技能或移动
  // 判断点击位置是否在高亮列表中
  const validAction = highlightData.cells.find(h => h.r === r && h.c === c);

  if (validAction) {
    // 点击了有效区域
    console.log('触发技能/移动：', validAction)
    if (validAction.type === 'target') {
      //触发攻击/技能
      const actor = selectedBoardPiece.value;
      // 发送技能指令给后端
      let message = protobuf.GamePacket.create({
        type: protobuf.MsgType.MOVE_REQ,
        moveReq: protobuf.MoveReq.create({
          x: actor.x,
          y: actor.y,
          pieceType: boardData.value?.[actor.x]?.[actor.y].type,
          targetX: r,
          targetY: c,
          type: protobuf.PlayAction.SKILL,
        })
      })
      sendMessage(message);
      // 清除状态
      clearSelection();
    } else {
      // 点击了范围内的空地
      clearSelection();
    }
  } else {
    // 取消选中或选中另一个己方棋子
    if (targetCell && targetCell.color === myColor.value) {
      selectPiece(targetCell, r, c); // 换一个选
    } else {
      clearSelection(); // 取消
    }
  }
};
// 控制棋子信息的弹窗位置
const cardPosition = reactive({ top: 0, left: 0 });
// 选中棋子并计算高亮
const selectPiece = (piece, r, c) => {
  // 设置 UI 显示
  piece.x = r; 
  piece.y = c; 
  console.log('选中棋子：', piece)
  selectedBoardPiece.value = piece;
  console.log(selectedBoardPiece.value)
  if (boardRef.value) {
    const screenPos = boardRef.value.getGridScreenPos(r, c);
    // 设定偏移量：让弹窗出现在棋子的“右上角”
    cardPosition.left = screenPos.x + 78; 
    cardPosition.top = screenPos.y - 105;
  }
  // 计算高亮 (前端预判逻辑)
  highlightData.cells = [];
  highlightData.type = piece.type;
  
  if (piece.skillCd > 0) return; // CD中不显示攻击范围

  if (piece.type === protobuf.PieceType.ARCHER ) {
    calculateArcherRange(r, c);
  } else if (piece.type === protobuf.PieceType.CAVALRY) {
    calculateCavalryPath(r, c);
  }
};

// 清除选中
const clearSelection = () => {
  selectedBoardPiece.value = null;
  highlightData.cells = [];
};
const deployUnit = (r, c) => {
  if(boardRef.value) boardRef.value.triggerShake();
  const unitName = unitTypes.value.find(u => u.type === selectedUnit.value)?.label || selectedUnit.value;
  addLog(`DEPLOYING [${unitName}] AT COORDINATES [${r}, ${c}]`);
  let message = protobuf.GamePacket.create({
    type: protobuf.MsgType.MOVE_REQ,
    moveReq: protobuf.MoveReq.create({
      x: r,
      y: c,
      pieceType: selectedUnit.value,
      type: protobuf.PlayAction.PLACE,
    })
  })
  sendMessage(message);
};

//全局鼠标移动监听
const handleGlobalMouseMove = (e) => {
  if (!selectedBoardPiece.value) return;
  const cardW = 220;
  const cardH = 180;

  const cardX = cardPosition.left;
  const cardY = cardPosition.top;

  // 鼠标位置
  const mx = e.clientX;
  const my = e.clientY;

  // 碰撞检测：如果鼠标进入了卡片的矩形范围
  // 稍微放宽一点范围 (padding 20px)，让体验更灵敏
  if (mx > cardX - 20 && mx < cardX + cardW + 20 && my > cardY - 20 && my < cardY + cardH + 20
  ) {
    console.log('鼠标进入卡片！');
    isCardGhost.value = true;
  } else {
    isCardGhost.value = false;
  }
};

const calculateArcherRange = (cx, cy) => {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const dist = Math.abs(r - cx) + Math.abs(c - cy);
      if (dist <= 2 && dist > 0) {
        const target = boardData.value[r][c];
        if (target) {
          if (target.color !== myColor.value) {
            // 标记为可攻击目标
            highlightData.cells.push({ r, c, type: 'target' });
          }
          // 友军忽略
        } else {
          // 空地 -> 标记为射程范围 (可选，看想不想显示空地)
          highlightData.cells.push({ r, c, type: 'range' });
        }
      }
    }
  }
};
// 骑兵：直线冲锋
const calculateCavalryPath = (cx, cy) => {
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // 右, 左, 下, 上
  
  dirs.forEach(([dx, dy]) => {
    let r = cx + dx;
    let c = cy + dy;
    while (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      const target = boardData.value[r][c];
      if (target) {
        // 遇到阻挡
        if (target.color !== myColor.value) {
           // 遇到敌人 -> 标记为攻击目标，然后停止这条线
           highlightData.cells.push({ r, c, type: 'target' });
        }
        // 遇到友军或敌人，路径都到此为止
        break; 
      } else {
        // 空地 -> 路径
        highlightData.cells.push({ r, c, type: 'path' });
      }
      r += dx;
      c += dy;
    }
  });
};

const handleSendChat = (text) => {
  const time = new Date().toLocaleTimeString('en-GB', { hour12: false, hour: "2-digit", minute: "2-digit" });
  let message = protobuf.GamePacket.create({
    type: protobuf.MsgType.CHAT_REQ,
    chatReq: protobuf.ChatReq.create({
      id: null,
      senderColor: myColor.value,
      time,
      text
    })
  })
  sendMessage(message);
};

const handleSurrender = () => {
  addLog("CRITICAL: SURRENDER SIGNAL TRANSMITTED.");
  chatMessages.value.push({ id: logIdCounter++, time: 'NOW', isSelf: true, text: 'Surrender sent.' });
  let message = protobuf.GamePacket.create({
    type: protobuf.MsgType.SURRENDER,
  })
  sendMessage(message);
};

const returnToLobby = () => {
  router.push('/home')
};

onMounted(() => {
  userInfo.value = accountStore.getAccountInfo;
  connectWebSocket(`ws://47.106.72.70/ws?token=${accountStore.getToken}`)
});



</script>

<style scoped>
/* 全局布局变量 & 容器样式 */
:root {
  --primary: #00f3ff;
  --accent: #bc13fe;
  --danger: #ef4444;
  --bg-deep: #050510;
  --border-color: rgba(255, 255, 255, 0.1);
}

.game-container {
  height: 100vh; width: 100vw; background-color: var(--bg-deep, #050510);
  color: #fff; display: flex; flex-direction: column; overflow: hidden; position: relative;
  font-family: 'Rajdhani', sans-serif; transition: background-color 0.5s ease;
}

.game-container.alert-mode { --primary: #bc13fe; }

.battle-grid {
  flex: 1; display: grid; grid-template-columns: 280px 1fr 280px; gap: 20px; padding: 20px 40px; z-index: 5; height: calc(100vh - 70px);
}

.side-panel {
  display: flex; flex-direction: column; 
  background: rgba(5, 5, 10, 0.6); border: 1px solid rgba(255,255,255,0.1); 
  backdrop-filter: blur(10px); border-radius: 8px; overflow: hidden;
}

.center-stage { display: flex; justify-content: center; align-items: center; position: relative; }

/* 入场动画 */
.slide-in-left { animation: slideInLeft 0.8s ease-out 0.2s backwards; }
.slide-in-right { animation: slideInRight 0.8s ease-out 0.2s backwards; }
.scale-in { animation: scaleIn 0.8s ease-out 0.4s backwards; }

@keyframes slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

@media (max-width: 1100px) {
  .battle-grid { grid-template-columns: 1fr; }
  .side-panel { display: none; }
}
/* ================== 暂停/警告弹窗的专用动画 ================== */

/* 进场：从屏幕中心“弹”出来，带有弹性 */
.pause-anim-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 离场：迅速坍缩、模糊、变亮（模拟全息投影关闭） */
.pause-anim-leave-active {
  transition: all 0.35s cubic-bezier(0.5, 0, 0.2, 1);
}

/* 进场前的初始状态 */
.pause-anim-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
  filter: blur(10px);
}

/* 离场后的结束状态 (核心效果在这里) */
.pause-anim-leave-to {
  opacity: 0;
  /* 稍微缩小并下沉 */
  transform: scale(0.95) translateY(10px); 
  /* 关键：高斯模糊 + 亮度提高，模拟光效熄灭 */
  filter: blur(15px) brightness(2); 
}
</style>

