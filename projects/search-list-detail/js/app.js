const products = [
    {
        id: 1,
        name: "无线蓝牙耳机 Pro Max",
        category: "电子产品",
        price: 1299,
        description: "高品质无线蓝牙耳机，支持主动降噪，40小时超长续航，舒适佩戴设计",
        fullDescription: "这款无线蓝牙耳机 Pro Max 采用先进的主动降噪技术，能够有效隔绝外界噪音。40小时超长续航让您无需频繁充电。采用人体工学设计，长时间佩戴依然舒适。支持蓝牙5.0，连接稳定，音质清晰。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wireless%20bluetooth%20headphones%20black%20minimal%20product%20photography&image_size=square_hd",
        sku: "SKU-001",
        specs: {
            "品牌": "TechSound",
            "型号": "Pro Max",
            "连接方式": "蓝牙 5.0",
            "续航时间": "40小时",
            "重量": "250g",
            "颜色": "星空黑"
        }
    },
    {
        id: 2,
        name: "智能手表 S5",
        category: "电子产品",
        price: 2499,
        description: "多功能智能手表，支持心率监测、血氧检测、GPS定位",
        fullDescription: "智能手表 S5 是一款全方位健康管理智能手表。实时监测心率、血氧、睡眠质量。内置GPS定位，支持运动轨迹记录。防水等级50米，适合各种水上运动。支持多种运动模式，是您的最佳健身伴侣。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20watch%20minimal%20product%20photography%20modern&image_size=square_hd",
        sku: "SKU-002",
        specs: {
            "品牌": "SmartLife",
            "型号": "S5",
            "屏幕尺寸": "1.4英寸",
            "防水等级": "50米",
            "续航时间": "7天",
            "颜色": "深空灰"
        }
    },
    {
        id: 3,
        name: "简约办公椅",
        category: "家居用品",
        price: 899,
        description: "人体工学设计，舒适透气，可调节高度和靠背角度",
        fullDescription: "简约办公椅采用人体工学设计，完美贴合脊椎曲线。网布透气设计，久坐不闷热。可调节座椅高度和靠背角度，满足不同使用场景。高品质气压杆，安全可靠。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20office%20chair%20black%20modern%20design&image_size=square_hd",
        sku: "SKU-003",
        specs: {
            "品牌": "ComfortPlus",
            "型号": "Ergo-800",
            "材质": "网布+尼龙",
            "承重": "150kg",
            "可调节": "高度/靠背",
            "颜色": "经典黑"
        }
    },
    {
        id: 4,
        name: "纯棉休闲卫衣",
        category: "服装配饰",
        price: 299,
        description: "100%纯棉材质，柔软舒适，简约百搭款式",
        fullDescription: "这款纯棉休闲卫衣采用100%优质纯棉面料，柔软亲肤，透气性好。简约圆领设计，经典百搭。宽松版型，穿着自在无束缚。多色可选，适合各种搭配。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cotton%20hoodie%20minimal%20fashion%20photography&image_size=square_hd",
        sku: "SKU-004",
        specs: {
            "品牌": "UrbanWear",
            "材质": "100%纯棉",
            "尺码": "S/M/L/XL",
            "款式": "圆领",
            "季节": "春秋冬",
            "颜色": "米白色"
        }
    },
    {
        id: 5,
        name: "专业登山背包",
        category: "运动户外",
        price: 599,
        description: "60L大容量，防水耐磨，多功能分区设计",
        fullDescription: "专业登山背包采用高强度尼龙面料，防水耐磨。60L超大容量，科学分区设计。背负系统可调节，贴合人体曲线。多功能外挂点，方便携带登山装备。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=hiking%20backpack%20outdoor%20gear%20product%20photo&image_size=square_hd",
        sku: "SKU-005",
        specs: {
            "品牌": "TrailPro",
            "容量": "60L",
            "材质": "防水尼龙",
            "重量": "1.8kg",
            "背负系统": "可调节",
            "颜色": "军绿色"
        }
    },
    {
        id: 6,
        name: "机械键盘 RGB",
        category: "电子产品",
        price: 699,
        description: "Cherry青轴，全键无冲，RGB背光，铝合金面板",
        fullDescription: "这款机械键盘采用Cherry原装青轴，手感清脆，段落感强。全键无冲设计，游戏办公两不误。1680万色RGB背光，多种灯效模式。铝合金面板，质感出众，坚固耐用。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mechanical%20keyboard%20rgb%20gaming%20minimal&image_size=square_hd",
        sku: "SKU-006",
        specs: {
            "品牌": "KeyMaster",
            "轴体": "Cherry青轴",
            "按键数": "104键",
            "背光": "RGB",
            "接口": "USB-C",
            "颜色": "深空灰"
        }
    },
    {
        id: 7,
        name: "北欧风落地灯",
        category: "家居用品",
        price: 459,
        description: "简约北欧设计，三档调光，护眼LED光源",
        fullDescription: "北欧风落地灯采用简约线条设计，完美融入各种家居风格。三档调光，满足不同场景需求。护眼LED光源，无频闪，护视力。灯头可调节，随心调整照明角度。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=nordic%20floor%20lamp%20minimal%20design%20white&image_size=square_hd",
        sku: "SKU-007",
        specs: {
            "品牌": "LightStyle",
            "光源": "LED",
            "功率": "12W",
            "调光": "三档",
            "高度": "160cm",
            "颜色": "白色"
        }
    },
    {
        id: 8,
        name: "复古牛仔夹克",
        category: "服装配饰",
        price: 399,
        description: "经典复古版型，优质牛仔面料，经典百搭",
        fullDescription: "复古牛仔夹克采用经典版型设计，重现经典魅力。优质牛仔面料，经过水洗处理，柔软舒适。经典水洗蓝，百搭耐看。细节处彰显品质，是您衣橱必备单品。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20denim%20jacket%20fashion%20photography&image_size=square_hd",
        sku: "SKU-008",
        specs: {
            "品牌": "DenimCo",
            "材质": "100%棉牛仔",
            "尺码": "S/M/L/XL",
            "款式": "经典款",
            "洗水": "复古蓝",
            "季节": "春秋"
        }
    },
    {
        id: 9,
        name: "便携折叠自行车",
        category: "运动户外",
        price: 1899,
        description: "20寸轮径，7速变速，轻量化铝合金车架",
        fullDescription: "便携折叠自行车采用20寸轮径，7速变速系统。轻量化铝合金车架，骑行轻快。快速折叠设计，3秒折叠，方便携带和存放。适合城市通勤和短途出行。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=folding%20bicycle%20portable%20minimal%20product&image_size=square_hd",
        sku: "SKU-009",
        specs: {
            "品牌": "CycleLite",
            "轮径": "20寸",
            "变速": "7速",
            "材质": "铝合金",
            "折叠时间": "3秒",
            "颜色": "钛金色"
        }
    },
    {
        id: 10,
        name: "4K高清显示器",
        category: "电子产品",
        price: 2999,
        description: "27英寸4K IPS屏，100% sRGB色域，Type-C接口",
        fullDescription: "27英寸4K高清显示器采用IPS面板，色彩精准。100% sRGB色域，专业级色彩表现。Type-C接口支持视频传输和充电。低蓝光不闪屏，长时间使用不累眼。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=4k%20monitor%20design%20minimal%20workspace&image_size=square_hd",
        sku: "SKU-010",
        specs: {
            "品牌": "ViewPro",
            "尺寸": "27英寸",
            "分辨率": "4K",
            "色域": "100% sRGB",
            "接口": "HDMI/DP/Type-C",
            "颜色": "深空灰"
        }
    },
    {
        id: 11,
        name: "香薰蜡烛礼盒",
        category: "家居用品",
        price: 199,
        description: "天然大豆蜡，多种香型，精美礼盒包装",
        fullDescription: "香薰蜡烛礼盒采用天然大豆蜡制作，燃烧安全无烟。多种香型可选，薰衣草助眠、柑橘提神、玫瑰浪漫。精美礼盒包装，自用送礼两相宜。每支燃烧时间约40小时。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=candle%20gift%20set%20aesthetic%20minimal%20lifestyle&image_size=square_hd",
        sku: "SKU-011",
        specs: {
            "品牌": "AromaHome",
            "成分": "天然大豆蜡",
            "数量": "4支装",
            "单支燃烧": "40小时",
            "香型": "混合装",
            "包装": "礼盒"
        }
    },
    {
        id: 12,
        name: "运动休闲跑鞋",
        category: "运动户外",
        price: 799,
        description: "减震科技，透气网面，轻量化设计，适合日常慢跑",
        fullDescription: "运动休闲跑鞋采用最新减震科技，有效缓冲落地冲击力。透气网面设计，保持双脚干爽。轻量化设计，减轻足部负担。大底防滑耐磨，适合各种路面。是日常慢跑和休闲穿搭的理想选择。",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=running%20shoes%20athletic%20minimal%20product&image_size=square_hd",
        sku: "SKU-012",
        specs: {
            "品牌": "RunFast",
            "鞋面": "透气网面",
            "大底": "耐磨橡胶",
            "科技": "Air减震",
            "重量": "280g",
            "颜色": "黑白"
        }
    }
];

let currentProducts = [...products];
let viewState = 'list';

const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const productGrid = document.getElementById('productGrid');
const resultCount = document.getElementById('resultCount');
const listSection = document.getElementById('listSection');
const detailSection = document.getElementById('detailSection');
const detailContent = document.getElementById('detailContent');
const backBtn = document.getElementById('backBtn');

function renderProducts() {
    if (currentProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>没有找到匹配的产品</h3>
                <p>尝试修改搜索条件或筛选器</p>
            </div>
        `;
    } else {
        productGrid.innerHTML = currentProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }
    
    resultCount.textContent = `共 ${currentProducts.length} 件商品`;
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            showDetail(id);
        });
    });
}

function showDetail(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    viewState = 'detail';
    listSection.classList.add('hidden');
    detailSection.classList.add('visible');
    
    detailContent.innerHTML = `
        <div class="detail-image-wrapper">
            <img class="detail-image" src="${product.image}" alt="${product.name}">
        </div>
        <div class="detail-body">
            <div class="detail-meta">
                <span class="detail-category">${product.category}</span>
                <span class="detail-sku">${product.sku}</span>
            </div>
            <h2 class="detail-title">${product.name}</h2>
            <div class="detail-price">${product.price.toLocaleString()}</div>
            
            <h3 class="detail-section-title">产品介绍</h3>
            <p class="detail-description">${product.fullDescription}</p>
            
            <h3 class="detail-section-title">产品规格</h3>
            <ul class="detail-specs">
                ${Object.entries(product.specs).map(([key, value]) => `
                    <li>
                        <span class="spec-label">${key}</span>
                        <span class="spec-value">${value}</span>
                    </li>
                `).join('')}
            </ul>
            
            <div class="detail-actions">
                <button class="action-btn secondary">加入收藏</button>
                <button class="action-btn primary">立即购买</button>
            </div>
        </div>
    `;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideDetail() {
    viewState = 'list';
    detailSection.classList.remove('visible');
    setTimeout(() => {
        listSection.classList.remove('hidden');
    }, 150);
}

function filterAndSort() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    
    currentProducts = products.filter(product => {
        const matchSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        const matchCategory = !category || product.category === category;
        return matchSearch && matchCategory;
    });
    
    switch (sort) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            currentProducts.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
            break;
    }
    
    renderProducts();
}

searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'flex' : 'none';
    filterAndSort();
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filterAndSort();
    searchInput.focus();
});

categoryFilter.addEventListener('change', filterAndSort);
sortFilter.addEventListener('change', filterAndSort);

backBtn.addEventListener('click', hideDetail);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && viewState === 'detail') {
        hideDetail();
    }
});

renderProducts();