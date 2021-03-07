<template>
  <div class="music-list" ref="musicList">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title" ref="title"></h1>
    <div
      class="bg-image"
      :style="{ backgroundImage: `url(${bgImg})` }"
      ref="bgImage"
    >
      <!-- 播放按钮 -->
      <div
        class="play-wrap"
        ref="playWrap"
        v-show="songs.length > 0"
        @click="randomPlaySong"
      >
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 设置滚动层 -->
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      :data="songs"
      class="list"
      ref="songList"
      @scroll="scroll"
      :probeType="probeType"
    >
      <div class="song-list-wrap">
        <song-list :songs="songs" @select="playSong"></song-list>
      </div>
      <!-- loading 组件 -->
      <div class="loadingWrap" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from "@/base/songList/SongList";
import Scroll from "@/base/scroll/scroll";
import { cssPrefix } from "@/common/js/dom";
import { playListMixin } from "@/common/js/mixin";
import Loading from "@/base/loading/loading";
import { mapActions } from "vuex";

// css兼容性处理
const transform = cssPrefix("transform");
const backdrop = cssPrefix("backdrop-filter");

export default {
  mixins: [playListMixin],
  props: {
    bgImg: {
      default: "",
      type: String,
    },
    title: {
      default: "",
      type: String,
    },
    songs: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      scrollY: 0,
    };
  },
  methods: {
    handlePlayList(playList) {
      let bottom = playList.length > 0? '60px' : '';
      this.$refs.songList.$el.style.bottom = bottom;
      this.$refs.songList.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    playSong(song, index) {
      this.play({
        songs: this.songs,
        index,
      });
    },
    randomPlaySong() {
      this.randomPlay({
        songs: this.songs,
      });
    },
    ...mapActions(["play", "randomPlay"]),
  },
  watch: {
    scrollY(newVal) {
      let curPos = Math.max(newVal, this.targetPos);
      let zIndex = `0`;
      let scale = 1;
      let blur = 0;
      // 滚动层随列表滚动而变化
      this.$refs.bgLayer.style[transform] = `translate3d(0, ${curPos}px, 0)`;
      const precent = Math.abs(newVal / this.imgHeight);
      // 下拉图片缩放处理
      if (newVal > 0) {
        scale = 1 + precent;
        zIndex = `5`;
      } else {
        // 往上推实现高斯模糊
        blur = Math.min(20 * precent, 20);
      }
      this.$refs.filter.style[backdrop] = `blur(${blur})`;
      // 滚动到顶的处理
      if (newVal <= this.targetPos) {
        zIndex = `5`;
        this.$refs.bgImage.style.paddingTop = `0`;
        this.$refs.bgImage.style.height = `${this.RESERVED_HEIGHT}px`;
        // 让播放按钮隐藏
        this.$refs.playWrap.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = `0`;
        // 让播放按钮显示
        this.$refs.playWrap.style.display = "block";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
    },
  },
  components: {
    SongList,
    Scroll,
    Loading,
  },
  created() {
    this.probeType = 3;
  },
  mounted() {
    // 滚动层预留高度
    this.RESERVED_HEIGHT = this.$refs.title.offsetHeight;
    // 图片高度
    this.imgHeight = this.$refs.bgImage.clientHeight;
    // 滚动层最终的滚动距离
    this.targetPos = -this.imgHeight + this.RESERVED_HEIGHT;
    this.$refs.songList.$el.style.top = `${this.imgHeight}px`;
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.music-list {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background-color: @color-background;
  .back {
    position: absolute;
    padding: 10rem / @baseSize;
    top: 0;
    left: 6rem / @baseSize;
    color: @color-theme;
    font-size: @font-size-large-x;
    z-index: 10;
  }
  .title {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    width: 300rem / @baseSize;
    height: 40rem / @baseSize;
    font-size: @font-size-large;
    text-align: center;
    line-height: 40rem / @baseSize;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    z-index: 10;
  }
  .bg-image {
    position: relative;
    transform-origin: top;
    width: 100%;
    height: 0;
    padding-top: 70%;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: @color-background-filter;
    }
    .play-wrap {
      position: absolute;
      bottom: 20rem / @baseSize;
      z-index: 20;
      width: 100%;
      .play {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 135rem / @baseSize;
        height: 32rem / @baseSize;
        border: 1rem / @baseSize solid @color-theme;
        border-radius: 100rem / @baseSize;
        color: @color-theme;
        font-size: @font-size-small;
        .icon-play {
          font-size: @font-size-medium-x;
          margin-right: 6rem / @baseSize;
        }
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: @color-background;
  }
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: @color-background;
    .song-list-wrap {
      padding: 20rem / @baseSize 30rem / @baseSize;
    }
  }
  .loadingWrap {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
    z-index: 100;
  }
}
</style>