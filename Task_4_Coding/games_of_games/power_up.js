"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class PowerUp {
        constructor(_type) {
            this.powerUpElement = document.createElement("div");
            this.speed = 2;
            this.type = _type;
            this.powerUpPosition = { x: Math.random() * 540, y: -40 };
            this.powerUpElement.className = "powerup " + _type;
            gameContainer.appendChild(this.powerUpElement);
            this.update(0);
        }
        update(_timeDelta) {
            const speedFactor = GamesOFGames.bulletTimeActive ? 0.3 : 1;
            const effectiveSpeed = this.speed * _timeDelta * 60;
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
        collides(_player) {
            return this.powerUpPosition.x < _player.playerPosition.x + 40 &&
                this.powerUpPosition.x + 40 > _player.playerPosition.x &&
                this.powerUpPosition.y < _player.playerPosition.y + 40 &&
                this.powerUpPosition.y + 40 > _player.playerPosition.y;
        }
    }
    GamesOFGames.PowerUp = PowerUp;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG93ZXJfdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3dlcl91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBVSxZQUFZLENBd0NyQjtBQXhDRCxXQUFVLFlBQVk7SUFDbEIsTUFBYSxPQUFPO1FBTWhCLFlBQVksS0FBbUU7WUFML0UsbUJBQWMsR0FBbUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUvRCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1lBSWQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDbkQsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDO1FBR0QsTUFBTSxDQUFDLFVBQWtCO1lBQ3JCLE1BQU0sV0FBVyxHQUFXLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsTUFBTSxjQUFjLEdBQVcsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRSxDQUFDO1lBRTVELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUM7WUFDdkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2xFLENBQUM7UUFFRCxXQUFXO1lBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDeEMsQ0FBQztRQUVELE1BQU07WUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLENBQUM7UUFFRCxRQUFRLENBQUMsT0FBZTtZQUNwQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3RELElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO0tBQ0o7SUF0Q1ksb0JBQU8sVUFzQ25CLENBQUE7QUFDTCxDQUFDLEVBeENTLFlBQVksS0FBWixZQUFZLFFBd0NyQiJ9