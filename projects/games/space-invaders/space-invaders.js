// 太空入侵者游戏 - 现代版

// 游戏状态
const gameState = {
    running: false,
    score: 0,
    lives: 3,
    level: 1,
    difficulty: 3,
    keys: {
        left: false,
        right: false,
        space: false
    },
    lastShootTime: 0,
    shootCooldown: 300
};

// 游戏元素
const elements = {
    canvas: document.getElementById('gameCanvas'),
    ctx: document.getElementById('gameCanvas').getContext('2d'),
    scoreElement: document.getElementById('score'),
    livesElement: document.getElementById('lives'),
    levelElement: document.getElementById('level'),
    difficultyElement: document.getElementById('difficultyValue'),
    startButton: document.getElementById('startButton'),
    resetButton: document.getElementById('resetButton'),
    difficultySlider: document.getElementById('difficulty')
};

// 游戏对象
const gameObjects = {
    player: {
        x: 400,
        y: 550,
        width: 40,
        height: 30,
        speed: 5
    },
    lasers: [],
    aliens: [],
    alienLasers: [],
    barriers: []
};

// 游戏参数
const gameParams = {
    alienSpeed: 1,
    alienDropDistance: 20,
    alienDirection: 1,
    alienShootProbability: 0.001,
    laserSpeed: 8
};

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.running = false;
    gameState.lastShootTime = 0;
    
    // 重置游戏对象
    gameObjects.player.x = 400;
    gameObjects.lasers = [];
    gameObjects.aliens = [];
    gameObjects.alienLasers = [];
    gameObjects.barriers = [];
    
    // 重置游戏参数
    gameParams.alienSpeed = 1 + (gameState.difficulty - 1) * 0.2;
    gameParams.alienShootProbability = 0.001 + (gameState.difficulty - 1) * 0.0005;
    
    // 更新UI
    updateUI();
    
    // 生成外星人
    generateAliens();
    
    // 生成障碍物
    generateBarriers();
    
    // 绘制游戏
    drawGame();
}

// 生成外星人
function generateAliens() {
    gameObjects.aliens = [];
    const rows = 5;
    const cols = 10;
    const alienWidth = 50;
    const alienHeight = 30;
    const spacing = 10;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            gameObjects.aliens.push({
                x: 100 + col * (alienWidth + spacing),
                y: 50 + row * (alienHeight + spacing),
                width: alienWidth,
                height: alienHeight,
                type: row,
                frame: 0
            });
        }
    }
}

// 生成障碍物
function generateBarriers() {
    gameObjects.barriers = [];
    const barrierWidth = 60;
    const barrierHeight = 40;
    const spacing = 150;
    
    for (let i = 0; i < 4; i++) {
        gameObjects.barriers.push({
            x: 100 + i * spacing,
            y: 500,
            width: barrierWidth,
            height: barrierHeight,
            health: 3
        });
    }
}

// 更新UI
function updateUI() {
    elements.scoreElement.textContent = gameState.score;
    elements.livesElement.textContent = gameState.lives;
    elements.levelElement.textContent = gameState.level;
    
    const difficultyLevels = ['简单', '较简单', '中等', '较困难', '困难'];
    elements.difficultyElement.textContent = difficultyLevels[gameState.difficulty - 1];
}

// 绘制游戏
function drawGame() {
    // 清空画布
    elements.ctx.fillStyle = '#0a0a2a';
    elements.ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    // 绘制星空背景
    drawStars();
    
    // 绘制障碍物
    drawBarriers();
    
    // 绘制玩家
    drawPlayer();
    
    // 绘制激光
    drawLasers();
    
    // 绘制外星人
    drawAliens();
    
    // 绘制外星人激光
    drawAlienLasers();
    
    // 绘制游戏状态
    if (!gameState.running) {
        drawGameOver();
    }
}

// 绘制星空背景
function drawStars() {
    elements.ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * elements.canvas.width;
        const y = Math.random() * elements.canvas.height;
        const size = Math.random() * 2;
        elements.ctx.beginPath();
        elements.ctx.arc(x, y, size, 0, Math.PI * 2);
        elements.ctx.fill();
    }
}

// 绘制玩家
function drawPlayer() {
    // 绘制飞船主体
    elements.ctx.fillStyle = '#00ffff';
    elements.ctx.beginPath();
    elements.ctx.moveTo(gameObjects.player.x + gameObjects.player.width / 2, gameObjects.player.y);
    elements.ctx.lineTo(gameObjects.player.x, gameObjects.player.y + gameObjects.player.height);
    elements.ctx.lineTo(gameObjects.player.x + gameObjects.player.width, gameObjects.player.y + gameObjects.player.height);
    elements.ctx.closePath();
    elements.ctx.fill();
    
    // 绘制飞船发光效果
    elements.ctx.shadowColor = '#00ffff';
    elements.ctx.shadowBlur = 10;
    elements.ctx.fill();
    elements.ctx.shadowBlur = 0;
    
    // 绘制飞船细节
    elements.ctx.fillStyle = '#ff00ff';
    elements.ctx.fillRect(gameObjects.player.x + 15, gameObjects.player.y + 5, 10, 20);
}

// 绘制激光
function drawLasers() {
    gameObjects.lasers.forEach((laser, index) => {
        elements.ctx.fillStyle = '#ff00ff';
        elements.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        
        // 绘制激光发光效果
        elements.ctx.shadowColor = '#ff00ff';
        elements.ctx.shadowBlur = 5;
        elements.ctx.fill();
        elements.ctx.shadowBlur = 0;
        
        // 更新激光位置
        laser.y -= gameParams.laserSpeed;
        
        // 移除超出画布的激光
        if (laser.y < 0) {
            gameObjects.lasers.splice(index, 1);
        }
    });
}

// 绘制外星人
function drawAliens() {
    gameObjects.aliens.forEach((alien, index) => {
        // 绘制外星人主体
        elements.ctx.fillStyle = alien.type === 0 ? '#ff00ff' : alien.type === 1 ? '#00ffff' : '#ffff00';
        elements.ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        
        // 绘制外星人发光效果
        elements.ctx.shadowColor = alien.type === 0 ? '#ff00ff' : alien.type === 1 ? '#00ffff' : '#ffff00';
        elements.ctx.shadowBlur = 5;
        elements.ctx.fill();
        elements.ctx.shadowBlur = 0;
        
        // 绘制外星人眼睛
        elements.ctx.fillStyle = '#ffffff';
        elements.ctx.fillRect(alien.x + 10, alien.y + 10, 8, 8);
        elements.ctx.fillRect(alien.x + alien.width - 18, alien.y + 10, 8, 8);
        
        // 动画效果
        alien.frame = (alien.frame + 0.1) % 2;
    });
}

// 绘制外星人激光
function drawAlienLasers() {
    gameObjects.alienLasers.forEach((laser, index) => {
        elements.ctx.fillStyle = '#ffff00';
        elements.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        
        // 绘制激光发光效果
        elements.ctx.shadowColor = '#ffff00';
        elements.ctx.shadowBlur = 5;
        elements.ctx.fill();
        elements.ctx.shadowBlur = 0;
        
        // 更新激光位置
        laser.y += gameParams.laserSpeed;
        
        // 移除超出画布的激光
        if (laser.y > elements.canvas.height) {
            gameObjects.alienLasers.splice(index, 1);
        }
    });
}

// 绘制障碍物
function drawBarriers() {
    gameObjects.barriers.forEach(barrier => {
        elements.ctx.fillStyle = '#00ffff';
        elements.ctx.fillRect(barrier.x, barrier.y, barrier.width, barrier.height);
        
        // 绘制障碍物发光效果
        elements.ctx.shadowColor = '#00ffff';
        elements.ctx.shadowBlur = 5;
        elements.ctx.fill();
        elements.ctx.shadowBlur = 0;
    });
}

// 绘制游戏结束
function drawGameOver() {
    elements.ctx.fillStyle = 'rgba(10, 10, 42, 0.8)';
    elements.ctx.fillRect(0, 0, elements.canvas.width, elements.canvas.height);
    
    elements.ctx.fillStyle = '#00ffff';
    elements.ctx.font = '48px Arial';
    elements.ctx.textAlign = 'center';
    elements.ctx.fillText('太空入侵者', elements.canvas.width / 2, elements.canvas.height / 2 - 50);
    
    elements.ctx.fillStyle = '#ff00ff';
    elements.ctx.font = '24px Arial';
    elements.ctx.fillText('点击开始游戏', elements.canvas.width / 2, elements.canvas.height / 2 + 20);
}

// 游戏主循环
function gameLoop() {
    if (gameState.running) {
        // 更新游戏状态
        updateGame();
        
        // 绘制游戏
        drawGame();
        
        // 继续游戏循环
        requestAnimationFrame(gameLoop);
    }
}

// 更新游戏状态
function updateGame() {
    // 移动玩家
    movePlayer();
    
    // 移动外星人
    moveAliens();
    
    // 外星人射击
    alienShoot();
    
    // 检测碰撞
    detectCollisions();
    
    // 检查游戏结束
    checkGameOver();
}

// 移动玩家
function movePlayer() {
    if (gameState.keys.left && gameObjects.player.x > 0) {
        gameObjects.player.x -= gameObjects.player.speed;
    }
    if (gameState.keys.right && gameObjects.player.x < elements.canvas.width - gameObjects.player.width) {
        gameObjects.player.x += gameObjects.player.speed;
    }
    if (gameState.keys.space) {
        shootLaser();
    }
}

// 发射激光
function shootLaser() {
    const currentTime = Date.now();
    if (currentTime - gameState.lastShootTime > gameState.shootCooldown) {
        gameObjects.lasers.push({
            x: gameObjects.player.x + gameObjects.player.width / 2 - 2,
            y: gameObjects.player.y,
            width: 4,
            height: 15
        });
        gameState.lastShootTime = currentTime;
        
        // 添加射击动画效果
        elements.startButton.classList.add('shoot');
        setTimeout(() => {
            elements.startButton.classList.remove('shoot');
        }, 300);
    }
}

// 移动外星人
function moveAliens() {
    let moveDown = false;
    
    gameObjects.aliens.forEach(alien => {
        alien.x += gameParams.alienSpeed * gameParams.alienDirection;
        
        // 检查是否碰到边界
        if (alien.x < 0 || alien.x + alien.width > elements.canvas.width) {
            moveDown = true;
        }
    });
    
    if (moveDown) {
        gameParams.alienDirection *= -1;
        gameObjects.aliens.forEach(alien => {
            alien.y += gameParams.alienDropDistance;
        });
    }
}

// 外星人射击
function alienShoot() {
    gameObjects.aliens.forEach(alien => {
        if (Math.random() < gameParams.alienShootProbability) {
            gameObjects.alienLasers.push({
                x: alien.x + alien.width / 2 - 2,
                y: alien.y + alien.height,
                width: 4,
                height: 15
            });
        }
    });
}

// 检测碰撞
function detectCollisions() {
    // 激光与外星人碰撞
    gameObjects.lasers.forEach((laser, laserIndex) => {
        gameObjects.aliens.forEach((alien, alienIndex) => {
            if (laser.x < alien.x + alien.width &&
                laser.x + laser.width > alien.x &&
                laser.y < alien.y + alien.height &&
                laser.y + laser.height > alien.y) {
                // 移除激光和外星人
                gameObjects.lasers.splice(laserIndex, 1);
                gameObjects.aliens.splice(alienIndex, 1);
                
                // 增加分数
                gameState.score += 10 * gameState.level;
                updateUI();
            }
        });
        
        // 激光与障碍物碰撞
        gameObjects.barriers.forEach((barrier, barrierIndex) => {
            if (laser.x < barrier.x + barrier.width &&
                laser.x + laser.width > barrier.x &&
                laser.y < barrier.y + barrier.height &&
                laser.y + laser.height > barrier.y) {
                // 移除激光
                gameObjects.lasers.splice(laserIndex, 1);
                
                // 减少障碍物生命值
                barrier.health--;
                if (barrier.health <= 0) {
                    gameObjects.barriers.splice(barrierIndex, 1);
                }
            }
        });
    });
    
    // 外星人激光与玩家碰撞
    gameObjects.alienLasers.forEach((laser, laserIndex) => {
        if (laser.x < gameObjects.player.x + gameObjects.player.width &&
            laser.x + laser.width > gameObjects.player.x &&
            laser.y < gameObjects.player.y + gameObjects.player.height &&
            laser.y + laser.height > gameObjects.player.y) {
            // 移除激光
            gameObjects.alienLasers.splice(laserIndex, 1);
            
            // 减少生命值
            gameState.lives--;
            updateUI();
        }
        
        // 外星人激光与障碍物碰撞
        gameObjects.barriers.forEach((barrier, barrierIndex) => {
            if (laser.x < barrier.x + barrier.width &&
                laser.x + laser.width > barrier.x &&
                laser.y < barrier.y + barrier.height &&
                laser.y + laser.height > barrier.y) {
                // 移除激光
                gameObjects.alienLasers.splice(laserIndex, 1);
                
                // 减少障碍物生命值
                barrier.health--;
                if (barrier.health <= 0) {
                    gameObjects.barriers.splice(barrierIndex, 1);
                }
            }
        });
    });
    
    // 外星人与玩家碰撞
    gameObjects.aliens.forEach(alien => {
        if (alien.x < gameObjects.player.x + gameObjects.player.width &&
            alien.x + alien.width > gameObjects.player.x &&
            alien.y < gameObjects.player.y + gameObjects.player.height &&
            alien.y + alien.height > gameObjects.player.y) {
            gameState.lives = 0;
            updateUI();
        }
    });
    
    // 检查是否消灭所有外星人
    if (gameObjects.aliens.length === 0) {
        // 进入下一关
        gameState.level++;
        gameParams.alienSpeed += 0.5;
        gameParams.alienShootProbability += 0.0005;
        generateAliens();
        generateBarriers();
        updateUI();
    }
}

// 检查游戏结束
function checkGameOver() {
    if (gameState.lives <= 0) {
        gameState.running = false;
        drawGame();
    }
}

// 事件监听
function setupEventListeners() {
    // 键盘事件
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            gameState.keys.left = true;
        } else if (e.key === 'ArrowRight') {
            gameState.keys.right = true;
        } else if (e.key === ' ') {
            gameState.keys.space = true;
        }
    });
    
    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') {
            gameState.keys.left = false;
        } else if (e.key === 'ArrowRight') {
            gameState.keys.right = false;
        } else if (e.key === ' ') {
            gameState.keys.space = false;
        }
    });
    
    // 按钮事件
    elements.startButton.addEventListener('click', () => {
        if (!gameState.running) {
            gameState.running = true;
            gameLoop();
        }
    });
    
    elements.resetButton.addEventListener('click', () => {
        initGame();
    });
    
    // 难度滑块事件
    elements.difficultySlider.addEventListener('input', (e) => {
        gameState.difficulty = parseInt(e.target.value);
        updateUI();
        gameParams.alienSpeed = 1 + (gameState.difficulty - 1) * 0.2;
        gameParams.alienShootProbability = 0.001 + (gameState.difficulty - 1) * 0.0005;
    });
}

// 初始化游戏
function startGame() {
    setupEventListeners();
    initGame();
    drawGame();
}

// 启动游戏
startGame();