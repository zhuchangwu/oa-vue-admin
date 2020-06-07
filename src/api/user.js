import request from '@/utils/request'

// Java后端地址
const BaseUrl = 'http://localhost:8080'

export function login(data) {
  return request({
    url: BaseUrl + '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    headers:{
      "Authrication":"Bearer "+token
    },
    url: BaseUrl + '/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: BaseUrl + '/user/logout',
    method: 'post'
  })
}
