import { MockApi } from '@/api/interface/index'

export const setOptions = `
// set options
function setOptions(options) {
  const parseList = options.url.split("?");

  return {
    url: parseList[0],
    query: parseList.length >= 1 ? {} : parseList[1].split("&").reduce((result, param) => {
      const [key, value] = param.split("=");
      if (key) {
        try {
          result[decodeURIComponent(key)] = decodeURIComponent(value || "");
        } catch {
          // 处理解码错误
          result[decodeURIComponent(key)] = null;
        }
      }
      return result;
    }, {}),
    body: options.body ? JSON.parse(options.body) : {}
  };
}
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
  const regexStr = new RegExp("^" + baseUrl + urlPath + ".*");
  return regexStr;
}
`

// 提取字符串中的 @LMFunc 注解内容
function extractLMFunc(mockRule: string) {
  const results = []
  const regex = /@LMFunc\(\s*/g // 匹配 @LMFunc( 开头

  let match
  while ((match = regex.exec(mockRule)) !== null) {
    const startIndex = match.index // 找到开头位置
    let stack = 1 // 初始化栈，表示找到的 '(' 数量
    let endIndex = startIndex + match[0].length // 从开头继续查找

    while (endIndex < mockRule.length && stack > 0) {
      if (mockRule[endIndex] === '(') {
        stack++ // 遇到 '(' 栈加一
      } else if (mockRule[endIndex] === ')') {
        stack-- // 遇到 ')' 栈减一
      }
      endIndex++
    }

    if (stack === 0) {
      // 如果栈为零，说明括号是闭合的
      results.push(mockRule.slice(startIndex, endIndex)) // 提取完整的 @LMFunc() 内容
    }
  }

  return results
}

// 处理mockRule函数部分
export function handleMockRuleFuncPart(mockRule: string) {
  const results = extractLMFunc(mockRule) // 提取 @LMFunc() 调用
  if (results.length === 0) return mockRule

  let modifiedRule = mockRule

  // 遍历每个函数调用并直接替换
  results.forEach((funcCall) => {
    // let returnValue; // 处理函数调用
    let code: string = ''
    try {
      code = `
      () => { 
      `
      funcCall
        .slice(8, -1)
        .trim()
        .split('\\n')
        .forEach((item) => {
          code += `
        ${item.trim()}

        `
        })
      code += `
       }
      `
    } catch (error) {
      code = `"LMFunc error"` // 或者根据需要返回其他值
    }
    // 全局找 funcCall
    // eslint-disable-next-line
    const regex = new RegExp(`"${funcCall}"`.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1'), 'g')
    modifiedRule = modifiedRule.replace(regex, code) // 替换原始字符串
  })

  return modifiedRule
}

// 转mockjs
export function list2mockjs(list: MockApi.ResApiDetail[], setParamsValidate: boolean, baseUrl: string) {
  let basicContent = `
  import Mock from 'mockjs'
  const baseUrl = '${baseUrl}'
  `
  list.forEach((item) => {
    if (!item.mockRule) return
    if (setParamsValidate && item.paramsCheckOn === 1 && item.params) {
      basicContent += `
      // ${item.description}
      Mock.mock(urlToRegex('${item.url}'), '${item.method.toLowerCase()}', (options) => {
         options = setOptions(options) 
         const params = ${item.params}
         const validateRes = validateParams(options.query, options.body, params)
        if(validateRes) {
          return {
            "code": 400,
            "message": "fail",
            "data": validateRes
          }
        }

        return Mock.mock(${handleMockRuleFuncPart(item.mockRule)})
      });`
    } else {
      basicContent += `
      // ${item.description}
      Mock.mock(urlToRegex('${item.url}'), '${item.method.toLowerCase()}', (options) => {
          options = setOptions(options)

          return Mock.mock(${handleMockRuleFuncPart(item.mockRule)}) 
        }
      );
      `
    }
  })

  if (setParamsValidate) {
    basicContent += `
    /***************** Utility Functions ******************/`
    basicContent += validateParams
    basicContent += getType
  }
  basicContent += setOptions
  basicContent += urlToRegex

  return basicContent
}
