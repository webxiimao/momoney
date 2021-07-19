import { wsRequest } from '../../../utils/socketUtils'

const bankruptcy = () => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'bankruptcy', props: {}}),
  })
}
export default bankruptcy
