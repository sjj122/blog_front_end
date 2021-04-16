import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Home = () => import('../views/home/Home')
const Lam = () => import('../views/leave a message/Lam')
const Dynamic = () => import('../views/dynamic/Dynamic')
const PhotoWall = () => import('../views/photoWall/PhotoWall')
const MyBlog = () => import('../views/myBlog/MyBlog')
const EditBlog = () => import('../views/myBlog/childComps/EditBlog')
const BlogDetail = () => import('../views/myBlog/childComps/BlogDetail')
const Profile = () => import('../views/profile/Profile')

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      { path: '/', redirect: '/myBlog' },
      { path: '/lam', component: Lam },
      { path: '/dynamic', component: Dynamic },
      { path: '/myPhoto', component: PhotoWall },
      { path: '/myBlog', component: MyBlog },
    ]
  },
  {
    path: '/editBlog/:b_id',
    component: EditBlog
  },
  {
    path: '/blogDetail/:b_id',
    component: BlogDetail
  },
  {
    path: '/profile/:user_id',
    meta: { path: '/profile' },
    component: Profile
  },
  {
    path: '/profileVisit/:user_id',
    meta: { path: '/profileVisit' },
    component: Profile
  }
]

const router = new VueRouter({
  routes
})

// 未登录拦截写博客
router.beforeEach((to, from, next) => {
  if (!window.localStorage.getItem('user_id') &&
      (to.path === '/editBlog' || to.meta.path === '/profile')) {
    next('/')
  } else {
    next()
  }
})

export default router
