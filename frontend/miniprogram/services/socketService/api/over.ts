import { wsRequest } from '../../../utils/socketUtils'

const over = () => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'game_over', props: {}}),
  })
}
export default over
