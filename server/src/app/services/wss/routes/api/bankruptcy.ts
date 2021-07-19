import bankruptcy from '../../controller/bankruptcy';
export default async function (props: any, client) {
  // 执行start方法
  await bankruptcy(props, client);
}
