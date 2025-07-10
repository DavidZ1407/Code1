"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    GamesOFGames.currentScore = 0;
    GamesOFGames.currentLives = 3;
    GamesOFGames.bulletTimeActive = false;
    GamesOFGames.bulletTimeTimeout = null;
    GamesOFGames.lastShotTime = 0;
    GamesOFGames.normalFireRate = 300;
    GamesOFGames.fastFireRate = 100;
    let timePreviousFrame = 0;
    GamesOFGames.bullets = [];
    GamesOFGames.enemies = [];
    GamesOFGames.powerUps = [];
    const activeKeys = new Set();
    let gameEnded = false;
    let gameStarted = false;
    let instructionsBox;
    let gameContainer;
    let enemySpawnInterval;
    let powerUpSpawnInterval;
    const initialEnemySpawnDelay = 1000;
    const minEnemySpawnDelay = 200;
    const spawnDelayDecreaseAmount = 50;
    const scoreThresholdForDifficultyIncrease = 100;
    let lastDifficultyIncreaseScore = 0;
    let currentEnemySpawnDelay = initialEnemySpawnDelay;
    let lastTapTime = 0;
    const doubleTapThreshold = 300;
    let isDraggingPlayer = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let playerStartPosX = 0;
    let playerStartPosY = 0;
    window.onload = () => {
        gameContainer = document.getElementById("game");
        GamesOFGames.player = new GamesOFGames.Player();
        GamesOFGames.updateLivesDisplay();
        GamesOFGames.updateScoreDisplay();
        instructionsBox = document.getElementById("game-instructions");
        window.addEventListener("keydown", _event => {
            if (_event.code === "Space" && (!gameStarted || gameEnded)) {
                if (gameEnded) {
                    location.reload();
                }
                else if (!gameStarted) {
                    startGame();
                }
                _event.preventDefault();
            }
            if (!gameStarted || gameEnded)
                return;
            activeKeys.add(_event.code);
            if (_event.code === "Space") {
                GamesOFGames.handlePlayerShot(GamesOFGames.bullets, GamesOFGames.enemies);
            }
        });
        window.addEventListener("keyup", _event => {
            if (!gameStarted || gameEnded)
                return;
            activeKeys.delete(_event.code);
        });
        instructionsBox.addEventListener("touchstart", (_event) => {
            if (!gameStarted || gameEnded) {
                if (gameEnded) {
                    location.reload();
                }
                else if (!gameStarted) {
                    startGame();
                }
            }
            _event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchstart", (_event) => {
            if (gameStarted && !gameEnded) {
                const currentTime = new Date().getTime();
                const tapDifference = currentTime - lastTapTime;
                if (tapDifference < doubleTapThreshold && tapDifference > 0) {
                    GamesOFGames.handlePlayerShot(GamesOFGames.bullets, GamesOFGames.enemies);
                    lastTapTime = 0;
                    isDraggingPlayer = false;
                }
                else {
                    isDraggingPlayer = true;
                    dragStartX = _event.touches[0].clientX;
                    dragStartY = _event.touches[0].clientY;
                    playerStartPosX = GamesOFGames.player.playerPosition.x;
                    playerStartPosY = GamesOFGames.player.playerPosition.y;
                }
                lastTapTime = currentTime;
            }
            _event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchmove", (_event) => {
            if (gameStarted && !gameEnded && isDraggingPlayer) {
                const touch = _event.touches[0];
                const deltaX = touch.clientX - dragStartX;
                const deltaY = touch.clientY - dragStartY;
                let newX = playerStartPosX + deltaX;
                let newY = playerStartPosY + deltaY;
                const gameRect = gameContainer.getBoundingClientRect();
                const playerRect = GamesOFGames.player.playerElement.getBoundingClientRect();
                newX = Math.max(0, Math.min(newX, gameRect.width - playerRect.width));
                newY = Math.max(0, Math.min(newY, gameRect.height - playerRect.height));
                GamesOFGames.player.playerPosition.x = newX;
                GamesOFGames.player.playerPosition.y = newY;
                GamesOFGames.player.updatePosition();
            }
            _event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchend", (_event) => {
            if (gameStarted && !gameEnded) {
                isDraggingPlayer = false;
            }
            _event.preventDefault();
        }, { passive: false });
    };
    function startEnemySpawningInterval() {
        if (enemySpawnInterval) {
            clearInterval(enemySpawnInterval);
        }
        enemySpawnInterval = setInterval(() => {
            if (!gameEnded) {
                GamesOFGames.spawnEnemy(GamesOFGames.enemies);
            }
        }, currentEnemySpawnDelay);
    }
    function startGame() {
        gameStarted = true;
        gameEnded = false;
        instructionsBox.style.display = "none";
        GamesOFGames.currentScore = 0;
        GamesOFGames.currentLives = 3;
        GamesOFGames.updateScoreDisplay();
        GamesOFGames.updateLivesDisplay();
        GamesOFGames.bullets.forEach(_b => _b.remove());
        GamesOFGames.enemies.forEach(_e => _e.remove());
        GamesOFGames.powerUps.forEach(_p => _p.remove());
        GamesOFGames.bullets.length = 0;
        GamesOFGames.enemies.length = 0;
        GamesOFGames.powerUps.length = 0;
        const playerWidth = GamesOFGames.player.playerElement.offsetWidth;
        const playerHeight = GamesOFGames.player.playerElement.offsetHeight;
        const gameWidth = gameContainer.offsetWidth;
        const gameHeight = gameContainer.offsetHeight;
        GamesOFGames.player.playerPosition = {
            x: (gameWidth / 2) - (playerWidth / 2),
            y: gameHeight - playerHeight - 10
        };
        GamesOFGames.player.hasDoubleShot = false;
        GamesOFGames.player.hasFastShot = false;
        GamesOFGames.player.shieldCount = 0;
        GamesOFGames.player.playerElement.classList.remove("shield");
        GamesOFGames.player.updatePosition();
        if (powerUpSpawnInterval)
            clearInterval(powerUpSpawnInterval);
        if (enemySpawnInterval)
            clearInterval(enemySpawnInterval);
        currentEnemySpawnDelay = initialEnemySpawnDelay;
        lastDifficultyIncreaseScore = 0;
        timePreviousFrame = performance.now();
        requestAnimationFrame(gameLoop);
        startEnemySpawningInterval();
        powerUpSpawnInterval = setInterval(() => {
            if (!gameEnded) {
                GamesOFGames.spawnPowerUp(GamesOFGames.powerUps);
            }
        }, 7000);
    }
    function gameLoop(_time) {
        if (!gameStarted || gameEnded)
            return;
        const timeDelta = (_time - timePreviousFrame) / 1000;
        timePreviousFrame = _time;
        GamesOFGames.player.move(activeKeys, timeDelta);
        GamesOFGames.updateAndCleanBullets(GamesOFGames.bullets, GamesOFGames.enemies, timeDelta);
        GamesOFGames.updateAndCleanEnemies(GamesOFGames.enemies, GamesOFGames.player, timeDelta);
        GamesOFGames.updateAndCleanPowerUps(GamesOFGames.powerUps, GamesOFGames.player, timeDelta);
        if (GamesOFGames.currentScore >= lastDifficultyIncreaseScore + scoreThresholdForDifficultyIncrease) {
            if (currentEnemySpawnDelay > minEnemySpawnDelay) {
                currentEnemySpawnDelay -= spawnDelayDecreaseAmount;
                lastDifficultyIncreaseScore = GamesOFGames.currentScore;
                startEnemySpawningInterval();
            }
        }
        requestAnimationFrame(gameLoop);
    }
    function setGameEnded(_state) {
        gameEnded = _state;
        if (_state) {
            if (enemySpawnInterval)
                clearInterval(enemySpawnInterval);
            if (powerUpSpawnInterval)
                clearInterval(powerUpSpawnInterval);
            enemySpawnInterval = undefined;
            powerUpSpawnInterval = undefined;
        }
    }
    GamesOFGames.setGameEnded = setGameEnded;
    function gameOver() {
        setGameEnded(true);
        gameStarted = false;
        if (instructionsBox) {
            instructionsBox.innerHTML = `<h2>Game Over!</h2><p>Your Score: ${GamesOFGames.currentScore}</p><p class="press-to-start">(Press SPACE or Tap to Restart!)</p>`;
            instructionsBox.style.display = "block";
        }
        else {
            location.reload();
        }
    }
    GamesOFGames.gameOver = gameOver;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQXFQckI7QUFyUEQsV0FBVSxZQUFZO0lBQ0wseUJBQVksR0FBVyxDQUFDLENBQUM7SUFDekIseUJBQVksR0FBVyxDQUFDLENBQUM7SUFHekIsNkJBQWdCLEdBQVksS0FBSyxDQUFDO0lBQ2xDLDhCQUFpQixHQUFRLElBQUksQ0FBQztJQUU5Qix5QkFBWSxHQUFXLENBQUMsQ0FBQztJQUN6QiwyQkFBYyxHQUFXLEdBQUcsQ0FBQztJQUM3Qix5QkFBWSxHQUFXLEdBQUcsQ0FBQztJQUV4QyxJQUFJLGlCQUFpQixHQUFXLENBQUMsQ0FBQztJQUVyQixvQkFBTyxHQUFhLEVBQUUsQ0FBQztJQUN2QixvQkFBTyxHQUFZLEVBQUUsQ0FBQztJQUN0QixxQkFBUSxHQUFjLEVBQUUsQ0FBQztJQUN0QyxNQUFNLFVBQVUsR0FBZSxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBRWpELElBQUksU0FBUyxHQUFZLEtBQUssQ0FBQztJQUMvQixJQUFJLFdBQVcsR0FBWSxLQUFLLENBQUM7SUFFakMsSUFBSSxlQUErQixDQUFDO0lBQ3BDLElBQUksYUFBNkIsQ0FBQztJQUVsQyxJQUFJLGtCQUFzQyxDQUFDO0lBQzNDLElBQUksb0JBQXdDLENBQUM7SUFFN0MsTUFBTSxzQkFBc0IsR0FBVyxJQUFJLENBQUM7SUFDNUMsTUFBTSxrQkFBa0IsR0FBVyxHQUFHLENBQUM7SUFDdkMsTUFBTSx3QkFBd0IsR0FBVyxFQUFFLENBQUM7SUFDNUMsTUFBTSxtQ0FBbUMsR0FBVyxHQUFHLENBQUM7SUFDeEQsSUFBSSwyQkFBMkIsR0FBVyxDQUFDLENBQUM7SUFDNUMsSUFBSSxzQkFBc0IsR0FBVyxzQkFBc0IsQ0FBQztJQUU1RCxJQUFJLFdBQVcsR0FBVyxDQUFDLENBQUM7SUFDNUIsTUFBTSxrQkFBa0IsR0FBVyxHQUFHLENBQUM7SUFFdkMsSUFB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