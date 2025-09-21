// API响应数据类型定义
export interface StockApiResponse {
  data: {
    stock: number
  }
  code?: number
  message?: string
}

// 请求payload类型定义
export interface StockRequestPayload {
  contact: string
  password: string
  num: string
  item_id: string
}

// 请求头类型定义
export interface StockRequestHeaders {
  'Content-Type': string
  'Cookie': string
}
