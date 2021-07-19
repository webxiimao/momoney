// websocket
// const ws = require('ws');
import ws from 'ws';
import onWsRoute from './routes';
const WebSocketServer = ws.Server;

const wss = new WebSocketServer({
  port: 8888
}, () => {
  console.log('websocket服务启动完成');
});
type UnionId = string
export const usersMap = new Map<ws, UnionId>();
export const clientsMap = new Map<UnionId, ws>();

// 1.客户端先登录，调用websocket连接
wss.on('connection', (socket: ws, request) => {
  // TODO这里需要重制下表的数据
  // clients.set(unionId, client);
  socket.on('message', (msg: string) => {
    onWsRoute(msg, socket);
  });
});

wss.on('close', () => {
  console.log('websocket close');
});

module.exports = wss;
