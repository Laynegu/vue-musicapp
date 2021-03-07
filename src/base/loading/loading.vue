<template>
  <div class="loading">
    <img src="./loading.gif" alt="loading..." />
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: "loading",
  props: {
    title: {
      type: String,
      default: "正在加载中...",
    },
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.loading {
  width: 100%;
  text-align: center;
  img {
    width: 24rem / @baseSize;
    height: 24rem / @baseSize;
  }
  .desc {
    font-size: @font-size-small;
    color: @color-text-l;
    line-height: 20rem / @baseSize;
  }
}
</style>