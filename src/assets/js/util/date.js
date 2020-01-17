import moment from 'moment'
/**
 * 设置时间格式
 * 如果date值是空的不做处理
 *
 * @export
 * @param {*} date 需要设置的时间
 * @param {*} format 需要设置的格式
 * @returns 返回自定义格式的时间
 */
export function setDateTime(date, format) {
  return (date && moment(date).format(format)) || ''
}
/**
 * 设置日期加时间的格式
 *
 * @export
 * @param {*} value 需要设置的时间
 * @returns 返回这个'YYYY-MM-DD HH:mm:ss'格式的时间
 */
export function formatterDateTime(value) {
  return setDateTime(value, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 设置日期加时间的格式（element.table专用）
 *
 * @export
 * @param {*} row
 * @param {*} col
 * @param {*} value 需要设置的时间
 * @returns
 */
export function formatterTDateTime(row, col, value) {
  return formatterDateTime(value)
}
