"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class Enemy {
        constructor(type = "normal") {
            this.enemyElement = document.createElement("div");
            this.health = 1;
            this.orbitAngle = 0;
            this.orbitDirectionX = 1;
            this.lastBossShotTime = 0;
            this.type = type;
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
        update(timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;
            if (this.type === "orbit") {
                this.enemyPosition.x += this.orbitDirectionX * 2 * timeDelta * 60;
                if (this.enemyPosition.x <= 0) {
                    this.enemyPosition.x = 0;
                    this.orbitDirectionX = 1;
                }
                else if (this.enemyPosition.x + this.size >= 600) {
                    this.enemyPosition.x = 600 - this.size;
                    this.orbitDirectionX = -1;
                }
                this.enemyPosition.y += effectiveSpeed * speedFactor;
            }
            else {
                this.enemyPosition.y += effectiveSpeed * speedFactor;
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
                GamesOFGames.currentScore += 10;
                GamesOFGames.updateScoreDisplay();
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
    GamesOFGames.Enemy = Enemy;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5lbXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbmVteS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBbUdyQjtBQW5HRCxXQUFVLFlBQVk7SUFDbEIsTUFBYSxLQUFLO1FBWWQsWUFBWSxPQUFvQyxRQUFRO1lBWHhELGlCQUFZLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFLN0QsV0FBTSxHQUFXLENBQUMsQ0FBQztZQUNuQixlQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ2Ysb0JBQWUsR0FBVyxDQUFDLENBQUM7WUFFNUIscUJBQWdCLEdBQVcsQ0FBQyxDQUFDO1lBR3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBRWpCLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRSxDQUFDO2dCQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNyQixDQUFDO2lCQUFNLENBQUM7Z0JBQ0osTUFBTSxVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEUsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN2QyxDQUFDO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxJ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