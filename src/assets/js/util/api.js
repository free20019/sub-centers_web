import { Message } from 'element-ui'
// export const baseURL = process.env.NODE_ENV !== 'production' ? '/api/' : ''
export const baseURL = 'http://192.168.11.237:8086/subcenters/'

/**
 * 返回API接口的状态类型
 *
 * @export
 * @param {*} code
 * @param {*} type
 * @param {*} cb
 */
export function apiReturnType(code, type, cb) {
  if (code > 0) {
    Message.success(`${type}成功`)
    if (typeof cb === 'function') cb()
  } else if (type === '删除') {
    if (code === -3) Message.warning(`无法${type}（别的表用到该条数据）`)
    else Message.error(`${type}失败`)
  } else if (code === 0) Message.error(`${type}失败`)
  else if (code === -1) Message.warning(`${type}失败，数据已存在`)
}
