const categories = [
    {
        id: 'cache',
        icon: '🗑️',
        name: '系统缓存',
        description: '清理浏览器、应用程序和系统缓存文件',
        size: '2.5 GB',
        sizeMB: 2560,
        safe: true
    },
    {
        id: 'logs',
        icon: '📝',
        name: '日志文件',
        description: '删除系统和应用程序的日志文件',
        size: '800 MB',
        sizeMB: 800,
        safe: true
    },
    {
        id: 'trash',
        icon: '🗑️',
        name: '废纸篓',
        description: '清空废纸篓中的所有文件',
        size: '5.2 GB',
        sizeMB: 5325,
        safe: true
    },
    {
        id: 'temp',
        icon: '⚡',
        name: '临时文件',
        description: '清理系统和应用程序的临时文件',
        size: '1.8 GB',
        sizeMB: 1843,
        safe: true
    },
    {
        id: 'downloads',
        icon: '📥',
        name: '下载文件夹',
        description: '清理下载文件夹中的旧文件',
        size: '12.5 GB',
        sizeMB: 12800,
        safe: false
    },
    {
        id: 'mail',
        icon: '📧',
        name: '邮件附件',
        description: '清理邮件应用中的附件缓存',
        size: '3.2 GB',
        sizeMB: 3277,
        safe: true
    },
    {
        id: 'updates',
        icon: '🔄',
        name: '更新文件',
        description: '删除旧的系统更新文件',
        size: '4.5 GB',
        sizeMB: 4608,
        safe: true
    },
    {
        id: 'duplicates',
        icon: '📋',
        name: '重复文件',
        description: '查找并清理重复的文件',
        size: '6.8 GB',
        sizeMB: 6963,
        safe: false
    }
];

let selectedCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderCategories();
});

function initStorage() {
    const totalStorage = 500;
    const usedStorage = 320;
    const percentage = (usedStorage / totalStorage) * 100;
    
    setTimeout(() => {
        document.getElementById('storageUsed').style.width = percentage + '%';
        document.getElementById('usedText').textContent = `已使用: ${usedStorage} GB`;
        document.getElementById('totalText').textContent = `总计: ${totalStorage} GB`;
    }, 500);
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
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-description">${category.description}</div>
            <div class="category-size">可释放: ${category.size}</div>
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
        total += category.sizeMB;
        
        const item = document.createElement('div');
        item.className = 'selected-item';
        item.textContent = `${category.icon} ${category.name}`;
        list.appendChild(item);
    });
    
    if (total >= 1024) {
        totalSavings.textContent = (total / 1024).toFixed(1) + ' GB';
    } else {
        totalSavings.textContent = total + ' MB';
    }
}

function startCleaning() {
    if (selectedCategories.length === 0) return;
    
    const modal = document.getElementById('cleaningModal');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    modal.classList.add('show');
    
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
            setTimeout(showSuccess, 800);
        }
    }, 200);
}

function showSuccess() {
    document.getElementById('cleaningModal').classList.remove('show');
    
    const successModal = document.getElementById('successModal');
    const savedSpace = document.getElementById('savedSpace');
    
    let total = 0;
    selectedCategories.forEach(id => {
        const category = categories.find(c => c.id === id);
        total += category.sizeMB;
    });
    
    if (total >= 1024) {
        savedSpace.textContent = `已释放: ${(total / 1024).toFixed(1)} GB`;
    } else {
        savedSpace.textContent = `已释放: ${total} MB`;
    }
    
    successModal.classList.add('show');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('show');
    
    selectedCategories = [];
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSelectedList();
    
    const storageUsed = document.getElementById('storageUsed');
    const currentWidth = parseFloat(storageUsed.style.width);
    storageUsed.style.width = Math.max(0, currentWidth - 15) + '%';
}
