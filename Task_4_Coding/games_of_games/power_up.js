"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class PowerUp {
        constructor(type) {
            this.powerUpElement = document.createElement("div");
            this.speed = 2;
            this.type = type;
            this.powerUpPosition = { x: Math.random() * 540, y: -40 };
            this.powerUpElement.className = "powerup " + type;
            gameContainer.appendChild(this.powerUpElement);
            this.update(0);
        }
        update(timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * timeDelta * 60;
            this.powerUpPosition.y += effectiveSpeed * speedFactor;
            this.powerUpElement.style.left = this.powerUpPosition.x + "px";
            this.powerUpElement.style.top = this.powerUpPosition.y + "px";
        }
        isOffscreen() {
            return this.powerUpPosition.y > 800;
        }
        remove() {
            this.powerUpElement.remove();
        }
        collides(player) {
            return this.powerUpPosition.x < player.playerPosition.x + 40 &&
                this.powerUpPosition.x + 40 > player.playerPosition.x &&
                this.powerUpPosition.y < player.playerPosition.y + 40 &&
                this.powerUpPosition.y + 40 > player.playerPosition.y;
        }
    }
    GamesOFGames.PowerUp = PowerUp;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93ZXJfdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3dlcl91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBd0NyQjtBQXhDRCxXQUFVLFlBQVk7SUFDbEIsTUFBYSxPQUFPO1FBTWhCLFlBQVksSUFBa0U7WUFMOUUsbUJBQWMsR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvRCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBSWQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDbEQsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDO1FBR0QsTUFBTSxDQUFDLFNBQWlCO1lBQ3BCLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBRW5ELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUM7WUFDdkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xFLENBQUM7UUFFRCxXQUFXO1lBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDeEMsQ0FBQztRQUVELE1BQU07WUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFFRCxRQUFRLENBQUMsTUFBYztZQUNuQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3hELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM5RCxDQUFDO0tBQ0o7SUF0Q1ksb0JBQU8sVUFzQ25CLENBQUE7QUFDTCxDQUFDLEVBeENTLFlBQVksS0FBWixZQUFZLFFBd0NyQiJ9