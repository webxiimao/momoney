"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("../../services/fetch");
var sendSocket_1 = require("../../services/socketService/sendSocket");
var socketUtils_1 = require("../../utils/socketUtils");
var index_1 = require("../../libs/wux/index");
var BtnStatus;
(function (BtnStatus) {
    BtnStatus["START"] = "start";
    BtnStatus["NOSTART_OWNER"] = "nostart_owner";
    BtnStatus["NOSTART_PLAYER"] = "nostart_player";
    BtnStatus["OVER"] = "over";
})(BtnStatus || (BtnStatus = {}));
var defaultData = {
    isGameStart: false,
    isGameOver: false,
    roomId: undefined,
    point: 15000,
    isOwner: false,
    winner: ''
};
var isConnect = true;
var timer = 3000;
Page({
    data: __assign(__assign({ userInfo: {}, hasUserInfo: false, canIUseGetUserProfile: true, canIUseOpenData: false, unionId: undefined }, defaultData), { btnStatus: "", visible: false, qrcodeVisible: false, actions: [
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
        ] }),
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs',
        });
    },
    onShareAppMessage: function () {
        return {
            title: '一起来玩吧！大富翁，冲冲冲！',
            path: "pages/index/index?roomId=" + this.data.roomId
        };
    },
    _heart: function () {
        var _this = this;
        setTimeout(function () {
            isConnect = false;
            setTimeout(function () {
                if (!isConnect) {
                    wx.connectSocket({
                        url: "ws://172.20.10.3:8888",
                        success: function (res) {
                            console.log('websocket连接成功', res);
                        },
                        fail: function (err) {
                            console.error(err);
                        }
                    });
                }
                else {
                    _this._heart();
                }
            }, timer);
        }, timer);
    },
    onLoad: function () {
        var _a;
        wx.showShareMenu({
            menus: ['shareAppMessage'],
            withShareTicket: true
        });
        var routes = getCurrentPages();
        console.log('routes', routes);
        var query = ((_a = routes[routes.length - 1].__displayReporter) === null || _a === void 0 ? void 0 : _a.query) || {};
        console.log('query', query);
        if (query.roomId) {
            this.setData({
                roomId: query.roomId
            });
            console.log(query.roomId);
        }
    },
    getStatus: function () {
        var _a = this.data, isOwner = _a.isOwner, isGameStart = _a.isGameStart, isGameOver = _a.isGameOver;
        var status = null;
        if (isGameStart) {
            status = BtnStatus.START;
        }
        else {
            if (isOwner) {
                status = BtnStatus.NOSTART_OWNER;
            }
            else {
                status = BtnStatus.NOSTART_PLAYER;
            }
        }
        if (isGameOver) {
            status = BtnStatus.OVER;
        }
        this.setData({
            btnStatus: status
        });
    },
    init: function () {
        var self = this;
        console.log('用户信息', self.data.userInfo);
        wx.login({
            success: function (wxres) {
                fetch_1.post('http://172.20.10.3:9000/api/login', { code: wxres.code }).then(function (res) {
                    var openid = res.data.openid;
                    self.setData({
                        unionId: openid
                    });
                    wx.setStorage({
                        key: 'MOMONEY_OPENID',
                        data: openid
                    });
                    console.log('返回的用户信息', res);
                    wx.connectSocket({
                        url: "ws://172.20.10.3:8888",
                        success: function (res) {
                            console.log('websocket连接成功', res);
                        },
                        fail: function (err) {
                            console.error(err);
                        }
                    });
                    console.log('login');
                    wx.onSocketOpen(function () {
                        var _a;
                        console.log('self.data.roomId', self.data.roomId);
                        sendSocket_1.default.login({
                            username: (_a = self.data.userInfo) === null || _a === void 0 ? void 0 : _a.nickName,
                            unionId: openid,
                            roomId: self.data.roomId
                        });
                    });
                    wx.onSocketMessage(function (res) {
                        var _a = socketUtils_1.getSocketResponse(res.data), flag = _a.flag, props = _a.props;
                        console.log('flag', flag);
                        switch (flag) {
                            case 'ping':
                                self.socketPing();
                                break;
                            case 'login':
                                self.socketLogin(props);
                                break;
                            case 'start':
                                self.socketStart();
                                break;
                            case 'bussiness':
                                self.socketBusiness(props);
                                break;
                            case 'log':
                                self.socketLog(props);
                                break;
                            case 'over':
                                self.socketOver(props);
                        }
                    });
                });
            }
        });
    },
    endGame: function () {
        index_1.$wuxDialog().confirm({
            resetOnClose: true,
            closable: true,
            title: '确定结束游戏',
            onConfirm: function () {
                sendSocket_1.default.over();
            },
        });
    },
    reset: function () {
        var _this = this;
        this.setData(defaultData, function () {
            _this.init();
            _this.getStatus();
        });
    },
    socketOver: function (props) {
        var _this = this;
        this.setData({
            isGameOver: true,
            isGameStart: false,
            winner: props.text
        }, function () {
            _this.getStatus();
        });
    },
    socketPing: function () {
        isConnect = true;
    },
    socketLog: function (data) {
        index_1.$wuxNotification().show({
            title: '通知',
            text: data.roomLog,
            duration: 3000,
        });
    },
    socketLogin: function (data) {
        var _this = this;
        console.log('游戏登录', data);
        var point = data.point, isOwner = data.isOwner, roomId = data.roomId, isGameStart = data.isGameStart;
        this.setData({
            point: point,
            isOwner: isOwner,
            roomId: roomId,
            isGameStart: isGameStart
        }, function () {
            _this.getStatus();
        });
    },
    socketBusiness: function (data) {
        var point = data.point;
        this.setData({
            point: point,
        });
    },
    socketStart: function () {
        var _this = this;
        this.setData({
            isGameStart: true
        }, function () {
            _this.getStatus();
        });
    },
    getUserProfile: function () {
        var _this = this;
        wx.getUserProfile({
            desc: '展示用户信息',
            success: function (res) {
                console.log('展示用户信息', res);
                _this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                }, function () {
                    _this.init();
                });
            }
        });
    },
    start: function () {
        sendSocket_1.default.start({
            roomId: this.data.roomId
        });
    },
    action: function () {
        this.setData({
            visible: true
        });
    },
    handleClickItem: function (e) {
        var index = e.detail.index;
        this.setData({
            visible: false
        });
        if (index === 0) {
            index_1.$wuxKeyBoard().show({
                maxlength: -1,
                password: false,
                callback: function () {
                    return true;
                },
                onSubmit: function (value) {
                    index_1.$wuxDialog().confirm({
                        resetOnClose: true,
                        closable: true,
                        title: '交易（银行 ）',
                        content: "\u786E\u5B9A\u5411\u94F6\u884C\u652F\u4ED8\u00A5" + value + "\uFF1F",
                        onConfirm: function () {
                            sendSocket_1.default.bankBusiness({
                                amount: value,
                                type: 'minus'
                            });
                        },
                    });
                },
            });
        }
        else if (index === 1) {
            wx.scanCode({
                onlyFromCamera: true,
                scanType: ['qrCode'],
                success: function (res) {
                    console.log(res);
                    var result = res.result;
                    index_1.$wuxKeyBoard().show({
                        maxlength: -1,
                        password: false,
                        callback: function () {
                            return true;
                        },
                        onSubmit: function (value) {
                            index_1.$wuxDialog().confirm({
                                resetOnClose: true,
                                closable: true,
                                title: '交易（个人）',
                                content: "\u786E\u5B9A\u5411\u4ED6\u652F\u4ED8\u00A5" + value + "\uFF1F",
                                onConfirm: function () {
                                    sendSocket_1.default.manBusiness({
                                        amount: value,
                                        receiveUnionId: result
                                    });
                                },
                            });
                        },
                    });
                },
                fail: function (err) {
                    index_1.$wuxToast().show({
                        type: 'forbidden',
                        duration: 1500,
                        color: '#fff',
                        text: "\u5FAE\u4FE1\u626B\u7801\u5931\u8D25" + err,
                        success: function () { return console.log('已完成'); }
                    });
                }
            });
        }
        else if (index === 2) {
            index_1.$wuxKeyBoard().show({
                maxlength: -1,
                password: false,
                callback: function () {
                    return true;
                },
                onSubmit: function (value) {
                    sendSocket_1.default.bankBusiness({
                        amount: value,
                        type: 'add'
                    });
                },
            });
        }
        else if (index === 3) {
            this.setData({
                qrcodeVisible: true
            });
        }
        else if (index === 4) {
            sendSocket_1.default.bankruptcy();
        }
    },
    handleCancel: function () {
        this.setData({
            visible: false
        });
    },
    qrcodeClose: function () {
        this.setData({
            qrcodeVisible: false
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsOENBQTJDO0FBQzNDLHNFQUFnRTtBQUNoRSx1REFBMkQ7QUFFM0QsOENBQTRGO0FBQzVGLElBQUssU0FTSjtBQVRELFdBQUssU0FBUztJQUVaLDRCQUFlLENBQUE7SUFFZiw0Q0FBK0IsQ0FBQTtJQUUvQiw4Q0FBaUMsQ0FBQTtJQUVqQywwQkFBYSxDQUFBO0FBQ2YsQ0FBQyxFQVRJLFNBQVMsS0FBVCxTQUFTLFFBU2I7QUFFRCxJQUFNLFdBQVcsR0FBRztJQUVsQixXQUFXLEVBQUUsS0FBSztJQUVsQixVQUFVLEVBQUUsS0FBSztJQUVqQixNQUFNLEVBQUUsU0FBUztJQUVqQixLQUFLLEVBQUUsS0FBSztJQUVaLE9BQU8sRUFBRSxLQUFLO0lBQ2QsTUFBTSxFQUFFLEVBQUU7Q0FDWCxDQUFBO0FBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtBQUVoQixJQUFJLENBQUM7SUFDSCxJQUFJLHNCQUNGLFFBQVEsRUFBRSxFQUFTLEVBQ25CLFdBQVcsRUFBRSxLQUFLLEVBQ2xCLHFCQUFxQixFQUFFLElBQUksRUFDM0IsZUFBZSxFQUFFLEtBQUssRUFDdEIsT0FBTyxFQUFFLFNBQVMsSUFDZixXQUFXLEtBQ2QsU0FBUyxFQUFFLEVBQUUsRUFDYixPQUFPLEVBQUUsS0FBSyxFQUNkLGFBQWEsRUFBRSxLQUFLLEVBQ3BCLE9BQU8sRUFBRTtZQUNQO2dCQUNJLElBQUksRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDSSxJQUFJLEVBQUUsSUFBSTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLElBQUk7YUFDWDtZQUNEO2dCQUNFLElBQUksRUFBRSxLQUFLO2FBQ1o7WUFDRDtnQkFDSSxJQUFJLEVBQUUsSUFBSTthQUNiO1NBQ0osR0FDQTtJQUVELFdBQVc7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SUFDRCxZQUFZO1FBQ1YsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNYLE9BQU8sRUFBRSxLQUFLO1NBQ2YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFdBQVc7UUFDVCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGluZGV4LnRzXG4vLyDojrflj5blupTnlKjlrp7kvotcbmltcG9ydCB7IHBvc3QgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mZXRjaCdcbmltcG9ydCBzZW5kU29ja2V0IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NvY2tldFNlcnZpY2Uvc2VuZFNvY2tldCdcbmltcG9ydCB7IGdldFNvY2tldFJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29ja2V0VXRpbHMnXG4vL0B0cy1pZ25vcmVcbmltcG9ydCB7ICR3dXhLZXlCb2FyZCwgJHd1eERpYWxvZywgJHd1eFRvYXN0LCAkd3V4Tm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbGlicy93dXgvaW5kZXgnXG5lbnVtIEJ0blN0YXR1cyB7XG4gIC8qKiDmuLjmiI/lt7Lnu4/lvIDlp4sgKi9cbiAgU1RBUlQgPSAnc3RhcnQnLFxuICAvKiog5ri45oiP5rKh5byA5aeL5L2G5piv5piv5oi/5Li7ICovXG4gIE5PU1RBUlRfT1dORVIgPSAnbm9zdGFydF9vd25lcicsXG4gIC8qKiDmuLjmiI/msqHlvIDlp4vvvIzkvYbkuZ/kuI3mmK/miL/kuLsgKi9cbiAgTk9TVEFSVF9QTEFZRVIgPSAnbm9zdGFydF9wbGF5ZXInLFxuICAvKiog5ri45oiP57uT5p2fICovXG4gIE9WRVIgPSAnb3Zlcidcbn1cblxuY29uc3QgZGVmYXVsdERhdGEgPSB7XG4gIC8vIOa4uOaIj+aYr+WQpuW8gOWni1xuICBpc0dhbWVTdGFydDogZmFsc2UsXG4gIC8vIOa4uOaIj+aYr+WQpue7k+adn1xuICBpc0dhbWVPdmVyOiBmYWxzZSxcbiAgLyoqIOaIv+mXtGlkICovXG4gIHJvb21JZDogdW5kZWZpbmVkLFxuICAvKiog5YiG5pWwICovXG4gIHBvaW50OiAxNTAwMCxcbiAgLyoqIOaYr+WQpuaYr+aIv+S4uyAqL1xuICBpc093bmVyOiBmYWxzZSxcbiAgd2lubmVyOiAnJ1xufVxuXG5sZXQgaXNDb25uZWN0ID0gdHJ1ZVxubGV0IHRpbWVyID0gMzAwMFxuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIHVzZXJJbmZvOiB7fSBhcyBhbnksXG4gICAgaGFzVXNlckluZm86IGZhbHNlLFxuICAgIGNhbklVc2VHZXRVc2VyUHJvZmlsZTogdHJ1ZSxcbiAgICBjYW5JVXNlT3BlbkRhdGE6IGZhbHNlLC8vIOWmgumcgOWwneivleiOt+WPlueUqOaIt+S/oeaBr+WPr+aUueS4umZhbHNlXG4gICAgdW5pb25JZDogdW5kZWZpbmVkLFxuICAgIC4uLmRlZmF1bHREYXRhLFxuICAgIGJ0blN0YXR1czogXCJcIixcbiAgICB2aXNpYmxlOiBmYWxzZSxcbiAgICBxcmNvZGVWaXNpYmxlOiBmYWxzZSxcbiAgICBhY3Rpb25zOiBbXG4gICAgICB7XG4gICAgICAgICAgbmFtZTogJ+aUr+S7mOmTtuihjCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgIG5hbWU6ICfku5jmrL4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAn5Y+W6ZKxJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ+S6jOe7tOeggSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICAgbmFtZTogJ+egtOS6pycsXG4gICAgICB9XG4gIF0sXG4gIH0sXG4gIC8vIOS6i+S7tuWkhOeQhuWHveaVsFxuICBiaW5kVmlld1RhcCgpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy4uL2xvZ3MvbG9ncycsXG4gICAgfSlcbiAgfSxcbiAgb25TaGFyZUFwcE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRpdGxlOiAn5LiA6LW35p2l546p5ZCn77yB5aSn5a+M57+B77yM5Yay5Yay5Yay77yBJyxcbiAgICAgIHBhdGg6IGBwYWdlcy9pbmRleC9pbmRleD9yb29tSWQ9JHt0aGlzLmRhdGEucm9vbUlkfWBcbiAgICB9XG4gIH0sXG4gIF9oZWFydCgpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlzQ29ubmVjdCA9IGZhbHNlXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKCFpc0Nvbm5lY3QpIHtcbiAgICAgICAgICB3eC5jb25uZWN0U29ja2V0KHtcbiAgICAgICAgICAgIHVybDogXCJ3czovLzE3Mi4yMC4xMC4zOjg4ODhcIixcbiAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3ZWJzb2NrZXTov57mjqXmiJDlip8nLCByZXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWwoZXJyKXtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICB0aGlzLl9oZWFydCgpXG4gICAgICAgIH1cbiAgICAgIH0sIHRpbWVyKTtcbiAgICB9LCB0aW1lcilcbiAgfSxcbiAgb25Mb2FkKCkge1xuICAgIHd4LnNob3dTaGFyZU1lbnUoe1xuICAgICAgbWVudXM6IFsnc2hhcmVBcHBNZXNzYWdlJ10sXG4gICAgICB3aXRoU2hhcmVUaWNrZXQ6IHRydWVcbiAgICB9KVxuICAgIGNvbnN0IHJvdXRlcyA9IGdldEN1cnJlbnRQYWdlcygpXG4gICAgY29uc29sZS5sb2coJ3JvdXRlcycsIHJvdXRlcyk7XG4gICAgY29uc3QgcXVlcnkgPSByb3V0ZXNbcm91dGVzLmxlbmd0aCAtIDFdLl9fZGlzcGxheVJlcG9ydGVyPy5xdWVyeSB8fCB7fVxuICAgIGNvbnNvbGUubG9nKCdxdWVyeScsIHF1ZXJ5KTtcbiAgICBcbiAgICBpZiAocXVlcnkucm9vbUlkKSB7XG4gICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICByb29tSWQ6IHF1ZXJ5LnJvb21JZFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKHF1ZXJ5LnJvb21JZCk7XG4gICAgfVxuICAgIC8vQHRzLWlnbm9yZVxuICB9LFxuICBnZXRTdGF0dXMoKSB7XG4gICAgY29uc3QgeyBpc093bmVyLCBpc0dhbWVTdGFydCwgaXNHYW1lT3ZlciB9ID0gdGhpcy5kYXRhXG4gICAgbGV0IHN0YXR1cyA9IG51bGxcbiAgICBpZiAoaXNHYW1lU3RhcnQpIHtcbiAgICAgIHN0YXR1cyA9IEJ0blN0YXR1cy5TVEFSVFxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNPd25lcil7XG4gICAgICAgIHN0YXR1cyA9IEJ0blN0YXR1cy5OT1NUQVJUX09XTkVSXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSBCdG5TdGF0dXMuTk9TVEFSVF9QTEFZRVJcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzR2FtZU92ZXIpIHtcbiAgICAgIHN0YXR1cyA9IEJ0blN0YXR1cy5PVkVSXG4gICAgfVxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBidG5TdGF0dXM6IHN0YXR1c1xuICAgIH0pXG4gIH0sXG4gIGluaXQoKSB7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKCfnlKjmiLfkv6Hmga8nLCBzZWxmLmRhdGEudXNlckluZm8pO1xuICAgIHd4LmxvZ2luKHtcbiAgICAgIHN1Y2Nlc3Mod3hyZXMpIHtcbiAgICAgICAgcG9zdCgnaHR0cDovLzE3Mi4yMC4xMC4zOjkwMDAvYXBpL2xvZ2luJywgeyBjb2RlOiB3eHJlcy5jb2RlIH0pLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3BlbmlkID0gcmVzLmRhdGEub3BlbmlkXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIHVuaW9uSWQ6IG9wZW5pZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgd3guc2V0U3RvcmFnZSh7XG4gICAgICAgICAgICBrZXk6ICdNT01PTkVZX09QRU5JRCcsXG4gICAgICAgICAgICBkYXRhOiBvcGVuaWRcbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnNvbGUubG9nKCfov5Tlm57nmoTnlKjmiLfkv6Hmga8nLCByZXMpO1xuICAgICAgICAgIC8vIOi/nuaOpXdlYnNvY2tldFxuICAgICAgICAgIHd4LmNvbm5lY3RTb2NrZXQoe1xuICAgICAgICAgICAgdXJsOiBcIndzOi8vMTcyLjIwLjEwLjM6ODg4OFwiLFxuICAgICAgICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dlYnNvY2tldOi/nuaOpeaIkOWKnycsIHJlcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZmFpbChlcnIpe1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnbG9naW4nKTtcbiAgICAgICAgICBcbiAgICAgICAgICB3eC5vblNvY2tldE9wZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gc2VsZi5faGVhcnQoKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGYuZGF0YS5yb29tSWQnLCBzZWxmLmRhdGEucm9vbUlkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VuZFNvY2tldC5sb2dpbih7XG4gICAgICAgICAgICAgIHVzZXJuYW1lOiBzZWxmLmRhdGEudXNlckluZm8/Lm5pY2tOYW1lIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgdW5pb25JZDogb3BlbmlkLFxuICAgICAgICAgICAgICByb29tSWQ6IHNlbGYuZGF0YS5yb29tSWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICB3eC5vblNvY2tldE1lc3NhZ2UoKHJlcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBmbGFnLCBwcm9wcyB9ID0gZ2V0U29ja2V0UmVzcG9uc2UocmVzLmRhdGEgYXMgc3RyaW5nKVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZsYWcnLCBmbGFnKTtcbiAgICAgICAgICAgIHN3aXRjaCAoZmxhZyl7XG4gICAgICAgICAgICAgIGNhc2UgJ3BpbmcnOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0UGluZygpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSAnbG9naW4nOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0TG9naW4ocHJvcHMpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0U3RhcnQoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgJ2J1c3NpbmVzcyc6XG4gICAgICAgICAgICAgICAgc2VsZi5zb2NrZXRCdXNpbmVzcyhwcm9wcylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBjYXNlICdsb2cnOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0TG9nKHByb3BzKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgJ292ZXInOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0T3Zlcihwcm9wcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZW5kR2FtZSgpIHtcbiAgICAvL0B0cy1pZ25vcmVcbiAgICAkd3V4RGlhbG9nKCkuY29uZmlybSh7XG4gICAgICByZXNldE9uQ2xvc2U6IHRydWUsXG4gICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgIHRpdGxlOiAn56Gu5a6a57uT5p2f5ri45oiPJyxcbiAgICAgIG9uQ29uZmlybSgpIHtcbiAgICAgICAgc2VuZFNvY2tldC5vdmVyKClcbiAgICAgIH0sXG4gIH0pXG4gIH0sXG4gIC8vIOS7peWQjuWGjeaQnlxuICByZXNldCgpIHtcbiAgICB0aGlzLnNldERhdGEoZGVmYXVsdERhdGEsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpXG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgfSxcblxuICBzb2NrZXRPdmVyKHByb3BzOiBhbnkpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgaXNHYW1lT3ZlcjogdHJ1ZSxcbiAgICAgIGlzR2FtZVN0YXJ0OiBmYWxzZSxcbiAgICAgIHdpbm5lcjogcHJvcHMudGV4dFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZ2V0U3RhdHVzKClcbiAgICB9KVxuICB9LFxuXG4gIHNvY2tldFBpbmcoKSB7XG4gICAgaXNDb25uZWN0ID0gdHJ1ZVxuICB9LFxuXG4gIHNvY2tldExvZyhkYXRhOmFueSkge1xuICAgICR3dXhOb3RpZmljYXRpb24oKS5zaG93KHtcbiAgICAgIHRpdGxlOiAn6YCa55+lJyxcbiAgICAgIHRleHQ6IGRhdGEucm9vbUxvZyxcbiAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgIH0pXG4gIH0sXG5cbiAgc29ja2V0TG9naW4oZGF0YTogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ+a4uOaIj+eZu+W9lScsIGRhdGEpO1xuICAgIGNvbnN0IHsgcG9pbnQsIGlzT3duZXIsIHJvb21JZCwgaXNHYW1lU3RhcnQgfSA9IGRhdGFcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgcG9pbnQsXG4gICAgICBpc093bmVyLFxuICAgICAgcm9vbUlkLFxuICAgICAgaXNHYW1lU3RhcnRcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgfSxcbiAgc29ja2V0QnVzaW5lc3MoZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBwb2ludCB9ID0gZGF0YVxuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBwb2ludCxcbiAgICB9KVxuICB9LFxuICBzb2NrZXRTdGFydCgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgaXNHYW1lU3RhcnQ6IHRydWVcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgICBcbiAgfSxcbiAgLyoqIOS7peWQjuWGjeS8mOWMliAqL1xuICBnZXRVc2VyUHJvZmlsZSgpIHtcbiAgICAvLyBjb25zdCB1bmlvbklkID0gd3guZ2V0U3RvcmFnZVN5bmMoJ01PTU9ORVlfT1BFTklEJylcbiAgICAvLyDmjqjojZDkvb/nlKh3eC5nZXRVc2VyUHJvZmlsZeiOt+WPlueUqOaIt+S/oeaBr++8jOW8gOWPkeiAheavj+asoemAmui/h+ivpeaOpeWPo+iOt+WPlueUqOaIt+S4quS6uuS/oeaBr+Wdh+mcgOeUqOaIt+ehruiupO+8jOW8gOWPkeiAheWmpeWWhOS/neeuoeeUqOaIt+W/q+mAn+Whq+WGmeeahOWktOWDj+aYteensO+8jOmBv+WFjemHjeWkjeW8ueeql1xuICAgIHd4LmdldFVzZXJQcm9maWxlKHtcbiAgICAgIGRlc2M6ICflsZXnpLrnlKjmiLfkv6Hmga8nLCAvLyDlo7DmmI7ojrflj5bnlKjmiLfkuKrkurrkv6Hmga/lkI7nmoTnlKjpgJTvvIzlkI7nu63kvJrlsZXnpLrlnKjlvLnnqpfkuK3vvIzor7fosKjmhY7loavlhplcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ+WxleekuueUqOaIt+S/oeaBrycsIHJlcyk7XG4gICAgICAgIC8vIHBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGkvdXBkYXRlVXNlckluZm8nLCB7XG4gICAgICAgIC8vICAgdXNlcm5hbWU6IHJlcy51c2VySW5mby5uaWNrTmFtZSxcbiAgICAgICAgLy8gICBhdmF0YXJVcmw6IHJlcy51c2VySW5mby5hdmF0YXJVcmwsXG4gICAgICAgIC8vICAgdW5pb25JZFxuICAgICAgICAvLyB9KVxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHVzZXJJbmZvOiByZXMudXNlckluZm8sXG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5pdCgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgc3RhcnQoKSB7XG4gICAgc2VuZFNvY2tldC5zdGFydCh7XG4gICAgICByb29tSWQ6IHRoaXMuZGF0YS5yb29tSWQhXG4gICAgfSlcbiAgfSxcbiAgYWN0aW9uKCkge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICB2aXNpYmxlOiB0cnVlXG4gICAgfSlcbiAgfSxcbiAgaGFuZGxlQ2xpY2tJdGVtKGU6IGFueSkge1xuICAgIGNvbnN0IGluZGV4ID0gZS5kZXRhaWwuaW5kZXhcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAkd3V4S2V5Qm9hcmQoKS5zaG93KHtcbiAgICAgICAgbWF4bGVuZ3RoOiAtMSxcbiAgICAgICAgcGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VibWl0KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAkd3V4RGlhbG9nKCkuY29uZmlybSh7XG4gICAgICAgICAgICByZXNldE9uQ2xvc2U6IHRydWUsXG4gICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHRpdGxlOiAn5Lqk5piT77yI6ZO26KGMIO+8iScsXG4gICAgICAgICAgICBjb250ZW50OiBg56Gu5a6a5ZCR6ZO26KGM5pSv5LuYwqUke3ZhbHVlfe+8n2AsXG4gICAgICAgICAgICBvbkNvbmZpcm0oKSB7XG4gICAgICAgICAgICAgICAgc2VuZFNvY2tldC5iYW5rQnVzaW5lc3Moe1xuICAgICAgICAgICAgICAgICAgYW1vdW50OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdtaW51cydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgICAvLyByZXR1cm4gdHJ1ZVxuICAgICAgfSxcbiAgICB9KSBcbiAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAxKSB7XG4gICAgICB3eC5zY2FuQ29kZSh7XG4gICAgICAgIG9ubHlGcm9tQ2FtZXJhOiB0cnVlLFxuICAgICAgICBzY2FuVHlwZTogWydxckNvZGUnXSxcbiAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzLnJlc3VsdFxuICAgICAgICAgICR3dXhLZXlCb2FyZCgpLnNob3coe1xuICAgICAgICAgICAgbWF4bGVuZ3RoOiAtMSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBmYWxzZSxcbiAgICAgICAgICAgIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TdWJtaXQodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgJHd1eERpYWxvZygpLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHJlc2V0T25DbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+S6pOaYk++8iOS4quS6uu+8iScsXG4gICAgICAgICAgICAgICAgY29udGVudDogYOehruWumuWQkeS7luaUr+S7mMKlJHt2YWx1ZX3vvJ9gLFxuICAgICAgICAgICAgICAgIG9uQ29uZmlybSgpIHtcbiAgICAgICAgICAgICAgICAgIHNlbmRTb2NrZXQubWFuQnVzaW5lc3Moe1xuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlVW5pb25JZDogcmVzdWx0XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pIFxuICAgICAgICAgIC8vIHNlbmRTb2NrZXQubWFuQnVzaW5lc3Moe1xuICAgICAgICAgIC8vICAgcmVjZWl2ZVVuaW9uSWQ6IHJlc3VsdFxuICAgICAgICAgIC8vIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IChlcnIpID0+IHtcbiAgICAgICAgICAkd3V4VG9hc3QoKS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JiaWRkZW4nLFxuICAgICAgICAgICAgZHVyYXRpb246IDE1MDAsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgdGV4dDogYOW+ruS/oeaJq+eggeWksei0pSR7ZXJyfWAsXG4gICAgICAgICAgICBzdWNjZXNzOiAoKSA9PiBjb25zb2xlLmxvZygn5bey5a6M5oiQJylcbiAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9ZWxzZSBpZiAoaW5kZXggPT09IDIpIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgJHd1eEtleUJvYXJkKCkuc2hvdyh7XG4gICAgICAgIG1heGxlbmd0aDogLTEsXG4gICAgICAgIHBhc3N3b3JkOiBmYWxzZSxcbiAgICAgICAgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgc2VuZFNvY2tldC5iYW5rQnVzaW5lc3Moe1xuICAgICAgICAgICAgYW1vdW50OiB2YWx1ZSxcbiAgICAgICAgICAgIHR5cGU6ICdhZGQnXG4gICAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcbiAgICB9IGVsc2UgIGlmIChpbmRleCA9PT0gMykge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcXJjb2RlVmlzaWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoaW5kZXggPT09IDQpe1xuICAgICAgc2VuZFNvY2tldC5iYW5rcnVwdGN5KClcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUNhbmNlbCgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICB9LFxuICBxcmNvZGVDbG9zZSgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgcXJjb2RlVmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICB9XG59KVxuIl19