<template>
  <div class="process-bar" ref="processBar">
    <div class="bar-inner" @click="processClick">
      <div class="process" ref="process"></div>
      <div
        class="bar-btn"
        ref="processBtn"
        @touchstart.prevent="processStart"
        @touchmove.prevent="processMove"
        @touchend="processEnd"
      ></div>
    </div>
  </div>
</template>

<script>
import { cssPrefix } from "@/common/js/dom";

const transform = cssPrefix("transform");

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
    barWidth: {
      type: Number,
      default: 240,
    },
    btnWidth: {
      type: Number,
      default: 16,
    },
  },
  computed: {
    processWidth() {
      return this.barWidth - this.btnWidth;
    },
  },
  created() {
    this.touchOpt = {};
  },
  methods: {
    processStart(e) {
      this.touchOpt.init = true;
      this.touchOpt.startX = e.touches[0].pageX;
      this.touchOpt.left = this.$refs.process.offsetWidth;
    },
    processMove(e) {
      if (!this.touchOpt.init) {
        return;
      }
      let delX = e.touches[0].pageX - this.touchOpt.startX;
      let offsetX = Math.min(
        Math.max(this.touchOpt.left + delX, 0),
        this.processWidth
      );
      this._setOffset(offsetX);
      this.$emit("processChangeImmediate", offsetX / this.processWidth);
    },
    processEnd() {
      this.touchOpt.init = false;
      this.onProcessChange();
    },
    processClick(e) {
      const rect = this.$refs.processBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      // let offsetX = Math.min(e.offsetX, this.processWidth);
      // 点击实现进度条的变化
      this._setOffset(offsetWidth);
      this.onProcessChange();
    },
    onProcessChange() {
      // 往外派发进度条事件
      let percent = this.$refs.process.offsetWidth / this.processWidth;
      this.$emit("processChange", percent);
    },
    _setOffset(offsetVal) {
      // 设置进度条及按钮的位移
      this.$refs.process.style.width = `${offsetVal}px`;
      this.$refs.processBtn.style[
        transform
      ] = `translate3d(${offsetVal}px, 0, 0)`;
    },
  },
  watch: {
    percent(curProcess) {
      if (curProcess >= 0 && !this.touchOpt.init) {
        let curWidth = Math.floor(curProcess * this.processWidth);
        this._setOffset(curWidth);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../common/less/variable.less";

.process-bar {
  height: 30rem / @baseSize;
  .bar-inner {
    position: relative;
    top: 13rem / @baseSize;
    height: 4rem / @baseSize;
    background-color: @color-background-d;
    .process {
      position: absolute;
      height: 100%;
      background-color: @color-theme;
    }
    .bar-btn {
      position: absolute;
      top: -6rem / @baseSize;
      left: 0;
      width: 16rem / @baseSize;
      height: 16rem / @baseSize;
      border-radius: 50%;
      background-color: @color-theme;
      border: 3rem / @baseSize solid @color-text;
      box-sizing: border-box;
    }
  }
}
</style>