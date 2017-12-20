import jsonp from 'common/js/jsonp'
import {options, commonParams} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getRankMusic(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    topid,
    type: 'top',
    song_begin: 0,
    song_num: 30,
    platform: 'h5',
    needNewCode: 0
  })

  return jsonp(url, data, options)
}