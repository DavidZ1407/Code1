namespace GamesOFGames {
    export class Bullet {
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

            this.update(0); 
        }

        update(timeDelta: number) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;

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

        remove() {
            this.bulletElement.remove();
        }
    }
}