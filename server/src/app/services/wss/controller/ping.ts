import ws from 'ws';
import { wsResponse } from 'src/app/utils/serverUtils';
// 交易
async function ping(props:any, client: ws) {
  await client.send(wsResponse('ack', {}));
}

export default ping;
