import start from '../../controller/start';
export default async function (props: any, client) {
  // 执行start方法
  await start(props, client);
}
