import { Context, Schema } from 'koishi'
import axios from 'axios'

export const name = 'nfa-stock-monitor'

export interface Config {
  apiUrl: string
  cookie: string
  itemId: string
  messageTemplate: string
  customCommands: { command: string; itemId: string; description?: string }[]
}

export const Config: Schema<Config> = Schema.object({
  apiUrl: Schema.string().default('https://mcheika.lol/user/api/index/stock').description('API接口地址'),
  cookie: Schema.string().default('_ok1_=OQjMRsSlWTvaBJGEBGOhyX03gXTXMGCpY/hbQkcNCKhAfakznli7RrxdZaYjFbPxV7UYMjZLjq48Nnc8fFQOHGqAtEUMb2XJ4w7VUt9heu/HwogXLAcGFdARPViZjeza').description('请求Cookie'),
  itemId: Schema.string().default('2').description('默认商品ID（用于/nfa指令）'),
  messageTemplate: Schema.string().default('The Stock of NFA : {stock}').description('自定义消息模板，使用 {stock} 作为库存数量占位符'),
  customCommands: Schema.array(Schema.object({
    command: Schema.string().description('指令名称'),
    itemId: Schema.string().description('对应的商品ID'),
    description: Schema.string().description('指令描述（可选）')
  })).default([
    { command: 'mfa', itemId: '3', description: '获取MFA库存信息' },
    { command: 'stock', itemId: '2', description: '获取NFA库存信息' },
    { command: '库存', itemId: '2', description: '获取NFA库存信息' }
  ]).description('自定义指令配置，每个指令可以对应不同的商品ID')
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
  async function getStock(itemId?: string): Promise<string> {
    try {
      const requestPayload = {
        ...payload,
        item_id: itemId || config.itemId
      }
      
      const response = await axios.post(config.apiUrl, requestPayload, { headers })
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

  // 注册 /nfa-query 命令 - 查询指定商品ID的库存
  ctx.command('nfa-query <itemId:text>', '查询指定商品ID的库存')
    .action(async ({ session }, itemId) => {
      if (!itemId) {
        return '请提供商品ID，例如：/nfa-query 2'
      }
      
      try {
        const stockInfo = await getStock(itemId)
        return `商品ID ${itemId} 的库存信息：${stockInfo}`
      } catch (error) {
        console.error('查询库存时发生错误:', error)
        return '查询库存时发生错误，请稍后重试'
      }
    })

  // 注册自定义指令
  config.customCommands.forEach(commandConfig => {
    if (commandConfig.command && commandConfig.command.trim()) {
      const commandName = commandConfig.command.trim()
      const itemId = commandConfig.itemId
      const description = commandConfig.description || `获取商品ID ${itemId} 的库存信息`
      
      ctx.command(commandName, description)
        .action(async ({ session }) => {
          try {
            const stockInfo = await getStock(itemId)
            return stockInfo
          } catch (error) {
            console.error('获取库存时发生错误:', error)
            return '获取库存时发生错误，请稍后重试'
          }
        })
    }
  })

  // 注册 /nfa-help 命令 - 显示帮助信息
  ctx.command('nfa-help', '显示NFA库存监控插件帮助信息')
    .action(async ({ session }) => {
      const helpText = `
NFA库存监控插件帮助信息：

基础指令：
• /nfa - 获取NFA库存（商品ID: ${config.itemId}）
• /nfa-query <商品ID> - 查询指定商品ID的库存
• /nfa-test <模板> - 测试自定义消息模板
• /nfa-help - 显示此帮助信息

自定义指令：
${config.customCommands.map(cmd => `• /${cmd.command} - ${cmd.description || `获取商品ID ${cmd.itemId} 的库存`}`).join('\n')}

配置说明：
• 默认商品ID: ${config.itemId}
• 消息模板: ${config.messageTemplate}
• 自定义指令配置: ${config.customCommands.length} 个

示例：
• /nfa-query 3 - 查询商品ID为3的库存
• /nfa-test "库存: {stock}个" - 测试消息模板
• /mfa - 获取MFA库存（如果已配置）
      `.trim()
      
      return helpText
    })
}
