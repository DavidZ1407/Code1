"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    function updateScoreDisplay() {
        scoreDisplay.textContent = "Score: " + GamesOFGames.currentScore + (GamesOFGames.bulletTimeActive ? " ⚡" : "");
    }
    GamesOFGames.updateScoreDisplay = updateScoreDisplay;
    function updateLivesDisplay() {
        var _a;
        let hearts = "❤️".repeat(GamesOFGames.currentLives);
        if ((_a = GamesOFGames.player) === null || _a === void 0 ? void 0 : _a.shieldCount) {
            hearts += " 🛡️".repeat(GamesOFGames.player.shieldCount);
        }
        livesDisplay.textContent = "Lives: " + hearts;
    }
    GamesOFGames.updateLivesDisplay = updateLivesDisplay;
    function activateBulletTime() {
        GamesOFGames.bulletTimeActive = true;
        if (GamesOFGames.bulletTimeTimeout !== null) {
            clearTimeout(GamesOFGames.bulletTimeTimeout);
        }
        GamesOFGames.bulletTimeTimeout = setTimeout(() => {
            GamesOFGames.bulletTimeActive = false;
            GamesOFGames.bulletTimeTimeout = null;
        }, 5000);
    }
    GamesOFGames.activateBulletTime = activateBulletTime;
    function activateNuke(enemiesArray) {
        GamesOFGames.currentScore += enemiesArray.length * 50;
        GamesOFGames.updateScoreDisplay();
        for (let i = enemiesArray.length - 1; i >= 0; i--) {
            enemiesArray[i].remove();
            enemiesArray.splice(i, 1);
        }
    }
    GamesOFGames.activateNuke = activateNuke;
    function findNearestEnemy(bulletX, bulletY, enemiesArray) {
        let nearestEnemy;
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
    GamesOFGames.findNearestEnemy = findNearestEnemy;
    function handlePlayerShot(bulletsArray, enemiesArray) {
        const now = Date.now();
        const fireRate = GamesOFGames.player.hasFastShot ? GamesOFGames.fastFireRate : GamesOFGames.normalFireRate;
        if (now - GamesOFGames.lastShotTime > fireRate) {
            GamesOFGames.lastShotTime = now;
            if (GamesOFGames.player.hasDoubleShot) {
                const target1 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 10, GamesOFGames.player.playerPosition.y, enemiesArray);
                const target2 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 26, GamesOFGames.player.playerPosition.y, enemiesArray);
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 10, target1));
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 26, target2));
            }
            else {
                bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }));
            }
        }
    }
    GamesOFGames.handlePlayerShot = handlePlayerShot;
    function spawnEnemy(enemiesArray) {
        const rand = Math.random();
        if (rand < 0.05) {
            enemiesArray.push(new GamesOFGames.Enemy("boss"));
        }
        else if (rand < 0.15) {
            enemiesArray.push(new GamesOFGames.Enemy("orbit"));
        }
        else {
            enemiesArray.push(new GamesOFGames.Enemy("normal"));
        }
    }
    GamesOFGames.spawnEnemy = spawnEnemy;
    function spawnPowerUp(powerUpsArray) {
        const types = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
        const randomIndex = Math.floor(Math.random() * types.length);
        const randomType = types[randomIndex];
        if (randomType) {
            powerUpsArray.push(new GamesOFGames.PowerUp(randomType));
        }
    }
    GamesOFGames.spawnPowerUp = spawnPowerUp;
    function updateAndCleanBullets(bulletsArray, enemiesArray, timeDelta) {
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
                if (bx > ex && bx < ex + ew &&
                    by > ey && by < ey + eh) {
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
    GamesOFGames.updateAndCleanBullets = updateAndCleanBullets;
    function updateAndCleanEnemies(enemiesArray, playerRef, timeDelta) {
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
    GamesOFGames.updateAndCleanEnemies = updateAndCleanEnemies;
    function updateAndCleanPowerUps(powerUpsArray, playerRef, timeDelta) {
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
    GamesOFGames.updateAndCleanPowerUps = updateAndCleanPowerUps;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBdUtyQjtBQXZLRCxXQUFVLFlBQVk7SUFJbEIsU0FBZ0Isa0JBQWtCO1FBQzlCLFlBQVksQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLFlBQVksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUZlLCtCQUFrQixxQkFFakMsQ0FBQTtJQUVELFNBQWdCLGtCQUFrQjs7UUFDOUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEQsSUFBSSxNQUFBLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUQsQ0FBQztRQUNELFlBQVksQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUNsRCxDQUFDO0lBTmUsK0JBQWtCLHFCQU1qQyxDQUFBO0lBRUQsU0FBZ0Isa0JBQWtCO1FBQzlCLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFckMsSUFBSSxZQUFZLENBQUMsaUJBQWlCLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxZQUFZLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDMUMs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