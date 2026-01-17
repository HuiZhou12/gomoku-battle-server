<template>
  <div class="panel-content">
    <div class="panel-header">
      <Zap class="pulse-icon" :size="16" />
      <h3>COMMS LINK // 频道</h3>
      <div class="connection-dot"></div>
    </div>

    <div class="broadcast-terminal chat-box" ref="msgBox">
      <TransitionGroup name="list" tag="div" class="chat-scroll-content">
        
        <div v-if="chatMessages.length === 0" key="welcome" class="log-line system-msg">
          <span class="log-prefix">>>></span>
          <span class="log-content">CHANNEL_SECURE_ESTABLISHED...<br>WAITING_FOR_INPUT_</span>
        </div>

        <div v-for="(msg, i) in chatMessages" :key="msg.id || i" class="log-line" :class="{ 'is-self': msg.senderColor === myColor }">
          <span class="log-time">{{ msg.time }}</span>
          
          <div class="log-body">
            <span class="user-tag">{{ msg.senderColor === myColor ? '[ME]' : '[OPP]' }}</span>
            <span class="text-content">{{ msg.text }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="chat-input-area" :class="{ 'is-focus': isInputFocus }">
      <span class="prompt-char">></span>
      <input 
        v-model="inputVal" 
        @keyup.enter="handleSend" 
        @focus="isInputFocus = true"
        @blur="isInputFocus = false"
        placeholder="ENTER COMMAND..." 
      />
      <button class="action-btn" @click="handleSend" :disabled="!inputVal.trim()">
        <Send :size="14" />
      </button>
    </div>
    
    <div class="panel-header small"><span>SYSTEM ACTIONS</span></div>
    <div class="control-pad">
       <button class="action-btn full-width danger" @click="emit('surrender')">ABORT MISSION // 投降</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { Zap, Send } from 'lucide-vue-next';
import store from '../../store/index';

const props = defineProps({ chatMessages: Array });
const emit = defineEmits(['send-chat', 'surrender']);

const inputVal = ref('');
const msgBox = ref(null);
const isInputFocus = ref(false); // 用于输入框高亮动画

const matchStore = store.matchStore();
const myColor = matchStore.getYourColor === "black" ? 1 : 2; 

const handleSend = () => {
  if(!inputVal.value.trim()) return;
  emit('send-chat', inputVal.value);
  inputVal.value = '';
};

watch(() => props.chatMessages.length, () => {
  nextTick(() => {
    if(msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  });
});
</script>

<style scoped>
.panel-content {
  --static-self: #00f3ff;
  --static-enemy: #bc13fe;
  --static-sys: #facc15;
  
  display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 15px; box-sizing: border-box;
}

/* 头部连接指示灯 */
.connection-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 5px #4ade80; margin-left: auto; animation: blink 3s infinite; }

.panel-header { padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); }
.panel-header h3 { margin: 0; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
.pulse-icon { color: var(--static-self); animation: pulse-opacity 2s infinite; }
.chat-box {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0; 
  overflow-y: auto; 
  padding-right: 5px; 
  height: 0; 
  scrollbar-width: thin;
  scrollbar-color: var(--primary) transparent;
  scrollbar-width: none
}
.chat-box::-webkit-scrollbar { width: 4px; }
.chat-box::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
.chat-box::-webkit-scrollbar-track { background: transparent; }


/* 消息行 */
.log-line { 
  display: flex; align-items: flex-start; margin-bottom: 8px; 
  font-family: 'Consolas', 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.5; 
  opacity: 0.8; transition: opacity 0.3s;
}
.log-line:hover { opacity: 1; }

.log-time { font-size: 10px; color: #555; margin-right: 8px; margin-top: 2px; }

/* [核心] 身份颜色恒定 */
.user-tag { font-weight: 800; margin-right: 6px; }
/* 默认是对手 */
.user-tag { color: var(--static-enemy); text-shadow: 0 0 5px rgba(188, 19, 254, 0.3); }
.log-body { color: #aaa; flex: 1; word-break: break-all; }

/* 我自己的消息 */
.is-self .user-tag { color: var(--static-self); text-shadow: 0 0 5px rgba(0, 243, 255, 0.3); }
.is-self .log-body { color: #fff; }

/* 系统消息 */
.system-msg { color: var(--static-sys); flex-direction: column; opacity: 0.7; border-left: 2px solid var(--static-sys); padding-left: 10px; margin: 10px 0; }
.log-prefix { margin-right: 5px; display: none; }

/* 输入框区域 - 增强交互 */
.chat-input-area { 
  padding: 8px 12px; 
  border: 1px solid rgba(255,255,255,0.1); 
  display: flex; align-items: center; gap: 8px; 
  background: rgba(0,0,0,0.4); 
  border-radius: 4px;
  transition: all 0.3s;
}
/* 聚焦时发光，但不随阵营变色，保持科技蓝 */
.chat-input-area.is-focus { border-color: var(--static-self); box-shadow: 0 0 10px rgba(0, 243, 255, 0.1); background: rgba(0, 243, 255, 0.05); }

.prompt-char { color: #666; font-weight: bold; }
.is-focus .prompt-char { color: var(--static-self); animation: blink 1s infinite; }

.chat-input-area input { 
  flex: 1; background: transparent; border: none; color: #fff; outline: none; 
  font-family: 'Consolas', monospace; font-size: 12px; 
}
.chat-input-area input::placeholder { color: #444; font-style: italic; }

/* 发送按钮 */
.action-btn { 
  background: transparent; border: 1px solid #444; color: #666; 
  width: 26px; height: 26px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; 
}
.action-btn:hover:not(:disabled) { border-color: var(--static-self); color: var(--static-self); background: rgba(0, 243, 255, 0.1); }
.action-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* 底部区域 */
.panel-header.small { padding: 4px 10px; font-size: 10px; opacity: 0.6; background: transparent; border: none; margin-top: 5px; }
.control-pad { padding: 0 5px 5px 5px; }
.action-btn.full-width { width: 100%; height: 30px; border-radius: 2px; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; }

/* 动画 */
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateY(10px); }
</style>