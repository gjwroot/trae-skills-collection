// 像素冒险游戏 - Pixel Adventure
// 一个经典的平台跳跃游戏

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 禁用抗锯齿，保持像素风格
ctx.imageSmoothingEnabled = false;

// 游戏状态
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    VICTORY: 'victory'
};

let currentState = GameState.MENU;
let score = 0;
let lives = 3;
let cameraX = 0;

// 游戏常量
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const TILE_SIZE = 32;

// 输入状态
const keys = {
    left: false,
    right: false,
    up: false,
    space: false
};

// 玩家对象
const player = {
    x: 100,
    y: 300,
    width: 24,
    height: 32,
    vx: 0,
    vy: 0,
    onGround: false,
    facingRight: true,
    invincible: false,
    invincibleTime: 0,
    animFrame: 0,
    animTimer: 0
};

// 关卡地图 (0=空气, 1=地面, 2=平台, 3=金币, 4=敌人, 5=终点, 6=尖刺)
const levelMap = [
    "11111111111111111111111111111111111111111111111111111111111111111111111111111111",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "10000000000000000000000000000000000000000000000000000000000000000000000000000001",
    "11111111111111111111111111111111111111111111111111111111111111111111111111111111"
];

// 游戏对象数组
let platforms = [];
let coins = [];
let enemies = [];
let particles = [];
let spikes = [];
let flag = null;

// 初始化关卡
function initLevel() {
    platforms = [];
    coins = [];
    enemies = [];
    spikes = [];
    
    // 地面
    for (let x = 0; x < 2500; x += TILE_SIZE) {
        platforms.push({ x: x, y: canvas.height - TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, type: 'ground' });
    }
    
    // 平台
    const platformData = [
        { x: 200, y: 350, w: 3 },
        { x: 350, y: 300, w: 2 },
        { x: 500, y: 250, w: 2 },
        { x: 700, y: 350, w: 4 },
        { x: 900, y: 280, w: 2 },
        { x: 1100, y: 350, w: 3 },
        { x: 1300, y: 250, w: 2 },
        { x: 1500, y: 300, w: 3 },
        { x: 1700, y: 350, w: 2 },
        { x: 1900, y: 280, w: 4 },
        { x: 2100, y: 350, w: 2 },
        { x: 2300, y: 300, w: 3 }
    ];
    
    platformData.forEach(p => {
        for (let i = 0; i < p.w; i++) {
            platforms.push({ 
                x: p.x + i * TILE_SIZE, 
                y: p.y, 
                width: TILE_SIZE, 
                height: TILE_SIZE, 
                type: 'platform' 
            });
        }
    });
    
    // 金币
    const coinData = [
        { x: 216, y: 310 },
        { x: 248, y: 310 },
        { x: 366, y: 260 },
        { x: 516, y: 210 },
        { x: 548, y: 210 },
        { x: 732, y: 310 },
        { x: 764, y: 310 },
        { x: 796, y: 310 },
        { x: 916, y: 240 },
        { x: 1132, y: 310 },
        { x: 1164, y: 310 },
        { x: 1196, y: 310 },
        { x: 1316, y: 210 },
        { x: 1348, y: 210 },
        { x: 1532, y: 260 },
        { x: 1564, y: 260 },
        { x: 1596, y: 260 },
        { x: 1716, y: 310 },
        { x: 1748, y: 310 },
        { x: 1932, y: 240 },
        { x: 1964, y: 240 },
        { x: 1996, y: 240 },
        { x: 2028, y: 240 },
        { x: 2132, y: 310 },
        { x: 2332, y: 260 },
        { x: 2364, y: 260 },
        { x: 2396, y: 260 }
    ];
    
    coinData.forEach(c => {
        coins.push({ x: c.x, y: c.y, width: 16, height: 16, collected: false, animOffset: Math.random() * Math.PI * 2 });
    });
    
    // 敌人
    const enemyData = [
        { x: 400, y: 418, range: 100 },
        { x: 800, y: 418, range: 120 },
        { x: 1200, y: 418, range: 80 },
        { x: 1600, y: 418, range: 100 },
        { x: 2000, y: 418, range: 150 },
        { x: 750, y: 248, range: 60 },
        { x: 1550, y: 268, range: 80 }
    ];
    
    enemyData.forEach(e => {
        enemies.push({
            x: e.x,
            y: e.y,
            width: 24,
            height: 24,
            startX: e.x,
            range: e.range,
            speed: 1.5,
            direction: 1,
            animFrame: 0
        });
    });
    
    // 尖刺陷阱
    const spikeData = [
        { x: 600, y: 446 },
        { x: 632, y: 446 },
        { x: 1000, y: 446 },
        { x: 1032, y: 446 },
        { x: 1064, y: 446 },
        { x: 1800, y: 446 },
        { x: 1832, y: 446 }
    ];
    
    spikeData.forEach(s => {
        spikes.push({ x: s.x, y: s.y, width: 32, height: 18 });
    });
    
    // 终点旗帜
    flag = { x: 2400, y: 270, width: 40, height: 70 };
}

// 绘制像素风格的矩形
function drawPixelRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x - cameraX), Math.floor(y), width, height);
}

// 绘制像素风格的边框
function drawPixelBorder(x, y, width, height, color, borderWidth = 2) {
    ctx.fillStyle = color;
    // 上边框
    ctx.fillRect(Math.floor(x - cameraX), Math.floor(y), width, borderWidth);
    // 下边框
    ctx.fillRect(Math.floor(x - cameraX), Math.floor(y + height - borderWidth), width, borderWidth);
    // 左边框
    ctx.fillRect(Math.floor(x - cameraX), Math.floor(y), borderWidth, height);
    // 右边框
    ctx.fillRect(Math.floor(x - cameraX + width - borderWidth), Math.floor(y), borderWidth, height);
}

// 绘制玩家
function drawPlayer() {
    const x = Math.floor(player.x - cameraX);
    const y = Math.floor(player.y);
    
    // 无敌状态闪烁效果
    if (player.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }
    
    // 身体
    drawPixelRect(player.x, player.y + 8, player.width, 24, '#4169E1');
    
    // 头部
    drawPixelRect(player.x + 4, player.y, 16, 12, '#FFDBAC');
    
    // 眼睛
    if (player.facingRight) {
        drawPixelRect(player.x + 14, player.y + 3, 3, 3, '#000');
    } else {
        drawPixelRect(player.x + 7, player.y + 3, 3, 3, '#000');
    }
    
    // 帽子/头发
    drawPixelRect(player.x + 2, player.y - 2, 20, 6, '#8B4513');
    
    // 手臂
    const armOffset = player.onGround ? Math.sin(player.animFrame * 0.3) * 4 : 0;
    drawPixelRect(player.x - 2, player.y + 12 + armOffset, 4, 10, '#FFDBAC');
    drawPixelRect(player.x + player.width - 2, player.y + 12 - armOffset, 4, 10, '#FFDBAC');
    
    // 腿
    const legOffset = player.onGround ? Math.sin(player.animFrame * 0.3) * 3 : 0;
    drawPixelRect(player.x + 4, player.y + 32, 6, 8 + legOffset, '#2F4F4F');
    drawPixelRect(player.x + 14, player.y + 32, 6, 8 - legOffset, '#2F4F4F');
    
    // 鞋子
    drawPixelRect(player.x + 2, player.y + 38 + legOffset, 10, 4, '#8B4513');
    drawPixelRect(player.x + 12, player.y + 38 - legOffset, 10, 4, '#8B4513');
    
    ctx.globalAlpha = 1;
}

// 绘制平台
function drawPlatforms() {
    platforms.forEach(p => {
        if (p.x - cameraX > canvas.width || p.x + p.width - cameraX < 0) return;
        
        if (p.type === 'ground') {
            // 草地顶层
            drawPixelRect(p.x, p.y, p.width, 6, '#228B22');
            // 泥土层
            drawPixelRect(p.x, p.y + 6, p.width, p.height - 6, '#8B4513');
            // 泥土纹理
            drawPixelRect(p.x + 4, p.y + 10, 4, 4, '#654321');
            drawPixelRect(p.x + 20, p.y + 18, 6, 6, '#654321');
        } else {
            // 平台
            drawPixelRect(p.x, p.y, p.width, p.height, '#8B4513');
            drawPixelRect(p.x, p.y, p.width, 4, '#D2691E');
            // 平台纹理
            drawPixelRect(p.x + 8, p.y + 10, 4, 4, '#654321');
            drawPixelRect(p.x + 20, p.y + 16, 6, 6, '#654321');
        }
    });
}

// 绘制金币
function drawCoins() {
    const time = Date.now() / 200;
    
    coins.forEach(c => {
        if (c.collected) return;
        if (c.x - cameraX > canvas.width || c.x + c.width - cameraX < 0) return;
        
        const floatY = Math.sin(time + c.animOffset) * 3;
        const x = Math.floor(c.x - cameraX);
        const y = Math.floor(c.y + floatY);
        
        // 金币外圈
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // 金币内圈
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.arc(x + 8, y + 8, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 金币符号
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('$', x + 5, y + 11);
    });
}

// 绘制敌人
function drawEnemies() {
    enemies.forEach(e => {
        if (e.x - cameraX > canvas.width || e.x + e.width - cameraX < 0) return;
        
        const x = Math.floor(e.x - cameraX);
        const y = Math.floor(e.y);
        
        // 身体
        drawPixelRect(e.x, e.y + 4, e.width, 20, '#DC143C');
        
        // 眼睛
        drawPixelRect(e.x + 4, e.y + 8, 5, 5, '#FFF');
        drawPixelRect(e.x + 15, e.y + 8, 5, 5, '#FFF');
        drawPixelRect(e.x + 6, e.y + 10, 2, 2, '#000');
        drawPixelRect(e.x + 17, e.y + 10, 2, 2, '#000');
        
        // 角
        drawPixelRect(e.x + 2, e.y, 4, 6, '#8B0000');
        drawPixelRect(e.x + 18, e.y, 4, 6, '#8B0000');
        
        // 腿
        const legAnim = Math.sin(Date.now() / 100) * 2;
        drawPixelRect(e.x + 4, e.y + 24, 5, 6 + legAnim, '#8B0000');
        drawPixelRect(e.x + 15, e.y + 24, 5, 6 - legAnim, '#8B0000');
    });
}

// 绘制尖刺
function drawSpikes() {
    spikes.forEach(s => {
        if (s.x - cameraX > canvas.width || s.x + s.width - cameraX < 0) return;
        
        const x = Math.floor(s.x - cameraX);
        const y = Math.floor(s.y);
        
        // 尖刺主体
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo(x, y + s.height);
        ctx.lineTo(x + s.width / 2, y);
        ctx.lineTo(x + s.width, y + s.height);
        ctx.closePath();
        ctx.fill();
        
        // 尖刺高光
        ctx.fillStyle = '#A9A9A9';
        ctx.beginPath();
        ctx.moveTo(x + 4, y + s.height);
        ctx.lineTo(x + s.width / 2, y + 4);
        ctx.lineTo(x + s.width / 2 + 4, y + s.height);
        ctx.closePath();
        ctx.fill();
    });
}

// 绘制终点旗帜
function drawFlag() {
    if (!flag) return;
    if (flag.x - cameraX > canvas.width || flag.x + flag.width - cameraX < 0) return;
    
    const x = Math.floor(flag.x - cameraX);
    const y = Math.floor(flag.y);
    
    // 旗杆
    drawPixelRect(flag.x + 5, flag.y, 6, flag.height, '#8B4513');
    
    // 旗帜
    const wave = Math.sin(Date.now() / 200) * 3;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(flag.x + 11, flag.y + 5 + wave);
    ctx.lineTo(flag.x + 35, flag.y + 20);
    ctx.lineTo(flag.x + 11, flag.y + 35 - wave);
    ctx.closePath();
    ctx.fill();
    
    // 旗帜边框
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// 绘制背景
function drawBackground() {
    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 云朵
    const clouds = [
        { x: 100, y: 50, size: 1 },
        { x: 300, y: 80, size: 0.8 },
        { x: 600, y: 40, size: 1.2 },
        { x: 900, y: 70, size: 0.9 },
        { x: 1200, y: 50, size: 1 },
        { x: 1500, y: 90, size: 0.7 },
        { x: 1800, y: 60, size: 1.1 },
        { x: 2100, y: 45, size: 0.85 }
    ];
    
    clouds.forEach(c => {
        const x = (c.x - cameraX * 0.3) % (canvas.width + 200);
        const drawX = x < -100 ? x + canvas.width + 200 : x;
        const y = c.y;
        const s = c.size;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(drawX, y, 25 * s, 0, Math.PI * 2);
        ctx.arc(drawX + 25 * s, y - 10 * s, 30 * s, 0, Math.PI * 2);
        ctx.arc(drawX + 50 * s, y, 25 * s, 0, Math.PI * 2);
        ctx.arc(drawX + 25 * s, y + 10 * s, 20 * s, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 远景山脉
    ctx.fillStyle = 'rgba(100, 149, 237, 0.3)';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let i = 0; i <= canvas.width; i += 50) {
        const height = 100 + Math.sin((i + cameraX * 0.1) * 0.01) * 50;
        ctx.lineTo(i, canvas.height - height);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
}

// 绘制粒子效果
function drawParticles() {
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;
        
        if (p.life <= 0) return false;
        
        const x = Math.floor(p.x - cameraX);
        const y = Math.floor(p.y);
        
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillRect(x, y, p.size, p.size);
            ctx.globalAlpha = 1;
        }
        
        return true;
    });
}

// 创建粒子效果
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            size: 2 + Math.random() * 4,
            color: color,
            life: 30,
            maxLife: 30
        });
    }
}

// 碰撞检测
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 更新玩家
function updatePlayer() {
    // 水平移动
    if (keys.left) {
        player.vx = -MOVE_SPEED;
        player.facingRight = false;
    } else if (keys.right) {
        player.vx = MOVE_SPEED;
        player.facingRight = true;
    } else {
        player.vx *= 0.8;
    }
    
    // 跳跃
    if ((keys.up || keys.space) && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        createParticles(player.x + player.width / 2, player.y + player.height, '#8B4513', 5);
    }
    
    // 应用重力
    player.vy += GRAVITY;
    
    // 更新位置
    player.x += player.vx;
    player.y += player.vy;
    
    // 平台碰撞检测
    player.onGround = false;
    platforms.forEach(p => {
        if (checkCollision(player, p)) {
            // 从上方落下
            if (player.vy > 0 && player.y < p.y) {
                player.y = p.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
            // 从下方跳上
            else if (player.vy < 0 && player.y > p.y) {
                player.y = p.y + p.height;
                player.vy = 0;
            }
            // 水平碰撞
            else if (player.vx > 0) {
                player.x = p.x - player.width;
                player.vx = 0;
            } else if (player.vx < 0) {
                player.x = p.x + p.width;
                player.vx = 0;
            }
        }
    });
    
    // 边界检测
    if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
    }
    if (player.y > canvas.height) {
        loseLife();
    }
    
    // 更新动画
    if (Math.abs(player.vx) > 0.1) {
        player.animTimer++;
        if (player.animTimer > 5) {
            player.animFrame++;
            player.animTimer = 0;
        }
    }
    
    // 更新无敌时间
    if (player.invincible) {
        player.invincibleTime--;
        if (player.invincibleTime <= 0) {
            player.invincible = false;
        }
    }
    
    // 更新相机
    cameraX = player.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > 2500 - canvas.width) cameraX = 2500 - canvas.width;
}

// 更新敌人
function updateEnemies() {
    enemies.forEach(e => {
        e.x += e.speed * e.direction;
        
        if (e.x > e.startX + e.range || e.x < e.startX) {
            e.direction *= -1;
        }
        
        // 与玩家碰撞
        if (!player.invincible && checkCollision(player, e)) {
            loseLife();
        }
    });
}

// 更新金币
function updateCoins() {
    coins.forEach(c => {
        if (!c.collected && checkCollision(player, c)) {
            c.collected = true;
            score += 10;
            updateScore();
            createParticles(c.x + 8, c.y + 8, '#FFD700', 6);
        }
    });
}

// 更新尖刺
function updateSpikes() {
    spikes.forEach(s => {
        if (!player.invincible && checkCollision(player, s)) {
            loseLife();
        }
    });
}

// 更新终点
function updateFlag() {
    if (flag && checkCollision(player, flag)) {
        victory();
    }
}

// 失去生命
function loseLife() {
    if (player.invincible) return;
    
    lives--;
    updateLives();
    createParticles(player.x + player.width / 2, player.y + player.height / 2, '#FF0000', 15);
    
    if (lives <= 0) {
        gameOver();
    } else {
        player.x = 100;
        player.y = 300;
        player.vx = 0;
        player.vy = 0;
        player.invincible = true;
        player.invincibleTime = 120;
        cameraX = 0;
    }
}

// 更新分数显示
function updateScore() {
    document.getElementById('score').textContent = score;
}

// 更新生命显示
function updateLives() {
    const hearts = '❤️'.repeat(lives);
    document.getElementById('lives').textContent = hearts;
}

// 游戏结束
function gameOver() {
    currentState = GameState.GAME_OVER;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// 胜利
function victory() {
    currentState = GameState.VICTORY;
    document.getElementById('victoryScore').textContent = score;
    document.getElementById('victoryScreen').classList.remove('hidden');
}

// 重置游戏
function resetGame() {
    score = 0;
    lives = 3;
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.invincible = false;
    player.invincibleTime = 0;
    cameraX = 0;
    
    updateScore();
    updateLives();
    initLevel();
    
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('startScreen').classList.add('hidden');
    
    currentState = GameState.PLAYING;
}

// 游戏主循环
function gameLoop() {
    if (currentState === GameState.PLAYING) {
        updatePlayer();
        updateEnemies();
        updateCoins();
        updateSpikes();
        updateFlag();
    }
    
    // 绘制
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawFlag();
    drawSpikes();
    drawEnemies();
    drawPlayer();
    drawParticles();
    
    requestAnimationFrame(gameLoop);
}

// 键盘事件
window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = true;
            e.preventDefault();
            break;
        case 'ArrowRight':
            keys.right = true;
            e.preventDefault();
            break;
        case 'ArrowUp':
            keys.up = true;
            e.preventDefault();
            break;
        case 'Space':
            keys.space = true;
            e.preventDefault();
            break;
        case 'KeyR':
            if (currentState === GameState.PLAYING) {
                loseLife();
            }
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'ArrowUp':
            keys.up = false;
            break;
        case 'Space':
            keys.space = false;
            break;
    }
});

// 按钮事件
document.getElementById('startBtn').addEventListener('click', resetGame);
document.getElementById('restartBtn').addEventListener('click', resetGame);
document.getElementById('playAgainBtn').addEventListener('click', resetGame);

// 初始化
initLevel();
gameLoop();
