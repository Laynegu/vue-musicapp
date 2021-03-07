const getters = {
  singer: state => state.singer,
  isPlay: state => state.isPlay,
  isFullScreen: state => state.isFullScreen,
  playList: state => state.playList,
  sequenceList: state => state.sequenceList,
  playMode: state => state.playMode,
  currentSongIndex: state => state.currentSongIndex,
  currentSong: state => state.playList[state.currentSongIndex] || {}
}

export default getters; 
