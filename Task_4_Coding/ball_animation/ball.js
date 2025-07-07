"use strict";
var BallAnimation;
(function (BallAnimation) {
    const balls = [];
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        for (let i = 0; i < 60; i++) {
            const span = document.createElement("span");
            document.body.appendChild(span);
            const ball = {
                element: span,
                position: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                },
                velocity: {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10
                }
            };
            balls.push(ball);
        }
        moveAll();
    }
    function moveAll() {
        for (const ball of balls) {
            move(ball);
        }
        requestAnimationFrame(moveAll);
        // setTimeout(moveAll, 60);
        // setInterval(moveAll, 60);
    }
    function move(ball) {
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;
        if (ball.position.x <= 0 || ball.position.x >= window.innerWidth) {
            ball.velocity.x *= -1;
        }
        if (ball.position.y <= 0 || ball.position.y >= window.innerHeight) {
            ball.velocity.y *= -1;
        }
        ball.element.style.transform = `matrix(1, 0, 0, 1, ${ball.position.x}, ${ball.position.y})`;
    }
})(BallAnimation || (BallAnimation = {}));
//# sourceMappingURL=ball.js.map