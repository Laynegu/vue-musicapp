<template>
  <div class="header">
    <div class="title">
      <i class="icon"></i>
      <h1>Chicken Music</h1>
    </div>
    <div class="mine">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";
@import "../../common/less/mixin.less";

.header {
  width: 100%;
  height: 44rem / @baseSize;
  position: relative;

  .title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    width: 165rem / @baseSize;
    height: 44rem / @baseSize;
    h1 {
      color: @color-theme;
      font-size: @font-size-large;
    }
    .icon {
      width: 30rem / @baseSize;
      height: 32rem / @baseSize;
      .bg-image(logo);
      background-size: 30rem / @baseSize auto;
    }
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12rem / @baseSize;
      font-size: 20rem / @baseSize;
      color: @color-theme;
    }
  }
}

</style>
