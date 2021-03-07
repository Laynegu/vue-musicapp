<template>
  <div class="recommend" ref="recommend">
    <scroll :data="discList" class="recommend-content" ref="recommendScroll">
      <div class="scroll-wrapper">
        <!-- 轮播图部分 -->
        <slider v-if="!!this.sliders.length">
          <div
            class="slider-item"
            v-for="(item, index) in sliders"
            :key="index"
          >
            <a :href="item.id">
              <img
                :src="item.cover"
                :alt="item.title"
                @load="imgLoad"
                class="needsclick"
              />
            </a>
          </div>
        </slider>
        <!-- 推荐歌单部分 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul class="list-content">
            <li
              class="list-item"
              v-for="(item, index) in discList"
              :key="index"
            >
              <div class="icon">
                <img v-lazy="item.imgurl" alt="" />
              </div>
              <div class="text">
                <h2 v-html="item.creator.name"></h2>
                <p v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <!-- 加载缓冲页面 -->
        <div class="loadingWrap" v-show="!discList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import { playListMixin } from "@/common/js/mixin";
import Slider from "@/base/slider/slider";
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";

export default {
  mixins: [playListMixin],
  data() {
    return {
      sliders: [],
      discList: [],
      isImgLoad: false,
    };
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  mounted() {},
  methods: {
    handlePlayList(playList) {
      let bottom = playList.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.recommendScroll.refresh();
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.sliders = res.focus.data.shelf.v_niche[0].v_card;
        }
      });
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    imgLoad() {
      // 确保图片已加载完，即时刷新滚动
      if (this.isImgLoad) {
        return;
      }
      this.$refs.recommendScroll.refresh();
      this.isImgLoad = true;
    },
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.recommend {
  position: fixed;
  top: 88rem / @baseSize;
  bottom: 0;
  width: 100%;
  .recommend-content {
    height: 100%;
    overflow: hidden;
  }
}

.slider-item {
  a {
    display: block;
    width: 100%;
    img {
      display: block;
      width: 100%;
    }
  }
}

.list-title {
  width: 100%;
  height: 65rem / @baseSize;
  line-height: 65rem / @baseSize;
  text-align: center;
  font-size: @font-size-medium;
  color: @color-theme;
}

.list-content {
  width: 100%;
  padding: 0 0 1rem / @baseSize;
  .list-item {
    display: flex;
    align-items: center;
    margin: 0 20rem / @baseSize 23rem / @baseSize;
    .icon {
      width: 60rem / @baseSize;
      height: 60rem / @baseSize;
      margin-right: 20rem / @baseSize;
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: @font-size-medium;
      h2 {
        margin-bottom: 15rem / @baseSize;
        color: @color-text;
      }
      p {
        color: @color-text-d;
      }
    }
  }
}

.loadingWrap {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
</style>