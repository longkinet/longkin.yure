const apihelper = {
  //MD5加密
  getMD5: function (str) {
    return hexMD5(str);
  },
  //生成参数(最终调用串) (排序)  传入键对值参数
  SetPms: function (fields) {
    if (fields != undefined && fields != null) {

      apihelper.systemPms = Object.assign(apihelper.systemPms, {
        request_time: apihelper.getDate("yyyyMMddHHmmssfff"),//请求时间
        plat_type: apihelper.getsys_tag(),//操作系统
        partner_id: apihelper.systemConfig.partner_id
      });
      fields = Object.assign(fields, apihelper.systemPms);//合并 参数 对象
      fields = apihelper.objKeySort(fields);//按key排序
      var requestKeyValues = "";
      //组装待加密码串
      for (var item in fields) {
        if (requestKeyValues == "")
          requestKeyValues += item + '=' + fields[item]
        else
          requestKeyValues += '&' + item + '=' + fields[item]
      }
      var encryptStr = apihelper.getMD5(requestKeyValues + apihelper.systemConfig.SECURITYKEY.toLowerCase());//生成加密串
      fields = Object.assign(fields, { sign_type: "md5", sign: encryptStr.toUpperCase() }); //并入 sign信息
      fields = apihelper.objKeySort(fields);//再次按key排序
      var KeyValues = '';
      //生成最终调用串
      for (var item in fields) {
        if (KeyValues == "")
          KeyValues += item.toLowerCase() + '=' + fields[item]
        else
          KeyValues += '&' + item.toLowerCase() + '=' + fields[item]
      }
      return apihelper.systemConfig.posurl + "?" + KeyValues;
    }
    return '';
  },
  //获取 操作系统 1 IOS / 2 ANDROID
  getsys_tag: function () {
    var result = 2;
    wx.getSystemInfo({
      success: function (res) {
        var isIOS = !!res.model.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        result = 1;
      },
    })
    return result;
  },
  //系统参数配置
  systemPms: {
    //request_time:"" apihelper.getDate("yyyyMMddHHmmssfff"),//请求时间
    version: '3.6.5',//版本号
    //sign_type: 'md5',//加密方式  
    format: 'json',//获取返回数据格式
    //  partner_id: apihelper.systemConfig.partner_id
  },
  //API请求配置
  systemConfig: {
    posurl: "https://app.longkin.net",//post API 请求地址
    SECURITYKEY: "longkin123!@#*",//密钥
    partner_id: "17ab7302-6ba9-4c4e-ab48-9ff004951b41",
  },
  //时间格式转换
  getDate: function (str, date) {
    //获取当前时间戳  
    var timestamp = Date.parse(new Date());
    if (date != null && date != undefined && date != '') {
      try {
        timestamp = Date.parse(date);//传入时间
      }
      finally {
      }
    }
    timestamp = timestamp / 1000;
    //console.log("当前时间戳为：" + timestamp);
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear()+'';


    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //时  
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    //分  
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    //秒  
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    //毫秒  
    var mi = date.getMilliseconds();
    if (mi < 10) mi = '00' + mi
    else if (mi < 100) mi = '0' + mi

    //console.log("当前时间：" + Y + M + D + h + ":" + m + ":" + s);
    //年月日时分秒毫秒
    if (str == 'yyyyMMddHHmmssfff')
      //console.info(Y + M + D + h + m + s + mi);
      return Y + M + D + h + m + s + mi;
    //年月日时分秒
    if (str == 'yyyyMMddHHmmss')
      return Y + M + D + h + m + s;
    //年月日时分秒
    if (str == 'yyyy-MM-dd HH:mm:ss')
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    //时分秒
    if (str == 'HHmmss')
      return h + m + s;
    //年月日
    if (str == 'yyyyMMdd')
      return Y + M + D;
    //年月日
    if (str == 'yyyy-MM-dd')
      return Y + '-' + M + '-' + D;
  },
  objKeySort: function (obj) {//排序的函数
    var newkey = Object.keys(obj).sort();
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;//返回排好序的新对象
  },
 
 
  getBody: function (content) {
    var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
    var result = REG_BODY.exec(content);
    if (result && result.length === 2)
      return result[1];
    return content;
  },
  reg: new RegExp(/section/ig),


}


/*  
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message  
 * Digest Algorithm, as defined in RFC 1321.  
 * Version 1.1 Copyright (C) Paul Johnston 1999 - 2002.  
 * Code also contributed by Greg Holt  
 * See http://pajhome.org.uk/site/legal.html for details.  
 */

/*  
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally  
 * to work around bugs in some JS interpreters.  
 */
function safe_add(x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*  
 * Bitwise rotate a 32-bit number to the left.  
 */
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/*  
 * These functions implement the four basic operations the algorithm uses.  
 */
function cmn(q, a, b, x, s, t) {
  return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}
function ff(a, b, c, d, x, s, t) {
  return cmn((b & c) | ((~b) & d), a, b, x, s, t)
}
function gg(a, b, c, d, x, s, t) {
  return cmn((b & d) | (c & (~d)), a, b, x, s, t)
}
function hh(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t)
}
function ii(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*  
 * Calculate the MD5 of an array of little-endian words, producing an array  
 * of little-endian words.  
 */
function coreMD5(x) {
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }
  return [a, b, c, d]
}

/*  
 * Convert an array of little-endian words to a hex string.  
 */
function binl2hex(binarray) {
  var hex_tab = "0123456789abcdef"
  var str = ""
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
  }
  return str
}

/*  
 * Convert an array of little-endian words to a base64 encoded string.  
 */
function binl2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  var str = ""
  for (var i = 0; i < binarray.length * 32; i += 6) {
    str += tab.charAt(((binarray[i >> 5] << (i % 32)) & 0x3F) |
      ((binarray[i >> 5 + 1] >> (32 - i % 32)) & 0x3F))
  }
  return str
}

/*  
 * Convert an 8-bit character string to a sequence of 16-word blocks, stored  
 * as an array, and append appropriate padding for MD4/5 calculation.  
 * If any of the characters are >255, the high byte is silently ignored.  
 */
function str2binl(str) {
  var nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((i % 4) * 8)
  blks[i >> 2] |= 0x80 << ((i % 4) * 8)
  blks[nblk * 16 - 2] = str.length * 8
  return blks
}

/*  
 * Convert a wide-character string to a sequence of 16-word blocks, stored as  
 * an array, and append appropriate padding for MD4/5 calculation.  
 */
function strw2binl(str) {
  var nblk = ((str.length + 4) >> 5) + 1 // number of 16-word blocks    
  var blks = new Array(nblk * 16)
  for (var i = 0; i < nblk * 16; i++) blks[i] = 0
  for (var i = 0; i < str.length; i++)
    blks[i >> 1] |= str.charCodeAt(i) << ((i % 2) * 16)
  blks[i >> 1] |= 0x80 << ((i % 2) * 16)
  blks[nblk * 16 - 2] = str.length * 16
  return blks
}

/*  
 * External interface  
 */
function hexMD5(str) { return binl2hex(coreMD5(str2binl(str))) }
function hexMD5w(str) { return binl2hex(coreMD5(strw2binl(str))) }
function b64MD5(str) { return binl2b64(coreMD5(str2binl(str))) }
function b64MD5w(str) { return binl2b64(coreMD5(strw2binl(str))) }
/* Backward compatibility */
function calcMD5(str) { return binl2hex(coreMD5(str2binl(str))) }



const serverce= {
  m_act_wonderful_list: 'longkin.invest.m_act_wonderful_list',//精彩活动
    m_others_new_detial: "longkin.others.m_others_new_detial",//新闻详情
      m_others_new_list: 'longkin.others.m_others_new_list',//新闻列表
        m_invest_trade_list_index: 'longkin.invest.m_invest_trade_list_index',//首页项目列表
          m_others_getservice_time: 'longkin.others.m_others_getservice_time',
            m_invest_trade_detil: 'longkin.invest.m_invest_trade_detil'
}

module.exports = {
  hexMD5: hexMD5,
  apihelper: apihelper,
  serverce: serverce
}