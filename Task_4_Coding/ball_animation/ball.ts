// namespace BallAnimation {
//   const world = {
//     width: window.innerWidth,
//     height: window.innerHeight,
//   };

//   let startPositionX: number = 50;
//   let startPositionY: number = 50;

//   let currentPositionX: number = startPositionX;
//   let currentPositionY: number = startPositionY;

//   let velocityX: number = 2;
//   let velocityY: number = 2;

//   const ballSize: number = 50;

//   setLocation();

//   function setLocation() {
//     const span = document.getElementById("span");
//     if (!span) return;

//     currentPositionX += velocityX;
//     currentPositionY += velocityY;

//     velocityX = checkCollision(currentPositionX, velocityX, ballSize, world.width);
//     velocityY = checkCollision(currentPositionY, velocityY, ballSize, world.height);

//     span.style.left = currentPositionX + "px";
//     span.style.top = currentPositionY + "px";

//     requestAnimationFrame(setLocation);
//   }

//   function checkCollision(position: number, velocity: number, size: number, limit: number): number {
//     if (position <= 0 || position + size >= limit) {
//       return -velocity;
//     }
//     return velocity;
//   }
// }
namespace BallAnimation {
type Vector = { x: number; y: number };

const velocity: Vector = { x: 1, y: 1 };
const position: Vector = { x: 100, y: 100 };
let ball: HTMLSpanElement | null;

window.addEventListener("load", handleLoad);

function handleLoad(_event: Event): void {
  ball = document.querySelector("span");
  if (!ball) {
    return;
  }
  move();
}

function move(): void {
  if (!ball) return; 

  position.x += velocity.x;
  position.y += velocity.y;
  ball.style.transform = `matrix(1, 0, 0, 1, ${position.x}, ${position.y})`;

  setTimeout(move, 16); 
}}



