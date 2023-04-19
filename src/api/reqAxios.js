import axios from 'axios';
import router from '../router'
let service = axios.create({
  timeout: 5000,
  baseURL:"http://81.71.153.104:3000/api",
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With'
  }
})

// 请求拦截
service.interceptors.request.use(config => {
  if (localStorage.userToken) {
    // 设置统一的request header
      config.headers.Authorization = localStorage.userToken;
  }
    return config;
}, error => {
    return Promise.reject(error);
})

// 响应拦截
service.interceptors.response.use(response => {
  if(response.data.code==="1003"){
    alert("token过期，请重新登录！")
    localStorage.removeItem('userToken');
    router.push("/login");
  }
  return response
}, error => {
    return Promise.reject(error);
})

export default service;
