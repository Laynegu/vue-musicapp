/**推荐页面相关的api */

import { jsonp } from '@/common/js/jsonp';
import { commonParams } from './config';

export function getRecommend() {
  const url = 'http://localhost:3000/api/getTopBanner';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq.json',
    sign: 'zzaay6iwzg5wtpneff15c4441255ee9ef959d8dacccc3f88',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    data: JSON.stringify({
      "comm": { "ct": 24 },
      "category": { "method": "get_hot_category", "param": { "qq": "" }, "module": "music.web_category_svr" },
      "recomPlaylist": { "method": "get_hot_recommend", "param": { "async": 1, "cmd": 2 }, "module": "playlist.HotRecommendServer" },
      "playlist": { "method": "get_playlist_by_category", "param": { "id": 8, "curPage": 1, "size": 40, "order": 5, "titleid": 8 }, "module": "playlist.PlayListPlazaServer" },
      "new_song": { "module": "newsong.NewSongServer", "method": "get_new_song_info", "param": { "type": 5 } },
      "new_album": { "module": "newalbum.NewAlbumServer", "method": "get_new_album_info", "param": { "area": 1, "sin": 0, "num": 20 } },
      "new_album_tag": { "module": "newalbum.NewAlbumServer", "method": "get_new_album_area", "param": {} },
      "toplist": { "module": "musicToplist.ToplistInfoServer", "method": "GetAll", "param": {} },
      "focus": { "module": "music.musicHall.MusicHallPlatform", "method": "GetFocus", "param": {} }
    })
  })

  return jsonp(url, data, { param: 'callback' });
}

export function getDiscList() {
  const url = 'http://localhost:3000/api/getDiscList';
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  })

  return jsonp(url, data, { param: 'callback' });
}