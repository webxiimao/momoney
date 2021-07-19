import RoomModel, { GameStatus } from '../../../core/model/room';
import UserModel, { UserStatus } from '../../../core/model/user';
import { broadcast4room, broadcastLog } from '../actions';

import { clientsMap, usersMap } from '../index';
import ws from 'ws';
import { wsResponse } from 'src/app/utils/serverUtils';
import ErrorCode from '../../../configs/errorCode';
// 开始
async function over(props:any, client: ws) {
  // 查询是哪个room
  const unionId = usersMap.get(client);
  const user: any = await UserModel.findOne({ unionId });
  const room: any = await RoomModel.findById(user.room);
  if (!room) {
    console.error('没有找到当前房间');
    await client.send(wsResponse(null, null, '没有找到房间', ErrorCode.SERVER_ERROR));
    return;
  }
  const winner: any = await UserModel.findOne({ unionId: { $in: room.users } }).sort({ point: -1 }).limit(1);
  /** 更新游戏状态 */
  await room.updateOne({ gameStatus: GameStatus.Success, winning: winner.unionId });
  await broadcastLog(room, room.users, `游戏结束，游戏胜利者${winner.username}`);
  await broadcast4room(room.users, wsResponse('over', { text: `Winner: ${winner.username}，Point: ${winner.point}` }));
  /** 获取胜利的客户端 */
  const winnerClient = clientsMap[winner.unionId];
  // 获得胜利
  if (winnerClient) {
    winnerClient.send(wsResponse('winning', { }));
  }
  await UserModel.updateMany({ unionId: { $in: room.users } }, { room: null });
}

export default over;
