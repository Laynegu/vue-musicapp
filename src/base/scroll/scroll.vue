<template>
  <div ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "scroll",
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      scrolls: null,
    };
  },
  mounted() {
    // dom在页面中渲染后进行初始化滚动
    setTimeout(() => {
      this.initScroll();
    }, 20);
  },
  methods: {
    initScroll() {
      if (!this.$refs.scrollWrapper) {
        return;
      }
      this.scrolls = new BScroll(this.$refs.scrollWrapper, {
        probeType: this.probeType,
        click: this.click,
      });
      // 监听滚动事件
      let that = this;
      this.scrolls.on("scroll", (pos) => {
        that.$emit("scroll", pos);
      });
    },
    // 方法代理
    enable() {
      this.scrolls && this.scrolls.enable();
    },
    disable() {
      this.scrolls && this.scrolls.disable();
    },
    refresh() {
      this.scrolls && this.scrolls.refresh();
    },
    scrollTo() {
      this.scrolls && this.scrolls.scrollTo.apply(this.scrolls, arguments);
    },
    scrollToElement() {
      this.scrolls &&
        this.scrolls.scrollToElement.apply(this.scrolls, arguments);
    },
  },
  watch: {
    // 侦听data的变化，即时刷新better-scroll组件
    data() {
      this.refresh();
    },
  },
};
</script>

<style lang='less' scoped>
</style>