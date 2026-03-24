class VisionChatAgent {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.previewImage = document.getElementById('previewImage');
        this.removeImage = document.getElementById('removeImage');
        this.initialTime = document.getElementById('initialTime');
        
        this.currentImage = null;
        this.messageHistory = [];
        this.dataStreams = { fps: 60, latency: 12 };
        
        this.init();
        this.startDataStreamUpdates();
    }
    
    init() {
        this.initialTime.textContent = this.formatTime(new Date());
        
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.messageInput.addEventListener('input', () => this.autoResize());
        
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeImage.addEventListener('click', () => this.clearImage());
        
        this.addVisualEffects();
    }
    
    addVisualEffects() {
        document.addEventListener('mousemove', (e) => this.createMouseTrail(e));
    }
    
    createMouseTrail(e) {
        if (Math.random() > 0.9) {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: rgba(0, 245, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                z-index: 9999;
                box-shadow: 0 0 10px rgba(0, 245, 255, 0.8);
                animation: trailFade 0.5s ease-out forwards;
            `;
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 500);
        }
    }
    
    startDataStreamUpdates() {
        setInterval(() => {
            this.dataStreams.fps = 55 + Math.floor(Math.random() * 10);
            this.dataStreams.latency = 8 + Math.floor(Math.random() * 10);
            this.updateDataDisplay();
        }, 2000);
    }
    
    updateDataDisplay() {
        const dataStreams = document.querySelectorAll('.data-value');
        if (dataStreams.length >= 2) {
            dataStreams[0].textContent = this.dataStreams.fps;
            dataStreams[1].textContent = this.dataStreams.latency + 'ms';
        }
    }
    
    formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 150) + 'px';
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImage = e.target.result;
                this.previewImage.src = this.currentImage;
                this.imagePreview.style.display = 'block';
                this.previewImage.style.animation = 'none';
                this.previewImage.offsetHeight;
                this.previewImage.style.animation = 'imageIn 0.4s ease-out';
            };
            reader.readAsDataURL(file);
        }
    }
    
    clearImage() {
        this.currentImage = null;
        this.imagePreview.style.display = 'none';
        this.fileInput.value = '';
    }
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text && !this.currentImage) return;
        
        this.sendBtn.style.transform = 'scale(0.95)';
        setTimeout(() => this.sendBtn.style.transform = '', 100);
        
        const userMessage = {
            type: 'user',
            text: text,
            image: this.currentImage,
            time: new Date()
        };
        
        this.addMessage(userMessage);
        this.messageHistory.push(userMessage);
        
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.clearImage();
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const assistantMessage = this.generateResponse(userMessage);
            this.addMessage(assistantMessage);
            this.messageHistory.push(assistantMessage);
        }, 1800 + Math.random() * 2000);
    }
    
    addMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}-message`;
        
        const avatarIcon = message.type === 'user' ? '◉' : '◎';
        
        let messageContent = '';
        if (message.image) {
            messageContent += `<img src="${message.image}" alt="上传的图片">`;
        }
        if (message.text) {
            const paragraphs = message.text.split('\n');
            paragraphs.forEach(p => {
                if (p.trim()) {
                    messageContent += `<p>${this.escapeHtml(p)}</p>`;
                }
            });
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-ring"></div>
                <span class="avatar-icon">${avatarIcon}</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${message.type === 'user' ? 'USER' : 'NEURAL AGENT'}</span>
                    <span class="message-timestamp">${this.formatTime(message.time)}</span>
                </div>
                <div class="message-text">
                    ${messageContent}
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.createMessageParticles(messageDiv);
    }
    
    createMessageParticles(messageEl) {
        const rect = messageEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const angle = (i / 8) * Math.PI * 2;
                const distance = 30 + Math.random() * 20;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${i % 2 === 0 ? '#00f5ff' : '#ff006e'};
                    border-radius: 50%;
                    pointer-events: none;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    z-index: 9999;
                    box-shadow: 0 0 10px currentColor;
                    animation: particleExplode 0.6s ease-out forwards;
                    --tx: ${x}px;
                    --ty: ${y}px;
                `;
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 600);
            }, i * 30);
        }
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'message assistant-message';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <div class="avatar-ring"></div>
                <span class="avatar-icon">◎</span>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">NEURAL AGENT</span>
                </div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    generateResponse(userMessage) {
        const responses = [];
        
        if (userMessage.image) {
            responses.push(
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ 视觉分析模块激活
▸ 图像数据已接收
▸ 神经网络处理中...

检测到图像输入！我可以帮你：
• 描述图像内容
• 分析视觉元素
• 回答关于图像的问题

请告诉我你想了解什么？
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                `▸ 图像上传成功 ✓
▸ 像素数据解码完成
▸ 视觉特征提取中...

这张图片看起来很有意思！你想让我：
1. 描述图片内容？
2. 分析某个特定元素？
3. 还是其他什么？

输入你的指令！`
            );
        } else {
            const lowerText = userMessage.text.toLowerCase();
            
            if (lowerText.includes('你好') || lowerText.includes('hi') || lowerText.includes('hello')) {
                responses.push(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ 问候协议已激活
▸ 用户识别成功
▸ 对话会话初始化

你好，用户！欢迎使用 VISION CHAT 系统。
我可以处理图像 + 文本的混合输入。
试试上传一张图片开始我们的对话！
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                    `▸ 神经连接建立 ✓
▸ 欢迎模式激活

嗨！很高兴见到你！
上传一张图片 + 输入你的问题 = 视觉对话
让我们开始吧！`
                );
            } else if (lowerText.includes('图片') || lowerText.includes('image') || lowerText.includes('图')) {
                responses.push(
                    `▸ 图像上传提示激活

点击左侧的 [UPLOAD] 按钮
选择一张图片
然后输入你关于图片的问题
系统将进行视觉分析并回复！`
                );
            } else if (lowerText.includes('帮助') || lowerText.includes('help')) {
                responses.push(
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
▸ 帮助系统激活

系统功能：
1. 图像上传与分析
2. 视觉内容描述
3. 混合对话模式

使用方法：
• 点击 UPLOAD 上传图片
• 在输入框中输入问题
• 点击 TRANSMIT 发送

快捷键：
• Enter：发送消息
• Shift+Enter：换行
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
                );
            } else if (lowerText.includes('再见') || lowerText.includes('bye')) {
                responses.push(
                    `▸ 会话结束协议激活
▸ 数据保存中...
▸ 神经连接断开

再见！期待下次与你对话。
VISION CHAT 系统离线中...`
                );
            } else if (lowerText.includes('谢谢') || lowerText.includes('thanks') || lowerText.includes('thank')) {
                responses.push(
                    `▸ 感谢接收 ✓

不客气！这是我应该做的。
还有什么我可以帮助你的吗？
随时上传图片继续对话！`
                );
            } else {
                responses.push(
                    `▸ 文本分析中...
▸ 语义理解完成

收到你的消息："${userMessage.text}"

这是个有趣的话题！
不过如果你上传一张图片，
我们可以进行更丰富的视觉对话。
要试试吗？`,
                    `▸ 消息已处理 ✓

关于"${userMessage.text}"，我收到了！

💡 提示：上传一张图片 + 文本
可以获得更强大的视觉交互体验！`
                );
            }
        }
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            type: 'assistant',
            text: randomResponse,
            image: null,
            time: new Date()
        };
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    @keyframes particleExplode {
        from {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
        }
    }
    
    @keyframes imageIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new VisionChatAgent();
});
