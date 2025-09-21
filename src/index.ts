import { Context, Schema } from 'koishi'
import axios from 'axios'

export const name = 'nfa-stock-monitor'

export interface Config {
  apiUrl: string
  cookie: string
  itemId: string
  messageTemplate: string
}

export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().default('https://mcheika.lol/user/api/index/stock').description('API接口地址'),
  cookie: Schema.string().default('_ok1_=OQjMRsSlWTvaBJGEBGOhyX03gXTXMGCpY/hbQkcNCKhAfakznli7RrxdZaYjFbPxV7UYMjZLjq48Nnc8fFQOHGqAtEUMb2XJ4w7VUt9heu/HwogXLAcGFdARPViZjeza').description('请求Cookie'),
  itemId: Schema.string().default('2').description('商品ID'),
  messageTemplate: Schema.string().default('The Stock of NFA : {stock}').description('自定义消息模板，使用 {stock} 作为库存数量占位符')
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
        // 使用自定义消息模板
        return config.messageTemplate.replace('{stock}', data.data.stock.toString())
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
    .action(async ({ session }) => {
      try {
        const stockInfo = await getStock()
        return stockInfo
      } catch (error) {
        console.error('获取库存时发生错误:', error)
        return '获取库存时发生错误，请稍后重试'
      }
    })

  // 注册 /nfa-test 命令 - 测试自定义消息模板
  ctx.command('nfa-test <template:text>', '测试自定义消息模板')
    .action(async ({ session }, template) => {
      if (!template) {
        return '请提供消息模板，例如：/nfa-test "当前NFA库存: {stock}个"'
      }
      
      try {
        const response = await axios.post(config.apiUrl, payload, { headers })
        const data = response.data
        
        if (data && data.data && data.data.stock !== undefined) {
          const testMessage = template.replace('{stock}', data.data.stock.toString())
          return `测试结果：${testMessage}`
        } else {
          return '获取库存数据失败：响应格式不正确'
        }
      } catch (error) {
        console.error('测试消息模板时发生错误:', error)
        return '测试消息模板时发生错误，请稍后重试'
      }
    })
}
