namespace GamesOFGames {
    export let currentScore = 0;
    export let currentLives = 3;
    export let player: Player;

    export let bulletTimeActive = false;
    export let bulletTimeTimeout: any = null;

    export let lastShotTime = 0;
    export const normalFireRate = 300;
    export const fastFireRate = 100;

    let timePreviousFrame: number = 0;

    export const bullets: Bullet[] = [];
    export let enemies: Enemy[] = [];
    export let powerUps: PowerUp[] = [];
    const activeKeys = new Set<string>();

    let gameEnded = false;
    let gameStarted = false;

    let instructionsBox: HTMLDivElement;
    let gameContainer: HTMLDivElement;

    let enemySpawnInterval: number | undefined;
    let powerUpSpawnInterval: number | undefined;

    const initialEnemySpawnDelay = 1000;
    const minEnemySpawnDelay = 200;
    const spawnDelayDecreaseAmount = 50;
    const scoreThresholdForDifficultyIncrease = 100;
    let lastDifficultyIncreaseScore = 0;
    let currentEnemySpawnDelay = initialEnemySpawnDelay;

    let lastTapTime: number = 0;
    const doubleTapThreshold = 300;

    let isDraggingPlayer: boolean = false;
    let dragStartX: number = 0;
    let dragStartY: number = 0;
    let playerStartPosX: number = 0;
    let playerStartPosY: number = 0;

    window.onload = () => {
        gameContainer = document.getElementById("game") as HTMLDivElement;
        player = new GamesOFGames.Player();
        GamesOFGames.updateLivesDisplay();
        GamesOFGames.updateScoreDisplay();

        instructionsBox = document.getElementById("game-instructions") as HTMLDivElement;

        window.addEventListener("keydown", event => {
            if (event.code === "Space" && (!gameStarted || gameEnded)) {
                if (gameEnded) {
                    location.reload();
                } else if (!gameStarted) {
                    startGame();
                }
                event.preventDefault();
            }
            if (!gameStarted || gameEnded) return;

            activeKeys.add(event.code);

            if (event.code === "Space") {
                GamesOFGames.handlePlayerShot(bullets, enemies);
            }
        });

        window.addEventListener("keyup", event => {
            if (!gameStarted || gameEnded) return;
            activeKeys.delete(event.code);
        });

        instructionsBox.addEventListener("touchstart", (event) => {
            if (!gameStarted || gameEnded) {
                if (gameEnded) {
                    location.reload();
                } else if (!gameStarted) {
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
                    GamesOFGames.handlePlayerShot(bullets, enemies);
                    lastTapTime = 0;
                    isDraggingPlayer = false;
                } else {
                    isDraggingPlayer = true;
                    dragStartX = event.touches[0].clientX;
                    dragStartY = event.touches[0].clientY;
                    playerStartPosX = player.playerPosition.x;
                    playerStartPosY = player.playerPosition.y;
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
                const playerRect = player.playerElement.getBoundingClientRect();

                newX = Math.max(0, Math.min(newX, gameRect.width - playerRect.width));
                newY = Math.max(0, Math.min(newY, gameRect.height - playerRect.height));

                player.playerPosition.x = newX;
                player.playerPosition.y = newY;
                player.updatePosition();
            }
            event.preventDefault();
        }, { passive: false });

        gameContainer.addEventListener("touchend", (event) => {
            if (gameStarted && !gameEnded) {
                isDraggingPlayer = false;
            }
            event.preventDefault();
        }, { passive: false });
    };

    function startEnemySpawningInterval() {
        if (enemySpawnInterval) {
            clearInterval(enemySpawnInterval);
        }
        enemySpawnInterval = setInterval(() => {
            if (!gameEnded) {
                GamesOFGames.spawnEnemy(enemies);
            }
        }, currentEnemySpawnDelay) as unknown as number;
    }

    function startGame() {
        gameStarted = true;
        gameEnded = false;

        instructionsBox.style.display = "none";

        GamesOFGames.currentScore = 0;
        GamesOFGames.currentLives = 3;
        GamesOFGames.updateScoreDisplay();
        GamesOFGames.updateLivesDisplay();

        bullets.forEach(b => b.remove());
        enemies.forEach(e => e.remove());
        powerUps.forEach(p => p.remove());
        bullets.length = 0;
        enemies.length = 0;
        powerUps.length = 0;


        const playerWidth = player.playerElement.offsetWidth;
        const playerHeight = player.playerElement.offsetHeight;
        const gameWidth = gameContainer.offsetWidth;
        const gameHeight = gameContainer.offsetHeight;

        player.playerPosition = {
            x: (gameWidth / 2) - (playerWidth / 2),
            y: gameHeight - playerHeight - 10
        };
        player.hasDoubleShot = false;
        player.hasFastShot = false;
        player.shieldCount = 0;
        player.playerElement.classList.remove("shield");
        player.updatePosition();

        if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
        if (enemySpawnInterval) clearInterval(enemySpawnInterval);

        currentEnemySpawnDelay = initialEnemySpawnDelay;
        lastDifficultyIncreaseScore = 0;

        timePreviousFrame = performance.now();
        requestAnimationFrame(gameLoop);

        startEnemySpawningInterval();

        powerUpSpawnInterval = setInterval(() => {
            if (!gameEnded) {
                GamesOFGames.spawnPowerUp(powerUps);
            }
        }, 7000) as unknown as number;
    }

    function gameLoop(time: number) {
        if (!gameStarted || gameEnded) return;

        const timeDelta = (time - timePreviousFrame) / 1000;
        timePreviousFrame = time;

        player.move(activeKeys, timeDelta);

        GamesOFGames.updateAndCleanBullets(bullets, enemies, timeDelta);
        GamesOFGames.updateAndCleanEnemies(enemies, player, timeDelta);
        GamesOFGames.updateAndCleanPowerUps(powerUps, player, timeDelta);

        if (GamesOFGames.currentScore >= lastDifficultyIncreaseScore + scoreThresholdForDifficultyIncrease) {
            if (currentEnemySpawnDelay > minEnemySpawnDelay) {
                currentEnemySpawnDelay -= spawnDelayDecreaseAmount;
                lastDifficultyIncreaseScore = GamesOFGames.currentScore;
                startEnemySpawningInterval();
            }
        }

        requestAnimationFrame(gameLoop);
    }

    export function setGameEnded(state: boolean) {
        gameEnded = state;
        if (state) {
            if (enemySpawnInterval) clearInterval(enemySpawnInterval);
            if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
            enemySpawnInterval = undefined;
            powerUpSpawnInterval = undefined;
        }
    }

    export function gameOver() {
        setGameEnded(true);
        gameStarted = false;

        if (instructionsBox) {
            instructionsBox.innerHTML = `<h2>Game Over!</h2><p>Your Score: ${GamesOFGames.currentScore}</p><p class="press-to-start">(Press SPACE or Tap to Restart!)</p>`;
            instructionsBox.style.display = "block";
        } else {
            location.reload();
        }
    }
}