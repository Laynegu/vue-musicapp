<template>
  <div>
    <listview
      @select="selectSinger"
      :list="singerList"
      class="singerList"
      ref="list"
    ></listview>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import { playListMixin } from "@/common/js/mixin";
import Listview from "@/base/listview/listview";
import Singer from "@/common/js/Singer";
import { mapMutations } from "vuex";
import * as types from "../../store/mutation-types";

export default {
  name: "singer",
  mixins: [playListMixin],
  data() {
    return {
      singerList: [],
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    Listview,
  },
  methods: {
    handlePlayList(playList) {
      let bottom = playList.length > 0? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`,
      });
      // 给store中添加singer属性
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then((ret) => {
        if (ret.code === ERR_OK) {
          this.singerList = this.handleSingerList(ret.data.list);
        }
      });
    },
    // 处理歌手相关数据
    handleSingerList(list) {
      // 选前十个数据作为热门数据
      // 利用桶排序
      const BASE_CODE = "A".charCodeAt(0) - 1;
      const bucket = [];
      bucket[0] = {
        title: "热门",
        list: [],
      };
      const res = [];
      list.forEach((item, index) => {
        let code = item.Findex.charCodeAt(0);
        if (index < 10) {
          bucket[0].list.push(
            new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid)
          );
        }
        if (!bucket[code - BASE_CODE]) {
          bucket[code - BASE_CODE] = {
            title: item.Findex,
            list: [],
          };
        }
        bucket[code - BASE_CODE].list.push(
          new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid)
        );
      });
      for (let i = 0; i < bucket.length; i++) {
        bucket[i] && res.push(bucket[i]);
      }
      return res;
    },
    ...mapMutations({
      setSinger: types.SET_SINGER,
    }),
  },
};
</script>

<style lang='less' scoped>
@import "../../common/less/variable.less";

.singerList {
  width: 100%;
  position: fixed;
  top: 88rem / @baseSize;
  bottom: 0;
  overflow: hidden;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>