import { wsDecode } from '../../../utils/wssUtils';
import login from './api/login';
import game_start from './api/game_start';
import game_over from './api/game_over';
import bank_business from './api/bank_business';
import man_business from './api/man_business';
import bankruptcy from './api/bankruptcy';
import ping from './api/ping';

const map = {
  // 登录
  login,
  // 游戏开始
  game_start,
  // 游戏结束
  game_over,
  // 银行业务
  bank_business,
  // 个人业务
  man_business,
  // 破产
  bankruptcy,
  // 心跳检测
  ping
};

function wsRoutes(msg: string, client) {
  const { path, props } = wsDecode(msg);
  const route = map[path];
  if (!route) {
    console.error(`404没有找到${route}路由`);
  }
  route(props, client);
}

export default wsRoutes;
