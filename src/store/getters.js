/* 对state做一个映射,去数据到组件中 */
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const mode = state => state.mode

export const sequenceList = state => state.sequenceList

export const playcurrIndex = state => state.playcurrIndex

export const currentSong = (state) => {
  return state.playList[state.playcurrIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList