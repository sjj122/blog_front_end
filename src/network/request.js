import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 封装axios库
export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://101.37.91.208:3000',
    baseURL: 'http://127.0.0.1:3000',
    timeout: 10000
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    NProgress.start()
    return config
  }, err => console.log(err))

  // 响应拦截器
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res
  }, err => console.log(err))

  return instance(config)
}

