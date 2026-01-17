

//获取游戏信息
export const getGameInfo = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            code: 200,
            message: "成功",
            data: [{
                gameId: "1",
                coverImage: "https://tse3-mm.cn.bing.net/th/id/OIP-C.JBBU72eu1X2QsHd_GrzGFwHaEK?w=273&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
                name: '布阵五子棋',
                tags: ['休闲','策略'],
            }]
          }
        });
      }, 500); // 模拟网络延迟
    });
  };

  //假设用户选择局域网对战模式
  //创建对局
export const getCreateRoom = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                code: 200,
                message: "房间创建成功",
                data: {
                  matchId: "1234",
                  matchName: "测试房间",
                  matchType: "局域网对战",
                  matchStatus: "等待中",//等待中、进行中、结束
                  players: [
                    {userId: 1, username: "belief",image:"https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"},
                  ],
                  currentPlayer: null,
                  startTime: null,
                }
              }
            })
          },500)
        })
      }
//模拟获取获取房间列表
export const getRoomList = () =>{
  return new Promise((resolve, reject) =>{
    setTimeout( () =>{
      resolve({
        data: {
        code: 200,
        message: "获取成功",
        data: [{
          matchId: "1234",
          matchName: "测试房间",
          matchType: "局域网对战",
          matchStatus: "等待中",//等待中、进行中、结束
          players: [
            {userId: 1, username: "belief", image: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"},
          ],
          currentPlayer: null,
          startTime: null,
        },
      {
        matchId: "1235",
        matchName: "测试房间",
        matchType: "局域网对战",
        matchStatus: "进行中",
        players: [
          {userId: 1, username: "belief",image: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"},
          {userId: 2, username: "东东哥", image: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"},
        ],
        currentPlayer: null,
        startTime: null,
      }]
      }
    })
    }, 500)
  })
}

//模拟加入房间
const now = new Date()
export const getJoinRoom = () =>{
  return new Promise((resolve, reject) =>{
    setTimeout( () =>{
      resolve({
        data: {
        code: 200,
        message: "加入成功",
        data: {
          matchId: "1234",
          matchName: "测试房间",
          matchType: "局域网对战",
          matchStatus: "等待中",//等待中、进行中、结束,
          players: [
            {userId: 1, username: "输了自动下载原神",image: "http://p4.music.126.net/0v1j4Rx6gQ5unCOjKvcGSA==/109951170468862784.jpg"},
            {userId: 2, username: "脸接大招", image: "http://p4.music.126.net/muZEa8CFHDZqx6ilJcG0cQ==/109951168161366714.jpg"},
          ],
          currentPlayer: "black",
          startTime: now.getTime(),
        }
        }
      })
    })
  })
}