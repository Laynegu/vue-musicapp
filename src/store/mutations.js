import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAY_STATE](state, flag) {
    state.isPlay = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.isFullScreen = flag;
  },
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.playMode = mode;
  },
  [types.SET_CURRENT_SONG_INDEX](state, index) {
    state.currentSongIndex = index; 
  }
}

export default mutations;
