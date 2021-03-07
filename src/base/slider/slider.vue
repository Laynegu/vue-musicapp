<template>
  <div class="slider" ref="slider">
    <div class="slider-content" ref="sliderContent">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        v-for="(item, index) in dots"
        :key="index"
        :class="currentPageIndex === index ? 'current' : ''"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "@/common/js/dom";

export default {
  name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
  },
  data() {
    return {
      sliderScroll: null,
      timer: null,
      dots: [],
      sliderItems: [],
      currentPageIndex: 0,
    };
  },
  methods: {
    setSliderWidth(isResize) {
      const viewWidth = this.$refs.slider.clientWidth;
      this.sliderItems = this.$refs.sliderContent.children;
      // 计算content区域的宽度
      let w = 0;
      for (let i = 0; i < this.sliderItems.length; i++) {
        this.sliderItems[i].style.width = viewWidth + "px";
        // 添加类名
        addClass(this.sliderItems[i], "slider-item");
        w += viewWidth;
      }
      // 考虑到循环滚动前后图片的拷贝
      if (this.loop && !isResize) {
        w += 2 * viewWidth;
      }
      this.$refs.sliderContent.style.width = w + "px";
    },
    initScroll() {
      this.sliderScroll = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap ---> slider 组件选项
        snap: {
          loop: true,
          threshold: 0.1,
        },
        stopPropagation: false,
      });

      this.sliderScroll.on("scrollEnd", () => {
        this.currentPageIndex = this.sliderScroll.getCurrentPage().pageX;
        // 判断是否自动播放
        if (this.autoPlay) {
          this.play();
        }
      });

      this.sliderScroll.on("beforeScrollStart", () => {
        // 滚动前先清除定时器
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    play() {
      this.timer = setTimeout(() => {
        this.sliderScroll.next(400);
      }, this.interval);
    },
    initDots() {
      this.dots = new Array(this.sliderItems.length);
    },
  },
  mounted() {
    // 确保dom已经被渲染了
    setTimeout(() => {
      // 设置slider-content宽度
      this.setSliderWidth();
      // 初始化dots
      this.initDots();
      // 初始化滚动
      this.initScroll();
      // 是否自动
      if (this.autoPlay) {
        this.play();
      }
    }, 20);
    // 窗口大小改变时，重新刷新
    window.addEventListener("resize", () => {
      if (!this.sliderScroll) {
        return;
      }
      this.setSliderWidth(true);
      this.sliderScroll.refresh();
    });
    
  },
  activated() {
    if (this.autoPlay) {
      this.play();
    }
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.slider {
  position: relative;
  min-height: 1rem / @baseSize;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .slider-content {
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
    }
  }

  .dots {
    position: absolute;
    box-sizing: border-box;
    bottom: 8rem / @baseSize;
    left: 50%;
    transform: translateX(-50%);

    span {
      display: inline-block;
      vertical-align: middle;
      margin: 0 3rem / @baseSize;
      width: 8rem / @baseSize;
      height: 8rem / @baseSize;
      border-radius: 50%;
      background-color: @color-text-l;
      transition: all 0.2s;

      &[class="current"] {
        width: 16rem / @baseSize;
        border-radius: 5rem / @baseSize;
        background-color: @color-text-ll;
      }
    }
  }
}
</style>