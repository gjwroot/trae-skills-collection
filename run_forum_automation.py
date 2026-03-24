#!/usr/bin/env python3
"""
执行论坛自动化技能的脚本
"""

import asyncio
import sys
import os

# 添加技能目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '.trae', 'skills', 'forum-automation'))

from forum_automation_v4 import main

async def run_forum_automation():
    print("开始执行论坛自动化技能...")
    print("=" * 60)
    
    # 创建一个模拟的mcp_context
    class MockMCPContext:
        async def run_mcp(self, server_name, tool_name, args):
            print(f"[MCP] {server_name}.{tool_name} - {args}")
            # 模拟返回结果
            return {"success": True}
    
    mcp_context = MockMCPContext()
    
    # 执行完整流程
    result = await main(mcp_context, mode="full")
    
    print("=" * 60)
    print("论坛自动化技能执行完成！")
    print(f"执行结果: {'成功' if result['success'] else '失败'}")
    print(f"会话ID: {result['session_id']}")
    print(f"报告目录: {result['report_dir']}")

if __name__ == "__main__":
    asyncio.run(run_forum_automation())
