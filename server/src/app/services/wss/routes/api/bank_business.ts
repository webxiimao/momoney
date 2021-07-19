// 银行交易
import bankTransaction from '../../controller/bankBusiness';
export default async function (props: any, client) {
  await bankTransaction(props, client);
}
