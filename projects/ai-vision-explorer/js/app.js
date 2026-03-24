const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const detectionBox = document.getElementById('detectionBox');
const analyzeBtn = document.getElementById('analyzeBtn');
const resetBtn = document.getElementById('resetBtn');
const analysisSection = document.getElementById('analysisSection');
const featuresGrid = document.getElementById('featuresGrid');
const heatmapContainer = document.getElementById('heatmapContainer');

const mockLabels = [
    { name: 'Kobe Bryant', confidence: 0.87 },
    { name: 'Ice Cream', confidence: 0.72 },
    { name: 'Basketball', confidence: 0.65 },
    { name: 'Chocolate', confidence: 0.58 },
    { name: 'Person', confidence: 0.52 }
];

const featureEmojis = ['🔴', '🔵', '🟡', '��', '🟣', '⚫', '⚪', '🔶', '🔷', '🔸', '🔹', '��', '📏', '🎨', '🖼️', '📊'];

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleImage(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

analyzeBtn.addEventListener('click', startAnalysis);

resetBtn.addEventListener('click', reset);

function startAnalysis() {
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '🔄 分析中...';
    
    setTimeout(() => {
        showDetectionBox();
        
        setTimeout(() => {
            showAnalysisResults();
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = '🔬 开始分析';
        }, 1500);
    }, 500);
}

function showDetectionBox() {
    detectionBox.style.top = '20%';
    detectionBox.style.left = '15%';
    detectionBox.style.width = '70%';
    detectionBox.style.height = '60%';
    detectionBox.classList.add('active');
}

function showAnalysisResults() {
    analysisSection.style.display = 'block';
    
    updateRecognitionResults();
    generateFeatures();
    generateHeatmap();
    
    analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateRecognitionResults() {
    const top3 = mockLabels.slice(0, 3);
    
    document.getElementById('top1').textContent = top3[0].name;
    document.getElementById('conf1').textContent = Math.round(top3[0].confidence * 100) + '%';
    
    document.getElementById('top2').textContent = top3[1].name;
    document.getElementById('conf2').textContent = Math.round(top3[1].confidence * 100) + '%';
    
    document.getElementById('top3').textContent = top3[2].name;
    document.getElementById('conf3').textContent = Math.round(top3[2].confidence * 100) + '%';
}

function generateFeatures() {
    featuresGrid.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const featureBox = document.createElement('div');
        featureBox.className = 'feature-box';
        featureBox.textContent = featureEmojis[i % featureEmojis.length];
        featureBox.style.animationDelay = (i * 0.1) + 's';
        featuresGrid.appendChild(featureBox);
    }
}

function generateHeatmap() {
    heatmapContainer.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    canvas.className = 'heatmap-canvas';
    heatmapContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 300;
    
    const gradient = ctx.createRadialGradient(300, 150, 0, 300, 150, 200);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 204, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(168, 85, 247, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 30 + 10;
        const alpha = Math.random() * 0.5 + 0.2;
        
        const spotGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        spotGradient.addColorStop(0, 'rgba(0, 255, 136, ' + alpha + ')');
        spotGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = spotGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function reset() {
    fileInput.value = '';
    previewImage.src = '';
    uploadArea.style.display = 'block';
    imagePreview.style.display = 'none';
    analysisSection.style.display = 'none';
    detectionBox.classList.remove('active');
    featuresGrid.innerHTML = '';
    heatmapContainer.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    heatmapContainer.innerHTML = '<div class="heatmap-placeholder">上传图片并点击"开始分析"查看热力图</div>';
});
