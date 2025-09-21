# Koishi NFA 库存监控插件

这是一个Koishi机器人插件，用于监控NFA库存信息。

## 功能特性

- 🚀 快速获取NFA库存信息
- 🛠️ 可配置的API参数
- 📊 实时库存数据展示
- 💡 简单易用的单次查询

## 安装

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
```

### 配置项说明

- `apiUrl`: API接口地址（默认：https://mcheika.lol/user/api/index/stock）
- `cookie`: 请求所需的Cookie值（必填）
- `itemId`: 商品ID（默认：2）

## 使用方法

### 命令列表

- `/nfa` - 获取当前NFA库存信息

### 使用示例

```
用户: /nfa
机器人: The Stock of NFA : 100
```

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
