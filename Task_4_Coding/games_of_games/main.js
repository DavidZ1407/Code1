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
        window.addEventListener("keydown", event => {
            if (event.code === "Space" && (!gameStarted || gameEnded)) {
                if (gameEnded) {
                    location.reload();
                }
                else if (!gameStarted) {
                    startGame();
                }
                event.preventDefault();
            }
            if (!gameStarted || gameEnded)
                return;
            activeKeys.add(event.code);
            if (event.code === "Space") {
                GamesOFGames.handlePlayerShot(GamesOFGames.bullets, GamesOFGames.enemies);
            }
        });
        instructionsBox.addEventListener("touchstart", (event) => {
            if (!gameStarted || gameEnded) {
                if (gameEnded) {
                    location.reload();
                }
                else if (!gameStarted) {
                    startGame();
                }
            }
            event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchstart", (event) => {
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
                    dragStartX = event.touches[0].clientX;
                    dragStartY = event.touches[0].clientY;
                    playerStartPosX = GamesOFGames.player.playerPosition.x;
                    playerStartPosY = GamesOFGames.player.playerPosition.y;
                }
                lastTapTime = currentTime;
            }
            event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchmove", (event) => {
            if (gameStarted && !gameEnded && isDraggingPlayer) {
                const touch = event.touches[0];
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
            event.preventDefault();
        }, { passive: false });
        gameContainer.addEventListener("touchend", (event) => {
            if (gameStarted && !gameEnded) {
                isDraggingPlayer = false;
            }
            event.preventDefault();
        }, { passive: false });
        window.addEventListener("keyup", event => {
            if (!gameStarted || gameEnded)
                return;
            activeKeys.delete(event.code);
        });
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
        GamesOFGames.bullets.forEach(b => b.remove());
        GamesOFGames.enemies.forEach(e => e.remove());
        GamesOFGames.powerUps.forEach(p => p.remove());
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
    function gameLoop(time) {
        if (!gameStarted || gameEnded)
            return;
        const timeDelta = (time - timePreviousFrame) / 1000;
        timePreviousFrame = time;
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
    function setGameEnded(state) {
        gameEnded = state;
        if (state) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQXFQckI7QUFyUEQsV0FBVSxZQUFZO0lBQ1AseUJBQVksR0FBRyxDQUFDLENBQUM7SUFDakIseUJBQVksR0FBRyxDQUFDLENBQUM7SUFHakIsNkJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLDhCQUFpQixHQUFRLElBQUksQ0FBQztJQUU5Qix5QkFBWSxHQUFHLENBQUMsQ0FBQztJQUNmLDJCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLHlCQUFZLEdBQUcsR0FBRyxDQUFDO0lBRWhDLElBQUksaUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBRXJCLG9CQUFPLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLG9CQUFPLEdBQVksRUFBRSxDQUFDO0lBQ3RCLHFCQUFRLEdBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFFckMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUV4QixJQUFJLGVBQStCLENBQUM7SUFDcEMsSUFBSSxhQUE2QixDQUFDO0lBRWxDLElBQUksa0JBQXNDLENBQUM7SUFDM0MsSUFBSSxvQkFBd0MsQ0FBQztJQUU3QyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUNwQyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUMvQixNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztJQUNwQyxNQUFNLG1DQUFtQyxHQUFHLEdBQUcsQ0FBQztJQUNoRCxJQUFJLDJCQUEyQixHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO0lBRXBELElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztJQUM1QixNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUcvQixJQUFJ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