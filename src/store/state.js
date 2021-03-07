import * as mode from '../common/js/config';

const state = {
  singer: {},
  isPlay: true,
  isFullScreen: false,
  playList: [],
  sequenceList: [],
  playMode: mode.SEQUENCE_PLAY,
  currentSongIndex: -1
}

export default state;
