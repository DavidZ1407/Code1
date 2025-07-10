"use strict";
var GamesOFGames;
(function (GamesOFGames) {
    class Player {
        constructor() {
            this.playerElement = document.createElement("div");
            this.playerPosition = { x: 280, y: 700 };
            this.playerSize = { x: 40, y: 40 };
            this.playerSpeed = 5;
            this.hasDoubleShot = false;
            this.hasFastShot = false;
            this.shieldCount = 0;
            this.playerElement.className = "player";
            gameContainer.appendChild(this.playerElement);
            this.updatePosition();
        }
        updatePosition() {
            this.playerElement.style.left = this.playerPosition.x + "px";
            this.playerElement.style.top = this.playerPosition.y + "px";
        }
        move(_activeKeys, _timeDelta) {
            const effectiveSpeed = this.playerSpeed * _timeDelta * 60;
            if (_activeKeys.has("ArrowLeft"))
                this.playerPosition.x -= effectiveSpeed;
            if (_activeKeys.has("ArrowRight"))
                this.playerPosition.x += effectiveSpeed;
            if (_activeKeys.has("ArrowUp"))
                this.playerPosition.y -= effectiveSpeed;
            if (_activeKeys.has("ArrowDown"))
                this.playerPosition.y += effectiveSpeed;
            this.playerPosition.x = Math.max(0, Math.min(560, this.playerPosition.x));
            this.playerPosition.y = Math.max(0, Math.min(760, this.playerPosition.y));
            this.updatePosition();
        }
        takeDamage() {
            if (this.shieldCount > 0) {
                this.shieldCount--;
                if (this.shieldCount === 0) {
                    this.playerElement.classList.remove("shield");
                }
                GamesOFGames.updateLivesDisplay();
                return;
            }
            GamesOFGames.currentLives--;
            GamesOFGames.updateLivesDisplay();
            if (GamesOFGames.currentLives <= 0)
                GamesOFGames.gameOver();
        }
        setPowerUp(_type, _value) {
            if (_type === "doubleShot") {
                this.hasDoubleShot = _value;
            }
            else if (_type === "fastShot") {
                this.hasFastShot = _value;
            }
        }
        applyPowerUp(_type, _enemies) {
            switch (_type) {
                case "doubleShot":
                    this.setPowerUp("doubleShot", true);
                    setTimeout(() => this.setPowerUp("doubleShot", false), 10000);
                    break;
                case "fastShot":
                    this.setPowerUp("fastShot", true);
                    setTimeout(() => this.setPowerUp("fastShot", false), 10000);
                    break;
                case "shield":
                    this.shieldCount++;
                    this.playerElement.classList.add("shield");
                    break;
                case "bulletTime":
                    GamesOFGames.activateBulletTime();
                    break;
                case "nuke":
                    GamesOFGames.activateNuke(_enemies);
                    break;
            }
            GamesOFGames.updateLivesDisplay();
        }
    }
    GamesOFGames.Player = Player;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFlBQVksQ0FpR3JCO0FBakdELFdBQVUsWUFBWTtJQVdsQixNQUFhLE1BQU07UUFVZjtZQVRBLGtCQUFhLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUQsbUJBQWMsR0FBVyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQzVDLGVBQVUsR0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1lBRXhCLGtCQUFhLEdBQVcsS0FBSyxDQUFDO1lBQzlCLGdCQUFXLEdBQVcsS0FBSyxDQUFDO1lBQzVCLGdCQUFXLEdBQVUsQ0FBQyxDQUFDO1lBR25CLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUN4QyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUIsQ0FBQztRQUVELGNBQWM7WUFDVixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQzdELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDaEUsQ0FBQztRQUVELElBQUksQ0FBQyxXQUF3QixFQUFFLFVBQWtCO1lBRzdDLE1BQU0sY0FBYyxHQUFVLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUVqRSxJQUFJLFdBQVcsQ0FBQyxHQUFHLENB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