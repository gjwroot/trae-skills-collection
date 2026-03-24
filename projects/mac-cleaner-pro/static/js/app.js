let categories = [];
let selectedCategories = [];
const icons = {
    'cache': '🗑️',
    'logs': '📝',
    'trash': '🗑️',
    'temp': '⚡',
    'downloads': '📥',
    'mail': '📧',
    'updates': '🔄'
};

document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    loadCategories();
});

async function initStorage() {
    try {
        const response = await fetch('/api/storage');
        const data = await response.json();
        
        const percentage = parseInt(data.usage_percent);
        document.getElementById('storageUsed').style.width = percentage + '%';
        document.getElementById('usedText').textContent = `已使用: ${data.used}`;
        document.getElementById('totalText').textContent = `总计: ${data.total}`;
    } catch (error) {
        console.error('获取存储空间信息失败:', error);
        // 使用默认值
        document.getElementById('storageUsed').style.width = '64%';
        document.getElementById('usedText').textContent = '已使用: 320 GB';
        document.getElementById('totalText').textContent = '总计: 500 GB';
    }
}

async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('获取清理类别失败:', error);
        // 显示错误信息
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = '<p style="text-align: center; color: #ff6b6b;">加载失败，请刷新页面重试</p>';
    }
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';
    
    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.id = category.id;
        card.onclick = () => toggleCategory(category.id);
        
        card.innerHTML = `
            <div class="category-icon">${icons[category.id] || '📁'}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-description">${category.description}</div>
            <div class="category-size">可释放: ${category.size_formatted}</div>
            <div class="category-safety ${category.safe ? '' : 'caution'}">
                ${category.safe ? '✅ 安全' : '⚠️ 需确认'}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function toggleCategory(id) {
    const index = selectedCategories.indexOf(id);
    const card = document.querySelector(`[data-id="${id}"]`);
    
    if (index > -1) {
        selectedCategories.splice(index, 1);
        card.classList.remove('selected');
    } else {
        selectedCategories.push(id);
        card.classList.add('selected');
    }
    
    updateSelectedList();
}

function updateSelectedList() {
    const section = document.getElementById('selectedSection');
    const list = document.getElementById('selectedList');
    const totalSavings = document.getElementById('totalSavings');
    
    if (selectedCategories.length === 0) {
        section.classList.remove('show');
        return;
    }
    
    section.classList.add('show');
    list.innerHTML = '';
    
    let total = 0;
    
    selectedCategories.forEach(id => {
        const category = categories.find(c => c.id === id);
        total += category.size;
        
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.textContent = `${icons[id] || '📁'} ${category.name}`;
        list.appendChild(item);
    });
    
    if (total >= 1024 ** 3) {
        totalSavings.textContent = (total / (1024 ** 3)).toFixed(1) + ' GB';
    } else if (total >= 1024 ** 2) {
        totalSavings.textContent = (total / (1024 ** 2)).toFixed(1) + ' MB';
    } else if (total >= 1024) {
        totalSavings.textContent = (total / 1024).toFixed(1) + ' KB';
    } else {
        totalSavings.textContent = total + ' B';
    }
}

async function startCleaning() {
    if (selectedCategories.length === 0) return;
    
    const modal = document.getElementById('cleaningModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    modal.classList.add('show');
    
    try {
        const response = await fetch('/api/clean', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categories: selectedCategories })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 模拟清理进度
            let progress = 0;
            let currentStep = 0;
            
            const steps = [
                '正在分析选中的项目...',
                '正在清理系统缓存...',
                '正在删除日志文件...',
                '正在清空废纸篓...',
                '正在清理临时文件...',
                '正在优化存储空间...',
                '即将完成...'
            ];
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = progress + '%';
                
                if (progress > (currentStep + 1) * (100 / steps.length) && currentStep < steps.length - 1) {
                    currentStep++;
                }
                
                progressText.textContent = steps[currentStep];
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => showSuccess(result.total_cleaned_formatted), 800);
                }
            }, 200);
        }
    } catch (error) {
        console.error('清理失败:', error);
        modal.classList.remove('show');
        alert('清理失败，请检查权限并重试');
    }
}

function showSuccess(savedSpace) {
    document.getElementById('cleaningModal').classList.remove('show');
    
    const successModal = document.getElementById('successModal');
    const savedSpaceElement = document.getElementById('savedSpace');
    
    savedSpaceElement.textContent = `已释放: ${savedSpace}`;
    successModal.classList.add('show');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
    
    // 重置选择
    selectedCategories = [];
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedList();
    
    // 重新加载存储空间信息
    initStorage();
}
