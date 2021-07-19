import { wsRequest } from '../../../utils/socketUtils'

interface Props {
  amount: number,
  receiveUnionId: string
}

const manBusiness = (props: Props) => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'man_business', props: props}),
  })
}
export default manBusiness
