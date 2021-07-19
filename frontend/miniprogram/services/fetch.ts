// import Wx from "types/wx/index"
// 请求库
interface Options {
  url: string,
  data: any,
  [key: string]: any
}

export const BaseUrl = "http://172.20.10.3:9000"
export const WsUrl = "ws://172.20.10.3:8888"

const fetch = (options: Options) => {
  const { url, data, method } = options
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method,
      complete(res: any){
        const data = res.data
        if (data.status !== 0) {
          reject(data)
        } else {
          resolve(data)
        }
      }
    })
  })
}

export const get = async (url: string, data: any) => {
  return await fetch({ url, data, method: "GET" })
}

export const post = async (url: string, data: any) => {
  return await fetch({ url, data, method: "POST" })
}
