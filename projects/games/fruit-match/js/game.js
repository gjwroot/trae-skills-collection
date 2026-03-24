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

    playMatch() {
        this.playTone(523, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 80);
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.3), 160);
    }

    playSwap() {
        this.playTone(440, 0.1, 'sine', 0.2);
    }

    playCombo(level) {
        const baseFreq = 400 + level * 50;
        for (let i = 0; i < Math.min(level, 5); i++) {
            setTimeout(() => this.playTone(baseFreq + i * 100, 0.15, 'sine', 0.3), i * 60);
        }
    }

    playLevelComplete() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.3), i * 150);
        });
    }

    playGameOver() {
        const notes = [400, 350, 300, 200];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sawtooth', 0.2), i * 200);
        });
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8 - 5;
        this.life = 1;
        this.decay = 0.02 + Math.random() * 0.02;
        this.size = 4 + Math.random() * 6;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
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

class FruitMatch {
    constructor() {
        this.audioManager = new AudioManager();
        this.particles = [];
        
        this.boardSize = 8;
        this.fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒'];
        this.fruitColors = {
            '🍎': '#ff6b6b',
            '🍊': '#ffa502',
            '🍋': '#ffd93d',
            '🍇': '#a55eea',
            '🍓': '#ff4757',
            '🍒': '#c44569'
        };
        
        this.board = [];
        this.selectedTile = null;
        this.score = 0;
        this.level = 1;
        this.targetScore = 1000;
        this.timeLeft = 60;
        this.combos = 0;
        this.isProcessing = false;
        this.isPaused = false;
        this.highScore = parseInt(localStorage.getItem('fruitMatchHighScore')) || 0;
        
        this.initElements();
        this.setupEventListeners();
        this.initCanvas();
        this.updateHighScoreDisplay();
    }

    initElements() {
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.levelCompleteScreen = document.getElementById('level-complete-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.nextLevelBtn = document.getElementById('next-level-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.targetElement = document.getElementById('target');
        this.timerElement = document.getElementById('timer');
        this.highScoreElement = document.getElementById('high-score');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalLevelElement = document.getElementById('final-level');
        this.levelScoreElement = document.getElementById('level-score');
        this.levelCombosElement = document.getElementById('level-combos');
        this.newRecordElement = document.getElementById('new-record');
        this.comboDisplayElement = document.getElementById('combo-display');
        
        this.gameBoardElement = document.getElementById('game-board');
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.nextLevelBtn.addEventListener('click', () => this.nextLevel());
        this.playAgainBtn.addEventListener('click', () => this.startGame());
    }

    initCanvas() {
        this.particleCanvas = document.getElementById('particles-canvas');
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.particleCanvas.width = window.innerWidth;
        this.particleCanvas.height = window.innerHeight;
    }

    updateHighScoreDisplay() {
        if (this.highScoreElement) {
            this.highScoreElement.textContent = this.highScore;
        }
    }

    startGame() {
        this.audioManager.init();
        this.score = 0;
        this.level = 1;
        this.targetScore = 1000;
        this.timeLeft = 60;
        this.combos = 0;
        this.isPaused = false;
        
        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');
        this.levelCompleteScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        
        this.updateUI();
        this.initBoard();
        this.startTimer();
        this.animateParticles();
    }

    initBoard() {
        this.board = [];
        this.gameBoardElement.innerHTML = '';
        
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                let fruit;
                do {
                    fruit = this.fruits[Math.floor(Math.random() * this.fruits.length)];
                } while (this.wouldCreateMatch(row, col, fruit));
                
                this.board[row][col] = fruit;
                this.createTile(row, col, fruit);
            }
        }
    }

    wouldCreateMatch(row, col, fruit) {
        let horizontalCount = 1;
        if (col >= 2 && this.board[row][col - 1] === fruit && this.board[row][col - 2] === fruit) {
            horizontalCount = 3;
        }
        
        let verticalCount = 1;
        if (row >= 2 && this.board[row - 1] && this.board[row - 1][col] === fruit &&
            this.board[row - 2] && this.board[row - 2][col] === fruit) {
            verticalCount = 3;
        }
        
        return horizontalCount >= 3 || verticalCount >= 3;
    }

    createTile(row, col, fruit, animate = false) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (animate) tile.classList.add('falling');
        tile.textContent = fruit;
        tile.dataset.row = row;
        tile.dataset.col = col;
        tile.addEventListener('click', () => this.handleTileClick(row, col));
        this.gameBoardElement.appendChild(tile);
    }

    handleTileClick(row, col) {
        if (this.isProcessing || this.isPaused) return;
        
        const tiles = this.gameBoardElement.querySelectorAll('.tile');
        
        if (this.selectedTile === null) {
            this.selectedTile = { row, col };
            tiles[row * this.boardSize + col].classList.add('selected');
        } else {
            const prevTile = this.selectedTile;
            tiles[prevTile.row * this.boardSize + prevTile.col].classList.remove('selected');
            
            if (this.isAdjacent(prevTile.row, prevTile.col, row, col)) {
                this.audioManager.playSwap();
                this.swapTiles(prevTile.row, prevTile.col, row, col);
            }
            
            this.selectedTile = null;
        }
    }

    isAdjacent(r1, c1, r2, c2) {
        return (Math.abs(r1 - r2) === 1 && c1 === c2) || 
               (Math.abs(c1 - c2) === 1 && r1 === r2);
    }

    async swapTiles(r1, c1, r2, c2) {
        this.isProcessing = true;
        
        const temp = this.board[r1][c1];
        this.board[r1][c1] = this.board[r2][c2];
        this.board[r2][c2] = temp;
        
        this.renderBoard();
        
        const matches = this.findMatches();
        
        if (matches.length > 0) {
            await this.processMatches(matches);
        } else {
            const temp2 = this.board[r1][c1];
            this.board[r1][c1] = this.board[r2][c2];
            this.board[r2][c2] = temp2;
            this.renderBoard();
        }
        
        this.isProcessing = false;
    }

    findMatches() {
        const matches = new Set();
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize - 2; col++) {
                const fruit = this.board[row][col];
                if (fruit && this.board[row][col + 1] === fruit && this.board[row][col + 2] === fruit) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row},${col + 1}`);
                    matches.add(`${row},${col + 2}`);
                    
                    let k = col + 3;
                    while (k < this.boardSize && this.board[row][k] === fruit) {
                        matches.add(`${row},${k}`);
                        k++;
                    }
                }
            }
        }
        
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = 0; row < this.boardSize - 2; row++) {
                const fruit = this.board[row][col];
                if (fruit && this.board[row + 1][col] === fruit && this.board[row + 2][col] === fruit) {
                    matches.add(`${row},${col}`);
                    matches.add(`${row + 1},${col}`);
                    matches.add(`${row + 2},${col}`);
                    
                    let k = row + 3;
                    while (k < this.boardSize && this.board[k][col] === fruit) {
                        matches.add(`${k},${col}`);
                        k++;
                    }
                }
            }
        }
        
        return Array.from(matches).map(m => {
            const [row, col] = m.split(',').map(Number);
            return { row, col };
        });
    }

    async processMatches(matches, combo = 0) {
        if (matches.length === 0) {
            if (combo > 0) this.combos++;
            return;
        }
        
        if (combo > 0) {
            this.showCombo(combo);
            this.audioManager.playCombo(combo);
        }
        
        const tiles = this.gameBoardElement.querySelectorAll('.tile');
        const matchPositions = new Set(matches.map(m => `${m.row},${m.col}`));
        
        matches.forEach(m => {
            const index = m.row * this.boardSize + m.col;
            if (tiles[index]) {
                tiles[index].classList.add('matched');
                
                const rect = tiles[index].getBoundingClientRect();
                const fruit = this.board[m.row][m.col];
                this.createParticles(
                    rect.left + rect.width / 2,
                    rect.top + rect.height / 2,
                    this.fruitColors[fruit]
                );
            }
        });
        
        this.audioManager.playMatch();
        
        const baseScore = matches.length * 10;
        const comboMultiplier = 1 + combo * 0.5;
        this.score += Math.floor(baseScore * comboMultiplier);
        this.updateUI();
        
        await this.delay(400);
        
        matches.forEach(m => {
            this.board[m.row][m.col] = null;
        });
        
        await this.dropFruits();
        await this.fillBoard();
        
        this.renderBoard();
        
        await this.delay(300);
        
        const newMatches = this.findMatches();
        if (newMatches.length > 0) {
            await this.processMatches(newMatches, combo + 1);
        } else {
            if (combo > 0) this.combos++;
        }
        
        this.checkLevelComplete();
    }

    async dropFruits() {
        for (let col = 0; col < this.boardSize; col++) {
            let writeRow = this.boardSize - 1;
            
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col] !== null) {
                    if (writeRow !== row) {
                        this.board[writeRow][col] = this.board[row][col];
                        this.board[row][col] = null;
                    }
                    writeRow--;
                }
            }
        }
    }

    async fillBoard() {
        for (let col = 0; col < this.boardSize; col++) {
            for (let row = 0; row < this.boardSize; row++) {
                if (this.board[row][col] === null) {
                    this.board[row][col] = this.fruits[Math.floor(Math.random() * this.fruits.length)];
                }
            }
        }
    }

    renderBoard() {
        this.gameBoardElement.innerHTML = '';
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) {
                    this.createTile(row, col, this.board[row][col]);
                }
            }
        }
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    animateParticles() {
        const animate = () => {
            this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
            
            for (let i = this.particles.length - 1; i >= 0; i--) {
                if (!this.particles[i].update()) {
                    this.particles.splice(i, 1);
                } else {
                    this.particles[i].draw(this.particleCtx);
                }
            }
            
            if (this.gameRunning) {
                requestAnimationFrame(animate);
            }
        };
        
        this.gameRunning = true;
        animate();
    }

    showCombo(combo) {
        const comboTexts = ['', '太棒了!', '连击!', '超级连击!', '疯狂连击!', '无敌!'];
        this.comboDisplayElement.textContent = comboTexts[Math.min(combo, 5)] || `${combo}连击!`;
        this.comboDisplayElement.classList.remove('show');
        void this.comboDisplayElement.offsetWidth;
        this.comboDisplayElement.classList.add('show');
    }

    updateUI() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.targetElement.textContent = this.targetScore;
        this.timerElement.textContent = this.timeLeft;
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.isPaused) return;
            
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    checkLevelComplete() {
        if (this.score >= this.targetScore) {
            this.levelComplete();
        }
    }

    levelComplete() {
        this.isPaused = true;
        clearInterval(this.timerInterval);
        
        this.audioManager.playLevelComplete();
        
        this.levelScoreElement.textContent = this.score;
        this.levelCombosElement.textContent = this.combos;
        
        this.gameScreen.classList.add('hidden');
        this.levelCompleteScreen.classList.remove('hidden');
    }

    nextLevel() {
        this.level++;
        this.targetScore = 1000 + (this.level - 1) * 500;
        this.timeLeft = 60 + Math.min(this.level * 5, 30);
        this.combos = 0;
        this.isPaused = false;
        
        this.levelCompleteScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        
        this.updateUI();
        this.initBoard();
        this.startTimer();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '▶️ 继续' : '⏸️ 暂停';
    }

    restartGame() {
        this.startGame();
    }

    endGame() {
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        
        this.audioManager.playGameOver();
        
        const isNewRecord = this.score > this.highScore;
        if (isNewRecord) {
            this.highScore = this.score;
            localStorage.setItem('fruitMatchHighScore', this.highScore);
        }
        
        this.finalScoreElement.textContent = this.score;
        this.finalLevelElement.textContent = this.level;
        
        if (this.newRecordElement) {
            if (isNewRecord) {
                this.newRecordElement.classList.remove('hidden');
            } else {
                this.newRecordElement.classList.add('hidden');
            }
        }
        
        this.updateHighScoreDisplay();
        
        this.gameScreen.classList.add('hidden');
        this.gameOverScreen.classList.remove('hidden');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new FruitMatch();
});
