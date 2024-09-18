export const parseQueryParams = `
function parseQueryParams(url) {
  try {
    // 提取查询字符串部分
    const queryString = url.split('?')[1] || '';

    // 分割参数
    const paramsArray = queryString.split('&');
    const result = {};

    // 解析参数
    paramsArray.forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        result[key] = decodeURIComponent(value || ''); // 处理 URL 编码
      }
    });

    return result;
  } catch (error) {
    return {};
  }
};
`

export const validateParams = `
function validateParams(query, body, paramsMap) {
  const paramsError = [];

  paramsMap.queryParams.length &&
    paramsMap.queryParams.forEach((item) => {
      if (item.required && !Object.prototype.hasOwnProperty.call(query, item.name)) {
        paramsError.push('query参数' + item.name + '缺失');
        return; // 如果是必需且不存在，则直接返回，不需要继续检查类型
      }

      if (Object.prototype.hasOwnProperty.call(query, item.name)) {
        const type = getType(query[item.name]);
        if (!item.type.includes(type)) {
          paramsError.push('query参数' + item.name + '类型错误应为' + item.type);
        }
      }
    });

  if (body) {
    if (paramsMap.bodyParamsType === 'array' && getType(body) !== 'array') {
      paramsError.push('body参数类型错误应为数组');
    }

    if (paramsMap.bodyParamsType === 'object') {
      if (getType(body) !== 'object') {
        paramsError.push('body参数类型错误应为object');
      } else {
        paramsMap.bodyParams.length &&
          paramsMap.bodyParams.forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(body, item.name)) {
              const type = getType(body[item.name]);
              if (!item.type.includes(type)) {
                paramsError.push(
                  'body参数' + item.name + '类型错误应为' + item.type,
                );
              }
            } else if (item.required) {
              paramsError.push('body参数' + item.name + '缺失');
            }
          });
      }
    }
  }

  if (paramsError.length) {
    return paramsError.join(';')
  } else {
    return ''
  }
};
`
export const getType = `
function getType(variable) {
  const type = typeof variable;

  switch (type) {
    case 'undefined':
    case 'boolean':
    case 'number':
    case 'string':
    case 'function':
      return type;
    case 'object':
      if (variable === null) {
        return 'null';
      } else if (Array.isArray(variable)) {
        return 'array';
      } else {
        return 'object';
      }
    default:
      return 'unknown';
  }
};
`

export const urlToRegex = `
function urlToRegex(urlPath) {
  const regexStr = new RegExp(urlPath + '.*');
  
  return regexStr;
};
`
