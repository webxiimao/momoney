import RoomModel, { GameStatus } from '../../../core/model/room';
import UserModel, { UserStatus } from '../../../core/model/user';
import { broadcastLog } from '../actions';

import { clientsMap, usersMap } from '../index';
import ws from 'ws';
// 有一个玩家宣布破产
async function bankruptcy(props:any, client: ws) {
  // 查询是哪个room
  const unionId = usersMap.get(client);
  const user: any = await UserModel.findOne({ unionId });
  await user.update({ status: UserStatus.Bankruptcy });
  const room: any = await RoomModel.findById(user.room);
  await broadcastLog(room, room.users, `玩家${user.username}宣布了破产！`);
  // 宣布游戏结束
}

export default bankruptcy;
