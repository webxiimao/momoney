import RoomModel, { GameStatus } from '../../../core/model/room';
import { broadcast4room, broadcastLog } from '../actions';
import UserModel from '../../../core/model/user';

import { clientsMap, usersMap } from '../index';
import ws from 'ws';
import { wsResponse } from 'src/app/utils/serverUtils';
import ErrorCode from '../../../configs/errorCode';
// 个人交易
async function manBussiness(props:any, client: ws) {
  const unionId = usersMap.get(client);
  const { amount, receiveUnionId } = props;
  const user: any = await UserModel.findOne({ unionId });
  if (user.point < amount) {
    client.send(wsResponse('nomoney', { point: user.point, amount }));
    return;
  }
  user.point -= Number(amount);
  await user.save();
  const receiveUser: any = await UserModel.findOne({ unionId: receiveUnionId });
  // await receiveUser.updateOne({ $inc: { point: amount } });
  receiveUser.point += Number(amount);
  await receiveUser.save();
  await client.send(wsResponse('bussiness', { point: user.point }));
  const recevieClient = clientsMap.get(receiveUnionId);
  if (recevieClient) {
    await recevieClient.send(wsResponse('bussiness', { point: receiveUser.point }));
  }
  // 广播
  const room = await RoomModel.findById(user.get('room')).exec();
  const usersList = room.get('users');
  await broadcastLog(room,
    usersList, `玩家${user.get('username')}向玩家${receiveUser.get('username')}支付了${amount}$`);
}

export default manBussiness;
