// 银行交易
import manBussiness from '../../controller/manBussiness';
export default async function (props: any, client) {
  await manBussiness(props, client);
}
