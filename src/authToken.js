import router from './router'
import store from './store'

//加载进度条 工具类
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {getToken} from '@/utils/auth'
import { isRelogin } from '@/utils/request'
import { Message } from 'element-ui'

const whiteList=['/login','register']

router.beforeEach((to,from,next)=>{
   if(getToken()){
      //meta Title TODO  

      //这里的意思是，如果已经在Cookies里面有token了，你再到url中
      //填写 localhost:81/login 它还是会跳到 localhost:81/index 页面
      if(to.path === '/login'){
         next({ path: '/' })
         NProgress.done()
      }else{
         //如果角色数组长度为0，说明用户角色信息丢失，需要重新拉取 获取用户信息接口
          if(store.getters.roles.length === 0){
            isRelogin.show = true

            //拉取用户信息，然后拉取完了，立刻设置重新登录为false
            store.dispatch('GetInfo').then((res)=>{
               isRelogin.show = false
               // store.dispatch('GenerateRoutes').then(accessRoutes => {
               //    // 根据roles权限生成可访问的路由表
               //    router.addRoutes(accessRoutes) // 动态添加可访问路由表
               //    next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
               //  })
               next()
            }).catch(err => {
               store.dispatch('LogOut').then(() => {
                 Message.error(err)
                 next({ path: '/' })
               })
             })

          }else{
            //角色长度不为0，直接放行
             next()   
          }
      }

   }else{
      if(whiteList.indexOf(to.path) !==-1){
        next()
      }else{
        next(`/login?redirect=${to.fullPath}`)
        NProgress.done()
      }
   }
})

router.afterEach(() => {
    NProgress.done()
})