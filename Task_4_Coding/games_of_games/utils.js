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
    function activateNuke(_enemiesArray) {
        GamesOFGames.currentScore += _enemiesArray.length * 50;
        GamesOFGames.updateScoreDisplay();
        for (let i = _enemiesArray.length - 1; i >= 0; i--) {
            _enemiesArray[i].remove();
            _enemiesArray.splice(i, 1);
        }
    }
    GamesOFGames.activateNuke = activateNuke;
    function findNearestEnemy(_bulletX, _bulletY, _enemiesArray) {
        let nearestEnemy;
        let minDistance = Infinity;
        for (const enemy of _enemiesArray) {
            const dx = enemy.enemyPosition.x - _bulletX;
            const dy = enemy.enemyPosition.y - _bulletY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        return nearestEnemy;
    }
    GamesOFGames.findNearestEnemy = findNearestEnemy;
    function handlePlayerShot(_bulletsArray, _enemiesArray) {
        const now = Date.now();
        const fireRate = GamesOFGames.player.hasFastShot ? GamesOFGames.fastFireRate : GamesOFGames.normalFireRate;
        if (now - GamesOFGames.lastShotTime > fireRate) {
            GamesOFGames.lastShotTime = now;
            if (GamesOFGames.player.hasDoubleShot) {
                const target1 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 10, GamesOFGames.player.playerPosition.y, _enemiesArray);
                const target2 = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 26, GamesOFGames.player.playerPosition.y, _enemiesArray);
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 10, target1));
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 26, target2));
            }
            else {
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }));
            }
        }
    }
    GamesOFGames.handlePlayerShot = handlePlayerShot;
    function spawnEnemy(_enemiesArray) {
        const rand = Math.random();
        if (rand < 0.05) {
            _enemiesArray.push(new GamesOFGames.Enemy("boss"));
        }
        else if (rand < 0.15) {
            _enemiesArray.push(new GamesOFGames.Enemy("orbit"));
        }
        else {
            _enemiesArray.push(new GamesOFGames.Enemy("normal"));
        }
    }
    GamesOFGames.spawnEnemy = spawnEnemy;
    function spawnPowerUp(_powerUpsArray) {
        const types = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
        const randomIndex = Math.floor(Math.random() * types.length);
        const randomType = types[randomIndex];
        if (randomType) {
            _powerUpsArray.push(new GamesOFGames.PowerUp(randomType));
        }
    }
    GamesOFGames.spawnPowerUp = spawnPowerUp;
    function updateAndCleanBullets(_bulletsArray, _enemiesArray, _timeDelta) {
        for (let i = _bulletsArray.length - 1; i >= 0; i--) {
            const bullet = _bulletsArray[i];
            bullet.update(_timeDelta);
            if (bullet.isOffscreen()) {
                bullet.remove();
                _bulletsArray.splice(i, 1);
                continue;
            }
            for (let j = _enemiesArray.length - 1; j >= 0; j--) {
                const enemy = _enemiesArray[j];
                const ex = enemy.enemyPosition.x;
                const ey = enemy.enemyPosition.y;
                const ew = enemy.size;
                const eh = enemy.size;
                const bx = bullet.bulletPosition.x;
                const by = bullet.bulletPosition.y;
                if (bx > ex && bx < ex + ew &&
                    by > ey && by < ey + eh) {
                    bullet.remove();
                    _bulletsArray.splice(i, 1);
                    if (enemy.takeDamage()) {
                        _enemiesArray.splice(j, 1);
                    }
                    break;
                }
            }
        }
    }
    GamesOFGames.updateAndCleanBullets = updateAndCleanBullets;
    function updateAndCleanEnemies(_enemiesArray, _playerRef, _timeDelta) {
        for (let i = _enemiesArray.length - 1; i >= 0; i--) {
            const enemy = _enemiesArray[i];
            enemy.update(_timeDelta);
            if (enemy.isOffscreen()) {
                enemy.remove();
                _enemiesArray.splice(i, 1);
                continue;
            }
            if (enemy.collides(_playerRef)) {
                enemy.remove();
                _enemiesArray.splice(i, 1);
                _playerRef.takeDamage();
                continue;
            }
        }
    }
    GamesOFGames.updateAndCleanEnemies = updateAndCleanEnemies;
    function updateAndCleanPowerUps(_powerUpsArray, _playerRef, _timeDelta) {
        for (let i = _powerUpsArray.length - 1; i >= 0; i--) {
            const powerUp = _powerUpsArray[i];
            powerUp.update(_timeDelta);
            if (powerUp.isOffscreen()) {
                powerUp.remove();
                _powerUpsArray.splice(i, 1);
                continue;
            }
            if (powerUp.collides(_playerRef)) {
                _playerRef.applyPowerUp(powerUp.type, GamesOFGames.enemies);
                powerUp.remove();
                _powerUpsArray.splice(i, 1);
                continue;
            }
        }
    }
    GamesOFGames.updateAndCleanPowerUps = updateAndCleanPowerUps;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBeUtyQjtBQXpLRCxXQUFVLFlBQVk7SUFJbEIsU0FBZ0Isa0JBQWtCO1FBQzlCLFlBQVksQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLFlBQVksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUZlLCtCQUFrQixxQkFFakMsQ0FBQTtJQUVELFNBQWdCLGtCQUFrQjs7UUFDOUIsSUFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDNUQsSUFBSSxNQUFBLFlBQVksQ0FBQyxNQUFNLDBDQUFFLFdBQVcsRUFBRSxDQUFDO1lBQ25DLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELFlBQVksQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUNsRCxDQUFDO0lBTmUsK0JBQWtCLHFCQU1qQyxDQUFBO0lBRUQsU0FBZ0Isa0JBQWtCO1FBQzlCLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFFckMsSUFBSSxZQUFZLENBQUMsaUJBQWlCLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDMUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxZQUFZLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM3QyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDMUMs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