import RoomModel, { GameStatus } from '../../../core/model/room';
import UserModel, { UserStatus } from '../../../core/model/user';
import { broadcast4room } from '../actions';

import { clientsMap, usersMap } from '../index';
import ws from 'ws';
import { wsResponse } from 'src/app/utils/serverUtils';
import ErrorCode from '../../../configs/errorCode';
// 开始
async function start(props:any, client: ws) {
  // 查询是哪个room
  const { roomId } = props || {} as any;
  const room = await RoomModel.findById(roomId);
  if (!room) {
    console.error('没有找到当前房间', roomId);
    await client.send(wsResponse(null, null, '没有找到房间', ErrorCode.SERVER_ERROR));
    return;
  }
  const unionId = usersMap.get(client);
  if (room.get('owner') === unionId) {
    // 把活动设置为开始
    await room.updateOne({ gameStatus: GameStatus.Processing });
    const userList = room.get('users');
    await UserModel.updateMany({ unionId: { $in: userList } }, { status: UserStatus.Processing });
    await broadcast4room(userList, wsResponse('start', null));
    await broadcast4room(userList, wsResponse('log', { roomLog: 'game start !' }));
  } else {
    await client.send(wsResponse(null, null, '必须由房主主持开始游戏', ErrorCode.SERVER_ERROR));
  }
}

export default start;
