import request from '@/utils/request'

// Golang后端地址
const BaseUrl = 'http://localhost:8081'

// 更新或者新建
export function createOrUpdateFlowTemplate(data) {
  return request({
    url: BaseUrl + '/flowTemplate/CreateOrUpdate',
    method: 'post',
    data
  })
}

// 根据分页+搜索
export function doGetFlowTemplateByPage(data) {
  return request({
    url: BaseUrl + '/flowTemplate/GetFlowTemplateByPage',
    method: 'post',
    data
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


