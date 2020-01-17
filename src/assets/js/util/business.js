/**
 * 获取车辆状态类型
 *
 * @export
 * @param {*} value 车辆状态编码
 * @returns
 */
export function formatterVehicleType(value) {
  if (value == 0) return '空车'
  else if (value == 1) return '重车'
  return ''
}

/**
 * 获取车辆状态类型（element.table专用）
 *
 * @export
 * @param {*} row
 * @param {*} col
 * @param {*} value 在线状态编码
 * @returns
 */
export function formatterTVehicleType(row, col, value) {
  return formatterVehicleType(value)
}
/**
 * 获取在线类型
 *
 * @export
 * @param {*} value 在线状态编码
 * @returns
 */
export function formatterOnlineType(value) {
  if (value == 0) return '在线'
  else if (value == 1) return '离线'
  return ''
}

/**
 * 获取在线类型（element.table专用）
 *
 * @export
 * @param {*} row
 * @param {*} col
 * @param {*} value 车辆状态编码
 * @returns
 */
export function formatterTOnlineType(row, col, value) {
  return formatterOnlineType(value)
}

/**
 * 获取方向类型
 *
 * @export
 * @param {*} value 方向类型编码
 * @returns
 */
export function formatterDirectionType(value) {
  if (value == 0 || value == 360) return '正北'
  else if (value == 90) return '正东'
  else if (value == 180) return '正南'
  else if (value == 270) return '正西'
  else if (value > 0 && value < 90) return '东北'
  else if (value > 90 && value < 180) return '东南'
  else if (value > 180 && value < 270) return '西南'
  else if (value > 270 && value < 360) return '西北'
  return ''
}
/**
 * 获取方向类型（element.table专用）
 *
 * @export
 * @param {*} row
 * @param {*} col
 * @param {*} value 方向类型编码
 * @returns
 */
export function formatterTDirectionType(row, col, value) {
  return formatterDirectionType(value)
}
