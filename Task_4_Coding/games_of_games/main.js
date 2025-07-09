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
                GamesOFGames.handlePlayerShot(GamesOFGames.bullets, GamesOFGames.enemies);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQStMckI7QUEvTEQsV0FBVSxZQUFZO0lBQ1AseUJBQVksR0FBRyxDQUFDLENBQUM7SUFDakIseUJBQVksR0FBRyxDQUFDLENBQUM7SUFHakIsNkJBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLDhCQUFpQixHQUFRLElBQUksQ0FBQztJQUU5Qix5QkFBWSxHQUFHLENBQUMsQ0FBQztJQUNmLDJCQUFjLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLHlCQUFZLEdBQUcsR0FBRyxDQUFDO0lBRWhDLElBQUksaUJBQWlCLEdBQVcsQ0FBQyxDQUFDO0lBRXJCLG9CQUFPLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLG9CQUFPLEdBQVksRUFBRSxDQUFDO0lBQ3RCLHFCQUFRLEdBQWMsRUFBRSxDQUFDO0lBQ3BDLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7SUFFckMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUV4QixJQUFJLGVBQStCLENBQUM7SUFDcEMsSUFBSSxhQUE2QixDQUFDO0lBRWxDLElBQUksa0JBQXNDLENBQUM7SUFDM0MsSUFBSSxvQkFBd0MsQ0FBQztJQUU3QyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQztJQUNwQyxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQztJQUMvQixNQUFNLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztJQUNwQyxNQUFNLG1DQUFtQyxHQUFHLEdBQUcsQ0FBQztJQUNoRCxJQUFJLDJCQUEyQixHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDO0lBRXBELE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO1FBQ2pCLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1B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