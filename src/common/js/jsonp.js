import originJsonp from 'jsonp'

export default function jsonp(url, data, options) {
  url += url.indexOf('?') > 0 ? '&' : '?' + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // if (typeof(value) === "string") {
    //   url += `&${k}=encodeURIComponent(${value})`
    // } else {
    //   url += `&${k}=${value}`
    // }
    url += `&${k}=${value}`
  }
  return url ? url.substring(1) : ''
}