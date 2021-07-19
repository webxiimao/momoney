import { AppServer } from './app/app';
import onerror from 'koa-onerror';
// import mongod from './app/services/mongod';
const appServer = new AppServer();
const cors = require('koa2-cors');
// 创建websocket连接
require('./app/services/wss');
// require('./app/services/mongod');
// 连接mongodb
import connectDb from './app/services/mongoose';
connectDb();
function normalizePort(val) {
  const _port = parseInt(val, 10);
  if (isNaN(_port)) {
    return val;
  }
  if (_port >= 0) {
    return _port;
  }
  return false;
}

const port = normalizePort(process.env.PORT || '9000');
console.log('port', port);

/**
 * 由于原生的koa的context.onerror不够全面,
 * 因此这里重写context.onerror
 */
onerror(appServer);

// 跨域处理
appServer.use(cors({
  origin(ctx) {
      if (ctx.url === '/test') {
          return '*'; // 允许来自所有域名请求
      }
      return 'http://127.0.0.1:5500';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

/**
 * 由于 Koa extends EventEmitter,因此这里监听全局EventEmitter的error事件,
 * 可以通过ctx.app.emit('error', err)触发事件
 */
appServer.on('error', (err) => {
  if (!err.expose) {
    // eslint-disable-next-line no-console
    console.log(`error: ${err.message} \n stack: ${err.stack} \n`);
  }
});

// 捕获未被处理的promise rejection
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log(`unhandledRejection: ${err['message']}, stack: ${err['stack']}`);
});

// 捕获未被处理的异常
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(`uncaughtException: ${err.message}, stack: ${err.stack}`);
});

const server = appServer.listen(port);

server.on('listening', function () {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  // eslint-disable-next-line no-console
  console.log(`Listening on ${bind}`);
});
