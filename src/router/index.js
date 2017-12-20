import Vue from 'vue'
import Router from 'vue-router'

const Singer = (resolve) => {
  import('components/singer/singer').then((singer) => {
    resolve(singer)
  })
}
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}
const Rank = (resolve) => {
  import('components/rank/rank').then((rank) => {
    resolve(rank)
  })
}
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer_detail').then((singerdetail) => {
    resolve(singerdetail)
  })
}
const Search = (resolve) => {
  import('components/search/search').then((search) => {
    resolve(search)
  })
}
const Disc = (resolve) => {
  import('components/disc/disc').then((disc) => {
    resolve(disc)
  })
}
const TopList = (resolve) => {
  import('components/top-list/top-list').then((singer) => {
    resolve(singer)
  })
}
const User = (resolve) => {
  import('components/user-center/user-center').then((user) => {
    resolve(user)
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: User
    }
  ]
})
