namespace GamesOFGames {
    export type Vector = { x: number; y: number };

   
    declare let currentLives: number;
    declare let bulletTimeActive: boolean;
    declare function updateLivesDisplay(): void;
    declare function gameOver(): void; 
    declare function activateBulletTime(): void; 
    declare function activateNuke(enemies: Enemy[]): void; 

    export class Player {
        playerElement: HTMLDivElement = document.createElement("div");
        playerPosition: Vector = { x: 280, y: 700 };
        playerSize: Vector = { x: 40, y: 40 };
        playerSpeed: number = 5;

        hasDoubleShot = false;
        hasFastShot = false;
        shieldCount = 0;

        constructor() {
            this.playerElement.className = "player";
            gameContainer.appendChild(this.playerElement);
            this.updatePosition();
        }

        updatePosition() {
            this.playerElement.style.left = this.playerPosition.x + "px";
            this.playerElement.style.top = this.playerPosition.y + "px";
        }

        move(activeKeys: Set<string>, timeDelta: number) {
           
           
            const effectiveSpeed = this.playerSpeed * timeDelta * 60;

            if (activeKeys.has("ArrowLeft")) this.playerPosition.x -= effectiveSpeed;
            if (activeKeys.has("ArrowRight")) this.playerPosition.x += effectiveSpeed;
            if (activeKeys.has("ArrowUp")) this.playerPosition.y -= effectiveSpeed;
            if (activeKeys.has("ArrowDown")) this.playerPosition.y += effectiveSpeed;

            
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
            if (GamesOFGames.currentLives <= 0) GamesOFGames.gameOver(); 
        }

        
        setPowerUp(type: "doubleShot" | "fastShot", value: boolean) {
            if (type === "doubleShot") {
                this.hasDoubleShot = value;
            } else if (type === "fastShot") {
                this.hasFastShot = value;
            }
        }

       
        applyPowerUp(type: PowerUp["type"], enemies: Enemy[]) {
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
}