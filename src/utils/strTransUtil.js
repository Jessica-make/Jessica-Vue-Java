// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
      var arg = args[i++];
      if (typeof arg === 'undefined') {
        flag = false;
        return '';
      }
      return arg;
    });
    return flag ? str : '';
  }
  
  // 转换字符串，undefined,null等转化为""
  export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
      return "";
    }
    return str;
  }