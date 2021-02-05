/*
 * @Descripttion:
 * @version:
 * @Author: CFQ
 * @Date: 2020-03-10 09:58:02
 * @LastEditors: CFQ
 * @LastEditTime: 2020-03-17 16:31:53
 */
import _ from 'underscore'

const _toString = Object.prototype.toString

export function hasObject(value) {
  return _toString.call(value) === '[object Object]'
}

export function hasFunction(value) {
  return _toString.call(value) === '[object Function]'
}

export function hasArray(value) {
  return _toString.call(value) === '[object Array]'
}

export function hasString(value) {
  return _toString.call(value) === '[object String]'
}

export function hasNumber(value) {
  return _toString.call(value) === '[object Number]'
}

export function hasBoolean(value) {
  return _toString.call(value) === '[object Boolean]'
}

/**
 * 定义图标类型名
 * @param icon
 * @returns {string|*}
 */
export function iconClassName(icon) {
  if (icon) {
    if (icon.indexOf('el-icon-') === 0) return icon
    else if (icon.indexOf('icon-') === 0) return `iconfont ${icon}`
    else return icon
  }
  return ''
}

/**
 * 前端分页
 *
 * @export
 * @param {*} {
 *   data = [],
 *   pageSize = 10,
 *   currentPage = 1
 * }
 * @returns
 */
export function filterFrontEndPage({
  data = [],
  pageSize = 10,
  currentPage = 1
}) {
  const currentPageIndex = currentPage - 1
  const startPageItem = currentPageIndex * pageSize
  const endPageItem = currentPage * pageSize
  return _.filter(data, (item, index) => {
    return startPageItem <= index && endPageItem > index
  })
}

export function freezeData(data) {
  return Object.freeze(Object.assign([], data))
}

// 方向判断
export function direction(data) {
  let angle = parseInt(data)
  if (angle == 0 || angle == 360) return '正北'
  else if (angle > 0 && angle < 90) return '东北'
  else if (angle == 90) return '正东'
  else if (angle > 90 && angle < 180) return '东南'
  else if (angle == 180) return '正南'
  else if (angle > 180 && angle < 270) return '西南'
  else if (angle == 270) return '正西'
  else if (angle > 270 && angle < 360) return '西北'
  else return ''
}
