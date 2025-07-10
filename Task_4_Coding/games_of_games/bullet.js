"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class Bullet {
        constructor(_initialPosition, _offsetX = 18, _targetEnemy) {
            this.bulletElement = document.createElement("div");
            this.speed = 10;
            this.velocityX = 0;
            this.velocityY = -1;
            this.bulletPosition = { x: _initialPosition.x + _offsetX, y: _initialPosition.y };
            this.bulletElement.className = "bullet";
            gameContainer.appendChild(this.bulletElement);
            if (_targetEnemy) {
                const dx = _targetEnemy.enemyPosition.x + _targetEnemy.size / 2 - this.bulletPosition.x;
                const dy = _targetEnemy.enemyPosition.y + _targetEnemy.size / 2 - this.bulletPosition.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                this.velocityX = dx / dist;
                this.velocityY = dy / dist;
            }
            this.update(0);
        }
        update(_timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * _timeDelta * 60;
            this.bulletPosition.x += this.velocityX * effectiveSpeed * speedFactor;
            this.bulletPosition.y += this.velocityY * effectiveSpeed * speedFactor;
            this.bulletElement.style.left = this.bulletPosition.x + "px";
            this.bulletElement.style.top = this.bulletPosition.y + "px";
        }
        isOffscreen() {
            return (this.bulletPosition.y < 0 || this.bulletPosition.y > 800 ||
                this.bulletPosition.x < 0 || this.bulletPosition.x > 600);
        }
        remove() {
            this.bulletElement.remove();
        }
    }
    GamesOFGames.Bullet = Bullet;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFlBQVksQ0E2Q3JCO0FBN0NELFdBQVUsWUFBWTtJQUNsQixNQUFhLE1BQU07UUFPZixZQUFZLGdCQUF3QixFQUFFLFdBQW1CLEVBQUUsRUFBRSxZQUFvQjtZQU5qRixrQkFBYSxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlELFVBQUssR0FBVyxFQUFFLENBQUM7WUFDbkIsY0FBUyxHQUFXLENBQUMsQ0FBQztZQUN0QixjQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7WUFHbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNsRixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7WUFDeEMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFOUMsSUFBSSxZQUFZLEVBQUUsQ0FBQztnQkFDZixNQUFNLEVBQUUsR0FBVyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDaEcsTUFBTSxFQUFFLEdBQVcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hHLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUM7WUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25CLENBQUM7UUFFRCxNQUFNLENBQUMsVUFBa0I7WUFDckIsTUFBTSxXQUFXLEdBQVcsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxNQUFNLGNBQWMsR0FBVyxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsR0FBRyxFQUFFLENBQUM7WUFFNUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsY0FBYyxHQUFHLFdBQVcsQ0FBQztZQUN2RSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzdELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDaEUsQ0FBQztRQUVELFdBQVc7WUFDUCxPQUFPLENBQ0gsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEdBQUc7Z0JBQ3hELElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQzNELENBQUM7UUFDTixDQUFDO1FBRUQsTUFBTTtZQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBM0NZLG1CQUFNLFNBMkNsQixDQUFBO0FBQ0wsQ0FBQyxFQTdDUyxZQUFZLEtBQVosWUFBWSxRQTZDckIifQ==