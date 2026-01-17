class WebSocketManage{
    constructor(url){
    this.url = url; // WebSocket 地址
    this.ws = null; // WebSocket 实例
    this.heartbeatTimer = null; // 心跳定时器
    this.reconnectTimer = null;// 重连定时器
    this.reconnectDelay = 2000;// 重连延迟时间
    this.isManuallyClosed = false;// 是否手动关闭
    }
    
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WS connected");
      this.sendConnect();
      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onclose = () => {
      console.log("WS closed");
      this.stopHeartbeat();
      if (!this.isManuallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      this.ws.close();
    };
  }

  sendConnect() {
    const msg = protobuf.GamePacket.create({
      type: protobuf.MsgType.CONNECT,
    });
    this.send(msg);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      const heart = protobuf.GamePacket.create({
        type: protobuf.MsgType.HEARTBEAT,
      });
      this.send(heart);
    }, 5000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(encode(message));
    }
  }

  close() {
    this.isManuallyClosed = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
  }
}