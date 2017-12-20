/* vuex的异步操作，或者对mutation的封装 */
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {upset} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlayHistory, saveFavorite, deleteFavorite} from 'common/js/cathe'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCELIST, list)
  if (state.mode === playMode.random) {
    let randomlist = upset(list)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_PLAY_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit, state}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCELIST, list)
  let randomList = upset(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_PLAY_INDEX, 0)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

function findIndex(arr, song) {
  return arr.findIndex((item) => {
    return item.id === song.id
  })
}

export function insertSong({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let playcurrIndex = state.playcurrIndex
  // 记录当前歌曲
  let currentSong = playlist[playcurrIndex]
  // 查找当前列表是否有带插入的歌曲
  let index = findIndex(playlist, song)
  // 插入歌曲到当前索引位置
  playcurrIndex++
  playlist.splice(playcurrIndex, 0, song)
  // 如果之前已经存在插入的歌曲，那么就要删除掉之前存在的歌曲
  if (index > -1) {
    //  如果当前插入的位置大于之前列表中的位置
    if (playcurrIndex > index) {
      playlist.splice(index, 1)
      playcurrIndex--
    } else {
      playlist.splice(index + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let Sindex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (Sindex > -1) {
    if (currentSIndex > Sindex) {
      sequenceList.splice(Sindex, 1)
    } else {
      sequenceList.splice(Sindex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.SET_PLAY_INDEX, playcurrIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export function saveSearchHistory({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export function deleteSearchHistory({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export function clearSearchHistory({commit, state}, query) {
  commit(types.SET_SEARCH_HISTORY, clearSearch(query))
}

export function deleteCurrSong({commit, state}, song) {
  let playlist = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let playcurrIndex = state.playcurrIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (playcurrIndex > pIndex || playcurrIndex === playlist.length) {
    playcurrIndex--
  }
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCELIST, sequenceList)
  commit(types.SET_PLAY_INDEX, playcurrIndex)
}

export function clearPlayList({commit, state}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCELIST, [])
  commit(types.SET_PLAY_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

export function savePlayingHistory({commit, state}, song) {
  commit(types.SET_PLAY_HISTORY, savePlayHistory(song))
}

export function saveFavoriteList({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export function deleteFavoriteList({commit, state}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}