import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

function insertArray(arr, item, maxlen) {
  let index = isExists(arr, item)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(item)
  if (arr.length > maxlen && maxlen) {
    arr.pop()
  }
}

function isExists(list, query) {
  let index
  for (let i = 0; i < list.length; i++) {
    if (list[i].id) {
      if (list[i].id === query.id) {
        index = i
        break
      }
    } else {
      if (list[i] === query) {
        index = i
        break
      }
    }
  }
  return index
}

function deleteFromArray(arr, song) {
  let index = arr.findIndex((item) => {
    return item.id === song.id
  })
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  let index = isExists(searches, query)
  if (index > -1) {
    searches.splice(index, 1)
  }
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlayHistory(song) {
  let list = storage.get(PLAY_KEY, [])
  insertArray(list, song, PLAY_MAX_LENGTH)
  storage.set(PLAY_KEY, list)
  return list
}
export function getPlayHistory() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  insertArray(favorites, song, FAVORITE_MAX_LENGTH)
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function getFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

export function deleteFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY, [])
  deleteFromArray(favorites, song)
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}