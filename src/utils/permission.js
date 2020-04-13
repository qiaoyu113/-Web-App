import router from '@/router'
import store from '@/store'
// import { Notify } from 'vant'
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// const qs = require('qs')

const whiteList = ['/login', '/register', '/driverfollow', '/driverfollowdetail'] // 白名单列表

router.beforeEach(async(to, from, next) => {
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  const code = localStorage.getItem('code')
  if (hasToken || code) {
    // 用户已授权，获取code
    if (hasToken) {
      // 已经登录，跳转到首页
      // next({ path: '/' })
      await store.dispatch('user/getInfo')
      // if (to.matched.length === 1) { // 匹配前往的路由不存在
      //   if (to.path === '/404') { // 这就是跳出循环的关键
      //     next()
      //   } else {
      //     console.log('from', from)
      //     from.name ? next({
      //       name: from.name
      //     }) : next('/404');
      //   }
      // } else {
      next()
      // }
    } else {
      localStorage.removeItem('code')
      next(`/login?redirect=${to.path}`)
      // 跳转到微信授权页面
      // window.location.href = loginUrl
      // 获取用户信息
      // const hasGetUserInfo = store.getters.userData && store.getters.userData.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // get user info
      //     await store.dispatch('user/getInfo')
      //     next()
      //   } catch (error) {
      //     // 清除用户信息，退出登录，跳转登录页
      //     store.commit('user/LOGOUT')
      //     Notify.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //   }
      // }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单中，无需验证
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // 微信未授权登录跳转到授权登录页面
      // const url = window.location.href
      // 解决重复登录url添加重复的code与state问题
      // const parseUrl = qs.parse(url.split('?')[1])
      // let loginUrl
      // if (parseUrl.code && parseUrl.state) {
      //   delete parseUrl.code
      //   delete parseUrl.state
      //   loginUrl = `${url.split('?')[0]}?${qs.stringify(parseUrl)}`
      // } else {
      //   loginUrl = url
      // }
      localStorage.setItem('loginUrl', to.path)
      // 无论拒绝还是授权都设置成1
      next(`/login?redirect=${to.path}`)
    }
  }
})
