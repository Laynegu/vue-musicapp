/*封装jsonp用于跨域请求*/

import _jsonp from 'jsonp';

export function jsonp(url, data, options) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);

  return new Promise((resolve, reject) => {
    _jsonp(url, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

/**拼接参数的方法 */
function param(data) {
  let params = ``;
  for (const key in data) {
    params += `&${key}=${data[key] === undefined ? '' : encodeURIComponent(data[key])}`;
  }
  return params ? params.substr(1) : '';
}
