"use strict";
// src/Bullet.ts
var GamesOFGames;
(function (GamesOFGames) {
    class Bullet {
        constructor(initialPosition, offsetX = 18, targetEnemy) {
            this.bulletElement = document.createElement("div");
            this.speed = 10;
            this.velocityX = 0;
            this.velocityY = -1;
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
        update(timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsbGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYnVsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnQkFBZ0I7QUFDaEIsSUFBVSxZQUFZLENBNkNyQjtBQTdDRCxXQUFVLFlBQVk7SUFDbEIsTUFBYSxNQUFNO1FBT2YsWUFBWSxlQUF1QixFQUFFLFVBQWtCLEVBQUUsRUFBRSxXQUFtQjtZQU45RSxrQkFBYSxHQUFtQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTlELFVBQUssR0FBVyxFQUFFLENBQUM7WUFDbkIsY0FBUyxHQUFXLENBQUMsQ0FBQztZQUN0QixjQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7WUFHbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQy9FLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUN4QyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUU5QyxJQUFJLFdBQVcsRUFBRSxDQUFDO2dCQUNkLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFDdEYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQztZQUVELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUVELE1BQU0sQ0FBQyxTQUFpQjtZQUNwQixNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUVuRCxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLGNBQWMsR0FBRyxXQUFXLENBQUM7WUFDdkUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNoRSxDQUFDO1FBRUQsV0FBVztZQUNQLE9BQU8sQ0FDSCxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsR0FBRztnQkFDeEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FDM0QsQ0FBQztRQUNOLENBQUM7UUFFRCxNQUFNO1lBQ0YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0tBQ0o7SUEzQ1ksbUJBQU0sU0EyQ2xCLENBQUE7QUFDTCxDQUFDLEVBN0NTLFlBQVksS0FBWixZQUFZLFFBNkNyQiJ9