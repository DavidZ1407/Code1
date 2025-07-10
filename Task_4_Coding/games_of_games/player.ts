namespace GamesOFGames {
    export type Vector = { x: number; y: number };

   
    declare let currentLives: number;
    declare let bulletTimeActive: boolean;
    declare function updateLivesDisplay(): void;
    declare function gameOver(): void; 
    declare function activateBulletTime(): void; 
    declare function activateNuke(_enemies: Enemy[]): void; 

    export class Player {
        playerElement: HTMLDivElement = document.createElement("div");
        playerPosition: Vector = { x: 280, y: 700 };
        playerSize: Vector = { x: 40, y: 40 };
        playerSpeed: number = 5;

        hasDoubleShot:boolean = false;
        hasFastShot:boolean = false;
        shieldCount:number = 0;

        constructor() {
            this.playerElement.className = "player";
            gameContainer.appendChild(this.playerElement);
            this.updatePosition();
        }

        updatePosition():void {
            this.playerElement.style.left = this.playerPosition.x + "px";
            this.playerElement.style.top = this.playerPosition.y + "px";
        }

        move(_activeKeys: Set<string>, _timeDelta: number):void {
           
           
            const effectiveSpeed:number = this.playerSpeed * _timeDelta * 60;

            if (_activeKeys.has("ArrowLeft")) this.playerPosition.x -= effectiveSpeed;
            if (_activeKeys.has("ArrowRight")) this.playerPosition.x += effectiveSpeed;
            if (_activeKeys.has("ArrowUp")) this.playerPosition.y -= effectiveSpeed;
            if (_activeKeys.has("ArrowDown")) this.playerPosition.y += effectiveSpeed;

            
            this.playerPosition.x = Math.max(0, Math.min(560, this.playerPosition.x)); 
            this.playerPosition.y = Math.max(0, Math.min(760, this.playerPosition.y)); 

            this.updatePosition();
        }

        takeDamage():void {
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

        
        setPowerUp(_type: "doubleShot" | "fastShot", _value: boolean) :void{
            if (_type === "doubleShot") {
                this.hasDoubleShot = _value;
            } else if (_type === "fastShot") {
                this.hasFastShot = _value;
            }
        }

       
        applyPowerUp(_type: PowerUp["type"], _enemies: Enemy[]) :void{
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
}