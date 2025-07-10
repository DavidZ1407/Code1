namespace GamesOFGames {
    export class PowerUp {
        powerUpElement: HTMLDivElement = document.createElement("div");
        powerUpPosition: Vector;
        speed: number = 2;
        type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke";

        constructor(_type: "doubleShot" | "fastShot" | "shield" | "bulletTime" | "nuke") {
            this.type = _type;
            this.powerUpPosition = { x: Math.random() * 540, y: -40 };
            this.powerUpElement.className = "powerup " + _type;
            gameContainer.appendChild(this.powerUpElement);
            this.update(0);
        }


        update(_timeDelta: number): void {
            const speedFactor: number = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed: number = this.speed * _timeDelta * 60;

            this.powerUpPosition.y += effectiveSpeed * speedFactor;
            this.powerUpElement.style.left = this.powerUpPosition.x + "px";
            this.powerUpElement.style.top = this.powerUpPosition.y + "px";
        }

        isOffscreen(): boolean {
            return this.powerUpPosition.y > 800;
        }

        remove():void {
            this.powerUpElement.remove();
        }

        collides(_player: Player): boolean {
            return this.powerUpPosition.x < _player.playerPosition.x + 40 &&
                this.powerUpPosition.x + 40 > _player.playerPosition.x &&
                this.powerUpPosition.y < _player.playerPosition.y + 40 &&
                this.powerUpPosition.y + 40 > _player.playerPosition.y;
        }
    }
}