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
var countup_js_1 = require("../../libs/countup/countup.js");
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
Page({
    data: __assign(__assign({ userInfo: {}, hasUserInfo: false, canIUseGetUserProfile: true, canIUseOpenData: false, unionId: undefined }, defaultData), { btnStatus: "", visible: false, qrcodeVisible: false, actions: [
            {
                name: '支付给银行',
            },
            {
                name: '从银行取钱'
            },
            {
                name: '付款给他人'
            },
            {
                name: '收款二维码'
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
        this.$wuxLoading = index_1.$wuxLoading();
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
                fetch_1.post(fetch_1.BaseUrl + '/api/login', { code: wxres.code }).then(function (res) {
                    var openid = res.data.openid;
                    self.setData({
                        unionId: openid
                    });
                    wx.onAppShow(function () {
                        console.log('重连websocket');
                        wx.showLoading({
                            title: '重连中'
                        });
                        wx.connectSocket({
                            url: fetch_1.WsUrl,
                            success: function (res) {
                                console.log('websocket连接成功', res);
                            },
                            fail: function (err) {
                                console.error(err);
                            },
                            complete: function () {
                                wx.hideLoading();
                            }
                        });
                    });
                    wx.setStorage({
                        key: 'MOMONEY_OPENID',
                        data: openid
                    });
                    console.log('返回的用户信息', res);
                    wx.connectSocket({
                        url: fetch_1.WsUrl,
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
                    wx.onSocketError(function (err) {
                        console.error("websocket失败", err);
                    });
                    wx.onSocketMessage(function (res) {
                        var _a = socketUtils_1.getSocketResponse(res.data), flag = _a.flag, props = _a.props;
                        console.log('flag', flag);
                        switch (flag) {
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
            isOwner: isOwner,
            roomId: roomId,
            isGameStart: isGameStart
        }, function () {
            _this.getStatus();
        });
        this.countUp = new countup_js_1.default('point', point, { duration: 1 }, this);
        this.countUp.start();
    },
    socketBusiness: function (data) {
        var point = data.point;
        this.countUp.update(point);
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
        else if (index === 2) {
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
        else if (index === 1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBRUEsOENBQTJEO0FBQzNELHNFQUFnRTtBQUNoRSx1REFBMkQ7QUFFM0QsNERBQW9EO0FBRXBELDhDQUF5RztBQUN6RyxJQUFLLFNBU0o7QUFURCxXQUFLLFNBQVM7SUFFWiw0QkFBZSxDQUFBO0lBRWYsNENBQStCLENBQUE7SUFFL0IsOENBQWlDLENBQUE7SUFFakMsMEJBQWEsQ0FBQTtBQUNmLENBQUMsRUFUSSxTQUFTLEtBQVQsU0FBUyxRQVNiO0FBRUQsSUFBTSxXQUFXLEdBQUc7SUFFbEIsV0FBVyxFQUFFLEtBQUs7SUFFbEIsVUFBVSxFQUFFLEtBQUs7SUFFakIsTUFBTSxFQUFFLFNBQVM7SUFFakIsS0FBSyxFQUFFLEtBQUs7SUFFWixPQUFPLEVBQUUsS0FBSztJQUNkLE1BQU0sRUFBRSxFQUFFO0NBQ1gsQ0FBQTtBQUVELElBQUksQ0FBQztJQUNILElBQUksc0JBQ0YsUUFBUSxFQUFFLEVBQVMsRUFDbkIsV0FBVyxFQUFFLEtBQUssRUFDbEIscUJBQXFCLEVBQUUsSUFBSSxFQUMzQixlQUFlLEVBQUUsS0FBSyxFQUN0QixPQUFPLEVBQUUsU0FBUyxJQUNmLFdBQVcsS0FDZCxTQUFTLEVBQUUsRUFBRSxFQUNiLE9BQU8sRUFBRSxLQUFLLEVBQ2QsYUFBYSxFQUFFLEtBQUssRUFDcEIsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0ksSUFBSSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsT0FBTzthQUNkO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLE9BQU87YUFDaEI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsT0FBTzthQUNkO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLElBQUk7YUFDYjtTQUNKLEdBQ0E7SUFFRCxXQUFXO1FBQ1QsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNaLEdBQUcsRUFBRSxjQUFjO1NB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QUFhLEVBQUUsSUFBSTthQUNwQixDQUFDLENBQUE7U0FDSDthQUFNLElBQUcsS0FBSyxLQUFLLENBQUMsRUFBQztZQUNwQixvQkFBVSxDQUFDLFVBQVUsRUFBRSxDQUFBO1NBQ3hCO0lBQ0gsQ0FBQztJQUNELFlBQVk7UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1gsT0FBTyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsV0FBVztRQUNULElBQUksQ0FBQyxPQUFPLENBQUM7WUFDWCxhQUFhLEVBQUUsS0FBSztTQUNyQixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW5kZXgudHNcbi8vIOiOt+WPluW6lOeUqOWunuS+i1xuaW1wb3J0IHsgcG9zdCwgQmFzZVVybCwgV3NVcmwgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9mZXRjaCdcbmltcG9ydCBzZW5kU29ja2V0IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NvY2tldFNlcnZpY2Uvc2VuZFNvY2tldCdcbmltcG9ydCB7IGdldFNvY2tldFJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29ja2V0VXRpbHMnXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgQ291bnRVcCBmcm9tICcuLi8uLi9saWJzL2NvdW50dXAvY291bnR1cC5qcyc7XG4vL0B0cy1pZ25vcmVcbmltcG9ydCB7ICR3dXhLZXlCb2FyZCwgJHd1eERpYWxvZywgJHd1eFRvYXN0LCAkd3V4Tm90aWZpY2F0aW9uLCAkd3V4TG9hZGluZyB9IGZyb20gJy4uLy4uL2xpYnMvd3V4L2luZGV4J1xuZW51bSBCdG5TdGF0dXMge1xuICAvKiog5ri45oiP5bey57uP5byA5aeLICovXG4gIFNUQVJUID0gJ3N0YXJ0JyxcbiAgLyoqIOa4uOaIj+ayoeW8gOWni+S9huaYr+aYr+aIv+S4uyAqL1xuICBOT1NUQVJUX09XTkVSID0gJ25vc3RhcnRfb3duZXInLFxuICAvKiog5ri45oiP5rKh5byA5aeL77yM5L2G5Lmf5LiN5piv5oi/5Li7ICovXG4gIE5PU1RBUlRfUExBWUVSID0gJ25vc3RhcnRfcGxheWVyJyxcbiAgLyoqIOa4uOaIj+e7k+adnyAqL1xuICBPVkVSID0gJ292ZXInXG59XG5cbmNvbnN0IGRlZmF1bHREYXRhID0ge1xuICAvLyDmuLjmiI/mmK/lkKblvIDlp4tcbiAgaXNHYW1lU3RhcnQ6IGZhbHNlLFxuICAvLyDmuLjmiI/mmK/lkKbnu5PmnZ9cbiAgaXNHYW1lT3ZlcjogZmFsc2UsXG4gIC8qKiDmiL/pl7RpZCAqL1xuICByb29tSWQ6IHVuZGVmaW5lZCxcbiAgLyoqIOWIhuaVsCAqL1xuICBwb2ludDogMTUwMDAsXG4gIC8qKiDmmK/lkKbmmK/miL/kuLsgKi9cbiAgaXNPd25lcjogZmFsc2UsXG4gIHdpbm5lcjogJydcbn1cblxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICB1c2VySW5mbzoge30gYXMgYW55LFxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcbiAgICBjYW5JVXNlR2V0VXNlclByb2ZpbGU6IHRydWUsXG4gICAgY2FuSVVzZU9wZW5EYXRhOiBmYWxzZSwvLyDlpoLpnIDlsJ3or5Xojrflj5bnlKjmiLfkv6Hmga/lj6/mlLnkuLpmYWxzZVxuICAgIHVuaW9uSWQ6IHVuZGVmaW5lZCxcbiAgICAuLi5kZWZhdWx0RGF0YSxcbiAgICBidG5TdGF0dXM6IFwiXCIsXG4gICAgdmlzaWJsZTogZmFsc2UsXG4gICAgcXJjb2RlVmlzaWJsZTogZmFsc2UsXG4gICAgYWN0aW9uczogW1xuICAgICAge1xuICAgICAgICAgIG5hbWU6ICfmlK/ku5jnu5npk7booYwnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ+S7jumTtuihjOWPlumSsSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICAgbmFtZTogJ+S7mOasvue7meS7luS6uidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICfmlLbmrL7kuoznu7TnoIEnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgIG5hbWU6ICfnoLTkuqcnLFxuICAgICAgfVxuICBdLFxuICB9LFxuICAvLyDkuovku7blpITnkIblh73mlbBcbiAgYmluZFZpZXdUYXAoKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuLi9sb2dzL2xvZ3MnLFxuICAgIH0pXG4gIH0sXG4gIG9uU2hhcmVBcHBNZXNzYWdlKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJ+S4gOi1t+adpeeOqeWQp++8geWkp+WvjOe/ge+8jOWGsuWGsuWGsu+8gScsXG4gICAgICBwYXRoOiBgcGFnZXMvaW5kZXgvaW5kZXg/cm9vbUlkPSR7dGhpcy5kYXRhLnJvb21JZH1gXG4gICAgfVxuICB9LFxuICBvbkxvYWQoKSB7XG4gICAgd3guc2hvd1NoYXJlTWVudSh7XG4gICAgICBtZW51czogWydzaGFyZUFwcE1lc3NhZ2UnXSxcbiAgICAgIHdpdGhTaGFyZVRpY2tldDogdHJ1ZVxuICAgIH0pXG4gICAgY29uc3Qgcm91dGVzID0gZ2V0Q3VycmVudFBhZ2VzKClcbiAgICBjb25zb2xlLmxvZygncm91dGVzJywgcm91dGVzKTtcbiAgICBjb25zdCBxdWVyeSA9IHJvdXRlc1tyb3V0ZXMubGVuZ3RoIC0gMV0uX19kaXNwbGF5UmVwb3J0ZXI/LnF1ZXJ5IHx8IHt9XG4gICAgY29uc29sZS5sb2coJ3F1ZXJ5JywgcXVlcnkpO1xuICAgIFxuICAgIGlmIChxdWVyeS5yb29tSWQpIHtcbiAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgIHJvb21JZDogcXVlcnkucm9vbUlkXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2cocXVlcnkucm9vbUlkKTtcbiAgICB9XG4gICAgdGhpcy4kd3V4TG9hZGluZyA9ICR3dXhMb2FkaW5nKClcbiAgfSxcbiAgZ2V0U3RhdHVzKCkge1xuICAgIGNvbnN0IHsgaXNPd25lciwgaXNHYW1lU3RhcnQsIGlzR2FtZU92ZXIgfSA9IHRoaXMuZGF0YVxuICAgIGxldCBzdGF0dXMgPSBudWxsXG4gICAgaWYgKGlzR2FtZVN0YXJ0KSB7XG4gICAgICBzdGF0dXMgPSBCdG5TdGF0dXMuU1RBUlRcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzT3duZXIpe1xuICAgICAgICBzdGF0dXMgPSBCdG5TdGF0dXMuTk9TVEFSVF9PV05FUlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gQnRuU3RhdHVzLk5PU1RBUlRfUExBWUVSXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0dhbWVPdmVyKSB7XG4gICAgICBzdGF0dXMgPSBCdG5TdGF0dXMuT1ZFUlxuICAgIH1cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYnRuU3RhdHVzOiBzdGF0dXNcbiAgICB9KVxuICB9LFxuICBpbml0KCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBjb25zb2xlLmxvZygn55So5oi35L+h5oGvJywgc2VsZi5kYXRhLnVzZXJJbmZvKTtcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzKHd4cmVzKSB7XG4gICAgICAgIHBvc3QoQmFzZVVybCArICcvYXBpL2xvZ2luJywgeyBjb2RlOiB3eHJlcy5jb2RlIH0pLnRoZW4oKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3BlbmlkID0gcmVzLmRhdGEub3BlbmlkXG4gICAgICAgICAgc2VsZi5zZXREYXRhKHtcbiAgICAgICAgICAgIHVuaW9uSWQ6IG9wZW5pZFxuICAgICAgICAgIH0pXG4gICAgICAgICAgd3gub25BcHBTaG93KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCfph43ov553ZWJzb2NrZXQnKTtcbiAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICfph43ov57kuK0nXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgd3guY29ubmVjdFNvY2tldCh7XG4gICAgICAgICAgICAgIHVybDogV3NVcmwsXG4gICAgICAgICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dlYnNvY2tldOi/nuaOpeaIkOWKnycsIHJlcyk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGZhaWwoZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNvbXBsZXRlKCkge1xuICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICAgIHd4LnNldFN0b3JhZ2Uoe1xuICAgICAgICAgICAga2V5OiAnTU9NT05FWV9PUEVOSUQnLFxuICAgICAgICAgICAgZGF0YTogb3BlbmlkXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZygn6L+U5Zue55qE55So5oi35L+h5oGvJywgcmVzKTtcbiAgICAgICAgICAvLyDov57mjqV3ZWJzb2NrZXRcbiAgICAgICAgICB3eC5jb25uZWN0U29ja2V0KHtcbiAgICAgICAgICAgIHVybDogV3NVcmwsXG4gICAgICAgICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnd2Vic29ja2V06L+e5o6l5oiQ5YqfJywgcmVzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmYWlsKGVycil7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2dpbicpO1xuICAgICAgICAgIFxuICAgICAgICAgIHd4Lm9uU29ja2V0T3BlbigoKSA9PiB7XG4gICAgICAgICAgICAvLyBzZWxmLl9oZWFydCgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZi5kYXRhLnJvb21JZCcsIHNlbGYuZGF0YS5yb29tSWQpO1xuICAgICAgICAgICAgc2VuZFNvY2tldC5sb2dpbih7XG4gICAgICAgICAgICAgIHVzZXJuYW1lOiBzZWxmLmRhdGEudXNlckluZm8/Lm5pY2tOYW1lIGFzIHN0cmluZyxcbiAgICAgICAgICAgICAgdW5pb25JZDogb3BlbmlkLFxuICAgICAgICAgICAgICByb29tSWQ6IHNlbGYuZGF0YS5yb29tSWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICB3eC5vblNvY2tldEVycm9yKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwid2Vic29ja2V05aSx6LSlXCIsIGVycik7XG4gICAgICAgICAgICAvLyBzZWxmLiR3dXhMb2FkaW5nLnNob3coe1xuICAgICAgICAgICAgLy8gICB0ZXh0OiAn5pat57q/6YeN6L+e5LitLi4uJyxcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICBcbiAgICAgICAgICB9KVxuICAgICAgICAgIHd4Lm9uU29ja2V0TWVzc2FnZSgocmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IGZsYWcsIHByb3BzIH0gPSBnZXRTb2NrZXRSZXNwb25zZShyZXMuZGF0YSBhcyBzdHJpbmcpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZmxhZycsIGZsYWcpO1xuICAgICAgICAgICAgc3dpdGNoIChmbGFnKXtcbiAgICAgICAgICAgICAgY2FzZSAnbG9naW4nOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0TG9naW4ocHJvcHMpXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgY2FzZSAnc3RhcnQnOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0U3RhcnQoKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgJ2J1c3NpbmVzcyc6XG4gICAgICAgICAgICAgICAgc2VsZi5zb2NrZXRCdXNpbmVzcyhwcm9wcylcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICBjYXNlICdsb2cnOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0TG9nKHByb3BzKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgJ292ZXInOlxuICAgICAgICAgICAgICAgIHNlbGYuc29ja2V0T3Zlcihwcm9wcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZW5kR2FtZSgpIHtcbiAgICAvL0B0cy1pZ25vcmVcbiAgICAkd3V4RGlhbG9nKCkuY29uZmlybSh7XG4gICAgICByZXNldE9uQ2xvc2U6IHRydWUsXG4gICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgIHRpdGxlOiAn56Gu5a6a57uT5p2f5ri45oiPJyxcbiAgICAgIG9uQ29uZmlybSgpIHtcbiAgICAgICAgc2VuZFNvY2tldC5vdmVyKClcbiAgICAgIH0sXG4gIH0pXG4gIH0sXG4gIC8vIOS7peWQjuWGjeaQnlxuICByZXNldCgpIHtcbiAgICB0aGlzLnNldERhdGEoZGVmYXVsdERhdGEsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpXG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgfSxcblxuICBzb2NrZXRPdmVyKHByb3BzOiBhbnkpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgaXNHYW1lT3ZlcjogdHJ1ZSxcbiAgICAgIGlzR2FtZVN0YXJ0OiBmYWxzZSxcbiAgICAgIHdpbm5lcjogcHJvcHMudGV4dFxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMuZ2V0U3RhdHVzKClcbiAgICB9KVxuICB9LFxuXG4gIHNvY2tldExvZyhkYXRhOmFueSkge1xuICAgICR3dXhOb3RpZmljYXRpb24oKS5zaG93KHtcbiAgICAgIHRpdGxlOiAn6YCa55+lJyxcbiAgICAgIHRleHQ6IGRhdGEucm9vbUxvZyxcbiAgICAgIGR1cmF0aW9uOiAzMDAwLFxuICAgIH0pXG4gIH0sXG5cbiAgc29ja2V0TG9naW4oZGF0YTogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ+a4uOaIj+eZu+W9lScsIGRhdGEpO1xuICAgIGNvbnN0IHsgcG9pbnQsIGlzT3duZXIsIHJvb21JZCwgaXNHYW1lU3RhcnQgfSA9IGRhdGFcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgLy8gcG9pbnQsXG4gICAgICBpc093bmVyLFxuICAgICAgcm9vbUlkLFxuICAgICAgaXNHYW1lU3RhcnRcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgICB0aGlzLmNvdW50VXAgPSBuZXcgQ291bnRVcCgncG9pbnQnLCBwb2ludCwge2R1cmF0aW9uOiAxfSwgdGhpcylcbiAgICB0aGlzLmNvdW50VXAuc3RhcnQoKTtcbiAgfSxcbiAgc29ja2V0QnVzaW5lc3MoZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBwb2ludCB9ID0gZGF0YVxuICAgIC8vIHRoaXMuc2V0RGF0YSh7XG4gICAgLy8gICBwb2ludCxcbiAgICAvLyB9KVxuICAgIHRoaXMuY291bnRVcC51cGRhdGUocG9pbnQpO1xuICB9LFxuICBzb2NrZXRTdGFydCgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgaXNHYW1lU3RhcnQ6IHRydWVcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmdldFN0YXR1cygpXG4gICAgfSlcbiAgICBcbiAgfSxcbiAgLyoqIOS7peWQjuWGjeS8mOWMliAqL1xuICBnZXRVc2VyUHJvZmlsZSgpIHtcbiAgICAvLyBjb25zdCB1bmlvbklkID0gd3guZ2V0U3RvcmFnZVN5bmMoJ01PTU9ORVlfT1BFTklEJylcbiAgICAvLyDmjqjojZDkvb/nlKh3eC5nZXRVc2VyUHJvZmlsZeiOt+WPlueUqOaIt+S/oeaBr++8jOW8gOWPkeiAheavj+asoemAmui/h+ivpeaOpeWPo+iOt+WPlueUqOaIt+S4quS6uuS/oeaBr+Wdh+mcgOeUqOaIt+ehruiupO+8jOW8gOWPkeiAheWmpeWWhOS/neeuoeeUqOaIt+W/q+mAn+Whq+WGmeeahOWktOWDj+aYteensO+8jOmBv+WFjemHjeWkjeW8ueeql1xuICAgIHd4LmdldFVzZXJQcm9maWxlKHtcbiAgICAgIGRlc2M6ICflsZXnpLrnlKjmiLfkv6Hmga8nLCAvLyDlo7DmmI7ojrflj5bnlKjmiLfkuKrkurrkv6Hmga/lkI7nmoTnlKjpgJTvvIzlkI7nu63kvJrlsZXnpLrlnKjlvLnnqpfkuK3vvIzor7fosKjmhY7loavlhplcbiAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ+WxleekuueUqOaIt+S/oeaBrycsIHJlcyk7XG4gICAgICAgIC8vIHBvc3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9hcGkvdXBkYXRlVXNlckluZm8nLCB7XG4gICAgICAgIC8vICAgdXNlcm5hbWU6IHJlcy51c2VySW5mby5uaWNrTmFtZSxcbiAgICAgICAgLy8gICBhdmF0YXJVcmw6IHJlcy51c2VySW5mby5hdmF0YXJVcmwsXG4gICAgICAgIC8vICAgdW5pb25JZFxuICAgICAgICAvLyB9KVxuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIHVzZXJJbmZvOiByZXMudXNlckluZm8sXG4gICAgICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5pdCgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgc3RhcnQoKSB7XG4gICAgc2VuZFNvY2tldC5zdGFydCh7XG4gICAgICByb29tSWQ6IHRoaXMuZGF0YS5yb29tSWQhXG4gICAgfSlcbiAgfSxcbiAgYWN0aW9uKCkge1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICB2aXNpYmxlOiB0cnVlXG4gICAgfSlcbiAgfSxcbiAgaGFuZGxlQ2xpY2tJdGVtKGU6IGFueSkge1xuICAgIGNvbnN0IGluZGV4ID0gZS5kZXRhaWwuaW5kZXhcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAkd3V4S2V5Qm9hcmQoKS5zaG93KHtcbiAgICAgICAgbWF4bGVuZ3RoOiAtMSxcbiAgICAgICAgcGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uU3VibWl0KHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAkd3V4RGlhbG9nKCkuY29uZmlybSh7XG4gICAgICAgICAgICByZXNldE9uQ2xvc2U6IHRydWUsXG4gICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHRpdGxlOiAn5Lqk5piT77yI6ZO26KGMIO+8iScsXG4gICAgICAgICAgICBjb250ZW50OiBg56Gu5a6a5ZCR6ZO26KGM5pSv5LuYwqUke3ZhbHVlfe+8n2AsXG4gICAgICAgICAgICBvbkNvbmZpcm0oKSB7XG4gICAgICAgICAgICAgICAgc2VuZFNvY2tldC5iYW5rQnVzaW5lc3Moe1xuICAgICAgICAgICAgICAgICAgYW1vdW50OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdtaW51cydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgICAvLyByZXR1cm4gdHJ1ZVxuICAgICAgfSxcbiAgICB9KSBcbiAgICB9IGVsc2UgaWYgKGluZGV4ID09PSAyKSB7XG4gICAgICB3eC5zY2FuQ29kZSh7XG4gICAgICAgIG9ubHlGcm9tQ2FtZXJhOiB0cnVlLFxuICAgICAgICBzY2FuVHlwZTogWydxckNvZGUnXSxcbiAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVzLnJlc3VsdFxuICAgICAgICAgICR3dXhLZXlCb2FyZCgpLnNob3coe1xuICAgICAgICAgICAgbWF4bGVuZ3RoOiAtMSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBmYWxzZSxcbiAgICAgICAgICAgIGNhbGxiYWNrKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TdWJtaXQodmFsdWU6IG51bWJlcikge1xuICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgJHd1eERpYWxvZygpLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHJlc2V0T25DbG9zZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjbG9zYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+S6pOaYk++8iOS4quS6uu+8iScsXG4gICAgICAgICAgICAgICAgY29udGVudDogYOehruWumuWQkeS7luaUr+S7mMKlJHt2YWx1ZX3vvJ9gLFxuICAgICAgICAgICAgICAgIG9uQ29uZmlybSgpIHtcbiAgICAgICAgICAgICAgICAgIHNlbmRTb2NrZXQubWFuQnVzaW5lc3Moe1xuICAgICAgICAgICAgICAgICAgICBhbW91bnQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICByZWNlaXZlVW5pb25JZDogcmVzdWx0XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pIFxuICAgICAgICAgIC8vIHNlbmRTb2NrZXQubWFuQnVzaW5lc3Moe1xuICAgICAgICAgIC8vICAgcmVjZWl2ZVVuaW9uSWQ6IHJlc3VsdFxuICAgICAgICAgIC8vIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IChlcnIpID0+IHtcbiAgICAgICAgICAkd3V4VG9hc3QoKS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdmb3JiaWRkZW4nLFxuICAgICAgICAgICAgZHVyYXRpb246IDE1MDAsXG4gICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgdGV4dDogYOW+ruS/oeaJq+eggeWksei0pSR7ZXJyfWAsXG4gICAgICAgICAgICBzdWNjZXNzOiAoKSA9PiBjb25zb2xlLmxvZygn5bey5a6M5oiQJylcbiAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9ZWxzZSBpZiAoaW5kZXggPT09IDEpIHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgJHd1eEtleUJvYXJkKCkuc2hvdyh7XG4gICAgICAgIG1heGxlbmd0aDogLTEsXG4gICAgICAgIHBhc3N3b3JkOiBmYWxzZSxcbiAgICAgICAgY2FsbGJhY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBvblN1Ym1pdCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgICAgc2VuZFNvY2tldC5iYW5rQnVzaW5lc3Moe1xuICAgICAgICAgICAgYW1vdW50OiB2YWx1ZSxcbiAgICAgICAgICAgIHR5cGU6ICdhZGQnXG4gICAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcbiAgICB9IGVsc2UgIGlmIChpbmRleCA9PT0gMykge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgcXJjb2RlVmlzaWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYoaW5kZXggPT09IDQpe1xuICAgICAgc2VuZFNvY2tldC5iYW5rcnVwdGN5KClcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUNhbmNlbCgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICB9LFxuICBxcmNvZGVDbG9zZSgpIHtcbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgcXJjb2RlVmlzaWJsZTogZmFsc2VcbiAgICB9KVxuICB9XG59KVxuIl19