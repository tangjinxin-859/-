import Vue from 'vue'
import VueRouter from 'vue-router'
import Container from '../components/Container.vue'
import Discovery from '../views/Discovery.vue'
import Recommend from '../views/Recommend.vue'
import LatestMusic from '../views/LatestMusic.vue'
import LatestMV from '../views/LatestMV.vue'
import Result from '../views/Result.vue'
import PlayList from '../views/PlayList.vue'
import MvList from '../views/MvList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/discovery'
  },
  {
    path: '/container',
    component: Container,
    name: 'Container',
    children: [
      {
        path: '/discovery',
        component: Discovery,
        name: 'Discovery'
      },
      {
        path: '/recommend',
        component: Recommend,
        name: 'Recommend'
      },
      {
        path: '/latest_music',
        component: LatestMusic,
        name: 'LatestMusic'
      },
      {
        path: '/latest_mv',
        component: LatestMV,
        name: 'LatestMV'
      },
      {
        path: '/result',
        component: Result,
        name: 'Result'
      }, {
        path: '/playlist',
        component: PlayList,
        name: 'PlayList'
      },
      {
        path: '/mvlist',
        component: MvList,
        name: 'MvList'
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
