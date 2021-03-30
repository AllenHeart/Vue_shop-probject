import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

// 公共路由匹配理由规则
const routes = [
  // 重定向 login
  {
    path: '/',
    name: '重定向',
    redirect: '/login'
  },
  // 登录组件
  {
    path: '/login',
    name: '登录组件',
    component: Login
  },
  // home 组件
  {
    path: '/home',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//  分析
// 1: 登录功能的实现
// 2: 如果用户没有登录,但是直接通过 Url 访问特定页面,需要重新导航到登录页面
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表哪个路径跳转而来
  // next: 是一个函数,表示放行,next()  || 又或者next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取 token 值 如果获取到了直接改代码
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果!tokenStr 里面存储 token 值那么直接放行---!非空判断
  if (!tokenStr) return next('/login')
  next()
})

export default router
