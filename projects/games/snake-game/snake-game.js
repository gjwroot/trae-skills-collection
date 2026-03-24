// 霓虹贪吃蛇游戏逻辑
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.lengthElement = document.getElementById('length');
        this.speedElement = document.getElementById('speed');
        this.difficultyElement = document.getElementById('difficulty');
        this.difficultyValueElement = document.getElementById('difficultyValue');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        
        this.cellSize = 20;
        this.rows = this.canvas.height / this.cellSize;
        this.cols = this.canvas.width / this.cellSize;
        
        this.resetGame();
        this.setupEventListeners();
        this.draw();
    }
    
    resetGame() {
        this.snake = [{ x: 15, y: 15 }];
        this.direction = { x: 0, y: 0 };
        this.food = this.generateFood();
        this.score = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gameOver = false;
        this.lastTime = 0;
        this.moveInterval = 200;
        this.difficulty = parseInt(this.difficultyElement.value);
        this.updateSpeed();
        this.updateUI();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.startButton.addEventListener('click', this.startGame.bind(this));
        this.resetButton.addEventListener('click', this.resetGame.bind(this));
        this.difficultyElement.addEventListener('input', this.handleDifficultyChange.bind(this));
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) {
            this.startGame();
        }
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.direction.y !== 1) {
                    this.direction = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.direction.y !== -1) {
                    this.direction = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.direction.x !== 1) {
                    this.direction = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.direction.x !== -1) {
                    this.direction = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    startGame() {
        if (!this.gameRunning && !this.gameOver) {
            this.gameRunning = true;
            this.direction = { x: 1, y: 0 }; // 默认向右移动
            this.gameLoop();
        }
    }
    
    handleDifficultyChange() {
        this.difficulty = parseInt(this.difficultyElement.value);
        this.updateDifficultyValue();
        this.updateSpeed();
    }
    
    updateDifficultyValue() {
        const difficultyLevels = ['简单', '较简单', '中等', '较难', '困难'];
        this.difficultyValueElement.textContent = difficultyLevels[this.difficulty - 1];
    }
    
    updateSpeed() {
        this.moveInterval = 200 - (this.difficulty - 1) * 30 - (this.level - 1) * 10;
        this.moveInterval = Math.max(this.moveInterval, 50);
        this.speedElement.textContent = Math.round(1000 / this.moveInterval);
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.cols),
                y: Math.floor(Math.random() * this.rows)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }
    
    moveSnake() {
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // 检查边界碰撞
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            this.gameOver = true;
            this.gameRunning = false;
            return;
        }
        
        // 检查自身碰撞
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            this.gameRunning = false;
            return;
        }
        
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            
            // 每吃10个食物升级
            if (this.score % 100 === 0) {
                this.level++;
                this.updateSpeed();
            }
            this.updateUI();
        } else {
            this.snake.pop();
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.lengthElement.textContent = this.snake.length;
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvas.width, i * this.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            // 渐变颜色效果
            const gradient = this.ctx.createLinearGradient(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                (segment.x + 1) * this.cellSize,
                (segment.y + 1) * this.cellSize
            );
            
            if (index === 0) {
                // 蛇头
                gradient.addColorStop(0, '#00ffff');
                gradient.addColorStop(1, '#0088ff');
            } else {
                // 蛇身
                const intensity = 1 - (index / this.snake.length) * 0.5;
                gradient.addColorStop(0, `rgba(0, 255, 255, ${intensity})`);
                gradient.addColorStop(1, `rgba(0, 128, 255, ${intensity})`);
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(segment.x * this.cellSize, segment.y * this.cellSize, this.cellSize - 2, this.cellSize - 2);
            
            // 发光效果
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawFood() {
        // 食物发光效果
        this.ctx.shadowColor = '#ff00ff';
        this.ctx.shadowBlur = 15;
        
        const gradient = this.ctx.createRadialGradient(
            (this.food.x + 0.5) * this.cellSize,
            (this.food.y + 0.5) * this.cellSize,
            0,
            (this.food.x + 0.5) * this.cellSize,
            (this.food.y + 0.5) * this.cellSize,
            this.cellSize / 2
        );
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(1, '#880088');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc((this.food.x + 0.5) * this.cellSize, (this.food.y + 0.5) * this.cellSize, this.cellSize / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(5, 5, 26, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '48px Arial';
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`最终长度: ${this.snake.length}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText(`最终级别: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('按重置按钮开始新游戏', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawSnake();
        this.drawFood();
        
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime > this.moveInterval) {
            this.moveSnake();
            this.draw();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// 初始化游戏
window.addEventListener('load', () => {
    new SnakeGame();
});