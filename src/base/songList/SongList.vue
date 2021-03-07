<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" :key="song.id" @click="select(song, index)">
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ song | getDesc }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      default: [],
      type: Array,
    },
  },
  methods: {
    select(song, index) {
      this.$emit('select', song, index);
    }
  },
  filters: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../common/less/variable.less";

.song-list {
  .content {
    height: 64rem / @baseSize;
    display: flex;
    font-size: @font-size-medium;
    flex-direction: column;
    justify-content: center;
    .name {
      color: @color-text;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .desc {
      color: @color-text-d;
      margin-top: 10rem / @baseSize;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>