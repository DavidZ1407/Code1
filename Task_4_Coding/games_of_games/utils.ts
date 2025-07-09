namespace GamesOFGames {

    declare let player: Player;

    export function updateScoreDisplay() {
        scoreDisplay.textContent = "Score: " + GamesOFGames.currentScore + (GamesOFGames.bulletTimeActive ? " ⚡" : "");
    }

    export function updateLivesDisplay() {
        let hearts = "❤️".repeat(GamesOFGames.currentLives);
        if (GamesOFGames.player?.shieldCount) {
             hearts += " 🛡️".repeat(GamesOFGames.player.shieldCount);
        }
        livesDisplay.textContent = "Lives: " + hearts;
    }

    export function activateBulletTime() {
        GamesOFGames.bulletTimeActive = true;

        if (GamesOFGames.bulletTimeTimeout !== null) {
            clearTimeout(GamesOFGames.bulletTimeTimeout);
        }

        GamesOFGames.bulletTimeTimeout = setTimeout(() => {
            GamesOFGames.bulletTimeActive = false;
            GamesOFGames.bulletTimeTimeout = null;
        }, 5000);
    }

    export function activateNuke(enemiesArray: Enemy[]) {
        GamesOFGames.currentScore += enemiesArray.length * 50;
        GamesOFGames.updateScoreDisplay();
        for (let i = enemiesArray.length - 1; i >= 0; i--) {
            enemiesArray[i].remove();
            enemiesArray.splice(i, 1);
        }
    }

    export function findNearestEnemy(bulletX: number, bulletY: number, enemiesArray: Enemy[]): Enemy | undefined {
        let nearestEnemy: Enemy | undefined;
        let minDistance = Infinity;

        for (const enemy of enemiesArray) {
            const dx = enemy.enemyPosition.x - bulletX;
            const dy = enemy.enemyPosition.y - bulletY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        return nearestEnemy;
    }

    export function handlePlayerShot(bulletsArray: Bullet[], enemiesArray: Enemy[]) {
        const now = Date.now();
        const fireRate = GamesOFGames.player.hasFastShot ? GamesOFGames.fastFireRate : GamesOFGames.normalFireRate;
        if (now - GamesOFGames.lastShotTime > fireRate) {
            GamesOFGames.lastShotTime = now;

            if (GamesOFGames.player.hasDoubleShot) {
                const target1 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 10, GamesOFGames.player.playerPosition.y, enemiesArray);
                const target2 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 26, GamesOFGames.player.playerPosition.y, enemiesArray);
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 10, target1));
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 26, target2));
            } else {
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }));
            }
        }
    }

    export function spawnEnemy(enemiesArray: Enemy[]) {
        const rand = Math.random();
        if (rand < 0.05) {
            enemiesArray.push(new GamesOFGames.Enemy("boss"));
        } else if (rand < 0.15) {
            enemiesArray.push(new GamesOFGames.Enemy("orbit"));
        } else {
            enemiesArray.push(new GamesOFGames.Enemy("normal"));
        }
    }

    export function spawnPowerUp(powerUpsArray: PowerUp[]) {
        const types: PowerUp["type"][] = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
        const randomIndex = Math.floor(Math.random() * types.length);
        const randomType = types[randomIndex];

        if (randomType) {
            powerUpsArray.push(new GamesOFGames.PowerUp(randomType));
        }
    }

    export function updateAndCleanBullets(bulletsArray: Bullet[], enemiesArray: Enemy[], timeDelta: number) {
        for (let i = bulletsArray.length - 1; i >= 0; i--) {
            const bullet = bulletsArray[i];
            bullet.update(timeDelta);

            if (bullet.isOffscreen()) {
                bullet.remove();
                bulletsArray.splice(i, 1);
                continue;
            }

            for (let j = enemiesArray.length - 1; j >= 0; j--) {
                const enemy = enemiesArray[j];
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
                    bulletsArray.splice(i, 1);
                    if (enemy.takeDamage()) {
                        enemiesArray.splice(j, 1);
                    }
                    break;
                }
            }
        }
    }

    export function updateAndCleanEnemies(enemiesArray: Enemy[], playerRef: Player, timeDelta: number) {
        for (let i = enemiesArray.length - 1; i >= 0; i--) {
            const enemy = enemiesArray[i];
            enemy.update(timeDelta);

            if (enemy.isOffscreen()) {
                enemy.remove();
                enemiesArray.splice(i, 1);
                continue;
            }

            if (enemy.collides(playerRef)) {
                enemy.remove();
                enemiesArray.splice(i, 1);
                playerRef.takeDamage();
                continue;
            }
        }
    }

    export function updateAndCleanPowerUps(powerUpsArray: PowerUp[], playerRef: Player, timeDelta: number) {
        for (let i = powerUpsArray.length - 1; i >= 0; i--) {
            const powerUp = powerUpsArray[i];
            powerUp.update(timeDelta);

            if (powerUp.isOffscreen()) {
                powerUp.remove();
                powerUpsArray.splice(i, 1);
                continue;
            }

            if (powerUp.collides(playerRef)) {
                playerRef.applyPowerUp(powerUp.type, GamesOFGames.enemies);
                powerUp.remove();
                powerUpsArray.splice(i, 1);
                continue;
            }
        }
    }
}