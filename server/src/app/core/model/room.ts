import mongoose from 'mongoose';

export enum GameStatus {
  Preparing = 0,
  Processing = 1,
  Success= 2
}

const Room = new mongoose.Schema({
  // 状态
  gameStatus: { type: Number, default: GameStatus.Preparing },
  // 用户
  users: [String],
  // 房主
  owner: String,
  // 日志
  logs: [String],
  winning: String
});

export default mongoose.model('room', Room);
