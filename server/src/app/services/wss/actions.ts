import { clientsMap } from './index';
import { wsResponse } from 'src/app/utils/serverUtils';

export const broadcast4room = async (unionIds: string[], msg: string) => {
  for (let i = 0; i < unionIds.length; i++) {
    const client = clientsMap.get(unionIds[i]);
    if (client) {
      await client.send(msg);
    }
  }
};

export const broadcastLog = async (room:any, unionIds: string[], msg: string) => {
  await room.update({ $push: { logs: msg } });
  await broadcast4room(unionIds, wsResponse('log', { roomLog: msg }));
};
