<template>
  <div class="player" v-show="playList.length > 0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="isFullScreen">
        <div class="background">
          <img :src="currentSong.img" alt="" width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" @click="shrink">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <!-- 歌曲cd部分 -->
          <div class="middle-l" ref="cd">
            <div class="cd-wrap" ref="cdWrap">
              <div class="cd">
                <img :src="currentSong.img" :class="rotateClass" alt="" />
              </div>
            </div>
            <!-- 实时歌词 -->
            <div class="playing-lyrics-wrap">
              <span class="playing-lyric">{{ playingLyric }}</span>
            </div>
          </div>
          <!-- 歌词部分 -->
          <scroll
            class="middle-r"
            :data="currentLyric && currentLyric.lines"
            ref="lyricScroll"
          >
            <div class="lyric-wrap">
              <div v-if="currentLyric">
                <p
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{ current: currentLyricLine === index }"
                  class="text"
                  ref="lyricLine"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrap">
            <div class="dot" :class="isShowLyric ? '' : 'active'"></div>
            <div class="dot" :class="isShowLyric ? 'active' : ''"></div>
          </div>
          <div class="process-wrap">
            <span class="time time-start">{{ format(curSongTime) }}</span>
            <div class="process-bar-wrap">
              <process-bar
                :percent="percent"
                @processChange="changePlayProcess"
                @processChangeImmediate="changeCurSongTime"
              />
            </div>
            <span class="time time-end">{{
              format(currentSong.duration)
            }}</span>
          </div>
          <div class="operator">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changePlayMode"></i>
            </div>
            <div class="icon i-left" :class="disableClass">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disableClass">
              <i :class="playIcon" @click="togglePlaying"></i>
            </div>
            <div class="icon i-right" :class="disableClass">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!isFullScreen" @click="enlarge">
        <div class="icon">
          <div class="img-wrap" ref="imgWrap">
            <img :src="currentSong.img" :class="rotateClass" alt="" />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <process-circle
            :radius="radius"
            :percent="percent"
            class="processCircle"
          >
            <i
              :class="miniPlayIcon"
              class="icon-mini"
              @click.stop="togglePlaying"
              ref="iconMini"
            ></i>
          </process-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.playUrl"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateSongTime"
      @ended="songEnd"
    ></audio>
  </div>
</template>

<script>
import ProcessBar from "@/base/processBar/ProcessBar";
import ProcessCircle from "@/base/processCircle/ProcessCircle";
import Scroll from "@/base/scroll/scroll";
import animations from "create-keyframe-animation";
import Lyrics from "lyric-parser";
import { mapGetters, mapMutations } from "vuex";
import { cssPrefix } from "@/common/js/dom";
import { shuffle } from "@/common/js/util";
import * as types from "@/store/mutation-types";
import * as mode from "@/common/js/config";

const transform = cssPrefix("transform");
const transitionDuration = cssPrefix("transitionDuration");

export default {
  data() {
    return {
      songReady: false,
      curSongTime: 0,
      radius: 30,
      currentLyric: null,
      currentLyricLine: 0,
      playingLyric: "",
      isShowLyric: false,
    };
  },
  components: {
    ProcessBar,
    ProcessCircle,
    Scroll,
  },
  created() {
    // cd和歌词滑动设置
    this.touch = {};
  },
  computed: {
    ...mapGetters([
      "isFullScreen",
      "playList",
      "currentSong",
      "isPlay",
      "currentSongIndex",
      "playMode",
      "sequenceList",
    ]),
    playIcon() {
      return this.isPlay ? "icon-pause" : "icon-play";
    },
    miniPlayIcon() {
      return this.isPlay ? "icon-pause-mini" : "icon-play-mini";
    },
    modeIcon() {
      // 播放模式
      return this.playMode === mode.SEQUENCE_PLAY
        ? "icon-sequence"
        : this.playMode === mode.RANDOM_PLAY
        ? "icon-random"
        : "icon-loop";
    },
    rotateClass() {
      return this.isPlay ? "play" : "play pause";
    },
    disableClass() {
      // 当歌曲未准备播放时，按钮置为灰色
      return this.songReady ? "" : "disable";
    },
    percent() {
      // 当前歌曲进度比例
      return this.curSongTime / this.currentSong.duration;
    },
  },
  methods: {
    shrink() {
      this.setFullScreen(false);
    },
    enlarge() {
      this.setFullScreen(true);
    },
    ...mapMutations({
      setFullScreen: types.SET_FULL_SCREEN,
      setIsPlay: types.SET_PLAY_STATE,
      setCurrentSongIndex: types.SET_CURRENT_SONG_INDEX,
      setPlayMode: types.SET_PLAY_MODE,
      setPlayList: types.SET_PLAY_LIST,
    }),
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });
      animations.runAnimation(this.$refs.cdWrap, "move", done);
    },
    afterEnter() {
      // 移除动画
      animations.unregisterAnimation("move");
      this.$refs.cdWrap.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrap.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrap.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.cdWrap.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrap.style.transition = "";
      this.$refs.cdWrap.style[transform] = "";
    },
    middleTouchStart(e) {
      this.touch.init = true;
      // 用来判断是否是一次移动
      this.touch.moved = false;
      const target = e.touches[0];
      this.touch.startX = target.pageX;
      this.touch.startY = target.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.init) {
        return;
      }
      const target = e.touches[0];
      let delX = target.pageX - this.touch.startX;
      let delY = target.pageY - this.touch.startY;
      if (Math.abs(delX) < Math.abs(delY)) {
        // 视为往上滚动，非水平方向
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      // 设置水平偏移范围
      const offsetX0 = this.isShowLyric ? -window.innerWidth : 0;
      let offsetX = Math.min(0, Math.max(-window.innerWidth, offsetX0 + delX));
      // 偏移百分比
      this.touch.offsetPercent = Math.abs(offsetX / window.innerWidth);
      this.$refs.lyricScroll.$el.style[transitionDuration] = 0;
      this.$refs.lyricScroll.$el.style[
        transform
      ] = `translate3d(${offsetX}px, 0, 0)`;
      this.$refs.cd.style[transitionDuration] = 0;
      this.$refs.cd.style.opacity = 1 - this.touch.offsetPercent;
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return;
      }
      let { offsetPercent } = this.touch;
      let offset, opacity;
      if (this.isShowLyric) {
        if (offsetPercent < 0.9) {
          offset = 0;
          opacity = 1;
          this.isShowLyric = false;
        } else {
          offset = -window.innerWidth;
          opacity = 0;
        }
      } else {
        if (offsetPercent > 0.1) {
          offset = -window.innerWidth;
          opacity = 0;
          this.isShowLyric = true;
        } else {
          offset = 0;
          opacity = 1;
        }
      }
      this.$refs.lyricScroll.$el.style[transitionDuration] = `0.5s`;
      this.$refs.cd.style[transitionDuration] = `0.5s`;
      this.$refs.lyricScroll.$el.style[
        transform
      ] = `translate3d(${offset}px, 0, 0)`;
      this.$refs.cd.style.opacity = opacity;
      this.touch.init = false;
    },
    updateSongTime(e) {
      this.curSongTime = e.target.currentTime;
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setIsPlay(!this.isPlay);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        // 歌曲列表只有一条则单曲循环
        this.loop();
      } else {
        if (this.currentSongIndex === this.playList.length - 1) {
          this.setCurrentSongIndex(0);
        } else {
          this.setCurrentSongIndex(this.currentSongIndex + 1);
        }
        this.setIsPlay(true);
      }
      this.songReady = false;
    },
    prevSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        // 歌曲列表只有一条则单曲循环
        this.loop();
      } else {
        if (this.currentSongIndex === 0) {
          this.setCurrentSongIndex(this.playList.length - 1);
        } else {
          this.setCurrentSongIndex(this.currentSongIndex - 1);
        }
        this.setIsPlay(true);
      }
      this.songReady = false;
    },
    changePlayProcess(percent) {
      let targetTime = percent * this.currentSong.duration;
      this.$refs.audio.currentTime = targetTime;
      if (!this.isPlay) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(targetTime * 1000);
      }
    },
    changeCurSongTime(percent) {
      this.curSongTime = percent * this.currentSong.duration;
    },
    changePlayMode() {
      let nextMode = (this.playMode + 1) % 3;
      this.setPlayMode(nextMode);
      let list = null;
      if (nextMode === mode.RANDOM_PLAY) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      // 保证仍然播放当前歌曲
      this.resetCurSongIndex(list);
      this.setPlayList(list);
    },
    resetCurSongIndex(list) {
      let index = list.findIndex((item) => item.id === this.currentSong.id);
      this.setCurrentSongIndex(index);
    },
    ready() {
      this.songReady = true;
    },
    error() {
      // 既防止快速点击造成dom异常，也能保证错误播放时按钮功能的正常运行
      this.songReady = true;
    },
    songEnd() {
      // 歌曲播放结束根据当前模式实现跳转下一首
      if (this.playMode === mode.CIRCLE_PLAY) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      // 单曲循环
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    async getLyric() {
      // 获取歌词
      const lyric = await this.currentSong.getLyrics();
      if (!lyric) {
        // 获取失败
        this.currentLyric = null;
        this.currentLyricLine = 0;
        this.playingLyric = "";
        return;
      }
      this.currentLyric = new Lyrics(lyric, this.handleLyric);
      if (this.isPlay) {
        this.currentLyric.play();
      }
    },
    handleLyric({ lineNum, txt }) {
      this.currentLyricLine = lineNum;
      this.playingLyric = txt;
      if (lineNum > 5) {
        this.$refs.lyricScroll.scrollToElement(
          this.$refs.lyricLine[lineNum - 5],
          1000
        );
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000);
      }
    },
    _getPosAndScale() {
      // 获取位移相关信息
      const BSAEVAL = this.$refs.imgWrap.offsetWidth;
      const targetWidth = BSAEVAL;
      const paddingLeft = BSAEVAL;
      const paddingBottom = BSAEVAL * 0.75;
      const paddingTop = BSAEVAL * 2;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
    _pad(num, n = 2) {
      // 数字补0位
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    format(time) {
      // 格式化时间
      time = Math.floor(time);
      let minute = Math.floor(time / 60);
      let second = this._pad(time % 60);
      return `${minute}:${second}`;
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
      // 清除上一首歌词
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.currentLyricLine = 0;
        this.playingLyric = "";
      }
      // 防止手机端后台运行时js代码不能执行造成歌曲无法往下播放，所以不用nextTick
      setTimeout(async () => {
        this.$refs.audio.play();
        // 获取歌词
        this.getLyric();
      }, 1000);
    },
    isPlay(playState) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        playState ? audio.play() : audio.pause();
      });
    },
    isFullScreen(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$refs.lyricScroll.refresh();
        }, 20);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../common/less/variable.less";

.player {
  .normal-enter-active,
  .normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  .normal-enter,
  .normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100%, 0);
    }
    .bottom {
      transform: translate3d(0, 100%, 0);
    }
  }
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 130;
    background: @color-background;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.6;
      filter: blur(20px);
      z-index: -5;
    }
    .top {
      position: relative;
      height: 60rem / @baseSize;
      margin-bottom: 25rem / @baseSize;
      .back {
        position: absolute;
        top: 0;
        left: 6rem / @baseSize;
        font-size: @font-size-large-x;
        color: @color-theme;
        transform: rotate(-90deg);
        z-index: 20;
        i {
          display: block;
          padding: 9rem / @baseSize;
        }
      }
      .title {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        width: 70%;
        height: 40rem / @baseSize;
        line-height: 40rem / @baseSize;
        color: @color-text;
        font-size: @font-size-large;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .subtitle {
        position: absolute;
        top: 40rem / @baseSize;
        left: 50%;
        transform: translate3d(-50%, 0, 0);
        font-size: @font-size-medium;
        line-height: 20rem / @baseSize;
        color: @color-text;
      }
    }
    .middle {
      position: absolute;
      top: 80rem / @baseSize;
      bottom: 170rem / @baseSize;
      white-space: nowrap;
      width: 100%;
      text-align: center;
      .middle-l {
        position: relative;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        .cd-wrap {
          width: 80%;
          height: 100%;
          margin: 0 auto;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              vertical-align: middle;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10rem / @baseSize solid @color-border;
            }
            .play {
              animation: rotate 20s linear infinite;
            }
            .pause {
              animation-play-state: paused;
            }
          }
        }
        .playing-lyrics-wrap {
          margin-top: 30rem / @baseSize;
          font-size: @font-size-medium;
          color: @color-text-l;
          overflow: hidden;
          height: 20rem / @baseSize;
          line-height: 20rem / @baseSize;
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrap {
          width: 80%;
          margin: 0 auto;
          text-align: center;
          overflow: hidden;
          .text {
            line-height: 32rem / @baseSize;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
          .current {
            color: @color-text;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      width: 100%;
      bottom: 50rem / @baseSize;
      .dot-wrap {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          margin: 0 4rem / @baseSize;
          width: 8rem / @baseSize;
          height: 8rem / @baseSize;
          border-radius: 50%;
          background-color: @color-text-l;
          &.active {
            width: 20rem / @baseSize;
            border-radius: 5rem / @baseSize;
            background-color: @color-text-ll;
          }
        }
      }
      .process-wrap {
        width: 80%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 10rem / @baseSize 0;
        .time {
          width: 30rem / @baseSize;
          line-height: 30rem / @baseSize;
          color: @color-text;
          font-size: @font-size-small;
        }
        .time-start {
          text-align: left;
        }
        .time-end {
          text-align: right;
        }
        .process-bar-wrap {
          flex: 1;
        }
      }
      .operator {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: @color-theme;
          font-size: @font-size-icon;
          &.disable {
            color: @color-theme-d;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-right {
          text-align: left;
        }
        .i-center {
          font-size: @font-size-icon-large;
          text-align: center;
          padding: 0 20rem / @baseSize;
        }
      }
    }
  }
  .mini-enter-active,
  .mini-leave-active {
    transition: all 0.4s;
  }
  .mini-enter,
  .mini-leave-to {
    opacity: 0;
  }
  .mini-player {
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: @color-highlight-background;
    z-index: 130;
    .icon {
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .img-wrap {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        img {
          vertical-align: middle;
        }
        .play {
          animation: rotate 20s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 20px;
      overflow: hidden;
      .name,
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .name {
        margin-bottom: 2px;
        font-size: @font-size-medium;
        color: @color-text;
      }
      .desc {
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
    .control {
      width: 30px;
      padding: 0 10px;
      font-size: @font-size-icon;
      .processCircle {
        margin-top: 6px;
      }
      .icon-mini {
        position: absolute;
        top: 0;
        left: 0;
        color: @color-theme-d;
      }
      .icon-playlist {
        color: @color-theme;
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>