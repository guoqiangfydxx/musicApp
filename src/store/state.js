/* vuex的状态 */
import {playMode} from 'common/js/config'
import {loadSearch, getPlayHistory, getFavorite} from 'common/js/cathe'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  playcurrIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: getPlayHistory(),
  favoriteList: getFavorite()
}

export default state