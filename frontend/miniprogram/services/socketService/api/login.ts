import { wsRequest } from '../../../utils/socketUtils'

interface LoginProps {
  username: string
  unionId: string
  roomId?: string
}

const login = (props: LoginProps) => {
  wx.sendSocketMessage({
    data: wsRequest({path: 'login', props: props}),
  })
}
export default login
