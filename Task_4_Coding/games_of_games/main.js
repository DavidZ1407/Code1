"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    const gameContainer = document.getElementById("game");
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    let currentScore = 0;
    let currentLives = 3;
    let player;
    let bulletTimeActive = false;
    let bulletTimeTimeout = null;
    let lastShotTime = 0;
    const normalFireRate = 300;
    const fastFireRate = 100;
    class Player {
        constructor() {
            this.playerElement = document.createElement("div");
            this.playerPosition = { x: 280, y: 700 };
            this.playerSize = { x: 40, y: 40 };
            this.playerSpeed = 5;
            this.hasDoubleShot = false;
            this.hasFastShot = false;
            this.shieldCount = 0;
            this.playerElement.className = "player";
            gameContainer.appendChild(this.playerElement);
            this.updatePosition();
        }
        updatePosition() {
            this.playerElement.style.left = this.playerPosition.x + "px";
            this.playerElement.style.top = this.playerPosition.y + "px";
        }
        move(activeKeys) {
            if (activeKeys.has("ArrowLeft"))
                this.playerPosition.x -= this.playerSpeed;
            if (activeKeys.has("ArrowRight"))
                this.playerPosition.x += this.playerSpeed;
            if (activeKeys.has("ArrowUp"))
                this.playerPosition.y -= this.playerSpeed;
            if (activeKeys.has("ArrowDown"))
                this.playerPosition.y += this.playerSpeed;
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
            if (currentLives <= 0)
                gameOver();
        }
        setPowerUp(type, value) {
            if (type === "doubleShot") {
                this.hasDoubleShot = value;
            }
            else if (type === "fastShot") {
                this.hasFastShot = value;
            }
        }
    }
    class Bullet {
        constructor(initialPosition, offsetX = 18, targetEnemy) {
            this.bulletElement = document.createElement("div");
            this.speed = 10;
            this.velocityX = 0;
            this.velocityY = -1;
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
        isOffscreen() {
            return (this.bulletPosition.y < 0 || this.bulletPosition.y > 800 ||
                this.bulletPosition.x < 0 || this.bulletPosition.x > 600);
        }
        remove() {
            this.bulletElement.remove();
        }
    }
    class Enemy {
        constructor(type = "normal") {
            this.enemyElement = document.createElement("div");
            this.health = 1;
            this.orbitAngle = 0;
            this.orbitDirectionX = 1;
            this.lastBossShotTime = 0;
            this.type = type;
            this.enemyPosition = { x: Math.random() * 540, y: -40 };
            this.enemyElement.className = "enemy " + type;
            if (type === "boss") {
                this.size = 80;
                this.speed = 1;
                this.health = 10;
            }
            else {
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
                }
                else if (this.enemyPosition.x + this.size >= 600) {
                    this.enemyPosition.x = 600 - this.size;
                    this.orbitDirectionX = -1;
                }
                this.enemyPosition.y += this.speed * (bulletTimeActive ? 0.3 : 1);
            }
            else {
                this.enemyPosition.y += this.speed * (bulletTimeActive ? 0.3 : 1);
            }
            this.enemyElement.style.left = this.enemyPosition.x + "px";
            this.enemyElement.style.top = this.enemyPosition.y + "px";
        }
        takeDamage() {
            this.health--;
            for (let i = 1; i <= 10; i++) {
                this.enemyElement.classList.remove(`hp-${i}`);
            }
            if (this.health > 0) {
                this.enemyElement.classList.add(`hp-${this.health}`);
                return false;
            }
            else {
                this.remove();
                currentScore += 10;
                updateScoreDisplay();
                return true;
            }
        }
        isOffscreen() {
            return (this.enemyPosition.y > 800 || this.enemyPosition.x < -this.size || this.enemyPosition.x > 600);
        }
        remove() {
            this.enemyElement.remove();
        }
        collides(player) {
            return this.enemyPosition.x < player.playerPosition.x + 40 &&
                this.enemyPosition.x + this.size > player.playerPosition.x &&
                this.enemyPosition.y < player.playerPosition.y + 40 &&
                this.enemyPosition.y + this.size > player.playerPosition.y;
        }
    }
    class PowerUp {
        constructor(type) {
            this.powerUpElement = document.createElement("div");
            this.speed = 2;
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
        isOffscreen() {
            return this.powerUpPosition.y > 800;
        }
        remove() {
            this.powerUpElement.remove();
        }
        collides(player) {
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
        if (player === null || player === void 0 ? void 0 : player.shieldCount)
            hearts += " 🛡️".repeat(player.shieldCount);
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
    function activateNuke(enemies) {
        for (const e of enemies)
            e.remove();
        enemies.length = 0;
    }
    function findNearestEnemy(x, y, enemies) {
        let nearestEnemy;
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
        const bullets = [];
        let enemies = [];
        let powerUps = [];
        const activeKeys = new Set();
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
                    }
                    else {
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
                }
                else if (rand < 0.15) {
                    enemies.push(new Enemy("orbit"));
                }
                else {
                    enemies.push(new Enemy("normal"));
                }
            }
        }, 1000);
        // PowerUps erzeugen
        setInterval(() => {
            if (!gameEnded) {
                const types = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
                const randomIndex = Math.floor(Math.random() * types.length);
                const randomType = types[randomIndex];
                // Sicherheits-Check
                if (randomType) {
                    powerUps.push(new PowerUp(randomType));
                }
            }
        }, 7000);
        function gameLoop() {
            if (gameEnded)
                return;
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
                    if (bx > ex && bx < ex + ew &&
                        by > ey && by < ey + eh) {
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
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVUsWUFBWSxDQTZjckI7QUE3Y0QsV0FBVSxZQUFZO0lBR2xCLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFFLENBQUM7SUFDdkQsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUUsQ0FBQztJQUN2RCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBRSxDQUFDO0lBRXZELElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUNyQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxNQUFjLENBQUM7SUFFbkIsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDN0IsSUFBSSxpQkFBaUIsR0FBUSxJQUFJLENBQUM7SUFFbEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUMzQixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUM7SUFFekIsTUFBTSxNQUFNO1FBVVI7WUFUQSxrQkFBYSxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlELG1CQUFjLEdBQVcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUM1QyxlQUFVLEdBQVcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUN0QyxnQkFBVyxHQUFXLENBQUMsQ0FBQztZQUV4QixrQkFBYSxHQUFHLEtBQUssQ0FBQztZQUN0QixnQkFBVyxHQUFHLEtBQUssQ0FBQztZQUNwQixnQkFBVyxHQUFHLENBQUMsQ0FBQztZQUdaLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZ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