<template>
  <div class="process-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1">
      <circle
        class="process-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <circle
        class="process-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dasharray"
        :stroke-dashoffset="dashoffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 30,
    },
    percent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    dashoffset() {
      return (1 - this.percent) * this.dasharray;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../common/less/variable.less";

.process-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.process-background {
      transform: scale(0.9);
      stroke: @color-theme-d;
    }
    &.process-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: @color-theme;
    }
  }
}
</style>