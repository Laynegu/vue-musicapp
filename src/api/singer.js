/**歌手列表页面相关的api */

import { jsonp } from '@/common/js/jsonp';
import { commonParams } from './config';

// 获取歌手列表
export function getSingerList() {
  const url = 'http://localhost:3000/api/getSingerList';
  const data = Object.assign({}, commonParams, {
    g_tk: 1928093487,
    format: 'jsonp',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1
  })

  return jsonp(url, data, { param: 'callback' });
}

// 获取歌手歌曲详情列表
export function getSingerDetail(singerId) {
  const url = 'http://localhost:3000/api/getSingerDetail';
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, { param: 'callback' })
}

// 获取歌曲播放地址
export function getPlayAddress(songmid) {
  const url = 'http://localhost:3000/api/getPlayAddress';
  const params = {
    req_0: {
      module: "vkey.GetVkeyServer",
      method: "CgiGetVkey",
      param: {
        guid: "358840384",
        songmid,
        songtype: [0],
        uin: "1443481947",
        loginflag: 1,
        platform: "20"
      }
    },
    comm: {
      uin: "18585073516",
      format: "json",
      ct: 24,
      cv: 0
    }
  }
  const data = Object.assign({}, {
    format: 'json',
    data: JSON.stringify(params)
  })

  return jsonp(url, data, { param: 'callback' });
}
