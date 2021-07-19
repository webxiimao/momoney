import { wsRequest } from '../../../utils/socketUtils'

interface StartProps {
  roomId: string
}

const start = (props: StartProps) => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'game_start', props: props}),
  })
}
export default start
