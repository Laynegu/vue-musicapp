/**定义歌手的类 */
export default class Singer {
  
  constructor(id, name, mid) {
    this.id = id;
    this.name = name;
    this.imgUrl = this.getImgUrl(mid);
    this.mid = mid;
  }

  // 拼接图片路径
  getImgUrl(param) {
    return `https://y.gtimg.cn/music/photo_new/T001R300x300M000${param}.jpg?max_age=2592000`;
  }
}
