namespace GamesOFGames {
    export class PowerUp {
        powerUpElement: HTMLDivElement = document.createElement("div");
        powerUpPosition: Vector;
        speed: number = 2;
        type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke";

        constructor(type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke") {
            this.type = type;
            this.powerUpPosition = { x: Math.random() * 540, y: -40 };
            this.powerUpElement.className = "powerup " + type;
            gameContainer.appendChild(this.powerUpElement);
            this.update(0); 
        }


        update(timeDelta: number) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;

            this.powerUpPosition.y += effectiveSpeed * speedFactor;
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
}