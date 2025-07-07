"use strict";
// namespace BallAnimation {
//   const world = {
//     width: window.innerWidth,
//     height: window.innerHeight,
//   };
const velocity = { x: 1, y: 1 };
const position = { x: 100, y: 100 };
let ball;
window.addEventListener("load", handleLoad);
function handleLoad(_event) {
    ball = document.querySelector("span");
    if (!ball) {
        console.error("Kein <span> gefunden!");
        return;
    }
    move();
}
function move() {
    if (!ball)
        return;
    position.x += velocity.x;
    position.y += velocity.y;
    ball.style.transform = `matrix(1, 0, 0, 1, ${position.x}, ${position.y})`;
    setTimeout(move, 10);
}
//# sourceMappingURL=ball.js.map