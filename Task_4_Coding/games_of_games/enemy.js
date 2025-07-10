"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class Enemy {
        constructor(_type = "normal") {
            this.enemyElement = document.createElement("div");
            this.health = 1;
            this.orbitAngle = 0;
            this.orbitDirectionX = 1;
            this.lastBossShotTime = 0;
            this.type = _type;
            if (_type === "boss") {
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
            this.enemyElement.className = "enemy " + _type;
            if (_type === "orbit") {
                this.orbitDirectionX = Math.random() < 0.5 ? 1 : -1;
            }
            this.enemyElement.classList.add(`hp-${this.health}`);
            this.enemyElement.style.width = this.size + "px";
            this.enemyElement.style.height = this.size + "px";
            gameContainer.appendChild(this.enemyElement);
            this.update(0);
        }
        update(_timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * _timeDelta * 60;
            if (this.type === "orbit") {
                this.enemyPosition.x += this.orbitDirectionX * 2 * _timeDelta * 60;
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
        collides(_player) {
            return this.enemyPosition.x < _player.playerPosition.x + 40 &&
                this.enemyPosition.x + this.size > _player.playerPosition.x &&
                this.enemyPosition.y < _player.playerPosition.y + 40 &&
                this.enemyPosition.y + this.size > _player.playerPosition.y;
        }
    }
    GamesOFGames.Enemy = Enemy;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5lbXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbmVteS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBbUdyQjtBQW5HRCxXQUFVLFlBQVk7SUFDbEIsTUFBYSxLQUFLO1FBWWQsWUFBWSxRQUFxQyxRQUFRO1lBWHpELGlCQUFZLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFLN0QsV0FBTSxHQUFXLENBQUMsQ0FBQztZQUNuQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1lBQ3ZCLG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1lBRTVCLHFCQUFnQixHQUFXLENBQUMsQ0FBQztZQUd6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUVsQixJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUUsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDckIsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE1BQU0sVUFBVSxHQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3hFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDdkMsQ0FBQztZQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUs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