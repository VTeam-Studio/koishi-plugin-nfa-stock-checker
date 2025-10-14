# Koishi NFA 库存监控插件
## 本插件已经停止开发。不再接收更多Issue。如需定制插件，可以联系QQ3801477277

这是一个Koishi机器人插件，用于监控NFA库存信息。

已更新到 Koishi 应用商店

## 功能特性

- 🚀 快速获取NFA库存信息
- 🛠️ 可配置的API参数
- 📊 实时库存数据展示
- 💡 简单易用的单次查询
- 🎨 支持自定义消息模板
- 🧪 内置消息模板测试功能

## 安装

### 从npm安装
```bash
npm install koishi-plugin-nfa-stock-monitor
```

### 从GitHub Packages安装
```bash
npm install @vteam-studio/koishi-plugin-nfa-stock-monitor
```

### 从源码安装
1. 将插件文件夹放入Koishi项目的`plugins`目录
2. 安装依赖：
   ```bash
   npm install
   ```
3. 编译TypeScript：
   ```bash
   npm run build
   ```

## 配置

在Koishi配置文件中添加以下配置：

```yaml
plugins:
  nfa-stock-monitor:
    apiUrl: "https://mcheika.lol/user/api/index/stock"
    cookie: "你的Cookie值"
    itemId: "2"
    messageTemplate: "当前NFA库存: {stock}个"
```

### 配置项说明

- `apiUrl`: API接口地址（默认：https://mcheika.lol/user/api/index/stock）
- `cookie`: 请求所需的Cookie值（可选，有默认值）
- `itemId`: 商品ID（默认：2）
- `messageTemplate`: 自定义消息模板（默认：The Stock of NFA : {stock}）

## 使用方法

### 命令列表

- `/nfa` - 获取当前NFA库存信息
- `/nfa-test <模板>` - 测试自定义消息模板

### 使用示例

#### 基本使用
```
用户: /nfa
机器人: The Stock of NFA : 100
```

#### 自定义消息模板
```
用户: /nfa-test "📦 当前NFA库存: {stock}个"
机器人: 测试结果：📦 当前NFA库存: 100个
```

#### 消息模板示例
- `"当前NFA库存: {stock}个"` → 当前NFA库存: 100个
- `"📦 NFA库存状态: {stock}"` → 📦 NFA库存状态: 100
- `"The Stock of NFA : {stock}"` → The Stock of NFA : 100

## 开发

### 构建项目

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

## 注意事项

1. 请确保Cookie值有效且未过期
2. 插件会自动处理API请求错误，并在出错时显示错误信息
3. 每次使用`/nfa`命令都会实时获取最新的库存信息

## 许可证

MIT License
