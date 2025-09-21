import { Context, Schema } from 'koishi'
import axios from 'axios'

export const name = 'nfa-stock-monitor'

export interface Config {
  apiUrl: string
  cookie: string
  itemId: string
}

export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().default('https://mcheika.lol/user/api/index/stock').description('API接口地址'),
  cookie: Schema.string().required().description('请求Cookie'),
  itemId: Schema.string().default('2').description('商品ID')
})

export function apply(ctx: Context, config: Config) {
  // 定义API请求的payload
  const payload = {
    contact: '',
    password: '',
    num: '1',
    item_id: config.itemId
  }

  // 定义请求头
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': config.cookie
  }

  // 获取库存的函数
  async function getStock(): Promise<string> {
    try {
      const response = await axios.post(config.apiUrl, payload, { headers })
      const data = response.data
      
      if (data && data.data && data.data.stock !== undefined) {
        return `The Stock of NFA : ${data.data.stock}`
      } else {
        return '获取库存数据失败：响应格式不正确'
      }
    } catch (error) {
      console.error('获取库存时发生错误:', error)
      return `获取库存时发生错误: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  // 注册 /nfa 命令 - 单次获取库存
  ctx.command('nfa', '获取NFA库存信息')
    .action(async () => {
      return await getStock()
    })
}
