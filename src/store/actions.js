import * as types from './mutation-types';
import * as mode from '../common/js/config';
import { shuffle } from '../common/js/util';

const actions = {
  play({ commit, state }, { songs, index }) {
    if (state.playMode === mode.RANDOM_PLAY) {
      let list = shuffle(songs);
      commit(types.SET_PLAY_LIST, list);
      index = list.findIndex(item => item.id === songs[index].id);
    } else {
      commit(types.SET_PLAY_LIST, songs);
    }
    commit(types.SET_SEQUENCE_LIST, songs);
    commit(types.SET_CURRENT_SONG_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAY_STATE, true);
  },
  randomPlay({ commit }, { songs }) {
    let list = shuffle(songs);
    commit(types.SET_PLAY_LIST, list);
    commit(types.SET_SEQUENCE_LIST, songs);
    commit(types.SET_CURRENT_SONG_INDEX, 0);
    commit(types.SET_PLAY_MODE, mode.RANDOM_PLAY);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAY_STATE, true);
  }
}

export default actions;
