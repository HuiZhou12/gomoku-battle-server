//房间状态
import { defineStore } from 'pinia';

export const matchStore = defineStore('match', {
    //相当于vue2中的data
    state: () => {
        return {
            matchId: null,  //房间号
            opponent:null,
            yourColor:null,
            yourInfo:null,
            matchStatus: 'WAITING',
            chatMessages: [],
            needResume: false, //是否需要恢复
            isMatched: false,
            board:null,
            currentTurnId:-1,
            winner:'',
            gameOver: false,
            isPaused: false,
        }
    },
    getters: {
        getCurrentPlayerId(state) {
          return state.currentPlayer ?? null //这里直接返回当前玩家ID
        },
        getCurrentPlayer(state) {
          return state.players.find(p => p.userId === state.currentPlayer) ?? null //根据userId查找处于当前回合的玩家
          /**find方法
           * const array1 = [5, 12, 8, 130, 44];
            const found = array1.find((element) => element > 10);
            console.log(found);     // Expected output: 12
            **/
        },
        getMachId(state) {
          return state.matchId ?? JSON.parse(window.localStorage.getItem('matchInfo')).matchId ?? null
        },
        getMatchName(state) {
          return state.matchName ?? JSON.parse(window.localStorage.getItem('matchInfo')).matchName ?? null
        },
        getOpponent(state) { 
          return state.opponent ?? JSON.parse(window.localStorage.getItem('matchInfo')).opponent ?? null
        },
        getYourInfo(state){
          return state.yourInfo ?? JSON.parse(window.localStorage.getItem('matchInfo')).yourInfo ?? null
        },
        getMessages(state) { 
          return state.chatMessages ?? JSON.parse(window.localStorage.getItem(`${state.matchId}` + "Message")) ?? []
        },
        getMatchStatus(state) {
          return state.matchStatus ?? JSON.parse(window.localStorage.getItem('matchInfo')).status ?? null
        },
        getYourColor(state) { 
          return state.yourColor ?? JSON.parse(window.localStorage.getItem('matchInfo')).yourColor ?? null
        },
        getBoard(state){
          return state.board ?? JSON.parse(window.localStorage.getItem('matchInfo')).board ?? null
        },
        getCurrentTurnId(state) { 
          return state.currentTurnId ?? JSON.parse(window.localStorage.getItem('matchInfo')).currentTurnId ?? null
        },
        getChatMessages(state) { //获取聊天信息
          return state.chatMessages ?? JSON.parse(window.localStorage.getItem('matchMessage')) ?? []
        },


      },
    actions:{
        setMatchInfo(matchInfo){ //设置房间信息
          this.matchId = matchInfo.roomId;
          this.opponent = matchInfo.opponent;
          this.yourInfo = matchInfo.yourInfo;
          this.yourColor = matchInfo.yourColor;
          this.matchStatus = matchInfo.status;
          this.board = matchInfo.board;
          this.currentTurnId = matchInfo.currentTurnId;
          console.log(matchInfo.currentTurnId)
            //保存到本地存储
            window.localStorage.setItem('matchInfo', JSON.stringify(matchInfo)); //JSON.stringify() 方法将 JavaScript 值转换为 JSON 字符串
        },
        //设置游戏状态
        setStatus(status){ //设置房间状态
          console.log("setStatus:",status)
          this.matchStatus = status;
          window.localStorage.setItem('matchStatus', status); //保存到本地存储
        },
        //得到游戏状态
        getMatchStatu(){
          return this.matchStatus;
        },
        //得到这一局的房间状态
        loadMatchInfo(){
            const data = window.localStorage.getItem('matchInfo');
            if (data) {
                const matchInfo = JSON.parse(data); //JSON.parse()是将JSON字符串转换成对象
                this.matchId = matchInfo.matchId;
                this.matchName = matchInfo.matchName;
                this.matchType = matchInfo.matchType;
                this.matchStatus = matchInfo.matchStatus;
                this.players = matchInfo.players;
                this.currentPlayer = matchInfo.currentPlayer;
                this.startTime = matchInfo.startTime;
        
            }
        },
        getMatchInfo(){
          return JSON.parse(window.localStorage.getItem('matchInfo'));
        },
        addMessage(message) { 
          this.chatMessages.push(message);
          window.localStorage.setItem("matchMessage", JSON.stringify(this.chatMessages));
        },
        removeMatchInfo(){
          window.localStorage.removeItem('matchInfo');
          window.localStorage.removeItem('matchMessage');
          this.$patch({ 
            matchId: null, 
            opponent:null,
            yourColor:null,
            yourInfo:null,
            matchStatus: 'WAITING',
            chatMessages: [],
            needResume: false,
            isMatched: false,
            board:null,
            currentTurnId:null,
            winner:'',
            gameOver: false,
          })
        },
        setIsPaused(state){
          this.isPaused = state;
        }

    }
})
