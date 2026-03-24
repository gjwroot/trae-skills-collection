// 游戏核心逻辑
class Game {
    constructor() {
        // 获取画布和上下文
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'ready'; // ready, playing, paused, gameOver
        
        // 游戏参数
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.speed = 5;
        
        // 玩家参数
        this.player = {
            x: 100,
            y: 300,
            width: 50,
            height: 50,
            velocityY: 0,
            isJumping: false,
            isDucking: false,
            jumpPower: -15,
            gravity: 0.8
        };
        
        // 游戏元素
        this.obstacles = [];
        this.coins = [];
        this.clouds = [];
        
        // 地面高度
        this.groundHeight = 50;
        
        // 游戏时间
        this.lastTime = 0;
        this.obstacleTimer = 0;
        this.coinTimer = 0;
        this.cloudTimer = 0;
        
        // 事件监听
        this.setupEventListeners();
        
        // 初始化按钮
        this.setupButtons();
        
        // 开始游戏循环
        this.gameLoop();
    }
    
    // 设置事件监听
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                if (e.code === 'Space' && !this.player.isJumping) {
                    this.player.isJumping = true;
                    this.player.velocityY = this.player.jumpPower;
                } else if (e.code === 'ArrowDown') {
                    this.player.isDucking = true;
                }
            } else if (this.gameState === 'ready' && e.code === 'Space') {
                this.startGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown') {
                this.player.isDucking = false;
            }
        });
    }
    
    // 设置按钮
    setupButtons() {
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');
        
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    // 开始游戏
    startGame() {
        if (this.gameState === 'ready' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.restartBtn.disabled = false;
        }
    }
    
    // 暂停/继续游戏
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.pauseBtn.textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.pauseBtn.textContent = '暂停';
        }
    }
    
    // 重新开始游戏
    restartGame() {
        this.gameState = 'ready';
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.speed = 5;
        this.player = {
            x: 100,
            y: 300,
            width: 50,
            height: 50,
            velocityY: 0,
            isJumping: false,
            isDucking: false,
            jumpPower: -15,
            gravity: 0.8
        };
        this.obstacles = [];
        this.coins = [];
        this.clouds = [];
        this.updateUI();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.restartBtn.disabled = true;
    }
    
    // 更新UI
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
    }
    
    // 生成障碍物
    spawnObstacle() {
        const obstacleTypes = [
            { width: 30, height: 80, color: '#4CAF50' }, // 树木
            { width: 40, height: 60, color: '#FF9800' }, // 岩石
            { width: 20, height: 100, color: '#9C27B0' } // 仙人掌
        ];
        
        const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        this.obstacles.push({
            x: this.canvas.width,
            y: this.canvas.height - this.groundHeight - randomType.height,
            width: randomType.width,
            height: randomType.height,
            color: randomType.color
        });
    }
    
    // 生成金币
    spawnCoin() {
        this.coins.push({
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - this.groundHeight - 100) + 50,
            width: 30,
            height: 30,
            color: '#FFD700',
            collected: false
        });
    }
    
    // 生成云朵
    spawnCloud() {
        this.clouds.push({
            x: this.canvas.width,
            y: Math.random() * 150 + 20,
            width: 100,
            height: 40,
            color: 'rgba(255, 255, 255, 0.8)',
            speed: Math.random() * 1 + 0.5
        });
    }
    
    // 更新游戏
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        // 更新玩家
        this.updatePlayer();
        
        // 更新障碍物
        this.updateObstacles();
        
        // 更新金币
        this.updateCoins();
        
        // 更新云朵
        this.updateClouds();
        
        // 检测碰撞
        this.checkCollisions();
        
        // 生成新元素
        this.obstacleTimer += deltaTime;
        this.coinTimer += deltaTime;
        this.cloudTimer += deltaTime;
        
        if (this.obstacleTimer > 1000 / this.level) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
        }
        
        if (this.coinTimer > 800) {
            this.spawnCoin();
            this.coinTimer = 0;
        }
        
        if (this.cloudTimer > 3000) {
            this.spawnCloud();
            this.cloudTimer = 0;
        }
        
        // 检查关卡升级
        if (this.score > this.level * 100) {
            this.levelUp();
        }
    }
    
    // 更新玩家
    updatePlayer() {
        // 应用重力
        this.player.velocityY += this.player.gravity;
        this.player.y += this.player.velocityY;
        
        // 地面碰撞检测
        if (this.player.y >= this.canvas.height - this.groundHeight - this.player.height) {
            this.player.y = this.canvas.height - this.groundHeight - this.player.height;
            this.player.velocityY = 0;
            this.player.isJumping = false;
        }
        
        // 下蹲处理
        if (this.player.isDucking) {
            this.player.height = 30;
            this.player.y = this.canvas.height - this.groundHeight - this.player.height;
        } else {
            this.player.height = 50;
        }
    }
    
    // 更新障碍物
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.x -= this.speed;
            
            // 移除屏幕外的障碍物
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    // 更新金币
    updateCoins() {
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.x -= this.speed;
            
            // 移除屏幕外的金币
            if (coin.x + coin.width < 0) {
                this.coins.splice(i, 1);
            }
        }
    }
    
    // 更新云朵
    updateClouds() {
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            cloud.x -= cloud.speed;
            
            // 移除屏幕外的云朵
            if (cloud.x + cloud.width < 0) {
                this.clouds.splice(i, 1);
            }
        }
    }
    
    // 检测碰撞
    checkCollisions() {
        // 检测与障碍物的碰撞
        for (const obstacle of this.obstacles) {
            if (this.checkCollision(this.player, obstacle)) {
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // 移除碰撞的障碍物
                    this.obstacles = this.obstacles.filter(o => o !== obstacle);
                }
            }
        }
        
        // 检测与金币的碰撞
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            if (this.checkCollision(this.player, coin) && !coin.collected) {
                coin.collected = true;
                this.score += 10;
                this.updateUI();
                this.coins.splice(i, 1);
            }
        }
    }
    
    // 碰撞检测函数
    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    // 关卡升级
    levelUp() {
        this.level++;
        this.speed += 1;
        this.updateUI();
        
        // 显示升级消息
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.canvas.height / 2 - 40, this.canvas.width, 80);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Level ${this.level}!`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    }
    
    // 游戏结束
    gameOver() {
        this.gameState = 'gameOver';
        
        // 显示游戏结束屏幕
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.canvas.height / 2 - 100, this.canvas.width, 200);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 30);
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`Level: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText('Press Restart to play again', this.canvas.width / 2, this.canvas.height / 2 + 70);
    }
    
    // 绘制游戏
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制云朵
        this.drawClouds();
        
        // 绘制地面
        this.drawGround();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制金币
        this.drawCoins();
        
        // 绘制游戏状态
        this.drawGameState();
    }
    
    // 绘制背景
    drawBackground() {
        // 渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // 绘制云朵
    drawClouds() {
        for (const cloud of this.clouds) {
            this.ctx.fillStyle = cloud.color;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 30, cloud.y, 25, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 60, cloud.y, 20, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + 30, cloud.y - 10, 20, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // 绘制地面
    drawGround() {
        this.ctx.fillStyle = '#8D6E63';
        this.ctx.fillRect(0, this.canvas.height - this.groundHeight, this.canvas.width, this.groundHeight);
        
        // 绘制地面纹理
        this.ctx.fillStyle = '#795548';
        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.fillRect(i, this.canvas.height - this.groundHeight + 10, 20, 5);
        }
    }
    
    // 绘制玩家
    drawPlayer() {
        // 绘制玩家主体
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 绘制玩家眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 35, this.player.y + 15, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 37, this.player.y + 15, 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制玩家嘴巴
        if (!this.player.isDucking) {
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.player.x + 30, this.player.y + 30, 5, 0, Math.PI);
            this.ctx.stroke();
        }
    }
    
    // 绘制障碍物
    drawObstacles() {
        for (const obstacle of this.obstacles) {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 绘制障碍物细节
            if (obstacle.color === '#4CAF50') { // 树木
                this.ctx.fillStyle = '#8D6E63';
                this.ctx.fillRect(obstacle.x + 10, obstacle.y + obstacle.height - 20, 10, 20);
            } else if (obstacle.color === '#FF9800') { // 岩石
                this.ctx.fillStyle = '#E65100';
                this.ctx.beginPath();
                this.ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    // 绘制金币
    drawCoins() {
        for (const coin of this.coins) {
            // 绘制金币
            this.ctx.fillStyle = coin.color;
            this.ctx.beginPath();
            this.ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制金币细节
            this.ctx.fillStyle = '#FFA000';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制金币光泽
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + coin.width / 3, coin.y + coin.height / 3, coin.width / 6, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // 绘制游戏状态
    drawGameState() {
        if (this.gameState === 'ready') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, this.canvas.height / 2 - 60, this.canvas.width, 120);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('清爽跑酷', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('按空格键开始游戏', this.canvas.width / 2, this.canvas.height / 2 + 10);
            this.ctx.fillText('使用空格键跳跃，下箭头下蹲', this.canvas.width / 2, this.canvas.height / 2 + 40);
        } else if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, this.canvas.height / 2 - 40, this.canvas.width, 80);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2 + 10);
        }
    }
    
    // 游戏循环
    gameLoop(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // 更新游戏
        this.update(deltaTime);
        
        // 绘制游戏
        this.draw();
        
        // 继续游戏循环
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    new Game();
});