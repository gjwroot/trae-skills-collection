class FruitMergeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.nextFruitElement = document.getElementById('next-fruit');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.finalScoreElement = document.getElementById('final-score');
        
        this.fruitTypes = [
            { emoji: '🍇', radius: 15, score: 1, color: '#9b59b6' },
            { emoji: '🍒', radius: 20, score: 2, color: '#e74c3c' },
            { emoji: '🍊', radius: 28, score: 4, color: '#e67e22' },
            { emoji: '🍋', radius: 35, score: 8, color: '#f1c40f' },
            { emoji: '🍎', radius: 42, score: 16, color: '#e74c3c' },
            { emoji: '🍐', radius: 50, score: 32, color: '#a8e6cf' },
            { emoji: '🍑', radius: 58, score: 64, color: '#ffb6c1' },
            { emoji: '🍍', radius: 68, score: 128, color: '#f39c12' },
            { emoji: '🍉', radius: 80, score: 256, color: '#2ecc71' }
        ];
        
        this.gravity = 0.5;
        this.friction = 0.98;
        this.bounce = 0.4;
        this.dangerLineY = 60;
        
        this.fruits = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('fruitMergeBestScore')) || 0;
        this.gameOver = false;
        this.currentFruit = null;
        this.nextFruitType = Math.floor(Math.random() * 5);
        this.canDrop = true;
        this.dropCooldown = 300;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        this.setupCanvas();
        this.updateNextFruitDisplay();
        this.bindEvents();
        this.gameLoop(0);
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouchMove(e);
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleClick(e);
        }, { passive: false });
        
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restart());
        
        window.addEventListener('resize', () => this.setupCanvas());
    }
    
    handleMouseMove(e) {
        if (this.gameOver || !this.canDrop) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        this.createPreviewFruit(x);
    }
    
    handleTouchMove(e) {
        if (this.gameOver || !this.canDrop) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        
        this.createPreviewFruit(x);
    }
    
    createPreviewFruit(x) {
        const fruitType = this.fruitTypes[this.nextFruitType];
        const radius = fruitType.radius;
        
        this.currentFruit = {
            x: Math.max(radius, Math.min(this.width - radius, x)),
            y: 30,
            radius: radius,
            type: this.nextFruitType,
            emoji: fruitType.emoji,
            color: fruitType.color,
            isPreview: true
        };
    }
    
    handleClick(e) {
        if (this.gameOver || !this.canDrop) return;
        
        const rect = this.canvas.getBoundingClientRect();
        let x;
        
        if (e.type === 'touchend') {
            x = e.changedTouches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }
        
        this.dropFruit(x);
    }
    
    dropFruit(x) {
        const fruitType = this.fruitTypes[this.nextFruitType];
        const radius = fruitType.radius;
        
        const fruit = {
            x: Math.max(radius, Math.min(this.width - radius, x)),
            y: 30,
            vx: 0,
            vy: 0,
            radius: radius,
            type: this.nextFruitType,
            emoji: fruitType.emoji,
            color: fruitType.color,
            score: fruitType.score,
            isPreview: false,
            id: Date.now(),
            dropTime: Date.now()
        };
        
        this.fruits.push(fruit);
        this.canDrop = false;
        
        this.nextFruitType = Math.floor(Math.random() * 5);
        this.updateNextFruitDisplay();
        
        setTimeout(() => {
            this.canDrop = true;
            this.currentFruit = null;
        }, this.dropCooldown);
    }
    
    updateNextFruitDisplay() {
        const fruitType = this.fruitTypes[this.nextFruitType];
        this.nextFruitElement.textContent = fruitType.emoji;
    }
    
    update(deltaTime) {
        if (this.gameOver) return;
        
        const gravity = this.gravity;
        const friction = this.friction;
        const bounce = this.bounce;
        const width = this.width;
        const height = this.height;
        
        for (let i = 0; i < this.fruits.length; i++) {
            const fruit = this.fruits[i];
            if (fruit.isPreview) continue;
            
            fruit.vy += gravity;
            fruit.vx *= friction;
            fruit.vy *= friction;
            
            fruit.x += fruit.vx;
            fruit.y += fruit.vy;
            
            const radius = fruit.radius;
            
            if (fruit.x - radius < 0) {
                fruit.x = radius;
                fruit.vx *= -bounce;
            } else if (fruit.x + radius > width) {
                fruit.x = width - radius;
                fruit.vx *= -bounce;
            }
            
            if (fruit.y + radius > height) {
                fruit.y = height - radius;
                fruit.vy *= -bounce;
            }
        }
        
        this.handleCollisions();
        this.checkGameOver();
    }
    
    handleCollisions() {
        const toRemove = new Set();
        const toAdd = [];
        const fruits = this.fruits;
        const fruitTypes = this.fruitTypes;
        const bounce = this.bounce;
        
        for (let i = 0; i < fruits.length; i++) {
            for (let j = i + 1; j < fruits.length; j++) {
                const f1 = fruits[i];
                const f2 = fruits[j];
                
                if (f1.isPreview || f2.isPreview) continue;
                if (toRemove.has(f1.id) || toRemove.has(f2.id)) continue;
                
                const dx = f2.x - f1.x;
                const dy = f2.y - f1.y;
                const distSq = dx * dx + dy * dy;
                const minDist = f1.radius + f2.radius;
                const minDistSq = minDist * minDist;
                
                if (distSq < minDistSq) {
                    const distance = Math.sqrt(distSq);
                    
                    if (f1.type === f2.type && f1.type < fruitTypes.length - 1) {
                        toRemove.add(f1.id);
                        toRemove.add(f2.id);
                        
                        const newType = f1.type + 1;
                        const newFruitType = fruitTypes[newType];
                        
                        const newFruit = {
                            x: (f1.x + f2.x) * 0.5,
                            y: (f1.y + f2.y) * 0.5,
                            vx: (f1.vx + f2.vx) * 0.5,
                            vy: (f1.vy + f2.vy) * 0.5 - 3,
                            radius: newFruitType.radius,
                            type: newType,
                            emoji: newFruitType.emoji,
                            color: newFruitType.color,
                            score: newFruitType.score,
                            isPreview: false,
                            id: Date.now() + Math.random(),
                            dropTime: Date.now(),
                            justMerged: true
                        };
                        
                        toAdd.push(newFruit);
                        this.score += newFruitType.score;
                        this.updateScore();
                    } else {
                        const angle = Math.atan2(dy, dx);
                        const overlap = minDist - distance;
                        
                        const moveX = (overlap * 0.5) * Math.cos(angle);
                        const moveY = (overlap * 0.5) * Math.sin(angle);
                        
                        f1.x -= moveX;
                        f1.y -= moveY;
                        f2.x += moveX;
                        f2.y += moveY;
                        
                        const normalX = dx / distance;
                        const normalY = dy / distance;
                        
                        const relativeV = (f1.vx - f2.vx) * normalX + (f1.vy - f2.vy) * normalY;
                        
                        if (relativeV > 0) {
                            const impulse = relativeV * bounce;
                            f1.vx -= impulse * normalX;
                            f1.vy -= impulse * normalY;
                            f2.vx += impulse * normalX;
                            f2.vy += impulse * normalY;
                        }
                    }
                }
            }
        }
        
        this.fruits = fruits.filter(f => !toRemove.has(f.id));
        this.fruits.push(...toAdd);
    }
    
    checkGameOver() {
        const now = Date.now();
        
        for (const fruit of this.fruits) {
            if (fruit.isPreview) continue;
            
            if (fruit.dropTime && now - fruit.dropTime < 2000) continue;
            
            if (fruit.y - fruit.radius < this.dangerLineY && Math.abs(fruit.vy) < 0.5) {
                this.endGame();
                return;
            }
        }
    }
    
    endGame() {
        this.gameOver = true;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('fruitMergeBestScore', this.bestScore);
            this.bestScoreElement.textContent = this.bestScore;
        }
        
        this.finalScoreElement.textContent = this.score;
        this.gameOverModal.classList.add('show');
    }
    
    restart() {
        this.gameOverModal.classList.remove('show');
        this.fruits = [];
        this.score = 0;
        this.gameOver = false;
        this.currentFruit = null;
        this.nextFruitType = Math.floor(Math.random() * 5);
        this.canDrop = true;
        this.updateNextFruitDisplay();
        this.updateScore();
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    draw() {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (this.currentFruit) {
            const fruit = this.currentFruit;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            ctx.fillStyle = fruit.color;
            ctx.fill();
            ctx.closePath();
            
            ctx.font = `${fruit.radius}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruit.emoji, fruit.x, fruit.y);
            ctx.globalAlpha = 1;
        } else if (this.fruits.length === 0) {
            ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👆 移动鼠标到这里开始游戏', width * 0.5, height * 0.5);
            ctx.font = '16px Arial';
            ctx.fillText('点击投放水果', width * 0.5, height * 0.5 + 40);
        }
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (const fruit of this.fruits) {
            if (fruit.isPreview) {
                ctx.globalAlpha = 0.5;
            }
            
            ctx.beginPath();
            ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
            ctx.fillStyle = fruit.color;
            ctx.fill();
            ctx.closePath();
            
            ctx.font = `${fruit.radius}px Arial`;
            ctx.fillText(fruit.emoji, fruit.x, fruit.y);
            
            if (fruit.isPreview) {
                ctx.globalAlpha = 1;
            }
            
            if (fruit.justMerged) {
                ctx.beginPath();
                ctx.arc(fruit.x, fruit.y, fruit.radius + 5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 3;
                ctx.stroke();
                fruit.justMerged = false;
            }
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        if (deltaTime > 0 && deltaTime < 100) {
            this.update(deltaTime);
            this.draw();
        }
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

window.addEventListener('load', () => {
    window.game = new FruitMergeGame();
});
