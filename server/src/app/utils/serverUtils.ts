import ErrorCode from '../configs/errorCode';
import { wsEncode } from './wssUtils';

export const httpResponse = (data: any, msg = 'success', code: ErrorCode = ErrorCode.SUCCESS) => ({
    status: code,
    msg,
    data
  });

export const wsResponse = (flag: string, data: any, msg = 'success', code: ErrorCode = ErrorCode.SUCCESS) => (wsEncode({
  status: code,
  msg,
  data: {
    flag,
    props: data
  }
}));
