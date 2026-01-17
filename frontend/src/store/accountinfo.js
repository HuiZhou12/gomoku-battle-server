//用户状态
import { defineStore } from 'pinia';

export const accountInfoStore = defineStore('account_info', {
    state: () => {
        return{
            accountInfo:{ 
            },
            isLoggedIn: false, //是否已登录
            token: null, //用户的token, 用于身份验证
            isOnline: false,
            timer: null,
            lastHeartbeatTime: Date.now(),
            heartbeatTimeout: 5000,
            
        }
    },
    getters: { //得到用户登录状态
        getLogin: (state) => {
            return  state.isLoggedIn || JSON.parse(window.localStorage.getItem('isLoggedIn')) || false; //从本地存储中获取登录状态
        },
        getAccountInfo: (state) => {
                return JSON.parse(window.localStorage.getItem('accountInfo')) || state.accountInfo || {}
        } ,
        getToken: (state) => {
            return state.token || window.localStorage.getItem('token') || null; //从本地存储中获取token
        }
    },
    actions: {
        //用户登出并跳转到登录页面
        logout({ redirectToLogin = true } = {}) {
            // 清空store状态
            this.$reset();
            localStorage.clear();
            if(redirectToLogin){
                //跳转到登录页面
                window.location.href = '/login'; 
            }
        },
        //用户登录成功
        loginSuccess(accountInfo,token) { 
            this.$patch({
                accountInfo: accountInfo, //更新用户信息
                isLoggedIn: true, //用户登录状态改为已登录
                token: token, //更新token
            });
            window.localStorage.setItem('isLoggedIn', true);
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('accountInfo', JSON.stringify(accountInfo));
        },
        onHeartbeat() {
            this.lastHeartbeatTime = Date.now();
            this.isOnline = true;
            // 确保定时器只启动一次
            if (!this.timer) {
            this.startMonitor();
            }
        },

        startMonitor() {
            this.timer = setInterval(() => {
            const now = Date.now();
            if (now - this.lastHeartbeatTime > this.heartbeatTimeout) {
                this.isOnline = false;
            }
            }, 1000);
        },

        stopMonitor() {
            if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            }
        }
    }
})