import mongoose, {
  Schema
} from 'mongoose';

export enum UserStatus {
  /** 未在游戏中 */
  NoGame = -1,
  /** 准备中 */
  Preparing = 0,
  /** 游戏进行中 */
  Processing = 1,
  /** 胜出 */
  Winning= 2,
  /** 破产 */
  Bankruptcy = 3
}

const User = new mongoose.Schema({
  username: String,
  unionId: String,
  /** 头像 */
  avatarUrl: String,
  point: Number,
  room: {
    type: Schema.Types.ObjectId,
    ref: 'room'
  },
  status: {
    type: Number,
    default: UserStatus.NoGame
  }
});

export default mongoose.model('user', User);
