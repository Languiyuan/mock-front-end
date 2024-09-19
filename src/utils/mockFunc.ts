export const parseQueryParams = `
// query参数解析
function parseQueryParams(url) {
  const queryString = url.split('?')[1] || '';
  return queryString.split('&').reduce((result, param) => {
    const [key, value] = param.split('=');
    if (key) {
      try {
        result[decodeURIComponent(key)] = decodeURIComponent(value || '');
      } catch {
        // 处理解码错误
        result[decodeURIComponent(key)] = null;
      }
    }
    return result;
  }, {});
};
`

export const validateParams = `
// 参数校验
function validateParams(query, body, paramsMap) {
  const paramsError = [];

  const checkParams = (params, source, paramType) => {
    params.forEach(item => {
      const exists = Object.prototype.hasOwnProperty.call(source, item.name);
      
      if (item.required && !exists) {
        paramsError.push(paramType + '参数' + item.name + '缺失');
      } else if (exists) {
        const type = getType(source[item.name]);
        if (!item.type.includes(type)) {
          paramsError.push(paramType + '参数' + item.name + '类型错误应为' + item.type);
        }
      }
    });
  };

  // 验证query参数
  if (paramsMap.queryParams.length) {
    checkParams(paramsMap.queryParams, query, 'query');
  }

  // 验证body参数
  if (body) {
    if (paramsMap.bodyParamsType === 'array' && getType(body) !== 'array') {
      paramsError.push('body参数类型错误应为数组');
    } else if (paramsMap.bodyParamsType === 'object') {
      if (getType(body) !== 'object') {
        paramsError.push('body参数类型错误应为object');
      } else {
        if (paramsMap.bodyParams.length) {
          checkParams(paramsMap.bodyParams, body, 'body');
        }
      }
    }
  }

  return paramsError.length ? paramsError.join(';') : '';
}
`
export const getType = `
// 类型判断
function getType(variable) {
  if (variable === null) return 'null';
  if (Array.isArray(variable)) return 'array';
  return typeof variable;
};
`

export const urlToRegex = `
// mock路径匹配
function urlToRegex(urlPath) {
  const regexStr = new RegExp(urlPath + '.*');
  return regexStr;
};
`
