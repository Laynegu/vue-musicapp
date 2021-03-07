<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommended">
      <span>推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span>歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.tab {
  display: flex;
  width: 100%;
  height: 44rem / @baseSize;
  line-height: 44rem / @baseSize;
  font-size: @font-size-medium;

  .tab-item {
    flex: 1;
    width: 25%;
    text-align: center;

    span {
      padding-bottom: 5px;
      color: @color-text-l;
    }
  }

  .router-link-active {
    // 当前路由活跃时
    span {
      color: @color-theme;
      border-bottom: 2px solid @color-theme;
    }
  }
}
</style>