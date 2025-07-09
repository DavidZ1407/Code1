namespace GamesOFGames {
    type Vector = { x: number; y: number };

    const gameContainer = document.getElementById("game")!;
    const scoreDisplay = document.getElementById("score")!;
    const livesDisplay = document.getElementById("lives")!;

    let currentScore = 0;
    let currentLives = 3;
    let player: Player;

    let bulletTimeActive = false;
    let bulletTimeTimeout: any = null;

    let lastShotTime = 0;
    const normalFireRate = 300;
    const fastFireRate = 100;

    class Player {
        playerElement: HTMLDivElement = document.createElement("div");
        playerPosition: Vector = { x: 280, y: 700 };
        playerSize: Vector = { x: 40, y: 40 };
        playerSpeed: number = 5;

        hasDoubleShot = false;
        hasFastShot = false;
        shieldCount = 0;

        constructor() {
            this.playerElement.className = "player";
            gameContainer.appendChild(this.playerElement);
            this.updatePosition();
        }

        updatePosition() {
            this.playerElement.style.left = this.playerPosition.x + "px";
            this.playerElement.style.top = this.playerPosition.y + "px";
        }

        move(activeKeys: Set<string>) {
            if (activeKeys.has("ArrowLeft")) this.playerPosition.x -= this.playerSpeed;
            if (activeKeys.has("ArrowRight")) this.playerPosition.x += this.playerSpeed;
            if (activeKeys.has("ArrowUp")) this.playerPosition.y -= this.playerSpeed;
            if (activeKeys.has("ArrowDown")) this.playerPosition.y += this.playerSpeed;

            // Begrenzung auf Spielfeldgröße
            this.playerPosition.x = Math.max(0, Math.min(560, this.playerPosition.x));
            this.playerPosition.y = Math.max(0, Math.min(760, this.playerPosition.y));
            this.updatePosition();
        }

        takeDamage() {
            if (this.shieldCount > 0) {
                this.shieldCount--;
                if (this.shieldCount === 0) {
                    this.playerElement.classList.remove("shield");
                }
                updateLivesDisplay();
                return;
            }
            currentLives--;
            updateLivesDisplay();
            if (currentLives <= 0) gameOver();
        }

        setPowerUp(type: "doubleShot" | "fastShot", value: boolean) {
            if (type === "doubleShot") {
                this.hasDoubleShot = value;
            } else if (type === "fastShot") {
                this.hasFastShot = value;
            }
        }
    }

    class Bullet {
        bulletElement: HTMLDivElement = document.createElement("div");
        bulletPosition: Vector;
        speed: number = 10;
        velocityX: number = 0;
        velocityY: number = -1;

        constructor(initialPosition: Vector, offsetX: number = 18, targetEnemy?: Enemy) {
            this.bulletPosition = { x: initialPosition.x + offsetX, y: initialPosition.y };
            this.bulletElement.className = "bullet";
            gameContainer.appendChild(this.bulletElement);

            if (targetEnemy) {
                const dx = targetEnemy.enemyPosition.x + targetEnemy.size / 2 - this.bulletPosition.x;
                const dy = targetEnemy.enemyPosition.y + targetEnemy.size / 2 - this.bulletPosition.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.velocityX = dx / dist;
                this.velocityY = dy / dist;
            }

            this.update();
        }

        update() {
            const speedFactor = bulletTimeActive ? 0.3 : 1;
            this.bulletPosition.x += this.velocityX * this.speed * speedFactor;
            this.bulletPosition.y += this.velocityY * this.speed * speedFactor;
            this.bulletElement.style.left = this.bulletPosition.x + "px";
            this.bulletElement.style.top = this.bulletPosition.y + "px";
        }

        isOffscreen(): boolean {
            return (
                this.bulletPosition.y < 0 || this.bulletPosition.y > 800 ||
                this.bulletPosition.x < 0 || this.bulletPosition.x > 600
            );
        }

        remove() {
            this.bulletElement.remove();
        }
    }

class Enemy {
    enemyElement: HTMLDivElement = document.createElement("div");
    enemyPosition: Vector;
    speed: number;
    size: number;
    type: "normal" | "orbit" | "boss";
    health: number = 1;
    orbitAngle = 0;
    orbitDirectionX: number = 1;

    lastBossShotTime: number = 0;

    constructor(type: "normal" | "orbit" | "boss" = "normal") {
        this.type = type;
        this.enemyPosition = { x: Math.random() * 540, y: -40 };
        this.enemyElement.className = "enemy " + type;

        if (type === "boss") {
            this.size = 80;
            this.speed = 1;
            this.health = 10;
        } else {
            const hpVariants = [1, 2, 3];
            this.health = hpVariants[Math.floor(Math.random() * hpVariants.length)];
            this.size = 30 + Math.random() * 20;
            this.speed = 2 + Math.random() * 2;
        }

        if (type === "orbit") {
            this.orbitDirectionX = Math.random() < 0.5 ? 1 : -1;
        }

        this.enemyElement.classList.add(`hp-${this.health}`);

        this.enemyElement.style.width = this.size + "px";
        this.enemyElement.style.height = this.size + "px";
        gameContainer.appendChild(this.enemyElement);
        this.update();
    }

    update() {
        if (this.type === "orbit") {
            this.enemyPosition.x += this.orbitDirectionX * 2;
            if (this.enemyPosition.x <= 0) {
                this.enemyPosition.x = 0;
                this.orbitDirectionX = 1;
            } else if (this.enemyPosition.x + this.size >= 600) {
                this.enemyPosition.x = 600 - this.size;
                this.orbitDirectionX = -1;
            }
            this.enemyPosition.y += this.speed * (bulletTimeActive ? 0.3 : 1);
        } else {
            this.enemyPosition.y += this.speed * (bulletTimeActive ? 0.3 : 1);
        }

        this.enemyElement.style.left = this.enemyPosition.x + "px";
        this.enemyElement.style.top = this.enemyPosition.y + "px";
    }

    takeDamage(): boolean {
        this.health--;
        for (let i = 1; i <= 10; i++) {
            this.enemyElement.classList.remove(`hp-${i}`);
        }

        if (this.health > 0) {
            this.enemyElement.classList.add(`hp-${this.health}`);
            return false;
        } else {
            this.remove();
            currentScore += 10;
            updateScoreDisplay();
            return true;
        }
    }

    isOffscreen(): boolean {
        return (
            this.enemyPosition.y > 800 || this.enemyPosition.x < -this.size || this.enemyPosition.x > 600
        );
    }

    remove() {
        this.enemyElement.remove();
    }

    collides(player: Player): boolean {
        return this.enemyPosition.x < player.playerPosition.x + 40 &&
            this.enemyPosition.x + this.size > player.playerPosition.x &&
            this.enemyPosition.y < player.playerPosition.y + 40 &&
            this.enemyPosition.y + this.size > player.playerPosition.y;
    }
}


    class PowerUp {
        powerUpElement: HTMLDivElement = document.createElement("div");
        powerUpPosition: Vector;
        speed: number = 2;
        type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke";

        constructor(type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke") {
            this.type = type;
            this.powerUpPosition = { x: Math.random() * 540, y: -40 };
            this.powerUpElement.className = "powerup " + type;
            gameContainer.appendChild(this.powerUpElement);
            this.update();
        }

        update() {
            this.powerUpPosition.y += this.speed * (bulletTimeActive ? 0.3 : 1);
            this.powerUpElement.style.left = this.powerUpPosition.x + "px";
            this.powerUpElement.style.top = this.powerUpPosition.y + "px";
        }

        isOffscreen(): boolean {
            return this.powerUpPosition.y > 800;
        }

        remove() {
            this.powerUpElement.remove();
        }

        collides(player: Player): boolean {
            return this.powerUpPosition.x < player.playerPosition.x + 40 &&
                this.powerUpPosition.x + 40 > player.playerPosition.x &&
                this.powerUpPosition.y < player.playerPosition.y + 40 &&
                this.powerUpPosition.y + 40 > player.playerPosition.y;
        }
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = "Score: " + currentScore + (bulletTimeActive ? " ⚡" : "");

    }

    function updateLivesDisplay() {
        let hearts = "❤️".repeat(currentLives);
        if (player?.shieldCount) hearts += " 🛡️".repeat(player.shieldCount);
        livesDisplay.textContent = "Lives: " + hearts;
    }

    function gameOver() {
        alert("💀 Game Over! Score: " + currentScore);
        location.reload();
    }

    function activateBulletTime() {
        bulletTimeActive = true;

        if (bulletTimeTimeout !== null) {
            clearTimeout(bulletTimeTimeout);
        }


        bulletTimeTimeout = setTimeout(() => {
            bulletTimeActive = false;
            bulletTimeTimeout = null;
        }, 5000);
    }

    function activateNuke(enemies: Enemy[]) {
        for (const e of enemies) e.remove();
        enemies.length = 0;
    }

    function findNearestEnemy(x: number, y: number, enemies: Enemy[]): Enemy | undefined {
        let nearestEnemy: Enemy | undefined;
        let nearestDist = Infinity;
        for (const enemy of enemies) {
            const ex = enemy.enemyPosition.x + enemy.size / 2;
            const ey = enemy.enemyPosition.y + enemy.size / 2;
            const dist = Math.sqrt((ex - x) ** 2 + (ey - y) ** 2);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        }
        return nearestEnemy;
    }

    window.onload = () => {
        player = new Player();
        const bullets: Bullet[] = [];
        let enemies: Enemy[] = [];
        let powerUps: PowerUp[] = [];
        const activeKeys = new Set<string>();
        let gameEnded = false;

        updateLivesDisplay();
        updateScoreDisplay();

        window.addEventListener("keydown", event => {
            activeKeys.add(event.code);
            if (event.code === "Space" && !gameEnded) {
                const now = Date.now();
                const fireRate = player.hasFastShot ? fastFireRate : normalFireRate;
                if (now - lastShotTime > fireRate) {
                    lastShotTime = now;

                    if (player.hasDoubleShot) {
                        const target1 = findNearestEnemy(player.playerPosition.x + 10, player.playerPosition.y, enemies);
                        const target2 = findNearestEnemy(player.playerPosition.x + 26, player.playerPosition.y, enemies);
                        bullets.push(new Bullet({ ...player.playerPosition }, 10, target1));
                        bullets.push(new Bullet({ ...player.playerPosition }, 26, target2));
                    } else {
                        bullets.push(new Bullet({ ...player.playerPosition }));
                    }
                }
            }
        });

        window.addEventListener("keyup", event => activeKeys.delete(event.code));

        // Gegner erzeugen
        setInterval(() => {
            if (!gameEnded) {
                const rand = Math.random();
                if (rand < 0.05) {
                    enemies.push(new Enemy("boss"));
                } else if (rand < 0.15) {
                    enemies.push(new Enemy("orbit"));
                } else {
                    enemies.push(new Enemy("normal"));
                }
            }
        }, 1000);

        // PowerUps erzeugen
        setInterval(() => {
            if (!gameEnded) {
                const types: PowerUp["type"][] = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
                const randomIndex = Math.floor(Math.random() * types.length);
                const randomType = types[randomIndex];

                // Sicherheits-Check
                if (randomType) {
                    powerUps.push(new PowerUp(randomType));
                }
            }
        }, 7000);

        function gameLoop() {
            if (gameEnded) return;

            player.move(activeKeys);

            // Bullets updaten & Kollision prüfen
            for (let i = bullets.length - 1; i >= 0; i--) {
                const bullet = bullets[i];
                bullet.update();

                if (bullet.isOffscreen()) {
                    bullet.remove();
                    bullets.splice(i, 1);
                    continue;
                }

                // Check Kollision mit Gegnern
                for (let j = enemies.length - 1; j >= 0; j--) {
                    const enemy = enemies[j];
                    const ex = enemy.enemyPosition.x;
                    const ey = enemy.enemyPosition.y;
                    const ew = enemy.size;
                    const eh = enemy.size;
                    const bx = bullet.bulletPosition.x;
                    const by = bullet.bulletPosition.y;

                    if (
                        bx > ex && bx < ex + ew &&
                        by > ey && by < ey + eh
                    ) {
                        bullet.remove();
                        bullets.splice(i, 1);
                        if (enemy.takeDamage()) {
                            enemies.splice(j, 1);
                        }
                        break;
                    }
                }
            }

            // Gegner updaten & Kollision mit Spieler prüfen
            for (let i = enemies.length - 1; i >= 0; i--) {
                const enemy = enemies[i];
                enemy.update();

                if (enemy.isOffscreen()) {
                    enemy.remove();
                    enemies.splice(i, 1);
                    continue;
                }

                if (enemy.collides(player)) {
                    enemy.remove();
                    enemies.splice(i, 1);
                    player.takeDamage();
                    continue;
                }
            }

            // PowerUps updaten & Kollision mit Spieler prüfen
            for (let i = powerUps.length - 1; i >= 0; i--) {
                const powerUp = powerUps[i];
                powerUp.update();

                if (powerUp.isOffscreen()) {
                    powerUp.remove();
                    powerUps.splice(i, 1);
                    continue;
                }

                if (powerUp.collides(player)) {
                    // Effekt aktivieren
                    switch (powerUp.type) {
                        case "doubleShot":
                            player.setPowerUp("doubleShot", true);
                            break;
                        case "fastShot":
                            player.setPowerUp("fastShot", true);
                            break;
                        case "shield":
                            player.shieldCount++;
                            player.playerElement.classList.add("shield");
                            break;
                        case "bulletTime":
                            activateBulletTime();
                            break;
                        case "nuke":
                            activateNuke(enemies);
                            break;
                    }
                    powerUp.remove();
                    powerUps.splice(i, 1);
                    updateLivesDisplay();

                }
            }

            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    };
}