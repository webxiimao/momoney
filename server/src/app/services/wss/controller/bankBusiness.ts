import RoomModel, { GameStatus } from '../../../core/model/room';
import { broadcastLog } from '../actions';
import UserModel from '../../../core/model/user';

import { clientsMap, usersMap } from '../index';
import ws from 'ws';
import { wsResponse } from 'src/app/utils/serverUtils';
import ErrorCode from '../../../configs/errorCode';
// 交易
async function bankBussiness(props:any, client: ws) {
  const unionId = usersMap.get(client);
  const { amount, type } = props;
  const user: any = await UserModel.findOne({ unionId });
  if (type === 'add') {
    // await user.updateOne({ $inc: { point: amount } });
    user.point += Number(amount);
  } else if (type === 'minus') {
    // await user.updateOne({ $inc: { point: -amount } });
    user.point -= Number(amount);
  }
  await user.save();
  const room = await RoomModel.findById(user.get('room')).exec();
  const usersList = room.get('users');
  await broadcastLog(room, usersList, `玩家${user.get('username')}向银行${type === 'add' ? '取' : '付'}了${amount}$`);
  await client.send(wsResponse('bussiness', { point: user.get('point') }));
}

export default bankBussiness;
