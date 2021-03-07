<template>
  <scroll :data="list" ref="scrollList" @scroll="scrollHandle" :probeType="3">
    <!-- 主题列表 -->
    <div class="list-wrap">
      <ul class="list-content">
        <li
          class="list-content-item"
          v-for="(items, index) in list"
          :key="index"
          ref="listItem"
        >
          <div class="items-title">{{ items.title }}</div>
          <ul>
            <li
              class="items-list"
              v-for="(item, index) in items.list"
              :key="index"
              :id="item.id"
              @click="selectItem(item)"
            >
              <div class="itemIcon">
                <img v-lazy="item.imgUrl" alt="" />
              </div>
              <span class="itemName">{{ item.name }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 侧边导航栏 -->
    <aside class="sub-nav">
      <ul @touchstart.stop.prevent="onTouchStart" @touchmove="onTouchMove">
        <li
          v-for="(items, index) in getSubNavList"
          :key="index"
          :data-index="index"
          ref="navItem"
          :class="currentIndex === index ? 'active' : ''"
        >
          {{ items }}
        </li>
      </ul>
    </aside>
    <!-- 顶部固定导航栏 -->
    <div class="fixBar" v-show="scrollY < 0" ref="fixBar">
      {{ getTitle }}
    </div>
    <!-- loading 组件 -->
    <div class="loadingWrap" v-show="!list.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import Loading from "@/base/loading/loading";
import { getAttr } from "@/common/js/dom";

export default {
  name: "listview",
  props: {
    list: {
      type: Array,
      default: [],
    },
  },
  computed: {
    getSubNavList() {
      return this.list.map((item) => {
        return item.title.charAt(0);
      });
    },
    getTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.list[this.currentIndex]
        ? this.list[this.currentIndex].title
        : "";
    },
  },
  created() {
    this.subnavPosition = {};
    this.listHeight = [];
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: 0,
    };
  },
  components: {
    Scroll,
    Loading,
  },
  methods: {
    refresh() {
      this.$refs.scrollList.refresh();
    },
    selectItem(item) {
      this.$emit('select', item);
    },
    onTouchStart(e) {
      let targetIndex = getAttr(e.target, "index");
      // !!!! 此时targetIndex是String
      this.subnavPosition.curIndex = parseInt(targetIndex);
      this.subnavPosition.y = e.touches[0].pageY;
      this.$refs.scrollList.scrollToElement(
        this.$refs.listItem[targetIndex],
        0
      );
    },
    onTouchMove(e) {
      let curY = e.touches[0].pageY;
      let delta = Math.floor(
        (curY - this.subnavPosition.y) / this.$refs.navItem[0].offsetHeight
      );
      let targetIndex = delta + this.subnavPosition.curIndex;
      this.$refs.scrollList.scrollToElement(
        this.$refs.listItem[targetIndex],
        0
      );
    },
    scrollHandle(pos) {
      this.scrollY = pos.y;
      if (this.scrollY >= 0 || -this.scrollY < this.listHeight[0]) {
        if (this.scrollY < 0) {
          this.diff = this.listHeight[0] + this.scrollY;
        }
        this.currentIndex = 0;
        return;
      }
      if (-this.scrollY >= this.listHeight[this.listHeight.length - 2]) {
        this.diff = this.listHeight[this.listHeight.length - 2] + this.scrollY;
        this.currentIndex = this.listHeight.length - 1;
        return;
      }
      for (let i = 0; i < this.listHeight.length - 1; i++) {
        if (
          -this.scrollY >= this.listHeight[i] &&
          -this.scrollY < this.listHeight[i + 1]
        ) {
          this.diff = this.listHeight[i + 1] + this.scrollY;
          this.currentIndex = i + 1;
          return;
        }
      }
    },
  },
  watch: {
    list(newList) {
      setTimeout(() => {
        for (let i = 0; i < newList.length; i++) {
          if (i === 0) {
            this.listHeight[i] = this.$refs.listItem[i].offsetHeight;
            continue;
          }
          this.listHeight[i] =
            this.listHeight[i - 1] + this.$refs.listItem[i].offsetHeight;
        }
      }, 20);
    },
    diff(newVal) {
      const TITLE_HEIGHT = this.$refs.fixBar.offsetHeight;
      let offset =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      // 不满足条件的直接结束
      if (this.offset === offset) return;
      this.offset = offset;
      this.$refs.fixBar.style.transform = `translate3d(0,${offset}px,0)`;
    },
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.list-wrap,
.list-content {
  width: 100%;
  color: @color-text-l;
  .list-content-item {
    width: 100%;
    padding: 0 0 20rem / @baseSize 0;
    .items-title {
      height: 30rem / @baseSize;
      font-size: @font-size-small;
      line-height: 30rem / @baseSize;
      background-color: @color-highlight-background;
      padding-left: 20rem / @baseSize;
    }
    .items-list {
      display: flex;
      align-items: center;
      padding: 20rem / @baseSize 0 0 30rem / @baseSize;
      .itemIcon {
        width: 50rem / @baseSize;
        height: 50rem / @baseSize;
        border-radius: 50%;
        overflow: hidden;
      }
      .itemName {
        font-size: @font-size-medium;
        margin-left: 20rem / @baseSize;
      }
    }
  }
}

.sub-nav {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10rem / @baseSize;
  padding: 20rem / @baseSize 0;
  font-size: @font-size-small;
  color: @color-text-l;
  background-color: @color-background-d;
  li {
    padding: 3rem / @baseSize 4rem / @baseSize;
    text-align: center;
    &.active {
      color: @color-theme;
    }
  }
}

.fixBar {
  position: absolute;
  top: -1rem / @baseSize;
  left: 0;
  width: 100%;
  height: 30rem / @baseSize;
  font-size: @font-size-small;
  line-height: 30rem / @baseSize;
  background-color: @color-highlight-background;
  color: @color-text-l;
  padding-left: 20rem / @baseSize;
}

.loadingWrap {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  z-index: 100;
}
</style>