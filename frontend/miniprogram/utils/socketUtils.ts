export function wsRequest(data: any) {
  return JSON.stringify(data)
}

export function getSocketResponse(rawData: string): {flag: string, props: any} {
  const res = JSON.parse(rawData)
  if (res.status === 0) {
    return {
      flag: res.data.flag,
      props: res.data.props
    }
  }else {
    throw new Error('接口请求错误')
  }
}
