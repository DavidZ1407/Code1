namespace GamesOFGames {
    export class Enemy {
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

            this.enemyPosition = { x: Math.random() * (600 - this.size), y: -40 };
            this.enemyElement.className = "enemy " + type;


            if (type === "orbit") {
                this.orbitDirectionX = Math.random() < 0.5 ? 1 : -1;
            }

            this.enemyElement.classList.add(`hp-${this.health}`);

            this.enemyElement.style.width = this.size + "px";
            this.enemyElement.style.height = this.size + "px";
            gameContainer.appendChild(this.enemyElement);
            this.update(0);
        }

        update(timeDelta: number) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;

            if (this.type === "orbit") {
                this.enemyPosition.x += this.orbitDirectionX * 2 * timeDelta * 60;
                if (this.enemyPosition.x <= 0) {
                    this.enemyPosition.x = 0;
                    this.orbitDirectionX = 1;
                } else if (this.enemyPosition.x + this.size >= 600) {
                    this.enemyPosition.x = 600 - this.size;
                    this.orbitDirectionX = -1;
                }
                this.enemyPosition.y += effectiveSpeed * speedFactor;
            } else {
                this.enemyPosition.y += effectiveSpeed * speedFactor;
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
                GamesOFGames.currentScore += 10;
                GamesOFGames.updateScoreDisplay();
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
}