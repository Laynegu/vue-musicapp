/**获取歌词内容 */

import { jsonp } from '@/common/js/jsonp';
import { commonParams } from './config';

export function getLyric(songmid) {
  const url = 'http://localhost:3000/api/getLyric';
  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    songmid
  })

  return jsonp(url, data, { param: 'callback' });
}