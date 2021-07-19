import { wsRequest } from '../../../utils/socketUtils'

interface Props {
  amount: number,
  type: 'add' | 'minus'
}

const bankBusiness = (props: Props) => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'bank_business', props: props}),
  })
}
export default bankBusiness
