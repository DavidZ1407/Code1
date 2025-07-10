namespace GamesOFGames {
    export class Bullet {
        bulletElement: HTMLDivElement = document.createElement("div");
        bulletPosition: Vector;
        speed: number = 10;
        velocityX: number = 0;
        velocityY: number = -1;

        constructor(_initialPosition: Vector, _offsetX: number = 18, _targetEnemy?: Enemy) {
            this.bulletPosition = { x: _initialPosition.x + _offsetX, y: _initialPosition.y };
            this.bulletElement.className = "bullet";
            gameContainer.appendChild(this.bulletElement);

            if (_targetEnemy) {
                const dx: number = _targetEnemy.enemyPosition.x + _targetEnemy.size / 2 - this.bulletPosition.x;
                const dy: number = _targetEnemy.enemyPosition.y + _targetEnemy.size / 2 - this.bulletPosition.y;
                const dist: number = Math.sqrt(dx * dx + dy * dy);
                this.velocityX = dx / dist;
                this.velocityY = dy / dist;
            }

            this.update(0);
        }

        update(_timeDelta: number): void {
            const speedFactor: number = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed: number = this.speed * _timeDelta * 60;

            this.bulletPosition.x += this.velocityX * effectiveSpeed * speedFactor;
            this.bulletPosition.y += this.velocityY * effectiveSpeed * speedFactor;
            this.bulletElement.style.left = this.bulletPosition.x + "px";
            this.bulletElement.style.top = this.bulletPosition.y + "px";
        }

        isOffscreen(): boolean {
            return (
                this.bulletPosition.y < 0 || this.bulletPosition.y > 800 ||
                this.bulletPosition.x < 0 || this.bulletPosition.x > 600
            );
        }

        remove(): void {
            this.bulletElement.remove();
        }
    }
}