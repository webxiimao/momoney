// index.ts
// 获取应用实例
import { post } from '../../services/fetch'
import sendSocket from '../../services/socketService/sendSocket'
import { getSocketResponse } from '../../utils/socketUtils'
//@ts-ignore
import { $wuxKeyBoard, $wuxDialog, $wuxToast, $wuxNotification } from '../../libs/wux/index'
enum BtnStatus {
  /** 游戏已经开始 */
  START = 'start',
  /** 游戏没开始但是是房主 */
  NOSTART_OWNER = 'nostart_owner',
  /** 游戏没开始，但也不是房主 */
  NOSTART_PLAYER = 'nostart_player',
  /** 游戏结束 */
  OVER = 'over'
}

const defaultData = {
  // 游戏是否开始
  isGameStart: false,
  // 游戏是否结束
  isGameOver: false,
  /** 房间id */
  roomId: undefined,
  /** 分数 */
  point: 15000,
  /** 是否是房主 */
  isOwner: false,
  winner: ''
}

let isConnect = true
let timer = 3000

Page({
  data: {
    userInfo: {} as any,
    hasUserInfo: false,
    canIUseGetUserProfile: true,
    canIUseOpenData: false,// 如需尝试获取用户信息可改为false
    unionId: undefined,
    ...defaultData,
    btnStatus: "",
    visible: false,
    qrcodeVisible: false,
    actions: [
      {
          name: '支付银行',
      },
      {
          name: '付款'
      },
      {
        name: '取钱'
      },
      {
        name: '二维码'
      },
      {
          name: '破产',
      }
  ],
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  onShareAppMessage() {
    return {
      title: '一起来玩吧！大富翁，冲冲冲！',
      path: `pages/index/index?roomId=${this.data.roomId}`
    }
  },
  _heart() {
    setTimeout(() => {
      isConnect = false
      sendSocket.ping()
      setTimeout(() => {
        if (!isConnect) {
          wx.connectSocket({
            url: "ws://127.0.0.1:8888",
            success(res) {
              console.log('websocket连接成功', res);
            },
            fail(err){
              console.error(err);
            }
          })
        }else {
          this._heart()
        }
      }, timer);
    }, timer)
  },
  onLoad() {
    wx.showShareMenu({
      menus: ['shareAppMessage'],
      withShareTicket: true
    })
    const routes = getCurrentPages()
    console.log('routes', routes);
    const query = routes[routes.length - 1].__displayReporter?.query || {}
    console.log('query', query);
    
    if (query.roomId) {
      this.setData({
        roomId: query.roomId
      })
      console.log(query.roomId);
    }
    //@ts-ignore
  },
  getStatus() {
    const { isOwner, isGameStart, isGameOver } = this.data
    let status = null
    if (isGameStart) {
      status = BtnStatus.START
    } else {
      if (isOwner){
        status = BtnStatus.NOSTART_OWNER
      } else {
        status = BtnStatus.NOSTART_PLAYER
      }
    }
    if (isGameOver) {
      status = BtnStatus.OVER
    }
    this.setData({
      btnStatus: status
    })
  },
  init() {
    let self = this;
    console.log('用户信息', self.data.userInfo);
    wx.login({
      success(wxres) {
        post('http://127.0.0.1:9000/api/login', { code: wxres.code }).then((res: any) => {
          const openid = res.data.openid
          self.setData({
            unionId: openid
          })
          wx.setStorage({
            key: 'MOMONEY_OPENID',
            data: openid
          })
          console.log('返回的用户信息', res);
          // 连接websocket
          wx.connectSocket({
            url: "ws://127.0.0.1:8888",
            success(res) {
              console.log('websocket连接成功', res);
            },
            fail(err){
              console.error(err);
            }
          })
          console.log('login');
          
          wx.onSocketOpen(() => {
            self._heart()
            sendSocket.login({
              username: self.data.userInfo?.nickName as string,
              unionId: openid,
              roomId: self.data.roomId
            })
          })
          wx.onSocketMessage((res) => {
            const { flag, props } = getSocketResponse(res.data as string)
            switch (flag){
              case 'ping':
                self.socketPing()
              case 'login':
                self.socketLogin(props)
                break
              case 'start':
                self.socketStart()
                break
              case 'bussiness':
                self.socketBusiness(props)
                break
              case 'log':
                self.socketLog(props)
                break
              case 'over':
                self.socketOver(props)
            }
          })
        })
      }
    })
  },

  endGame() {
    //@ts-ignore
    $wuxDialog().confirm({
      resetOnClose: true,
      closable: true,
      title: '确定结束游戏',
      onConfirm() {
        sendSocket.over()
      },
  })
  },
  // 以后再搞
  reset() {
    this.setData(defaultData, () => {
      this.init()
      this.getStatus()
    })
  },

  socketOver(props: any) {
    this.setData({
      isGameOver: true,
      isGameStart: false,
      winner: props.text
    }, () => {
      this.getStatus()
    })
  },

  socketPing() {
    isConnect = true
  },

  socketLog(data:any) {
    $wuxNotification().show({
      title: '通知',
      text: data.roomLog,
      duration: 3000,
    })
  },

  socketLogin(data: any) {
    console.log('游戏登录', data);
    const { point, isOwner, roomId, isGameStart } = data
    this.setData({
      point,
      isOwner,
      roomId,
      isGameStart
    }, () => {
      this.getStatus()
    })
  },
  socketBusiness(data: any) {
    const { point } = data
    this.setData({
      point,
    })
  },
  socketStart() {
    this.setData({
      isGameStart: true
    }, () => {
      this.getStatus()
    })
    
  },
  /** 以后再优化 */
  getUserProfile() {
    // const unionId = wx.getStorageSync('MOMONEY_OPENID')
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('展示用户信息', res);
        // post('http://localhost:9000/api/updateUserInfo', {
        //   username: res.userInfo.nickName,
        //   avatarUrl: res.userInfo.avatarUrl,
        //   unionId
        // })
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        }, () => {
          this.init()
        })
      }
    })
  },
  start() {
    sendSocket.start({
      roomId: this.data.roomId!
    })
  },
  action() {
    this.setData({
      visible: true
    })
  },
  handleClickItem(e: any) {
    const index = e.detail.index
    this.setData({
      visible: false
    })
    if (index === 0) {
      //@ts-ignore
      $wuxKeyBoard().show({
        maxlength: -1,
        password: false,
        callback() {
            return true
        },
        onSubmit(value: number) {
          //@ts-ignore
          $wuxDialog().confirm({
            resetOnClose: true,
            closable: true,
            title: '交易（银行 ）',
            content: `确定向银行支付¥${value}？`,
            onConfirm() {
              sendSocket.bankBusiness({
                amount: value,
                type: 'minus'
              })
            },
        })
          // return true
      },
    }) 
    } else if (index === 1) {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success: (res) => {
          console.log(res);
          const result = res.result
          $wuxKeyBoard().show({
            maxlength: -1,
            password: false,
            callback() {
                return true
            },
            onSubmit(value: number) {
              //@ts-ignore
              $wuxDialog().confirm({
                resetOnClose: true,
                closable: true,
                title: '交易（个人）',
                content: `确定向他支付¥${value}？`,
                onConfirm() {
                  sendSocket.manBusiness({
                    amount: value,
                    receiveUnionId: result
                  })
                },
            })
          },
        }) 
          // sendSocket.manBusiness({
          //   receiveUnionId: result
          // })
        },
        fail: (err) => {
          $wuxToast().show({
            type: 'forbidden',
            duration: 1500,
            color: '#fff',
            text: `微信扫码失败${err}`,
            success: () => console.log('已完成')
        })
        }
      })
    }else if (index === 2) {
      //@ts-ignore
      $wuxKeyBoard().show({
        maxlength: -1,
        password: false,
        callback() {
            return true
        },
        onSubmit(value: number) {
          sendSocket.bankBusiness({
            amount: value,
            type: 'add'
          })
      },
    })
    } else  if (index === 3) {
      this.setData({
        qrcodeVisible: true
      })
    } else if(index === 4){
      sendSocket.bankruptcy()
    }
  },
  handleCancel() {
    this.setData({
      visible: false
    })
  },
  qrcodeClose() {
    this.setData({
      qrcodeVisible: false
    })
  }
})
