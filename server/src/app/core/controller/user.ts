const WXBizDataCrypt = require('@libs/WXBizDataCrypt');
import request from 'request';
import Wechat from '@configs/wechat';
import { get } from '@utils/http';
import UserModel from '@model/user';
// 瞎几把快速搞定
export default {
  async login(ctx) {
    const { code } = ctx.request.body;
    const wxLoginApi = 'https://api.weixin.qq.com/sns/jscode2session';
    const reqApi = `${wxLoginApi}?appid=${Wechat.APP_ID}&js_code=${code}&secret=${Wechat.APP_SECRET}&grant_type=authorization_code`;
    const res: any = await get(reqApi);
    console.log('code2session', JSON.parse(res));
    ctx.body = {
      status: 0,
      data: JSON.parse(res)
    };
  },
  async getUserInfo(ctx) {
    const { sessionKey, userInfo } = ctx.request.body;
    const pc = new WXBizDataCrypt(Wechat.APP_ID, sessionKey);
    const data = pc.decryptData(userInfo.encryptedData, userInfo.iv);
    ctx.body = {
      status: 0,
      data
    };
  },
  async updateUserInfo(ctx) {
    const { username, avatarUrl, unionId } = ctx.request.body;
    console.log(username, avatarUrl);
    const user = await UserModel.findOne({ unionId });
    await user.updateOne({ username, avatarUrl });
    ctx.body = {
      status: 0,
    };
  }
};
