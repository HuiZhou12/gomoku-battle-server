//游戏状态
import { defineStore } from 'pinia';

export const gameStore = defineStore('game', {
    //相当于vue2中的data
    state: () => {
        return {
            isInGame: false, //是否在游戏中
            playerColor: null, //玩家的棋子颜色, black or white
            board: [], //棋盘状态,二维数组, 0表示空格, 1表示黑子, 2表示白子
            moveHistory: [], //走棋记录, 用于悔棋和重做
            winner: null, //获胜者, null表示未结束, 'draw'表示平局, 否则为玩家ID
            boardSize: 19, //19*19 与Board组件的size保持一致
            futureMoves: [],  //通俗点说就是悔棋后又走了新的棋, 这些新的棋会被存储在这里, 用于重做
            shields: [], // 存放当前生效的盾保护对象 { id, coords: [{x,y}], used: false }
            archerCooldown: { black: 0, white: 0 }, // 弓箭手技能冷却轮数（按使用方计数）
        }

    },
    //相当于vue2中的computed ,数据会在状态改变时自动更新
    getters: {
        isPlayerTurn: (state) => {
            return state.currentPlayer === state.playerId;
        }
    },
    //相当于vue2中的methods
    actions: {
        //初始化游戏
        initGame(options = {}) {
            const size = Number(options.boardSize) || this.boardSize || 19; //默认棋盘大小19*19
            this.boardSize = size; //更新store中的boardSize
            this.board = Array.from({ length: size }, () => Array.from({ length: size }, () => null)); //初始化棋盘
            this.moveHistory = []; //初始化走棋记录
            this.futureMoves = [];//初始化未来走棋记录
            this.winner = null;//初始化获胜者
            this.isInGame = true;//设置为在游戏中
            this.gameMode = options.mode || 'local'; //游戏模式, 默认local
            this.playerId = options.playerId || this.playerId || null; //玩家ID, 如果没有传入则保持原来的值
            this.playerColor = options.playerColor || this.playerColor || 'black'; // 默认黑色
            this.currentPlayer = options.startingPlayer !== undefined ? options.startingPlayer : (this.playerId || null); //默认玩家先手
            this.maxMoves = options.maxMoves || null;//最大步数限制, null表示无限制
            if (t === 'CHAT') {
                if (data.success && data.data) {
                    // 触发聊天消息处理
                    // 可以通过事件总线或者直接更新聊天组件
                    console.log('收到聊天消息:', data.data)
                }
            }
        },
        //发布悔棋请求消息
        publishUndoRequest() {
            //检查websocket是否连接且具有发布悔棋方法
            if (this.websocket && typeof this.websocket.publishUndo === 'function') {
                this.websocket.publishUndo(this.matchId, { userId: this.playerId })
                return true
            }
            //便于调试，打印警告信息
            console.warn('当前无法发送悔棋请求, websocket未连接或不支持该功能') 
            return false
        },

        //发布认输消息
        publishSurrenderRequest() {
            if (this.websocket && typeof this.websocket.publishSurrender === 'function') {
                this.websocket.publishSurrender(this.matchId, { userId: this.playerId })
                return true
            }
            console.warn('当前无法发送认输请求, websocket未连接或不支持该功能')
            return false
        },
        //结束游戏
        endGame() {
            this.isInGame = false; //设置为不在游戏中，对局信息暂不清空，后续可能要用
        },
        // 初始化 websocket（集成前端 wrapper），并注册常见消息处理器
        // async initWebSocket(url, opts = {}) { 
        // },
        // async initWebSocket(url, opts = {}) {
        //     try {
        //         //动态导入 websocket 服务模块，并且初始化
        //         const mod = await import('../services/webSocket.js')
        //         const StompService = mod.default || mod
        //         this.websocket = new StompService(url, opts)
        //         await this.websocket.connect()
        //         // 如果存在，则订阅 match topic
        //         if (this.matchId) {
        //             this.websocket.subscribeMatch(this.matchId, (data) => {
        //                 // 统一按照后端返回的 result.type 分发
        //                 if (!data || !data.type) return
        //                 const t = data.type
        //                 if (t === 'PLAY') {
        //                     // 服务器确认落子
        //                     if (data.success) {
        //                         const d = data.data || {}
        //                         // 如果是 full-board 同步
        //                         if (d.board) {
        //                             this.board = d.board
        //                             this.moveHistory = d.moveHistory || []
        //                             this.currentPlayer = d.currentPlayer || this.currentPlayer
        //                         } else if (d.x !== undefined) {
        //                             // 单步落子
        //                             this.applyMove(Object.assign({ kind: 'place', remote: true }, d))
        //                         }
        //                     } else {
        //                         console.warn('PLAY failed', data.error)
        //                     }
        //                 } else if (t === 'SKILL') {
        //                     // 服务器确认技能使用，处理技能操作
        //                     if (data.success) {
        //                         const d = data.data || {}
        //                         if (d.board) {
        //                             // 全盘同步
        //                             this.board = d.board
        //                         } else {
        //                             // 单步技能应用，技能的作用效果
        //                             this.applySkill(Object.assign({ remote: true }, d))
        //                         }
        //                     } else console.warn('SKILL failed', data.error)
        //                 } else if (t === 'JOIN') {
        //                     // 更新房间/玩家信息
        //                     if (data.success && data.data) {
        //                         //后续可以添加更新玩家信息的逻辑
        //                     }
        //                 } else if (t === 'UNDO' || t === 'UNDO_CONFIRM') {
        //                     // 服务器确认撤回
        //                     this.undo()
        //                 } else if (t === 'SURRENDER') {
        //                     // 处理投降事件
        //                     if (data.success && data.data && data.data.from) this.surrender(data.data.from)
        //                 } else if (t === 'SYNC') {
        //                     // 全盘同步
        //                     if (data.data && data.data.board) {
        //                         this.board = data.data.board
        //                         this.moveHistory = data.data.moveHistory || []
        //                         this.currentPlayer = data.data.currentPlayer || this.currentPlayer
        //                     }
        //                 }
        //             })
        //         }
        //     } catch (e) {
        //         console.error('webSocket初始化失败', e)
        //     }
        // },



        // 将一条 move 应用到棋盘上（统一落子/技能入口），并记录到 moveHistory
        applyMove(move) {
            if (!move) return
            // 在 online 模式下：如果是本地发起（未标记 remote），则通过 websocket 发送并等待服务器确认后再应用
            if (this.gameMode === 'online' && !move.remote) {
                if (this.websocket && typeof this.websocket.publishPlay === 'function') {
                    const pieceType = move.type || move.typePiece || move.piece || 'pawn'
                    this.websocket.publishPlay(this.matchId, { userId: this.playerId, x: move.x, y: move.y, pieceType })
                } else {
                    console.warn('applyMove: stomp not ready, cannot send online move')
                }
                return
            }

            // 只处理基本的 place 类型（本步为 local / remote 应用逻辑）
            if (move.kind === 'place' || !move.kind) {
                const x = move.x
                const y = move.y
                // 确保 board 已初始化
                if (!this.board || !this.board[y]) return
                // 只在该格为空时放置
                if (!this.board[y][x]) {
                    this.board[y][x] = { player: move.player, type: move.type || move.piece || 'pawn' }
                    // 记录到历史
                    this.moveHistory = this.moveHistory || []
                    this.moveHistory.push(move)
                    // clear redo stack
                    this.futureMoves = []
                    // 如果是盾卫，创建一次性保护覆盖自己与周围8格
                    if ((move.type || move.piece || 'pawn') === 'shield') {
                        // 生成 shield 对象，保护周边9格一次
                        const id = Date.now() + '_' + Math.random().toString(36).slice(2, 6)
                        const coords = []
                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dy = -1; dy <= 1; dy++) {
                                const sx = x + dx, sy = y + dy
                                if (sx >= 0 && sy >= 0 && sx < this.boardSize && sy < this.boardSize) coords.push({ x: sx, y: sy })
                            }
                        }
                        this.shields.push({ id, coords, used: false })
                    }
                    // 如果是普通棋，检查胜利条件（五子连珠）
                    if ((move.type || move.piece || 'pawn') === 'pawn') {
                        const win = this.checkVictory(x, y)
                        if (win) {
                            this.winner = move.player
                            this.isInGame = false
                        }
                    }
                }
            }
        },
        pushMove(move) {
            this.applyMove(Object.assign({ kind: 'place' }, move))
        },

        // 本地悔棋实现：将最后一步移动到 futureMoves 并在 board 上清除
        undo() {
            if (!this.moveHistory || this.moveHistory.length === 0) return null
            const last = this.moveHistory.pop()
            this.futureMoves = this.futureMoves || []
            this.futureMoves.push(last)
            // 在 board 上清除该步（兼容 applyMove 的结构）
            try {
                if (this.board && this.board[last.y]) {
                    this.board[last.y][last.x] = null
                }
            } catch (e) {
                console.error('undo failed', e)
            }
            // 切换当前玩家（简单切换 black/white）
            if (this.currentPlayer === 'black') this.currentPlayer = 'white'
            else if (this.currentPlayer === 'white') this.currentPlayer = 'black'
            return last
        },

        // 本地重做实现：从 futureMoves 恢复最后一步，用于恢复之前撤销的棋，将棋子重新放置在棋盘上
        redo() {
            //检查是否存在可以重做的步骤，如果没有直接返回null
            if (!this.futureMoves || this.futureMoves.length === 0) return null
            // 从futureMoves中取出最后一步棋并从数组中移除
            const mv = this.futureMoves.pop()
            // 确保moveHistory数组存在，并将恢复的步骤添加到历史记录中
            this.moveHistory = this.moveHistory || []
            this.moveHistory.push(mv)
            try {
                // 将棋子重新放置到棋盘对应位置
                if (this.board && this.board[mv.y]) {
                    this.board[mv.y][mv.x] = { player: mv.player, type: mv.type || 'pawn' }
                }
            } catch (e) {
                console.error('redo failed', e)
            }
            // 切换当前玩家回合
            if (this.currentPlayer === 'black') this.currentPlayer = 'white'
            else if (this.currentPlayer === 'white') this.currentPlayer = 'black'

            // 返回移动信息
            return mv
        },

        // 本地投降：设置 winner 并结束对局（winner 为对方颜色或 id）
        surrender(player) {
            if (!player) return
            this.winner = player === 'black' ? 'white' : 'black'
            this.isInGame = false
        },

        // 通用技能入口：根据 move.kind 判断并执行对应技能逻辑
        // move = { kind: 'skill', skill: 'archer'|'horse', player, x, y, target: {x,y} }
        applySkill(move) {
            if (!move || !move.skill) return

            // 在 online 模式下，如果是本地发起则通过 websocket 发送，远端确认后再应用
            if (this.gameMode === 'online' && !move.remote) {
                if (this.websocket && typeof this.websocket.publishSkill === 'function') {
                    // 确保传递正确的技能类型参数
                    this.websocket.publishSkill(this.matchId, move.skill, Object.assign({ userId: this.playerId }, move))
                } else {
                    console.warn('applySkill: stomp not ready, cannot send skill')
                }
                return true // 返回true表示已发送
            }

            // 本地模式：直接执行技能
            if (move.skill === 'archer') return this.archerSkill(move)
            if (move.skill === 'horse') return this.horseSkill(move)
            if (move.skill === 'shield') {
                // 盾棋技能已经在放置时处理，这里可以添加特殊技能逻辑
                console.log('盾棋技能已激活')
                return true
            }

            return false // 未知技能类型
        },
        // 修改弓箭手技能方法，添加数组边界检查
        archerSkill(move) {
            // 检查冷却
            const cd = this.archerCooldown && this.archerCooldown[move.player]
            if (cd && cd > 0) {
                console.warn(`弓箭手技能冷却中，剩余${cd}回合`)
                return false
            }

            // 验证必要参数
            if (move.x === undefined || move.y === undefined || !move.target) {
                console.error('弓箭手技能缺少必要参数')
                return false
            }

            const tx = move.target.x, ty = move.target.y

            // 检查目标坐标是否在有效范围内
            if (tx < 0 || ty < 0 || tx >= this.boardSize || ty >= this.boardSize) {
                console.error(`目标坐标(${tx}, ${ty})超出棋盘范围`)
                return false
            }

            // 距离校验
            const dx = Math.abs(move.x - tx), dy = Math.abs(move.y - ty)
            if (Math.max(dx, dy) > 2) {
                console.warn('目标超出弓箭手射程')
                return false
            }

            // 命中处理
            try {
                // 先检查行是否存在，避免数组越界
                if (!this.board[ty]) {
                    console.error(`棋盘行${ty}不存在`)
                    return false
                }

                const targetCell = this.board[ty][tx]

                // 弓箭手可以攻击目标位置上的敌方棋子
                if (targetCell && targetCell.player !== move.player) {
                    // 检查是否有盾保护
                    const shield = (this.shields || []).find(s => !s.used &&
                        s.coords.some(c => c.x === tx && c.y === ty))

                    if (shield) {
                        shield.used = true // 消耗盾的一次免死
                        console.log('目标受到盾保护，免受弓箭手攻击')
                    } else {
                        this.board[ty][tx] = null
                        console.log('弓箭手成功击中目标')
                    }
                } else if (!targetCell) {
                    console.log('弓箭手攻击了空位置，没有造成伤害')
                } else {
                    console.warn('不能攻击己方棋子')
                    return false
                }

                // 设置冷却为2回合
                this.archerCooldown = this.archerCooldown || { black: 0, white: 0 }
                this.archerCooldown[move.player] = 2

                // 记录到历史以便回放
                this.moveHistory = this.moveHistory || []
                this.moveHistory.push(move)
                return true
            } catch (e) {
                console.error('archerSkill failed', e)
                return false
            }
        },



        // 冲锋手技能：类似车（直线多格），但如果周围八格存在敌方棋子则技能无效
        horseSkill(move) {
            const tx = move.target.x, ty = move.target.y
            // 判断周围八格是否存在敌方棋子
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (dx === 0 && dy === 0) continue
                    const sx = move.x + dx, sy = move.y + dy
                    if (sx >= 0 && sy >= 0 && sx < this.boardSize && sy < this.boardSize) {
                        const c = this.board[sy][sx]
                        if (c && c.player !== move.player) {
                            return false // 技能失效
                        }
                    }
                }
            }
            // 如果技能有效，类似车的移动：允许横纵直线任意距离（不穿过阻挡）
            if (move.x !== tx && move.y !== ty) return false
            const stepX = tx === move.x ? 0 : (tx > move.x ? 1 : -1)
            const stepY = ty === move.y ? 0 : (ty > move.y ? 1 : -1)
            let cx = move.x + stepX, cy = move.y + stepY
            while (cx !== tx || cy !== ty) {
                if (this.board[cy][cx]) return false // 路径被阻挡
                cx += stepX; cy += stepY
            }
            // 执行移动/攻击：如果目标存在敌方棋子并为 pawn 则按死亡/盾逻辑处理
            try {
                const targetCell = this.board[ty][tx]
                if (targetCell && targetCell.player !== move.player) {
                    if (targetCell.type === 'pawn') {
                        const shield = (this.shields || []).find(s => !s.used && s.coords.some(c => c.x === tx && c.y === ty))
                        if (shield) shield.used = true
                        else this.board[ty][tx] = null
                    } else {
                        // 其它类型直接替换
                        this.board[ty][tx] = { player: move.player, type: move.type }
                    }
                } else {
                    // 目标为空则移动冲锋手到目标格
                    this.board[ty][tx] = { player: move.player, type: move.type || 'horse' }
                    this.board[move.y][move.x] = null
                }
                this.moveHistory = this.moveHistory || []
                this.moveHistory.push(move)
                return true
            } catch (e) {
                console.error('horseSkill failed', e)
                return false
            }
        },

        // 每回合开始调用：用于递减冷却等维护操作
        onTurnStart(player) {
            // player 表示当前行动方，递减对方的冷却计数
            this.archerCooldown = this.archerCooldown || { black: 0, white: 0 }
            if (this.archerCooldown.black > 0) this.archerCooldown.black--
            if (this.archerCooldown.white > 0) this.archerCooldown.white--
        },

        // 五子连珠检测（仅统计 type === 'pawn' 的棋子）
        // 从放置点 (x,y) 向 4 个主方向统计连续同色棋子数量
        checkVictory(x, y) {
            const cell = this.board[y][x]
            if (!cell) return false
            if (cell.type !== 'pawn') return false // 只有普通棋参与连珠
            const player = cell.player
            const dirs = [
                { dx: 1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 1, dy: 1 },
                { dx: 1, dy: -1 }
            ]
            const size = this.boardSize || this.board.length
            for (const d of dirs) {
                let count = 1
                let nx = x + d.dx, ny = y + d.dy
                while (nx >= 0 && ny >= 0 && nx < size && ny < size) {
                    const c = this.board[ny][nx]
                    if (c && c.player === player && c.type === 'pawn') {
                        count++
                        nx += d.dx; ny += d.dy
                    } else break
                }
                nx = x - d.dx; ny = y - d.dy
                while (nx >= 0 && ny >= 0 && nx < size && ny < size) {
                    const c = this.board[ny][nx]
                    if (c && c.player === player && c.type === 'pawn') {
                        count++
                        nx -= d.dx; ny -= d.dy
                    } else break
                }
                if (count >= 5) return true
            }
            return false
        },



    }
})

//这里还有很多功能没写: 各个用户的剩余棋子数量, 用户落子, 悔棋, 重做, 认输, 平局, 使用技能等
//这些功能需要和后端进行配合, 具体的实现逻辑可以参考后端的代码
//以及websocket的使用逻辑, 可以参考services/webSocket.js文件
//包括发送消息的格式
//接收消息的格式
//以及处理消息的逻辑等
//这些逻辑需要和后端的websocket逻辑进行配合