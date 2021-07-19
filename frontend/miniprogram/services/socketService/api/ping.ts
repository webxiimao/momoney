import { wsRequest } from '../../../utils/socketUtils'

const ping = () => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'ping'}),
  })
}
export default ping
