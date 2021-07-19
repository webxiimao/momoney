import { clientsMap, usersMap } from '../index';
import { broadcast4room } from '../actions';
import { wsResponse } from '../../../utils/serverUtils';
import UserModel, { UserStatus } from '../../../core/model/user';
import RoomModel, { GameStatus } from '../../../core/model/room';
import constants from '../../../configs/constants';
// 登录调用
async function login(data: any, client) {
  console.log('wsslogin', data);
  const { username, unionId, roomId } = data;
  /** 重新登录，删除存储的旧的client */
  const oldClient = clientsMap.get(unionId);
  if (oldClient) {
    clientsMap.delete(unionId);
    usersMap.delete(oldClient);
  }
  /** 初始化clientsMap和usersMap */
  clientsMap.set(unionId, client);
  usersMap.set(client, unionId);
  let room = null;
  // let room = await RoomModel.findOne({ users: { $in: unionId }, gameStatus: { $ne: GameStatus.Success } }).exec();
  let point = null;
  // 如果没有room 则表示不在房间李，则需要重制积分
  // 先判断有没有user，不存在判断roomId
  let user = await UserModel.findOne({ unionId }).exec();
  if (!user) {
    user = new UserModel({
      username,
      unionId,
      point: constants.INIT_POINT
    });
    await user.save();
    // 如果存在房间id直接进入房间
    if (roomId) {
      room = await RoomModel.findById(roomId).exec();
      if (room) {
        await RoomModel.findByIdAndUpdate(room.id, { $push: { users: unionId } });
      } else {
        console.log('房间不存在');
        return;
      }
    }
  } else {
    room = await RoomModel.findById(user.get('room')).exec();
    console.log('room', room);
    // 如果游戏还未开始，判断是否有roomId
    if (roomId) {
      if (room && room.get('gameStatus') === GameStatus.Preparing) {
        const innerRoom = await RoomModel.findById(roomId).exec();
        if (innerRoom) {
          room = innerRoom;
        }
      }
    }
  }

  if (!room) {
    room = new RoomModel({
      // 设置房主
      owner: unionId,
      users: [unionId]
    });
    await room.save();
  }
  point = user.get('point');
  /** 状态流转为准备中 */
  await user.updateOne({ status: UserStatus.Preparing });
  console.log('game status', room.get('status'));
  /** 如果游戏状态未开始，则重置金钱 */
  if (!room.get('status') || room.get('status') === GameStatus.Preparing) {
    await user.updateOne({ room: room._id, point: constants.INIT_POINT });
    /** fix: 这里异步了，所以point得到的还是旧的，但实际已经更新为15000了 */
    point = constants.INIT_POINT;
  } else {
    await user.updateOne({ room: room._id });
  }
  console.log('point', point);
  // 发送给当前用户积分和房间信息
  await client.send(wsResponse('login', {
 point, roomId: room.get('id'), isOwner: room.get('owner') === unionId, isGameStart: room.get('gameStatus') === GameStatus.Processing
 }));
  // 发送给房间的所有用户日志信息
  const log = `欢迎${username}进入房间`;
  await room.updateOne({ $push: { logs: log } });
  await broadcast4room(room.get('users'), wsResponse('log', { roomLog: log }));
}

export default login;
