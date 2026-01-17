import api from "./instance"

//用户模块
//1. 用户注册
const register = (email,password) => { return api.post('/api/register', { email: email, password: password }) }
//2. 用户登录
const login = (email,password) => { return api.post('/api/login', { email: email, password: password }) }
//3. 获取用户信息
const getUserInfo = (token) => { return api.get('/api/user/profile', {},)} 
//4. 获取指定用户信息
const getSpecificUserInfo = (userId) => { return api.get(`/api/user/${userId}/profile`, {},)}
//5. 用户登出
const logout = (userId) => { return api.post('/api/user/logout', {userId: userId}) }
//对局模块
//1. 创建对局
const createGame = (gameMode,boardSize,matchName) => { return api.post('/api/match/create', { gameMode: gameMode, boardSize: boardSize, matchName: matchName}) }

//2. 加入对局(这里的加入对局是根据用户点击已经创建的房间来达到局域网对战的模式，匹配模式不知道怎么写,这里仅作为占位参考)
const joinGame = (matchId) => { return api.post(`/api/match/${matchId}/join`, { matchId: matchId }) }
//3.获取房间列表
const getRoomList = () => { return api.get('/api/match/status', {}) }
//游戏模块(布阵五子棋)
//1. 获取游戏信息,这里假设后端只返回一个游戏信息, 
const getGameInfo = () => { return api.get(`/api/gamedetial`, {}) } 
//退出游戏
const exitGame = (userName,matchId) => { return api.post(`/api/match/exit`, {userName: userName, matchId: matchId}) }


export {
    register,
    login,
    getUserInfo,
    getSpecificUserInfo,
    logout,
    createGame,
    joinGame,
    getGameInfo,
    getRoomList,
    exitGame
}