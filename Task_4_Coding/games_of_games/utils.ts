namespace GamesOFGames {

    declare let player: Player;

    export function updateScoreDisplay(): void {
        scoreDisplay.textContent = "Score: " + GamesOFGames.currentScore + (GamesOFGames.bulletTimeActive ? " ⚡" : "");
    }

    export function updateLivesDisplay(): void {
        let hearts: string = "❤️".repeat(GamesOFGames.currentLives);
        if (GamesOFGames.player?.shieldCount) {
            hearts += " 🛡️".repeat(GamesOFGames.player.shieldCount);
        }
        livesDisplay.textContent = "Lives: " + hearts;
    }

    export function activateBulletTime(): void {
        GamesOFGames.bulletTimeActive = true;

        if (GamesOFGames.bulletTimeTimeout !== null) {
            clearTimeout(GamesOFGames.bulletTimeTimeout);
        }

        GamesOFGames.bulletTimeTimeout = setTimeout(() => {
            GamesOFGames.bulletTimeActive = false;
            GamesOFGames.bulletTimeTimeout = null;
        }, 5000);
    }

    export function activateNuke(_enemiesArray: Enemy[]): void {
        GamesOFGames.currentScore += _enemiesArray.length * 50;
        GamesOFGames.updateScoreDisplay();
        for (let i: number = _enemiesArray.length - 1; i >= 0; i--) {
            _enemiesArray[i].remove();
            _enemiesArray.splice(i, 1);
        }
    }

    export function findNearestEnemy(_bulletX: number, _bulletY: number, _enemiesArray: Enemy[]): Enemy | undefined {
        let nearestEnemy: Enemy | undefined;
        let minDistance: number = Infinity;

        for (const enemy of _enemiesArray) {
            const dx: number = enemy.enemyPosition.x - _bulletX;
            const dy: number = enemy.enemyPosition.y - _bulletY;
            const distance: number = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearestEnemy = enemy;
            }
        }
        return nearestEnemy;
    }

    export function handlePlayerShot(_bulletsArray: Bullet[], _enemiesArray: Enemy[]): void {
        const now: number = Date.now();
        const fireRate: number = GamesOFGames.player.hasFastShot ? GamesOFGames.fastFireRate : GamesOFGames.normalFireRate;

        if (now - GamesOFGames.lastShotTime > fireRate) {
            GamesOFGames.lastShotTime = now;

            if (GamesOFGames.player.hasDoubleShot) {
                const target1: Enemy | undefined = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 10, GamesOFGames.player.playerPosition.y, _enemiesArray);
                const target2: Enemy | undefined = GamesOFGames.findNearestEnemy(GamesOFGames.player.playerPosition.x + 26, GamesOFGames.player.playerPosition.y, _enemiesArray);
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 10, target1));
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }, 26, target2));
            } else {
                _bulletsArray.push(new GamesOFGames.Bullet({ ...GamesOFGames.player.playerPosition }));
            }
        }
    }

    export function spawnEnemy(_enemiesArray: Enemy[]): void {
        const rand: number = Math.random();
        if (rand < 0.05) {
            _enemiesArray.push(new GamesOFGames.Enemy("boss"));
        } else if (rand < 0.15) {
            _enemiesArray.push(new GamesOFGames.Enemy("orbit"));
        } else {
            _enemiesArray.push(new GamesOFGames.Enemy("normal"));
        }
    }

    export function spawnPowerUp(_powerUpsArray: PowerUp[]): void {
        const types: PowerUp["type"][] = ["doubleShot", "fastShot", "shield", "bulletTime", "nuke"];
        const randomIndex: number = Math.floor(Math.random() * types.length);

        const randomType: PowerUp["type"] = types[randomIndex];

        if (randomType) {
            _powerUpsArray.push(new GamesOFGames.PowerUp(randomType));
        }
    }

    export function updateAndCleanBullets(_bulletsArray: Bullet[], _enemiesArray: Enemy[], _timeDelta: number):void {
        for (let i:number = _bulletsArray.length - 1; i >= 0; i--) {
            const bullet:Bullet = _bulletsArray[i];
            bullet.update(_timeDelta);

            if (bullet.isOffscreen()) {
                bullet.remove();
                _bulletsArray.splice(i, 1);
                continue;
            }

            for (let j:number = _enemiesArray.length - 1; j >= 0; j--) {
                const enemy:Enemy = _enemiesArray[j];
                const ex:number = enemy.enemyPosition.x;
                const ey:number = enemy.enemyPosition.y;
                const ew:number = enemy.size;
                const eh:number = enemy.size;
                const bx:number = bullet.bulletPosition.x;
                const by:number = bullet.bulletPosition.y;

                if (
                    bx > ex && bx < ex + ew &&
                    by > ey && by < ey + eh
                ) {
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

    export function updateAndCleanEnemies(_enemiesArray: Enemy[], _playerRef: Player, _timeDelta: number):void {
        for (let i:number= _enemiesArray.length - 1; i >= 0; i--) {
            const enemy:Enemy = _enemiesArray[i];
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

    export function updateAndCleanPowerUps(_powerUpsArray: PowerUp[], _playerRef: Player, _timeDelta: number):void {
        for (let i:number = _powerUpsArray.length - 1; i >= 0; i--) {
            const powerUp: PowerUp= _powerUpsArray[i];
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
}