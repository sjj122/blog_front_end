export function dateFormat(date, fmt) { // 传进来一个 yyyy-MM-dd hh:mm:ss  类型字符串
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''   // 变为字符串
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : str.padStart(2, '0'))
    }
  }
  return fmt
}

let timeNumber = 60*60*24

export function dateFormatBefore(d1) {  // d1 存储的时间戳，单位毫秒
  let time = dateFormat(new Date(d1), 'MM-dd hh:mm')

  // 得到今天零点的时间戳，并除以1000，取得秒为单位的时间戳
  let ddZero1 = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000
  let ddZero2 = parseInt(new Date(new Date().setHours(23, 59, 59, 59)).getTime() / 1000)

  let dd1 = parseInt(d1 / 1000), dd2 = parseInt(new Date().getTime() / 1000)
  let result = dd2 - dd1

  if (dd1 > ddZero1 - timeNumber && dd1 < ddZero1) {  // 昨天
    return "昨天"
  } else if (dd1 > ddZero1) {        // 今天之内
    if (result < 60) {
      return '刚刚'
    } else if (result >= 60 && result < 3600) { // 一小时内
      return '前不久'
    } else if (result >= 3600 && result < 3600 * 6) { // 一天内 (1-6个小时)
      return '有一会儿'
    } else  if (result >= 3600 * 6 && result <= ddZero2) { // 今天
      return '今天'
    }
  } else {              // 两天前直接显示日期
    return time
  }
}
