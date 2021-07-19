// 心跳检测
import ping from '../../controller/ping';
export default async function (props: any, client) {
  await ping(props, client);
}
