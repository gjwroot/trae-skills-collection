---
name: "builtin-class-tools"
description: "提供Trae内置MCP工具和调用工具的使用方法、示例和技巧。当用户需要了解Trae内置工具的使用方法、寻求使用技巧或参考指南时调用。"
---

# Trae 内置工具使用合集

## 功能介绍

本技能提供以下功能：

1. **Trae内置MCP工具的使用方法和示例**：包含各种MCP工具的详细使用方法、参数说明和示例代码
2. **Trae内置调用工具的使用技巧**：收集整理内置调用工具的使用技巧、常见问题和解决方案
3. **Trae内置工具的综合参考指南**：提供内置工具的全面参考指南，包括使用方法、示例和注意事项

## 适用场景

当用户需要以下帮助时调用本技能：

- 了解Trae特定内置工具的使用方法
- 查找Trae内置工具的示例代码
- 学习Trae内置工具的使用技巧
- 解决Trae内置工具使用中遇到的问题
- 获取Trae内置工具的综合参考信息

## 支持的内置工具

### 1. 核心内置工具
- search：代码库搜索工具
- git-workflow-manager：Git工作流管理工具
- Skill：技能执行工具
- SearchCodebase：代码库上下文搜索工具
- Glob：文件模式匹配工具
- LS：文件和目录列出工具
- Grep：代码搜索工具
- Read：文件读取工具
- WebSearch：网络搜索工具
- WebFetch：网页内容获取工具
- RunCommand：命令执行工具
- CheckCommandStatus：命令状态检查工具
- StopCommand：命令停止工具
- GetDiagnostics：代码诊断工具
- DeleteFile：文件删除工具
- Edit：文件编辑工具
- Write：文件写入工具
- TodoWrite：任务管理工具
- OpenPreview：预览打开工具
- AskUserQuestion：用户问题询问工具

### 2. MCP工具
- mcp_Sequential_Thinking_sequentialthinking：顺序思考工具
- mcp_Figma_AI_Bridge_get_figma_data：Figma数据获取工具
- mcp_Figma_AI_Bridge_download_figma_images：Figma图片下载工具
- mcp_IMCP_Feedback_Enhanced_interactive_feedback：交互式反馈工具
- mcp_IMCP_Feedback_Enhanced_get_system_info：系统信息获取工具
- mcp_Playwright_end_codegen_session：Playwright代码生成会话结束工具
- mcp_Chrome_DevTools_MCP_*：Chrome DevTools相关工具（如click、navigate_page、evaluate_script等）
- mcp_Fetch_fetch：网络内容获取工具

## 使用示例

### 示例1：search 工具

**功能说明**：启动搜索子代理来处理代码库探索任务。

**参数**：
- description：任务的简短描述（3-5个单词）
- query：要执行的任务（<= 30个单词）

**使用示例**：
```javascript
// 搜索代码库中的身份验证相关代码
search({
  description: "查找身份验证代码",
  query: "查找处理用户身份验证的代码文件和函数"
});
```

### 示例2：RunCommand 工具

**功能说明**：执行终端命令。

**参数**：
- command：要执行的终端命令
- target_terminal：目标终端ID或'new'
- command_type：命令类型（web_server, long_running_process, short_running_process, other）
- cwd：工作目录（绝对路径）
- blocking：是否阻塞（true/false）
- wait_ms_before_async：异步前等待时间（仅当blocking为false时）
- requires_approval：是否需要批准

**使用示例**：
```javascript
// 运行开发服务器
RunCommand({
  command: "npm run dev",
  target_terminal: "new",
  command_type: "web_server",
  blocking: false,
  wait_ms_before_async: 3000,
  requires_approval: false
});

// 执行构建命令
RunCommand({
  command: "npm run build",
  target_terminal: "new",
  command_type: "short_running_process",
  blocking: true,
  requires_approval: false
});
```

### 示例3：Read 工具

**功能说明**：从本地文件系统读取文件。

**参数**：
- file_path：文件的绝对路径
- offset：开始读取的行号（可选）
- limit：要读取的行数（可选）

**使用示例**：
```javascript
// 读取整个文件
Read({
  file_path: "/path/to/file.js"
});

// 读取文件的特定部分
Read({
  file_path: "/path/to/file.js",
  offset: 10,
  limit: 50
});
```

### 示例4：Edit 工具

**功能说明**：在文件中执行精确的字符串替换。

**参数**：
- file_path：要修改的文件的绝对路径
- old_string：要替换的文本
- new_string：替换后的文本
- replace_all：是否替换所有出现的old_string（默认false）

**使用示例**：
```javascript
// 替换文件中的特定文本
Edit({
  file_path: "/path/to/file.js",
  old_string: "console.log('Hello');",
  new_string: "console.log('Hello, Trae!');"
});

// 替换文件中的所有匹配文本
Edit({
  file_path: "/path/to/file.js",
  old_string: "var",
  new_string: "let",
  replace_all: true
});
```

### 示例5：TodoWrite 工具

**功能说明**：帮助跟踪进度，组织多步骤复杂任务。

**参数**：
- todos：更新的待办事项列表
  - content：任务内容
  - status：状态（pending, in_progress, completed）
  - id：任务ID
  - priority：优先级（high, medium, low）
- summary：任务完成的用户友好摘要（可选）

**使用示例**：
```javascript
// 创建待办事项列表
TodoWrite({
  todos: [
    {
      content: "分析用户需求",
      status: "pending",
      id: "1",
      priority: "high"
    },
    {
      content: "设计解决方案",
      status: "pending",
      id: "2",
      priority: "high"
    },
    {
      content: "实现功能",
      status: "pending",
      id: "3",
      priority: "medium"
    },
    {
      content: "测试验证",
      status: "pending",
      id: "4",
      priority: "medium"
    }
  ]
});

// 更新待办事项状态
TodoWrite({
  todos: [
    {
      content: "分析用户需求",
      status: "completed",
      id: "1",
      priority: "high"
    },
    {
      content: "设计解决方案",
      status: "in_progress",
      id: "2",
      priority: "high"
    },
    {
      content: "实现功能",
      status: "pending",
      id: "3",
      priority: "medium"
    },
    {
      content: "测试验证",
      status: "pending",
      id: "4",
      priority: "medium"
    }
  ],
  summary: "完成了用户需求分析，明确了功能需求和技术实现方案"
});
```

### 示例6：mcp_Chrome_DevTools_MCP_navigate_page 工具

**功能说明**：导航页面到指定URL，或向后、向前、重新加载。

**参数**：
- type：导航类型（url, back, forward, reload）
- url：目标URL（仅当type=url时）
- ignoreCache：重新加载时是否忽略缓存
- handleBeforeUnload：如何处理beforeunload对话框
- initScript：下次导航前要执行的JavaScript脚本
- timeout：最大等待时间（毫秒）

**使用示例**：
```javascript
// 导航到指定URL
mcp_Chrome_DevTools_MCP_navigate_page({
  type: "url",
  url: "https://example.com"
});

// 重新加载页面
mcp_Chrome_DevTools_MCP_navigate_page({
  type: "reload",
  ignoreCache: true
});
```

### 示例7：mcp_Fetch_fetch 工具

**功能说明**：从互联网获取URL并可选地将其内容提取为markdown。

**参数**：
- url：要获取的URL
- max_length：返回的最大字符数（默认5000）
- start_index：返回输出的起始字符索引（默认0）
- raw：是否获取实际HTML内容（默认false）

**使用示例**：
```javascript
// 获取网页内容
mcp_Fetch_fetch({
  url: "https://example.com"
});

// 获取网页的原始HTML内容
mcp_Fetch_fetch({
  url: "https://example.com",
  raw: true
});
```

## 最佳实践

1. **合理选择工具**：根据具体任务选择合适的内置工具，例如搜索代码使用search或Grep，执行命令使用RunCommand。

2. **熟悉工具参数**：了解每个工具的参数和用法，确保正确传递参数。

3. **错误处理**：对于可能失败的操作，考虑添加错误处理机制。

4. **性能优化**：对于大型操作，注意性能优化，例如使用适当的搜索参数减少搜索范围。

5. **工具组合使用**：根据需要组合使用多个工具，例如先使用Read读取文件，然后使用Edit修改文件。

6. **遵循使用规则**：遵守每个工具的使用规则和最佳实践，例如Edit工具需要先使用Read获取最新文件内容。

## 常见问题与解决方案

### 问题1：工具调用失败
**解决方案**：
- 检查参数是否正确
- 确保文件路径是绝对路径
- 检查权限问题
- 查看错误信息并根据错误信息调整

### 问题2：搜索结果不准确
**解决方案**：
- 优化搜索关键词
- 使用更具体的搜索参数
- 尝试使用不同的搜索工具（如search vs Grep）

### 问题3：命令执行超时
**解决方案**：
- 对于长时间运行的命令，设置blocking为false
- 增加wait_ms_before_async值
- 检查命令是否陷入死循环

### 问题4：文件编辑失败
**解决方案**：
- 确保先使用Read获取最新文件内容
- 确保old_string在文件中是唯一的
- 检查文件权限

### 问题5：MCP工具使用困难
**解决方案**：
- 仔细阅读工具的参数说明
- 参考示例代码
- 从简单的使用开始，逐步掌握复杂用法

## 工具分类参考

### 1. 代码和文件操作工具
- SearchCodebase：代码库上下文搜索
- Glob：文件模式匹配
- LS：文件和目录列出
- Grep：代码搜索
- Read：文件读取
- Edit：文件编辑
- Write：文件写入
- DeleteFile：文件删除
- GetDiagnostics：代码诊断

### 2. 命令和进程管理工具
- RunCommand：命令执行
- CheckCommandStatus：命令状态检查
- StopCommand：命令停止

### 3. 搜索和信息获取工具
- search：代码库搜索
- WebSearch：网络搜索
- WebFetch：网页内容获取
- mcp_Fetch_fetch：网络内容获取

### 4. 交互和反馈工具
- AskUserQuestion：用户问题询问
- mcp_IMCP_Feedback_Enhanced_interactive_feedback：交互式反馈
- mcp_IMCP_Feedback_Enhanced_get_system_info：系统信息获取

### 5. 开发和调试工具
- mcp_Chrome_DevTools_MCP_*：Chrome DevTools相关工具（如click、navigate_page、evaluate_script等）
- mcp_Playwright_end_codegen_session：Playwright代码生成

### 6. 项目管理工具
- git-workflow-manager：Git工作流管理
- TodoWrite：任务管理
- OpenPreview：预览打开

### 7. 设计和创意工具
- mcp_Figma_AI_Bridge_get_figma_data：Figma数据获取
- mcp_Figma_AI_Bridge_download_figma_images：Figma图片下载

### 8. 其他工具
- Skill：技能执行
- mcp_Sequential_Thinking_sequentialthinking：顺序思考

## 总结

本技能提供了Trae内置工具的全面参考和使用指南，涵盖了核心内置工具和MCP工具的使用方法、示例代码、最佳实践和常见问题解决方案。通过掌握这些内置工具的使用技巧，可以提高开发效率和代码质量。