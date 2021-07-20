let patterns = {
    PATTERN_ERA: 'G', // Era 标志符 Era strings. For example: "AD" and "BC"
    PATTERN_YEAR: 'y', // 年
    PATTERN_MONTH: 'M', // 月份
    PATTERN_DAY_OF_MONTH: 'd', // 月份的天数
    PATTERN_HOUR_OF_DAY1: 'k', // 一天中的小时数（1-24）
    PATTERN_HOUR_OF_DAY0: 'H', // 24小时制，一天中的小时数（0-23）
    PATTERN_MINUTE: 'm', // 小时中的分钟数
    PATTERN_SECOND: 's', // 秒
    PATTERN_MILLISECOND: 'S', // 毫秒
    PATTERN_DAY_OF_WEEK: 'E', // 一周中对应的星期，如星期一，周一
    PATTERN_DAY_OF_YEAR: 'D', // 一年中的第几天
    PATTERN_DAY_OF_WEEK_IN_MONTH: 'F', // 一月中的第几个星期(会把这个月总共过的天数除以7,不够准确，推荐用W)
    PATTERN_WEEK_OF_YEAR: 'w', // 一年中的第几个星期
    PATTERN_WEEK_OF_MONTH: 'W', // 一月中的第几星期(会根据实际情况来算)
    PATTERN_AM_PM: 'a', // 上下午标识
    PATTERN_HOUR1: 'h', // 12小时制 ，am/pm 中的小时数（1-12）
    PATTERN_HOUR0: 'K', // 和h类型
    PATTERN_ZONE_NAME: 'z', // 时区名
    PATTERN_ZONE_VALUE: 'Z', // 时区值
    PATTERN_WEEK_YEAR: 'Y', // 和y类型
    PATTERN_ISO_DAY_OF_WEEK: 'u',
    PATTERN_ISO_ZONE: 'X'
}

let week = {
    ch: {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d'
    },
    en: {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
    }
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function dayOfTheYear(date) {
    let obj = new Date(date)
    let year = obj.getFullYear()
    let month = obj.getMonth() // 从0开始
    let days = obj.getDate()
    let daysArr = [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ]
    for (let i = 0; i < month; i++) {
        days += daysArr[i]
    }
    return days
}

function getZoneNameValue(dateObj) {
    var date = new Date(dateObj)
    date = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    var arr = date.toString().match(/([A-Z]+)([-+]\d+:?\d+)/)
    var obj = {
        name: arr[1],
        value: arr[2]
    }
    return obj
}

function dateFormat(dateTime, pattern) {
    if (dateTime) {
        let date = null
        if (dateTime instanceof Date) {
            date = dateTime
        } else if (typeof dateTime === 'string') {
            date = new Date(dateTime)
        }
        if (!pattern) {
            return date.toLocaleString()
        }
        return pattern.replace(/([a-z])\1*/gi, function (matchStr, group1) {
            let replacement = ''
            var days = date.getDate()
            switch (group1) {
                case patterns.PATTERN_ERA: // G
                    break
                case patterns.PATTERN_WEEK_YEAR: // Y
                case patterns.PATTERN_YEAR: // y
                    replacement = date.getFullYear()
                    break
                case patterns.PATTERN_MONTH: // M
                    var month = date.getMonth() + 1
                    replacement = month < 10 && matchStr.length >= 2 ? '0' + month : month
                    break
                case patterns.PATTERN_DAY_OF_MONTH: // d
                    replacement = days < 10 && matchStr.length >= 2 ? '0' + days : days
                    break
                case patterns.PATTERN_HOUR_OF_DAY1: // k(1~24)
                    replacement = date.getHours()
                    break
                case patterns.PATTERN_HOUR_OF_DAY0: // H(0~23)
                    var hours24 = date.getHours()
                    replacement = hours24 < 10 && matchStr.length >= 2 ? '0' + hours24 : hours24
                    break
                case patterns.PATTERN_MINUTE: // m
                    var minutes = date.getMinutes()
                    replacement = (minutes < 10 && matchStr.length >= 2 ? '0' + minutes : minutes)
                    break
                case patterns.PATTERN_SECOND: // s
                    var seconds = date.getSeconds()
                    replacement = seconds < 10 && matchStr.length >= 2 ? '0' + seconds : seconds
                    break
                case patterns.PATTERN_MILLISECOND: // S
                    var milliSeconds = date.getMilliseconds()
                    replacement = milliSeconds
                    break
                case patterns.PATTERN_DAY_OF_WEEK: // E
                    var day = date.getDay()
                    replacement = week['ch'][day]
                    break
                case patterns.PATTERN_DAY_OF_YEAR: // D
                    replacement = dayOfTheYear(date)
                    break
                case patterns.PATTERN_DAY_OF_WEEK_IN_MONTH: // F

                    replacement = Math.floor(days / 7)
                    break
                case patterns.PATTERN_WEEK_OF_YEAR: // w
                    replacement = Math.ceil(dayOfTheYear(date) / 7)
                    break
                case patterns.PATTERN_WEEK_OF_MONTH: // W
                    replacement = Math.ceil(date.getDate() / 7)
                    break
                case patterns.PATTERN_AM_PM: // a
                    replacement = date.getHours() < 12 ? '\u4e0a\u5348' : '\u4e0b\u5348'
                    break
                case patterns.PATTERN_HOUR1: // h(1~12)
                    var hours12 = date.getHours() % 12 || 12 // 0转为12
                    replacement =
                        hours12 < 10 && matchStr.length >= 2 ? '0' + hours12 : hours12
                    break
                case patterns.PATTERN_HOUR0: // K(0~11)
                    replacement = date.getHours() % 12
                    break
                case patterns.PATTERN_ZONE_NAME: // z
                    replacement = getZoneNameValue(date)['name']
                    break
                case patterns.PATTERN_ZONE_VALUE: // Z
                    replacement = getZoneNameValue(date)['value']
                    break
                case patterns.PATTERN_ISO_DAY_OF_WEEK: // u
                    break
                case patterns.PATTERN_ISO_ZONE: // X
                    break
                default:
                    replacement = group1
                    break
            }
            return replacement
        })
    } else {
        return ''
    }
}

function getZoneDate(dateStr, timezone = 8) {
    const date = new Date(dateStr)
    const offset_GMT = date.getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const nowDate = date.getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(
        nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    )
    return targetDate
}

export {isLeapYear, getZoneDate, dateFormat}
