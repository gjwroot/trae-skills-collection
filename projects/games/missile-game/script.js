class MissileGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.angleInput = document.getElementById('angle');
        this.angleValue = document.getElementById('angleValue');
        this.powerInput = document.getElementById('power');
        this.powerValue = document.getElementById('powerValue');
        this.fireButton = document.getElementById('fireButton');
        this.resetButton = document.getElementById('resetButton');
        this.scoreElement = document.getElementById('score');
        this.roundElement = document.getElementById('round');
        
        this.score = 0;
        this.round = 1;
        this.attempts = 3;
        this.isFiring = false;
        this.missile = null;
        this.target = null;
        this.gravity = 0.5;
        this.wind = 0;
        this.angle = 45;
        this.power = 50;
        this.mouseX = 450;
        this.mouseY = 200;
        this.pressStartTime = 0;
        this.isPressing = false;
        
        this.init();
        this.setupEventListeners();
        this.resetGame();
        this.animate();
    }
    
    init() {
        this.canvas.width = 800;
        this.canvas.height = 400;
    }
    
    setupEventListeners() {
        // 鼠标移动事件，用于控制角度
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            this.calculateAngle();
        });
        
        // 画布点击事件，支持任意位置点击蓄力
        this.canvas.addEventListener('mousedown', () => {
            if (this.isFiring || this.attempts <= 0) return;
            this.isPressing = true;
            this.pressStartTime = Date.now();
            this.power = 10;
            this.updatePowerDisplay();
        });
        
        this.canvas.addEventListener('mouseup', () => {
            if (this.isPressing) {
                this.isPressing = false;
                this.fireMissile();
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            if (this.isPressing) {
                this.isPressing = false;
                this.fireMissile();
            }
        });
        
        // 发射按钮事件，保持兼容性
        this.fireButton.addEventListener('mousedown', () => {
            if (this.isFiring || this.attempts <= 0) return;
            this.isPressing = true;
            this.pressStartTime = Date.now();
            this.power = 10;
            this.updatePowerDisplay();
        });
        
        this.fireButton.addEventListener('mouseup', () => {
            if (this.isPressing) {
                this.isPressing = false;
                this.fireMissile();
            }
        });
        
        this.fireButton.addEventListener('mouseleave', () => {
            if (this.isPressing) {
                this.isPressing = false;
                this.fireMissile();
            }
        });
        
        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });
    }
    
    calculateAngle() {
        const cannonX = 50;
        const cannonY = this.canvas.height - 30;
        const dx = this.mouseX - cannonX;
        const dy = cannonY - this.mouseY;
        
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        angle = Math.max(0, Math.min(90, angle));
        this.angle = angle;
        this.angleValue.textContent = `${Math.round(angle)}°`;
    }
    
    updatePowerDisplay() {
        this.powerValue.textContent = Math.round(this.power);
    }
    
    resetGame() {
        this.isFiring = false;
        this.missile = null;
        this.targets = [];
        this.generateTargets();
        this.attempts = 3;
        this.render();
    }
    
    generateTargets() {
        // 生成主要目标（大灯笼）
        const minX = 400;
        const maxX = this.canvas.width - 60;
        const minY = 50;
        const maxY = this.canvas.height - 80;
        
        const mainTarget = {
            x: Math.random() * (maxX - minX) + minX,
            y: Math.random() * (maxY - minY) + minY,
            width: 50,
            height: 60,
            color: '#e74c3c',
            type: 'main',
            score: 100
        };
        
        this.targets.push(mainTarget);
        
        // 生成小灯笼目标（可攻击）
        for (let i = 0; i < 3; i++) {
            const smallTarget = {
                x: 150 + i * 180,
                y: 60 + Math.sin(i) * 30,
                width: 20,
                height: 25,
                color: '#e74c3c',
                type: 'small',
                score: 50
            };
            this.targets.push(smallTarget);
        }
    }
    
    fireMissile() {
        if (this.isFiring || this.attempts <= 0) return;
        
        this.isFiring = true;
        this.attempts--;
        
        // 添加发射动画
        this.fireButton.classList.add('fire-animation');
        setTimeout(() => {
            this.fireButton.classList.remove('fire-animation');
        }, 300);
        
        // 计算初始速度
        const radians = (this.angle * Math.PI) / 180;
        const velocity = this.power * 0.3;
        
        this.missile = {
            x: 50,
            y: this.canvas.height - 50,
            vx: Math.cos(radians) * velocity,
            vy: -Math.sin(radians) * velocity,
            radius: 8,
            color: '#3498db',
            trail: []
        };
    }
    
    updateMissile() {
        if (!this.missile) return;
        
        // 记录轨迹
        this.missile.trail.push({x: this.missile.x, y: this.missile.y});
        if (this.missile.trail.length > 20) {
            this.missile.trail.shift();
        }
        
        // 更新位置
        this.missile.x += this.missile.vx + this.wind;
        this.missile.y += this.missile.vy;
        this.missile.vy += this.gravity;
        
        // 检查是否击中目标
        const hitTarget = this.checkCollisions();
        if (hitTarget) {
            this.score += hitTarget.score;
            this.scoreElement.textContent = this.score;
            
            // 从目标列表中移除被击中的目标
            const index = this.targets.findIndex(target => 
                target.x === hitTarget.x && target.y === hitTarget.y
            );
            if (index > -1) {
                this.targets.splice(index, 1);
            }
            
            // 如果所有目标都被击中，重置游戏
            if (this.targets.length === 0) {
                this.resetGame();
            } else {
                // 否则继续游戏
                this.isFiring = false;
                this.missile = null;
            }
            return;
        }
        
        // 检查是否飞出画布或落地
        if (this.missile.x > this.canvas.width || 
            this.missile.y > this.canvas.height || 
            this.missile.x < 0 || 
            this.missile.y < 0) {
            this.isFiring = false;
            this.missile = null;
            
            if (this.attempts <= 0) {
                this.round++;
                this.roundElement.textContent = this.round;
                this.resetGame();
            }
        }
    }
    
    checkCollisions() {
        if (!this.missile || !this.targets) return null;
        
        for (const target of this.targets) {
            const dx = this.missile.x - (target.x + target.width / 2);
            const dy = this.missile.y - (target.y + target.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const targetRadius = Math.min(target.width, target.height) / 2;
            
            if (distance < this.missile.radius + targetRadius) {
                return target;
            }
        }
        
        return null;
    }
    
    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制春节背景
        this.ctx.fillStyle = '#fffaf0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制地面
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
        
        // 绘制发射器（改为春节特色，更时髦）
        const cannonBaseX = 30;
        const cannonBaseY = this.canvas.height - 50;
        const cannonBaseWidth = 50;
        const cannonBaseHeight = 30;
        
        // 绘制炮台底座
        const baseGradient = this.ctx.createLinearGradient(cannonBaseX, cannonBaseY, cannonBaseX + cannonBaseWidth, cannonBaseY + cannonBaseHeight);
        baseGradient.addColorStop(0, '#34495e');
        baseGradient.addColorStop(1, '#2c3e50');
        
        this.ctx.fillStyle = baseGradient;
        this.roundRect(cannonBaseX, cannonBaseY, cannonBaseWidth, cannonBaseHeight, 8);
        this.ctx.fill();
        
        // 绘制炮台装饰
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(cannonBaseX + cannonBaseWidth / 2, cannonBaseY + cannonBaseHeight / 2, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制炮筒
        const radians = (this.angle * Math.PI) / 180;
        const cannonLength = 60;
        const cannonStartX = cannonBaseX + cannonBaseWidth;
        const cannonStartY = cannonBaseY + cannonBaseHeight / 2;
        const cannonEndX = cannonStartX + Math.cos(radians) * cannonLength;
        const cannonEndY = cannonStartY - Math.sin(radians) * cannonLength;
        
        // 炮筒渐变
        const cannonGradient = this.ctx.createLinearGradient(cannonStartX, cannonStartY, cannonEndX, cannonEndY);
        cannonGradient.addColorStop(0, '#34495e');
        cannonGradient.addColorStop(1, '#7f8c8d');
        
        // 绘制炮筒主体
        this.ctx.beginPath();
        this.ctx.lineWidth = 12;
        this.ctx.strokeStyle = cannonGradient;
        this.ctx.lineCap = 'round';
        this.ctx.moveTo(cannonStartX, cannonStartY);
        this.ctx.lineTo(cannonEndX, cannonEndY);
        this.ctx.stroke();
        
        // 绘制炮筒内部
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.moveTo(cannonStartX + 2, cannonStartY);
        this.ctx.lineTo(cannonEndX - Math.cos(radians) * 10, cannonEndY + Math.sin(radians) * 10);
        this.ctx.stroke();
        
        // 绘制炮筒装饰环
        this.ctx.beginPath();
        this.ctx.arc(cannonStartX, cannonStartY, 8, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(cannonStartX, cannonStartY, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#34495e';
        this.ctx.fill();
        
        // 绘制抛物线轨迹预测
        this.drawTrajectory();
        
        // 绘制蓄力效果
        if (this.isPressing) {
            this.drawPowerEffect();
        }
        
        // 绘制目标（改为灯笼）
        if (this.targets) {
            for (const target of this.targets) {
                this.drawLantern(target.x, target.y, target.width, target.height);
            }
        }
        
        // 绘制飞弹（改为爆竹）
        if (this.missile) {
            // 绘制轨迹
            if (this.missile.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.missile.trail[0].x, this.missile.trail[0].y);
                for (let i = 1; i < this.missile.trail.length; i++) {
                    this.ctx.lineTo(this.missile.trail[i].x, this.missile.trail[i].y);
                }
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
                this.ctx.stroke();
            }
            
            // 绘制爆竹
            this.drawFirecracker(this.missile.x, this.missile.y, this.missile.radius);
            
            // 绘制爆竹尾部火焰
            this.ctx.beginPath();
            this.ctx.arc(this.missile.x - this.missile.vx * 0.5, this.missile.y - this.missile.vy * 0.5, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ff4500';
            this.ctx.fill();
        }
        
        // 绘制春节装饰
        this.drawSpringFestivalDecorations();
        
        // 绘制剩余次数
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillText(`剩余次数: ${this.attempts}`, 20, 30);
        
        // 绘制风力
        if (this.wind !== 0) {
            const windDirection = this.wind > 0 ? '→' : '←';
            const windStrength = Math.abs(this.wind).toFixed(1);
            this.ctx.font = '16px Arial';
            this.ctx.fillStyle = '#8b0000';
            this.ctx.fillText(`风力: ${windDirection} ${windStrength}`, 150, 30);
        }
        
        // 绘制力度显示
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#8b0000';
        this.ctx.fillText(`力度: ${Math.round(this.power)}`, 300, 30);
    }
    
    drawLantern(x, y, width, height) {
        // 绘制灯笼
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        // 灯笼主体（使用圆角矩形）
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 绘制灯笼主体渐变
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff4500');
        gradient.addColorStop(0.5, '#e74c3c');
        gradient.addColorStop(1, '#c0392b');
        
        this.ctx.fillStyle = gradient;
        this.roundRect(0, 0, width, height, 8);
        this.ctx.fill();
        
        // 灯笼顶部和底部
        const topBottomGradient = this.ctx.createLinearGradient(0, 0, width, 10);
        topBottomGradient.addColorStop(0, '#d35400');
        topBottomGradient.addColorStop(1, '#a0522d');
        
        this.ctx.fillStyle = topBottomGradient;
        this.roundRect(0, 0, width, 8, 4);
        this.ctx.fill();
        this.roundRect(0, height - 8, width, 8, 4);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // 灯笼绳子
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, y);
        this.ctx.lineTo(centerX, y - 20);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#d35400';
        this.ctx.stroke();
        
        // 灯笼穗子
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, y + height);
        this.ctx.lineTo(centerX - 12, y + height + 20);
        this.ctx.lineTo(centerX - 6, y + height + 15);
        this.ctx.lineTo(centerX, y + height + 25);
        this.ctx.lineTo(centerX + 6, y + height + 15);
        this.ctx.lineTo(centerX + 12, y + height + 20);
        this.ctx.closePath();
        
        const tasselGradient = this.ctx.createLinearGradient(centerX - 12, y + height, centerX + 12, y + height + 25);
        tasselGradient.addColorStop(0, '#ffd700');
        tasselGradient.addColorStop(1, '#ffed4e');
        
        this.ctx.fillStyle = tasselGradient;
        this.ctx.fill();
        
        // 灯笼图案（时髦的几何图案）
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // 绘制几何图案
        this.ctx.beginPath();
        this.ctx.moveTo(-width / 4, 0);
        this.ctx.lineTo(width / 4, 0);
        this.ctx.moveTo(0, -height / 4);
        this.ctx.lineTo(0, height / 4);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.stroke();
        
        // 绘制装饰圆点
        this.ctx.beginPath();
        this.ctx.arc(-width / 4, -height / 4, 3, 0, Math.PI * 2);
        this.ctx.arc(width / 4, -height / 4, 3, 0, Math.PI * 2);
        this.ctx.arc(-width / 4, height / 4, 3, 0, Math.PI * 2);
        this.ctx.arc(width / 4, height / 4, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        
        this.ctx.restore();
        
        // 绘制灯笼高光
        this.ctx.beginPath();
        this.ctx.arc(centerX - width / 4, centerY - height / 4, width / 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fill();
    }
    
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
    
    drawFirecracker(x, y, radius) {
        // 绘制爆竹
        const length = radius * 4;
        const angle = Math.atan2(this.missile.vy, this.missile.vx);
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);
        
        // 爆竹主体渐变
        const firecrackerGradient = this.ctx.createLinearGradient(-radius / 2, -length / 2, radius / 2, length / 2);
        firecrackerGradient.addColorStop(0, '#8b0000');
        firecrackerGradient.addColorStop(0.5, '#a00000');
        firecrackerGradient.addColorStop(1, '#8b0000');
        
        this.ctx.fillStyle = firecrackerGradient;
        this.roundRect(-radius / 2, -length / 2, radius, length, 4);
        this.ctx.fill();
        
        // 爆竹装饰
        this.ctx.fillStyle = '#ffd700';
        for (let i = 0; i < 3; i++) {
            const decorationY = -length / 2 + (length / 4) * (i + 1);
            this.ctx.beginPath();
            this.ctx.arc(0, decorationY, radius / 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 爆竹引线
        this.ctx.beginPath();
        this.ctx.moveTo(0, -length / 2);
        this.ctx.lineTo(0, -length - 5);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#d35400';
        this.ctx.stroke();
        
        // 爆竹火花
        this.ctx.beginPath();
        this.ctx.arc(0, -length - 5, 3, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff4500';
        this.ctx.fill();
        
        // 火花粒子效果
        for (let i = 0; i < 3; i++) {
            const particleAngle = (Math.random() - 0.5) * Math.PI;
            const particleDistance = Math.random() * 5;
            const particleX = Math.cos(particleAngle) * particleDistance;
            const particleY = -length - 5 + Math.sin(particleAngle) * particleDistance;
            
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ff4500';
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    drawSpringFestivalDecorations() {
        // 绘制春节装饰
        
        // 绘制远处的灯笼
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 150;
            const y = 50 + Math.sin(i) * 20;
            this.drawSmallLantern(x, y);
        }
        
        // 绘制祥云
        this.drawCloud(150, 80);
        this.drawCloud(650, 60);
        
        // 绘制烟花效果（随机）
        if (Math.random() > 0.95) {
            this.drawFirework(Math.random() * this.canvas.width, Math.random() * this.canvas.height / 2);
        }
    }
    
    drawSmallLantern(x, y) {
        // 绘制小灯笼
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y - 10);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#d35400';
        this.ctx.stroke();
    }
    
    drawCloud(x, y) {
        // 绘制祥云
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 5, 15, 0, Math.PI * 2);
        this.ctx.arc(x + 30, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y + 5, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawFirework(x, y) {
        // 绘制烟花
        const colors = [
            ['#ff0000', '#ff6666'],
            ['#ffd700', '#ffff66'],
            ['#00ff00', '#66ff66'],
            ['#00ffff', '#66ffff'],
            ['#ff00ff', '#ff66ff']
        ];
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        const primaryColor = colorSet[0];
        const secondaryColor = colorSet[1];
        
        // 绘制主烟花
        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 * i) / 50;
            const distance = Math.random() * 40 + 20;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            const gradient = this.ctx.createLinearGradient(x, y, endX, endY);
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, secondaryColor);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(endX, endY);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = gradient;
            this.ctx.stroke();
            
            // 绘制烟花粒子
            this.ctx.beginPath();
            this.ctx.arc(endX, endY, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = primaryColor;
            this.ctx.fill();
        }
        
        // 绘制内圈烟花
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const distance = Math.random() * 20 + 10;
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            this.ctx.beginPath();
            this.ctx.arc(endX, endY, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = secondaryColor;
            this.ctx.fill();
        }
        
        // 绘制中心亮点
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
    }
    
    drawTrajectory() {
        // 绘制抛物线轨迹预测
        const radians = (this.angle * Math.PI) / 180;
        const velocity = this.power * 0.3;
        const startX = 50;
        const startY = this.canvas.height - 50;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        
        let x = startX;
        let y = startY;
        let vx = Math.cos(radians) * velocity;
        let vy = -Math.sin(radians) * velocity;
        
        for (let i = 0; i < 100; i++) {
            x += vx;
            y += vy;
            vy += this.gravity;
            
            if (x > this.canvas.width || y > this.canvas.height || x < 0 || y < 0) {
                break;
            }
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
        this.ctx.stroke();
    }
    
    drawPowerEffect() {
        // 绘制蓄力效果
        const powerPercentage = (this.power - 10) / 90;
        const cannonX = 50;
        const cannonY = this.canvas.height - 30;
        const radians = (this.angle * Math.PI) / 180;
        
        // 绘制蓄力光环
        this.ctx.beginPath();
        this.ctx.arc(cannonX, cannonY, 20 + powerPercentage * 15, 0, Math.PI * 2);
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = `rgba(230, 126, 34, ${0.3 + powerPercentage * 0.7})`;
        this.ctx.stroke();
        
        // 绘制蓄力粒子效果
        for (let i = 0; i < 5; i++) {
            const particleAngle = radians + (Math.random() - 0.5) * Math.PI / 3;
            const particleDistance = 30 + powerPercentage * 20;
            const particleX = cannonX + Math.cos(particleAngle) * particleDistance;
            const particleY = cannonY - Math.sin(particleAngle) * particleDistance;
            
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(230, 126, 34, ${0.5 + powerPercentage * 0.5})`;
            this.ctx.fill();
        }
        
        // 绘制力度条
        const barWidth = 200;
        const barHeight = 10;
        const barX = 50;
        const barY = this.canvas.height - 60;
        
        // 背景条
        this.ctx.fillStyle = 'rgba(127, 140, 141, 0.3)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // 力度条
        const fillWidth = (powerPercentage * barWidth);
        this.ctx.fillStyle = `hsl(${20 + powerPercentage * 40}, 100%, 50%)`;
        this.ctx.fillRect(barX, barY, fillWidth, barHeight);
        
        // 力度条边框
        this.ctx.strokeStyle = 'rgba(52, 73, 94, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    animate() {
        if (this.isPressing) {
            // 蓄力逻辑，力度随时间增加
            const pressDuration = Date.now() - this.pressStartTime;
            this.power = Math.min(100, 10 + pressDuration / 20);
            this.updatePowerDisplay();
        }
        
        if (this.isFiring) {
            this.updateMissile();
        }
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new MissileGame();
});
