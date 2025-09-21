# 发布到Koishi应用市场指南

## 发布步骤

### 1. 准备工作

1. **注册npm账号**
   - 访问 [npmjs.com](https://www.npmjs.com) 注册账号
   - 验证邮箱

2. **创建GitHub仓库**
   - 在GitHub上创建新仓库
   - 将代码推送到仓库
   - 更新 `package.json` 中的仓库地址

### 2. 修改配置

在发布前，请修改以下文件中的占位符：

**package.json**
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/VTeam-Studio/koishi-plugin-nfa-stock-checker.git"
  },
  "homepage": "https://github.com/VTeam-Studio/koishi-plugin-nfa-stock-checker#readme",
  "bugs": {
    "url": "https://github.com/VTeam-Studio/koishi-plugin-nfa-stock-checker/issues"
  }
}
```

**plugin.json**
```json
{
  "homepage": "https://github.com/VTeam-Studio/koishi-plugin-nfa-stock-checker",
  "repository": {
    "type": "git",
    "url": "https://github.com/VTeam-Studio/koishi-plugin-nfa-stock-checker.git"
  }
}
```

### 3. 发布到npm

1. **登录npm**
   ```bash
   npm login
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **发布包**
   ```bash
   npm publish
   ```

### 4. 在Koishi应用市场找到插件

发布成功后，用户可以通过以下方式找到你的插件：

1. **在Koishi控制台中搜索**
   - 打开Koishi控制台
   - 进入"插件市场"
   - 搜索 "nfa-stock-monitor" 或 "NFA库存监控"

2. **通过npm安装**
   ```bash
   npm install koishi-plugin-nfa-stock-monitor
   ```

3. **在配置文件中启用**
   ```yaml
   plugins:
     nfa-stock-monitor: {}
   ```

## 注意事项

1. **包名唯一性**：确保包名 `koishi-plugin-nfa-stock-monitor` 在npm上是唯一的
2. **版本管理**：每次发布新版本时，记得更新 `package.json` 中的版本号
3. **文档完善**：确保README.md包含完整的使用说明
4. **测试**：发布前请充分测试插件功能

## 更新版本

当需要更新插件时：

1. 修改代码
2. 更新版本号：
   ```bash
   npm version patch  # 补丁版本 (1.0.0 -> 1.0.1)
   npm version minor  # 小版本 (1.0.0 -> 1.1.0)
   npm version major  # 大版本 (1.0.0 -> 2.0.0)
   ```
3. 重新发布：
   ```bash
   npm publish
   ```

## 推广建议

1. **在Koishi社区分享**：在官方QQ群或论坛分享你的插件
2. **完善文档**：提供详细的使用说明和示例
3. **收集反馈**：积极回应用户的问题和建议
4. **持续维护**：定期更新插件，修复bug，添加新功能
