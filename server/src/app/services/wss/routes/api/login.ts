import login from '../../controller/login';
export default async function (props: any, client) {
  await login(props, client);
}
