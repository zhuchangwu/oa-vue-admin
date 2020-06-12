import request from '@/utils/request'

// Golang后端地址
const BaseUrl = 'http://localhost:8080'


// 更新或者新建
export function createOrUpdateNotice(data,token) {
  return request({
    headers:{
      "Authrication":"Bearer "+token
    },
    url: BaseUrl + '/notice/create',
    method: 'post',
    data
  })
}


// todo 获取所有模版的信息
export function getAllFlowTemplateInfo() {
  return request({
    url: BaseUrl + '/flowTemplate/getAllFlowTemplateInfo',
    method: 'get',
  })
}


export function getInfo(token) {
  return request({
    headers: {
      'Authrication': 'Bearer ' + token
    },
    url: BaseUrl + '/user/getInfo',
    method: 'get',
    params: { token }
  })
}


