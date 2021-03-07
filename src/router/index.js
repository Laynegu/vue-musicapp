import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommended'
  },
  {
    path: '/recommended',
    component: () => import('@/views/recommended/Recommended')
  },
  {
    path: '/singer',
    component: () => import('@/views/singer/Singer'),
    children: [
      {
        path: ':id',
        component: () => import('@/views/singerDetail/SingerDetail')
      }
    ]
  },
  {
    path: '/rank',
    component: () => import('@/views/rank/Rank')
  },
  {
    path: '/search',
    component: () => import('@/views/search/Search')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
