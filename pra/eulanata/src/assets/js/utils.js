//主要把Wed Jun 09 2021 11:51:01 GMT+0800 (中国标准时间) 转换成 2021-06-09，时分秒一般不必
// 用法
// curDate = dateFormat('YYYY-mm-dd HH:MM:SS', curDate)
export function dateFormat (fmt, date) {
    let ret;
    const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        }
    }
    return fmt
}

//主要用于给隔壁的currentDate赋值
//用法 dateFormat2(dateFormat('YYYY-mm-dd', new Date()))
export function dateFormat2 (val) {
    let arr = val.split('-');
    console.log(arr);
    let newArr = [];
    arr.forEach((item) => {
        if(item.length === 2) {
            if (item.indexOf('0') === 0 ){
                newArr.push(item.slice(1))
                return
            }
        }
        newArr.push(item)
    })
    console.log(newArr)
    //月份得减1, 天数得根据是start还是end + - 1的，但是判断条件太复杂，就直接当天了
    //return 的是一个new Date()，为了迎合data里currentDate的格式
    return new Date(newArr[0],newArr[1] - 1,newArr[2] + 1)
}

// val: 2021 06-06  转成shijianchuo
export function timestamp (val) {
    return new Date(val).getTime()
}

//解析url的query字符串
//console.log(decodeurl('www.fnif.com?name=wawa&age=10&sex=男&id=100'))
export function decodeurl(url){
    var params = [], h,obj = {};
    var hash = url.slice(url.indexOf("?") + 1).split('&'); //将变量放在数组里面，形如[fr=iks,word=slice,ie=gbk]
    for(var i = 0; i<hash.length; i++) {
    h = hash[i].split("=");                             //形如[fr,iks]
    params[h[0]] = h[1];
    // params.h[0] = h[1]
    obj = {...params}
    }
    return obj;
}

//特定的获得某个属性  好像没卵用
// export function getUrlParam(name) {
//     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
//     let url = window.location.href.split('#')[0]
//     let search = url.split('?')[1]
//     if (search) {
//       var r = search.substr(0).match(reg)
//       if (r !== null)
//         return unescape(r[2])
//       return null
//     } else
//       return null
//   }

// export function getUrlParam(name) {
//     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if (r != null) return unescape(r[2]); return null;
// }

// 获取 localStorage
export function getLocal(key) {
    return window.localStorage.getItem(key)
}
// 设置 localStorage
export function setLocal(key, value) {
    return window.localStorage.setItem(key, value)
}
// // 删除 localStorage
// export function removeStorage(key) {
// return Cookies.remove(key)
// }

// 获取 sessionStorage
export function getStorage(key) {
    return window.sessionStorage.getItem(key)
  }
// 设置 sessionStorage
export function setStorage(key, value) {
    return window.sessionStorage.setItem(key, value)
}


//2021-06-27T00:00:00 这种值变成2021-06-27,T切割不稳，万一以后不是T呢
export function date(date) {
    if(date != undefined) {
        return date.slice(0,10)
    }
    // return date.split('T')[0]
}

//2020年最新的手机号检测
export function checkMobile(num) {
    let reg = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    return reg.test(num);
}

//把url后面的参数转成obj
export function transformObj(url) {
    let a = url.split('?')[1]
    let b = a.split('&')
    let obj = {}
    for (let i in b) {
        let c = b[i].split('=')
        obj[c[0]] = c[1]
    }
    console.log(obj)
}
// export function transformObj(url) {
//     let a = url.split('?')[1]
//     return a.split('=')[1]
// }

// export function getUrlParam(val) {
//     var reg = new RegExp('(^|&)' + val + '=([^&]*)(&|$)')
//     var r = window.location.search.substr(1).match(reg)
//     if(r != null) return unescape(r[2])
//     return null
// }