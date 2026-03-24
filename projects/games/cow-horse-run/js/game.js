// 音效系统
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
    }

    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playJump() {
        this.playTone(400, 0.1, 'sine', 0.4);
        setTimeout(() => this.playTone(600, 0.1, 'sine', 0.3), 50);
    }

    playCoin() {
        this.playTone(800, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.3), 50);
        setTimeout(() => this.playTone(1200, 0.15, 'sine', 0.2), 100);
    }

    playHit() {
        this.playTone(200, 0.2, 'sawtooth', 0.4);
        setTimeout(() => this.playTone(150, 0.3, 'sawtooth', 0.3), 100);
    }

    playGameOver() {
        this.playTone(400, 0.2, 'sine', 0.4);
        setTimeout(() => this.playTone(300, 0.2, 'sine', 0.4), 150);
        setTimeout(() => this.playTone(200, 0.4, 'sine', 0.4), 300);
    }

    playPowerup() {
        this.playTone(500, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(700, 0.1, 'sine', 0.3), 80);
        setTimeout(() => this.playTone(900, 0.1, 'sine', 0.3), 160);
        setTimeout(() => this.playTone(1100, 0.2, 'sine', 0.3), 240);
    }
}

// 粒子系统
class Particle {
    constructor(x, y, color, type = 'default') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        
        if (type === 'coin') {
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = (Math.random() - 0.5) * 8 - 3;
            this.life = 1;
            this.decay = 0.02 + Math.random() * 0.02;
            this.size = 3 + Math.random() * 4;
        } else if (type === 'hit') {
            this.vx = (Math.random() - 0.5) * 10;
            this.vy = (Math.random() - 0.5) * 10;
            this.life = 1;
            this.decay = 0.03 + Math.random() * 0.02;
            this.size = 2 + Math.random() * 4;
        } else if (type === 'trail') {
            this.vx = -2 - Math.random() * 2;
            this.vy = (Math.random() - 0.5) * 1;
            this.life = 1;
            this.decay = 0.05;
            this.size = 2 + Math.random() * 3;
        } else {
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = (Math.random() - 0.5) * 6;
            this.life = 1;
            this.decay = 0.02;
            this.size = 3 + Math.random() * 3;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// 游戏核心逻辑
class CowHorseRun {
    constructor() {
        // 音效管理器
        this.audioManager = new AudioManager();
        
        // 粒子系统
        this.particles = [];
        
        // 获取DOM元素
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.jumpBtn = document.getElementById('jump-btn');
        this.duckBtn = document.getElementById('duck-btn');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.finalScoreElement = document.getElementById('final-score');
        this.highScoreElement = document.getElementById('high-score');
        this.highScoreDisplayElement = document.getElementById('high-score-display');
        this.highScoreEndElement = document.getElementById('high-score-end');
        this.newRecordElement = document.getElementById('new-record');
        
        // 获取画布和上下文
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        this.highScore = parseInt(localStorage.getItem('cowHorseRunHighScore')) || 0;
        
        // 游戏速度
        this.gameSpeed = 5;
        
        // 角色属性
        this.player = {
            x: 100,
            y: 300,
            width: 60,
            height: 60,
            jumping: false,
            ducking: false,
            jumpHeight: 150,
            jumpSpeed: 10,
            currentJumpHeight: 0,
            direction: 'up',
            frame: 0,
            invincible: false,
            invincibleTime: 0,
            speedBoost: false,
            speedBoostTime: 0,
            magnet: false,
            magnetTime: 0
        };
        
        // 背景元素
        this.background = {
            clouds: [],
            groundSegments: [],
            stars: []
        };
        
        // 障碍物
        this.obstacles = [];
        
        // 金币
        this.coins = [];
        
        // 道具
        this.powerups = [];
        
        // 地面
        this.groundY = 360;
        
        // 初始化最高分显示
        this.updateHighScore();
        
        // 事件监听器
        this.setupEventListeners();
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 开始游戏
        this.startBtn.addEventListener('click', () => this.startGame());
        
        // 重新开始游戏
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        // 跳跃按钮
        this.jumpBtn.addEventListener('click', () => this.jump());
        
        // 下蹲按钮
        this.duckBtn.addEventListener('click', () => this.duck());
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                this.jump();
            } else if (e.code === 'ArrowDown') {
                this.duck();
            }
        });
        
        // 触摸控制
        this.canvas.addEventListener('touchstart', (e) => {
            const touchY = e.touches[0].clientY;
            const canvasRect = this.canvas.getBoundingClientRect();
            const canvasCenter = canvasRect.top + canvasRect.height / 2;
            
            if (touchY < canvasCenter) {
                this.jump();
            } else {
                this.duck();
            }
        });
    }
    
    // 开始游戏
    startGame() {
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.gameOverScreen.classList.add('hidden');
        
        this.score = 0;
        this.lives = 3;
        this.gameSpeed = 5;
        this.obstacles = [];
        this.coins = [];
        this.powerups = [];
        this.particles = [];
        
        // 重置角色状态
        this.player.invincible = false;
        this.player.speedBoost = false;
        this.player.magnet = false;
        
        this.updateScore();
        this.updateLives();
        this.updateHighScore();
        
        this.gameRunning = true;
        this.gameLoop();
    }
    
    // 更新最高分显示
    updateHighScore() {
        if (this.highScoreElement) {
            this.highScoreElement.textContent = this.highScore;
        }
        if (this.highScoreDisplayElement) {
            this.highScoreDisplayElement.textContent = this.highScore;
        }
        if (this.highScoreEndElement) {
            this.highScoreEndElement.textContent = this.highScore;
        }
    }
    
    // 重新开始游戏
    restartGame() {
        this.startGame();
    }
    
    // 跳跃
    jump() {
        if (!this.player.jumping && !this.player.ducking) {
            this.player.jumping = true;
            this.player.direction = 'up';
            this.player.currentJumpHeight = 0;
            this.audioManager.playJump();
            
            // 生成跳跃粒子
            for (let i = 0; i < 5; i++) {
                this.particles.push(new Particle(
                    this.player.x + this.player.width / 2,
                    this.groundY,
                    '#4ecdc4',
                    'default'
                ));
            }
        }
    }
    
    // 生成粒子效果
    createParticles(x, y, color, type, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, type));
        }
    }
    
    // 下蹲
    duck() {
        if (!this.player.jumping) {
            this.player.ducking = true;
            setTimeout(() => {
                this.player.ducking = false;
            }, 500);
        }
    }
    
    // 更新分数
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.finalScoreElement.textContent = this.score;
    }
    
    // 更新生命
    updateLives() {
        this.livesElement.textContent = this.lives;
    }
    
    // 生成障碍物
    generateObstacle() {
        if (Math.random() < 0.02) {
            const obstacleHeight = Math.random() > 0.5 ? 60 : 30;
            const obstacleY = obstacleHeight === 60 ? this.groundY - obstacleHeight : this.groundY - obstacleHeight;
            
            this.obstacles.push({
                x: this.canvas.width,
                y: obstacleY,
                width: 40,
                height: obstacleHeight,
                speed: this.gameSpeed
            });
        }
    }
    
    // 生成金币
    generateCoin() {
        if (Math.random() < 0.015) {
            this.coins.push({
                x: this.canvas.width,
                y: Math.random() * (this.groundY - 100) + 50,
                width: 20,
                height: 20,
                speed: this.gameSpeed,
                angle: 0
            });
        }
    }
    
    // 生成道具
    generatePowerup() {
        if (Math.random() < 0.003) {
            const types = ['invincible', 'speed', 'magnet'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerups.push({
                x: this.canvas.width,
                y: Math.random() * (this.groundY - 120) + 60,
                width: 30,
                height: 30,
                speed: this.gameSpeed,
                type: type,
                angle: 0
            });
        }
    }
    
    // 生成云朵
    generateCloud() {
        if (Math.random() < 0.005) {
            this.background.clouds.push({
                x: this.canvas.width,
                y: Math.random() * 150 + 20,
                width: 80,
                height: 40,
                speed: this.gameSpeed * 0.3
            });
        }
    }
    
    // 生成地面段
    generateGroundSegment() {
        if (this.background.groundSegments.length === 0 || this.background.groundSegments[this.background.groundSegments.length - 1].x < this.canvas.width) {
            this.background.groundSegments.push({
                x: this.background.groundSegments.length > 0 ? this.background.groundSegments[this.background.groundSegments.length - 1].x + 100 : 0,
                y: this.groundY,
                width: 100,
                height: this.canvas.height - this.groundY
            });
        }
    }
    
    // 更新游戏元素
    updateElements() {
        // 更新角色
        if (this.player.jumping) {
            if (this.player.direction === 'up') {
                this.player.currentJumpHeight += this.player.jumpSpeed;
                this.player.y = this.groundY - this.player.height - this.player.currentJumpHeight;
                
                if (this.player.currentJumpHeight >= this.player.jumpHeight) {
                    this.player.direction = 'down';
                }
            } else {
                this.player.currentJumpHeight -= this.player.jumpSpeed;
                this.player.y = this.groundY - this.player.height - this.player.currentJumpHeight;
                
                if (this.player.currentJumpHeight <= 0) {
                    this.player.jumping = false;
                    this.player.y = this.groundY - this.player.height;
                }
            }
        }
        
        // 更新道具效果
        this.updatePowerupEffects();
        
        // 更新障碍物
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= obstacle.speed;
            
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
        
        // 更新金币
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.x -= coin.speed;
            coin.angle += 0.1;
            
            // 磁铁效果
            if (this.player.magnet) {
                const dx = (this.player.x + this.player.width / 2) - (coin.x + coin.width / 2);
                const dy = (this.player.y + this.player.height / 2) - (coin.y + coin.height / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    coin.x += dx * 0.1;
                    coin.y += dy * 0.1;
                }
            }
            
            if (coin.x + coin.width < 0) {
                this.coins.splice(i, 1);
            }
        }
        
        // 更新道具
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.x -= powerup.speed;
            powerup.angle += 0.05;
            
            if (powerup.x + powerup.width < 0) {
                this.powerups.splice(i, 1);
            }
        }
        
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update()) {
                this.particles.splice(i, 1);
            }
        }
        
        // 生成拖尾粒子
        if (this.gameRunning && Math.random() < 0.3) {
            const tailY = this.player.ducking ? 
                this.groundY - this.player.height * 0.7 + 20 : 
                this.player.y + 30;
            this.particles.push(new Particle(
                this.player.x + 10,
                tailY,
                this.player.invincible ? '#ffd700' : '#ff6b6b',
                'trail'
            ));
        }
        
        // 生成新的障碍物、金币和背景元素
        this.generateObstacle();
        this.generateCoin();
        this.generatePowerup();
        this.generateCloud();
        this.generateGroundSegment();
        
        // 更新背景元素
        for (let i = this.background.clouds.length - 1; i >= 0; i--) {
            const cloud = this.background.clouds[i];
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                this.background.clouds.splice(i, 1);
            }
        }
        
        for (let i = this.background.groundSegments.length - 1; i >= 0; i--) {
            const segment = this.background.groundSegments[i];
            segment.x -= this.gameSpeed * 0.5;
            if (segment.x + segment.width < 0) {
                this.background.groundSegments.splice(i, 1);
            }
        }
        
        this.player.frame += 0.1;
        if (this.player.frame >= 10) {
            this.player.frame = 0;
        }
        
        this.checkCollisions();
        
        const speedMultiplier = this.player.speedBoost ? 1.5 : 1;
        this.gameSpeed += 0.001 * speedMultiplier;
    }
    
    // 更新道具效果
    updatePowerupEffects() {
        if (this.player.invincible) {
            this.player.invincibleTime--;
            if (this.player.invincibleTime <= 0) {
                this.player.invincible = false;
            }
        }
        
        if (this.player.speedBoost) {
            this.player.speedBoostTime--;
            if (this.player.speedBoostTime <= 0) {
                this.player.speedBoost = false;
            }
        }
        
        if (this.player.magnet) {
            this.player.magnetTime--;
            if (this.player.magnetTime <= 0) {
                this.player.magnet = false;
            }
        }
    }
    
    // 碰撞检测
    checkCollisions() {
        // 检测与障碍物的碰撞
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            if (
                this.player.x < obstacle.x + obstacle.width &&
                this.player.x + this.player.width > obstacle.x &&
                this.player.y < obstacle.y + obstacle.height &&
                this.player.y + this.player.height > obstacle.y
            ) {
                if (this.player.invincible) {
                    this.createParticles(
                        obstacle.x + obstacle.width / 2,
                        obstacle.y + obstacle.height / 2,
                        '#ffd700',
                        'hit',
                        15
                    );
                    this.obstacles.splice(i, 1);
                } else {
                    this.lives--;
                    this.updateLives();
                    this.audioManager.playHit();
                    
                    this.createParticles(
                        this.player.x + this.player.width / 2,
                        this.player.y + this.player.height / 2,
                        '#ff6b6b',
                        'hit',
                        20
                    );
                    
                    this.obstacles.splice(i, 1);
                    
                    if (this.lives <= 0) {
                        this.endGame();
                    }
                }
            }
        }
        
        // 检测与金币的碰撞
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            
            if (
                this.player.x < coin.x + coin.width &&
                this.player.x + this.player.width > coin.x &&
                this.player.y < coin.y + coin.height &&
                this.player.y + this.player.height > coin.y
            ) {
                this.score += 10;
                this.updateScore();
                this.audioManager.playCoin();
                
                this.createParticles(
                    coin.x + coin.width / 2,
                    coin.y + coin.height / 2,
                    '#ffd93d',
                    'coin',
                    12
                );
                
                this.coins.splice(i, 1);
            }
        }
        
        // 检测与道具的碰撞
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            
            if (
                this.player.x < powerup.x + powerup.width &&
                this.player.x + this.player.width > powerup.x &&
                this.player.y < powerup.y + powerup.height &&
                this.player.y + this.player.height > powerup.y
            ) {
                this.activatePowerup(powerup.type);
                this.audioManager.playPowerup();
                
                const colors = {
                    invincible: '#ffd700',
                    speed: '#00ff00',
                    magnet: '#ff00ff'
                };
                
                this.createParticles(
                    powerup.x + powerup.width / 2,
                    powerup.y + powerup.height / 2,
                    colors[powerup.type] || '#ffffff',
                    'coin',
                    20
                );
                
                this.powerups.splice(i, 1);
            }
        }
    }
    
    // 激活道具效果
    activatePowerup(type) {
        switch (type) {
            case 'invincible':
                this.player.invincible = true;
                this.player.invincibleTime = 300;
                break;
            case 'speed':
                this.player.speedBoost = true;
                this.player.speedBoostTime = 400;
                break;
            case 'magnet':
                this.player.magnet = true;
                this.player.magnetTime = 500;
                break;
        }
    }
    
    // 结束游戏
    endGame() {
        this.gameRunning = false;
        this.audioManager.playGameOver();
        
        // 更新最高分
        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.highScore = this.score;
            localStorage.setItem('cowHorseRunHighScore', this.highScore);
        }
        
        this.updateHighScore();
        
        // 显示新纪录提示
        if (this.newRecordElement) {
            if (isNewRecord) {
                this.newRecordElement.classList.remove('hidden');
            } else {
                this.newRecordElement.classList.add('hidden');
            }
        }
        
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
    }
    
    // 绘制游戏元素
    drawElements() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制天空渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#f0f8ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.groundY);
        
        // 绘制云朵
        this.drawClouds();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制金币
        this.drawCoins();
        
        // 绘制道具
        this.drawPowerups();
        
        // 绘制粒子
        this.drawParticles();
        
        // 绘制角色
        this.drawPlayer();
        
        // 绘制地面
        this.drawGround();
        
        // 绘制道具状态指示器
        this.drawPowerupIndicators();
    }
    
    // 绘制粒子
    drawParticles() {
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }
    }
    
    // 绘制道具
    drawPowerups() {
        for (const powerup of this.powerups) {
            this.ctx.save();
            this.ctx.translate(powerup.x + powerup.width / 2, powerup.y + powerup.height / 2);
            this.ctx.rotate(powerup.angle);
            
            // 绘制道具光晕
            const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, powerup.width);
            let color1, color2;
            
            switch (powerup.type) {
                case 'invincible':
                    color1 = 'rgba(255, 215, 0, 0.8)';
                    color2 = 'rgba(255, 215, 0, 0)';
                    break;
                case 'speed':
                    color1 = 'rgba(0, 255, 0, 0.8)';
                    color2 = 'rgba(0, 255, 0, 0)';
                    break;
                case 'magnet':
                    color1 = 'rgba(255, 0, 255, 0.8)';
                    color2 = 'rgba(255, 0, 255, 0)';
                    break;
            }
            
            glowGradient.addColorStop(0, color1);
            glowGradient.addColorStop(1, color2);
            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, powerup.width, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制道具主体
            switch (powerup.type) {
                case 'invincible':
                    this.ctx.fillStyle = '#ffd700';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, powerup.width / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 16px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('⭐', 0, 0);
                    break;
                    
                case 'speed':
                    this.ctx.fillStyle = '#00ff00';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, powerup.width / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 16px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('⚡', 0, 0);
                    break;
                    
                case 'magnet':
                    this.ctx.fillStyle = '#ff00ff';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, powerup.width / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 16px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('🧲', 0, 0);
                    break;
            }
            
            this.ctx.restore();
        }
    }
    
    // 绘制道具状态指示器
    drawPowerupIndicators() {
        let y = 10;
        
        if (this.player.invincible) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            this.ctx.fillRect(10, y, 120, 25);
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(`⭐ 无敌 ${Math.ceil(this.player.invincibleTime / 60)}s`, 15, y + 5);
            y += 30;
        }
        
        if (this.player.speedBoost) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
            this.ctx.fillRect(10, y, 120, 25);
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(`⚡ 加速 ${Math.ceil(this.player.speedBoostTime / 60)}s`, 15, y + 5);
            y += 30;
        }
        
        if (this.player.magnet) {
            this.ctx.fillStyle = 'rgba(255, 0, 255, 0.9)';
            this.ctx.fillRect(10, y, 120, 25);
            this.ctx.fillStyle = '#000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(`🧲 磁铁 ${Math.ceil(this.player.magnetTime / 60)}s`, 15, y + 5);
        }
    }
    
    // 绘制云朵
    drawClouds() {
        for (const cloud of this.background.clouds) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(cloud.x + 20, cloud.y + 20, 20, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 40, cloud.y + 15, 25, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 60, cloud.y + 20, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // 绘制地面
    drawGround() {
        // 绘制地面基础
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // 绘制地面纹理
        this.ctx.fillStyle = '#45b7aa';
        for (const segment of this.background.groundSegments) {
            this.ctx.fillRect(segment.x, this.groundY, segment.width, 5);
        }
    }
    
    // 绘制角色
    drawPlayer() {
        // 无敌时闪烁效果
        if (this.player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // 调整角色大小（下蹲时）
        const drawHeight = this.player.ducking ? this.player.height * 0.7 : this.player.height;
        const drawY = this.player.ducking ? this.groundY - drawHeight : this.player.y;
        
        // 计算动画帧
        const frame = Math.floor(this.player.frame);
        
        // 绘制身体
        const bodyColor = this.player.invincible ? '#ffd700' : '#ff6b6b';
        this.ctx.fillStyle = bodyColor;
        
        // 绘制加速时的特效
        if (this.player.speedBoost) {
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 15;
        }
        
        this.ctx.fillRect(this.player.x, drawY, this.player.width, drawHeight);
        
        // 绘制头部
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width + 10, drawY + drawHeight / 2, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width + 15, drawY + drawHeight / 2 - 5, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + this.player.width + 16, drawY + drawHeight / 2 - 5, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制腿部动画
        this.ctx.fillStyle = bodyColor;
        
        const frontLegOffset = Math.sin(frame * 0.5) * 5;
        this.ctx.fillRect(this.player.x + 20, drawY + drawHeight - 5, 10, 15 + frontLegOffset);
        
        const backLegOffset = Math.cos(frame * 0.5) * 5;
        this.ctx.fillRect(this.player.x + 40, drawY + drawHeight - 5, 10, 15 + backLegOffset);
        
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;
    }
    
    // 绘制障碍物
    drawObstacles() {
        for (const obstacle of this.obstacles) {
            this.ctx.fillStyle = '#45b7aa';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
    }
    
    // 绘制金币
    drawCoins() {
        for (const coin of this.coins) {
            this.ctx.fillStyle = '#ffd93d';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制金币光泽
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + coin.width / 3, coin.y + coin.height / 3, coin.width / 6, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // 游戏主循环
    gameLoop() {
        if (!this.gameRunning) return;
        
        this.updateElements();
        this.drawElements();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new CowHorseRun();
});