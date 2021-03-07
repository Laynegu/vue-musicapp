<template>
  <music-list :songs="songs" :title="title" :bgImg="bgImage"></music-list>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail, getPlayAddress } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import createSong from "@/common/js/Song";
import musicList from "@/components/musicList/MusicList";

export default {
  name: "singerDetail",
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getSingerDetail();
  },
  components: {
    musicList,
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.imgUrl;
    },
    ...mapGetters(["singer"]),
  },
  methods: {
    // 获取歌曲数据
    _getSingerDetail() {
      if (!this.singer.id) {
        this.$router.replace("/singer");
        return;
      }
      getSingerDetail(this.singer.mid)
        .then((ret) => {
          if (ret.code === ERR_OK) {
            this.songs = this._handleSong(ret.data.list);
            return this.songs.map((item) => item.mid);
          }
        })
        .then((mid) => {
          getPlayAddress(mid).then((ret) => {
            this._handlePlayAddress(ret.req_0.data);
          });
        });
    },
    // 处理歌曲数据
    _handleSong(list) {
      const ret = [];
      list.forEach((item) => {
        const { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    // 处理歌曲播放地址
    _handlePlayAddress({ sip, midurlinfo }) {
      const baseUrl = sip[0] || sip[1];
      let map = {};
      midurlinfo.forEach((item) => {
        map[item.songmid] = {
          purl: item.purl,
          playUrl: baseUrl + item.purl,
        };
      });
      this.songs.forEach((item) => {
        if (map[item.mid] && map[item.mid].purl) {
          item.playUrl = map[item.mid].playUrl;
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>

</style>