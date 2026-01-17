import store from "../store/index"
import {com } from "../proto/game_pb" 
let socket = null;
const matchStore = store.matchStore();
const protobuf = com.gomokumaster.proto;
const accountInfoStore = store.accountInfoStore();
let heartbeatTimer = null;
let reconnectTimer = null;
let isManuallyClosed = false;

//测试变量
let reconnectStartTime = 0;
const metrics = {
  reconnectAttempts: 0, // 尝试重连次数
  reconnectSuccess: 0, // 重连成功次数
  reconnectTimes: [],   // ms
  heartbeatSent: 0, // 发送心跳包的次数
  heartbeatAck: 0, // 收到心跳包回复的次数
  sendTime: 0,
  rttSamples: [], // 
};



// 建立 WebSocket 
export function connectWebSocket(url) {
  if (socket && socket.readyState === WebSocket.OPEN) { //防止重复连接
    return;
  }
  socket = new WebSocket(url);
  socket.binaryType = 'arraybuffer'; // 设置接收二进制数据
  socket.onopen = () => {
    console.log('WebSocket 已连接');
    //记录成功次数
    metrics.reconnectSuccess++
    if (reconnectStartTime > 0) {
      metrics.reconnectTimes.push(Date.now() - reconnectStartTime);
      reconnectStartTime = 0;
    }


    //发送心跳包
    const message = protobuf.GamePacket.create({
      type: protobuf.MsgType.CONNECT
    });
    sendMessage(message);
    metrics.sendTime = Date.now();
    metrics.heartbeatSent++
    startHeartbeat();
    accountInfoStore.onHeartbeat();
  };
  socket.onmessage = (event) => {
    const buffer = new Uint8Array(event.data);
    let data = protobuf.GamePacket.decode(buffer);
    try{
      switch (data.type) {
        case protobuf.MsgType.MATCH_RES:
          console.log('收到匹配信息:', data.gameSnapshot);
          matchStore.isMatched = true;
          matchStore.setMatchInfo(data.gameSnapshot)
          break;
        case protobuf.MsgType.GAME_RESUME:
          console.log('用户重连:', data.gameSnapshot);
          matchStore.setIsPaused(false);
          matchStore.needResume = true;
          matchStore.setMatchInfo(data.gameSnapshot)
          break;
        case protobuf.MsgType.BOARD_UPDATE:
          matchStore.setMatchInfo(data.gameSnapshot);
          break;
        case protobuf.MsgType.CHAT_RES:
          matchStore.addMessage(data.chatReq);
          break;
        case protobuf.MsgType.GAME_OVER:
          console.log('游戏结束:', data.winnerId);
          matchStore.matchStatus = 'FINISHED';
          matchStore.setIsPaused(false);
          matchStore.winner = data.winnerId;
          matchStore.currentTurnId = -1;
          matchStore.gameOver = true;
          break;
        case protobuf.MsgType.HEARTBEAT:  
        console.log('收到心跳包');
          metrics.heartbeatAck++ //记录收到心跳包的次数
          metrics.rttSamples.push(Date.now() - metrics.sendTime); //记录RTT
          accountInfoStore.stopMonitor();
          accountInfoStore.onHeartbeat();
          accountInfoStore.startMonitor();
          break;
        case protobuf.MsgType.GAME_DISCONNECT:
          console.log('用户掉线了');
          matchStore.setIsPaused(true); //设置暂停状态
        default:
          console.log('收到消息:', data);
      }      
    } catch (error) {
      console.error('解析数据时出错:', error);
    }

  };
  socket.onclose = () => {
    console.log('WebSocket 已断开');
    stopHeartbeat();
    accountInfoStore.stopMonitor();
    socket = null;
    if (!isManuallyClosed) {
    
      //尝试重连
      scheduleReconnect(url);
    }
  };
  socket.onerror = (err) => {
    console.error('WebSocket 错误:', err);
    socket?.close(1000, '关闭连接');
  };
}


//断开连接
export function disconnectWebSocket() {
  if (!socket) return;
  isManuallyClosed = true;
  stopHeartbeat();
  accountInfoStore.stopMonitor();
  socket.close(1000, '正常关闭连接');
  socket = null;
}

//重连
function scheduleReconnect(url) {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    console.log('尝试重连...');
    //记录尝试重连次数
    metrics.reconnectAttempts++;
    reconnectStartTime = Date.now();

    connectWebSocket(url);
  }, 2000);
}

export function sendMessage(data) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  //序列化！
  let finalMessage = protobuf.GamePacket.encode(data).finish();
  socket.send(finalMessage);
}


function startHeartbeat() {
  stopHeartbeat();
  const heartMessage = protobuf.GamePacket.create({
    type: protobuf.MsgType.HEARTBEAT,
  });
  heartbeatTimer = setInterval(() => {
    sendMessage(heartMessage);
    metrics.heartbeatSent++
    metrics.sendTime = Date.now();
  }, 5000);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}



window.dumpMetrics = () => {
  console.table({
    reconnectAttempts: metrics.reconnectAttempts,
    reconnectSuccess: metrics.reconnectSuccess,
    avgReconnectTime:
      metrics.reconnectTimes.reduce((a, b) => a + b, 0) /
      metrics.reconnectTimes.length,
    avgRTT:
      metrics.rttSamples.reduce((a, b) => a + b, 0) /
      metrics.rttSamples.length,
    heartbeatLossRate:
      (metrics.heartbeatSent - metrics.heartbeatAck) / metrics.heartbeatSent
  });
};


//万能模板
/**let socket = null;

export function connectWebSocket(url) {
  if (socket && socket.readyState === WebSocket.OPEN) return;

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WS connected');
  };

  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      console.log('WS message', data);
    } catch {
      console.warn('Non-JSON message', e.data);
    }
  };

  socket.onclose = (e) => {
    console.log('WS closed', e.code, e.reason);
    socket = null;
  };

  socket.onerror = (e) => {
    console.error('WS error', e);
  };
}

export function sendMessage(data) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
}

export function disconnectWebSocket() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
     socket.readyState === WebSocket.CONNECTING)
  ) {
    socket.close(1000, 'client disconnect');
  }
  socket = null;
}
 */