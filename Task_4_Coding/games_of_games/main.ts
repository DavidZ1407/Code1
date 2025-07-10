namespace GamesOFGames {
    export const currentScore: number = 0;
    export const currentLives: number = 3;
    export let player: Player;

    export const bulletTimeActive: boolean = false;
    export const bulletTimeTimeout: any = null;

    export const lastShotTime: number = 0;
    export const normalFireRate: number = 300;
    export const fastFireRate: number = 100;

    let timePreviousFrame: number = 0;

    export const bullets: Bullet[] = [];
    export const enemies: Enemy[] = [];
    export const powerUps: PowerUp[] = [];
    const activeKeys:Set<string> = new Set<string>();

    let gameEnded: boolean = false;
    let gameStarted: boolean = false;

    let instructionsBox: HTMLDivElement;
    let gameContainer: HTMLDivElement;

    let enemySpawnInterval: number | undefined;
    let powerUpSpawnInterval: number | undefined;

    const initialEnemySpawnDelay: number = 1000;
    const minEnemySpawnDelay: number = 200;
    const spawnDelayDecreaseAmount: number = 50;
    const scoreThresholdForDifficultyIncrease: number = 100;
    let lastDifficultyIncreaseScore: number = 0;
    let currentEnemySpawnDelay: number = initialEnemySpawnDelay;

    let lastTapTime: number = 0;
    const doubleTapThreshold: number = 300;

    let isDraggingPlayer: boolean = false;
    let dragStartX: number = 0;
    let dragStartY: number = 0;
    let playerStartPosX: number = 0;
    let playerStartPosY: number = 0;

    window.onload = (): void => {
        gameContainer = document.getElementById("game") as HTMLDivElement;
        player = new GamesOFGames.Player();
        GamesOFGames.updateLivesDisplay();
        GamesOFGames.updateScoreDisplay();

        instructionsBox = document.getElementById("game-instructions") as HTMLDivElement;

        window.addEventListener("keydown", _event => {
            if (_event.code === "Space" && (!gameStarted || gameEnded)) {
                if (gameEnded) {
                    location.reload();
                } else if (!gameStarted) {
                    startGame();
                }
                _event.preventDefault();
            }
            if (!gameStarted || gameEnded) return;

            activeKeys.add(_event.code);

            if (_event.code === "Space") {
                GamesOFGames.handlePlayerShot(bullets, enemies);
            }
        });

        window.addEventListener("keyup", _event => {
            if (!gameStarted || gameEnded) return;
            activeKeys.delete(_event.code);
        });

        instructionsBox.addEventListener("touchstart", (_event) => {
            if (!gameStarted || gameEnded) {
                if (gameEnded) {
                    location.reload();
                } else if (!gameStarted) {
                    startGame();
                }
            }
            _event.preventDefault();
        }, { passive: false });


        gameContainer.addEventListener("touchstart", (_event) => {
            if (gameStarted && !gameEnded) {
                const currentTime: number = new Date().getTime();
                const tapDifference: number = currentTime - lastTapTime;

                if (tapDifference < doubleTapThreshold && tapDifference > 0) {
                    GamesOFGames.handlePlayerShot(bullets, enemies);
                    lastTapTime = 0;
                    isDraggingPlayer = false;
                } else {
                    isDraggingPlayer = true;
                    dragStartX = _event.touches[0].clientX;
                    dragStartY = _event.touches[0].clientY;
                    playerStartPosX = player.playerPosition.x;
                    playerStartPosY = player.playerPosition.y;
                }
                lastTapTime = currentTime;
            }
            _event.preventDefault();
        }, { passive: false });

        gameContainer.addEventListener("touchmove", (_event) => {
            if (gameStarted && !gameEnded && isDraggingPlayer) {
                const touch: Touch = _event.touches[0];
                const deltaX: number = touch.clientX - dragStartX;
                const deltaY: number = touch.clientY - dragStartY;

                let newX: number = playerStartPosX + deltaX;
                let newY: number = playerStartPosY + deltaY;

                const gameRect: DOMRect = gameContainer.getBoundingClientRect();
                const playerRect: DOMRect = player.playerElement.getBoundingClientRect();

                newX = Math.max(0, Math.min(newX, gameRect.width - playerRect.width));
                newY = Math.max(0, Math.min(newY, gameRect.height - playerRect.height));

                player.playerPosition.x = newX;
                player.playerPosition.y = newY;
                player.updatePosition();
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

    function startEnemySpawningInterval(): void {
        if (enemySpawnInterval) {
            clearInterval(enemySpawnInterval);
        }
        enemySpawnInterval = setInterval(() => {
            if (!gameEnded) {
                GamesOFGames.spawnEnemy(enemies);
            }
        }, currentEnemySpawnDelay) as unknown as number;
    }

    function startGame(): void {
        gameStarted = true;
        gameEnded = false;

        instructionsBox.style.display = "none";

        GamesOFGames.currentScore = 0;
        GamesOFGames.currentLives = 3;
        GamesOFGames.updateScoreDisplay();
        GamesOFGames.updateLivesDisplay();

        bullets.forEach(_b => _b.remove());
        enemies.forEach(_e => _e.remove());
        powerUps.forEach(_p => _p.remove());
        bullets.length = 0;
        enemies.length = 0;
        powerUps.length = 0;


        const playerWidth: number = player.playerElement.offsetWidth;
        const playerHeight: number = player.playerElement.offsetHeight;
        const gameWidth: number = gameContainer.offsetWidth;
        const gameHeight: number = gameContainer.offsetHeight;

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

    function gameLoop(_time: number): void {
        if (!gameStarted || gameEnded) return;

        const timeDelta: number = (_time - timePreviousFrame) / 1000;
        timePreviousFrame = _time;

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

    export function setGameEnded(_state: boolean): void {
        gameEnded = _state;
        if (_state) {
            if (enemySpawnInterval) clearInterval(enemySpawnInterval);
            if (powerUpSpawnInterval) clearInterval(powerUpSpawnInterval);
            enemySpawnInterval = undefined;
            powerUpSpawnInterval = undefined;
        }
    }

    export function gameOver(): void {
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