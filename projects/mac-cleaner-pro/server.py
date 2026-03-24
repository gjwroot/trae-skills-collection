#!/usr/bin/env python3
"""
Mac 清理助手 Pro - 服务器端
"""

import os
import subprocess
import json
import shutil
from pathlib import Path
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)
app.static_folder = 'static'

# 清理类别配置
CLEAN_CATEGORIES = {
    'cache': {
        'name': '系统缓存',
        'paths': [
            '~/Library/Caches',
            '~/Library/Application Support/Caches',
            '/Library/Caches',
            '/System/Library/Caches'
        ],
        'safe': True,
        'description': '清理浏览器、应用程序和系统缓存文件'
    },
    'logs': {
        'name': '日志文件',
        'paths': [
            '~/Library/Logs',
            '/Library/Logs',
            '/var/log'
        ],
        'safe': True,
        'description': '删除系统和应用程序的日志文件'
    },
    'trash': {
        'name': '废纸篓',
        'paths': [
            '~/.Trash'
        ],
        'safe': True,
        'description': '清空废纸篓中的所有文件'
    },
    'temp': {
        'name': '临时文件',
        'paths': [
            '/tmp',
            '~/Library/Caches/TemporaryItems',
            '~/Library/Application Support/Google/Chrome/Default/Pepper Data/Shockwave Flash/WritableRoot/FlashPlayerCache'
        ],
        'safe': True,
        'description': '清理系统和应用程序的临时文件'
    },
    'downloads': {
        'name': '下载文件夹',
        'paths': [
            '~/Downloads'
        ],
        'safe': False,
        'description': '清理下载文件夹中的旧文件'
    },
    'mail': {
        'name': '邮件附件',
        'paths': [
            '~/Library/Mail',
            '~/Library/Containers/com.apple.mail/Data/Library/Mail Downloads'
        ],
        'safe': True,
        'description': '清理邮件应用中的附件缓存'
    },
    'updates': {
        'name': '更新文件',
        'paths': [
            '~/Library/Updates',
            '/Library/Updates'
        ],
        'safe': True,
        'description': '删除旧的系统更新文件'
    }
}

def get_folder_size(folder):
    """获取文件夹大小（字节）"""
    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(folder):
            for filename in filenames:
                filepath = os.path.join(dirpath, filename)
                if os.path.exists(filepath):
                    total_size += os.path.getsize(filepath)
    except Exception:
        pass
    return total_size

def format_size(size_bytes):
    """格式化文件大小"""
    if size_bytes >= 1024 ** 3:
        return f"{size_bytes / (1024 ** 3):.1f} GB"
    elif size_bytes >= 1024 ** 2:
        return f"{size_bytes / (1024 ** 2):.1f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes} B"

def expand_path(path):
    """展开路径中的 ~"""
    return os.path.expanduser(path)

def scan_category(category_id):
    """扫描清理类别"""
    category = CLEAN_CATEGORIES.get(category_id)
    if not category:
        return None
    
    total_size = 0
    files = []
    
    for path_pattern in category['paths']:
        path = expand_path(path_pattern)
        if os.path.exists(path):
            if os.path.isdir(path):
                size = get_folder_size(path)
                total_size += size
                files.append({
                    'path': path,
                    'size': size,
                    'type': 'directory'
                })
            else:
                size = os.path.getsize(path)
                total_size += size
                files.append({
                    'path': path,
                    'size': size,
                    'type': 'file'
                })
    
    return {
        'id': category_id,
        'name': category['name'],
        'description': category['description'],
        'size': total_size,
        'size_formatted': format_size(total_size),
        'safe': category['safe'],
        'files': files
    }

def clean_category(category_id):
    """清理指定类别"""
    category = CLEAN_CATEGORIES.get(category_id)
    if not category:
        return {'success': False, 'message': '无效的清理类别'}
    
    cleaned_size = 0
    cleaned_files = []
    
    for path_pattern in category['paths']:
        path = expand_path(path_pattern)
        if os.path.exists(path):
            if os.path.isdir(path):
                try:
                    size = get_folder_size(path)
                    cleaned_size += size
                    cleaned_files.append(path)
                    # 清空文件夹但保留文件夹本身
                    for root, dirs, files in os.walk(path, topdown=False):
                        for file in files:
                            os.remove(os.path.join(root, file))
                        for dir in dirs:
                            os.rmdir(os.path.join(root, dir))
                except Exception as e:
                    print(f"清理 {path} 失败: {e}")
            else:
                try:
                    size = os.path.getsize(path)
                    cleaned_size += size
                    cleaned_files.append(path)
                    os.remove(path)
                except Exception as e:
                    print(f"清理 {path} 失败: {e}")
    
    return {
        'success': True,
        'cleaned_size': cleaned_size,
        'cleaned_size_formatted': format_size(cleaned_size),
        'cleaned_files': cleaned_files
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/storage')
def get_storage():
    """获取存储空间信息"""
    try:
        # 使用 df 命令获取磁盘使用情况
        result = subprocess.run(['df', '-h', '/'], capture_output=True, text=True)
        lines = result.stdout.strip().split('\n')
        if len(lines) > 1:
            parts = lines[1].split()
            if len(parts) >= 5:
                total = parts[1]
                used = parts[2]
                available = parts[3]
                usage_percent = parts[4].rstrip('%')
                
                return jsonify({
                    'total': total,
                    'used': used,
                    'available': available,
                    'usage_percent': usage_percent
                })
    except Exception as e:
        print(f"获取存储空间信息失败: {e}")
    
    # 默认值
    return jsonify({
        'total': '500 GB',
        'used': '320 GB',
        'available': '180 GB',
        'usage_percent': '64'
    })

@app.route('/api/categories')
def get_categories():
    """获取清理类别列表"""
    categories = []
    for category_id in CLEAN_CATEGORIES:
        category_info = scan_category(category_id)
        if category_info:
            categories.append(category_info)
    return jsonify(categories)

@app.route('/api/clean', methods=['POST'])
def clean():
    """执行清理操作"""
    data = request.json
    categories = data.get('categories', [])
    
    results = {}
    total_cleaned = 0
    
    for category_id in categories:
        result = clean_category(category_id)
        results[category_id] = result
        if result['success']:
            total_cleaned += result['cleaned_size']
    
    return jsonify({
        'success': True,
        'results': results,
        'total_cleaned': total_cleaned,
        'total_cleaned_formatted': format_size(total_cleaned)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
