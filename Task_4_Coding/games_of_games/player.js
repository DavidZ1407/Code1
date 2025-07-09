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
        move(activeKeys, timeDelta) {
            const effectiveSpeed = this.playerSpeed * timeDelta * 60;
            if (activeKeys.has("ArrowLeft"))
                this.playerPosition.x -= effectiveSpeed;
            if (activeKeys.has("ArrowRight"))
                this.playerPosition.x += effectiveSpeed;
            if (activeKeys.has("ArrowUp"))
                this.playerPosition.y -= effectiveSpeed;
            if (activeKeys.has("ArrowDown"))
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
        setPowerUp(type, value) {
            if (type === "doubleShot") {
                this.hasDoubleShot = value;
            }
            else if (type === "fastShot") {
                this.hasFastShot = value;
            }
        }
        applyPowerUp(type, enemies) {
            switch (type) {
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
                    GamesOFGames.activateNuke(enemies);
                    break;
            }
            GamesOFGames.updateLivesDisplay();
        }
    }
    GamesOFGames.Player = Player;
})(GamesOFGames || (GamesOFGames = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFVLFlBQVksQ0FpR3JCO0FBakdELFdBQVUsWUFBWTtJQVdsQixNQUFhLE1BQU07UUFVZjtZQVRBLGtCQUFhLEdBQW1CLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUQsbUJBQWMsR0FBVyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQzVDLGVBQVUsR0FBVyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3RDLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1lBRXhCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1lBR1osSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQ3hDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQixDQUFDO1FBRUQsY0FBYztZQUNWLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDN0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNoRSxDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQXVCLEVBQUUsU0FBaUI7WUFHM0MsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBRXpELElBQUksVUFBVSxDQUFDLEdBQUcsQ0FB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