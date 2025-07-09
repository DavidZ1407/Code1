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
                }
                else {
                    console.log("Single tap for movement detected.");
                }
                lastTapTime = currentTime;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQTJNckI7QUEzTUQsV0FBVSxZQUFZO0lBQ1AseUJBQVksR0FBRyxDQUFDLENBQUM7SUFDakIseUJBQVksR0FBRyxDQUFDLENBQUM7SUFHakIsNkJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLDhCQUFpQixHQUFRLElBQUksQ0FBQztJQUU5Qix5QkFBWSxHQUFHLENBQUMsQ0FBQztJQUNmLDJCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLHlCQUFZLEdBQUcsR0FBRyxDQUFDO0lBRWhDLElBQUksaUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBRXJCLG9CQUFPLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLG9CQUFPLEdBQVksRUFBRSxDQUFDO0lBQ3RCLHFCQUFRLEdBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFFckMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUV4QixJQUFJLGVBQStCLENBQUM7SUFDcEMsSUFBSSxhQUE2QixDQUFDO0lBRWxDLElBQUksa0JBQXNDLENBQUM7SUFDM0MsSUFBSSxvQkFBd0MsQ0FBQztJQUU3QyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUNwQyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUMvQixNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztJQUNwQyxNQUFNLG1DQUFtQyxHQUFHLEdBQUcsQ0FBQztJQUNoRCxJQUFJLDJCQUEyQixHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO0lBRXBELElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztJQUM1QixNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUUvQixNQUFN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