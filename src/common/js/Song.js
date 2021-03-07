/**定义歌曲的类 */
import { getLyric } from '../../api/song';
import { ERR_OK } from '../../api/config';

export class Song {
  constructor({ id, mid, singer, album, img, playUrl, duration, name }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.album = album;
    this.img = img;
    this.playUrl = playUrl;
    this.duration = duration;
    this.name = name;
  }

  async getLyrics() {
    if (!this.lyric) {
      // 获取歌词
      try {
        const ret = await getLyric(this.mid);
        if (ret.retcode === ERR_OK) {
          this.lyric = ret.lyric;
        } else {
          return Promise.reject("");
        }
      } catch (error) {
        return Promise.reject("");
      }
    }
    return Promise.resolve(this.lyric);
  }
}

// 处理歌手
function handleSinger(singer) {
  if (!singer)
    return '';
  return singer.map(item => item.name).join('/');
}

/**歌曲工厂 */
export default function createSong(musicData) {
  const { songid, songmid, songname, interval, singer, albumname, albummid } = musicData;
  return new Song({
    id: songid,
    mid: songmid,
    singer: handleSinger(singer),
    album: albumname,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
    playUrl: '',
    duration: interval,
    name: songname
  })
}
