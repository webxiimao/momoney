// 传输websocket数据
export const wsEncode = (data: any) => JSON.stringify(data);

// 接收websocket数据
export const wsDecode = (msg: string) => JSON.parse(msg);
