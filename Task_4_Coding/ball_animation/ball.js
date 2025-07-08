"use strict";
var BallGame;
(function (BallGame) {
    const balls = [];
    let destroyedCount = 0;
    let collisionMode = "circle";
    window.addEventListener("load", handleLoad);
    function handleLoad() {
        const score = document.createElement("div");
        score.id = "score";
        score.classList.add("ui-box");
        score.textContent = "Destroyed: 0";
        document.body.appendChild(score);
        const remaining = document.createElement("div");
        remaining.id = "remaining";
        remaining.classList.add("ui-box");
        remaining.textContent = "Remaining: 0";
        document.body.appendChild(remaining);
        const toggle = document.createElement("button");
        toggle.id = "toggle";
        toggle.classList.add("ui-box");
        toggle.textContent = "Mode: Circle";
        toggle.onclick = () => {
            collisionMode =
                collisionMode === "point" ? "circle" : collisionMode === "circle" ? "rect" : "point";
            toggle.textContent = `Mode: ${collisionMode[0].toUpperCase()}${collisionMode.slice(1)}`;
        };
        document.body.appendChild(toggle);
        setupInteraction();
        createBalls(100);
        setInterval(() => createBalls(10), 30000);
        setInterval(update, 16);
    }
    function setupInteraction() {
        window.addEventListener("click", (event) => {
            const element = document.elementFromPoint(event.clientX, event.clientY);
            if (!element)
                return;
            const ball = balls.find(b => b.element === element && !b.isBlackhole);
            if (ball) {
                ball.element.remove();
                balls.splice(balls.indexOf(ball), 1);
                destroyedCount++;
                updateScore();
                if (destroyedCount % 10 === 0) {
                    createBlackhole();
                }
            }
        });
    }
    function updateScore() {
        const score = document.getElementById("score");
        if (score)
            score.textContent = `Destroyed: ${destroyedCount}`;
        const remaining = document.getElementById("remaining");
        if (remaining)
            remaining.textContent = `Remaining: ${balls.filter(b => !b.isBlackhole).length}`;
    }
    function createBalls(count) {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight - 100) + 100;
            createBallAt(x, y);
        }
        updateScore();
    }
    function createBallAt(x, y) {
        const rootStyles = getComputedStyle(document.documentElement);
        const colorVars = [
            "--neon-pink", "--neon-green", "--neon-orange",
            "--neon-yellow", "--neon-cyan", "--neon-red", "--neon-purple"
        ];
        const randomVar = colorVars[Math.floor(Math.random() * colorVars.length)];
        const randomColor = rootStyles.getPropertyValue(randomVar).trim();
        const span = document.createElement("span");
        span.classList.add("ball");
        span.style.setProperty("--span-bg", randomColor);
        span.style.setProperty("--span-border", randomColor);
        span.style.setProperty("--highlight", randomColor);
        document.body.appendChild(span);
        const ball = {
            element: span,
            position: { x, y },
            velocity: {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100
            },
            color: randomColor
        };
        balls.push(ball);
        updateScore();
    }
    function update() {
        moveAllBalls(0.016);
    }
    function moveAllBalls(dt) {
        for (const ball of balls) {
            move(ball, dt);
        }
        checkBallCollisions();
    }
    function move(ball, dt) {
        ball.position.x += ball.velocity.x * dt;
        ball.position.y += ball.velocity.y * dt;
        if (ball.position.x < 0 || ball.position.x > window.innerWidth)
            ball.velocity.x *= -1;
        if (ball.position.y < 0 || ball.position.y > window.innerHeight)
            ball.velocity.y *= -1;
        const transform = `matrix(1, 0, 0, 1, ${ball.position.x}, ${ball.position.y})`;
        ball.element.style.transform = transform;
    }
    function checkBallCollisions() {
        const radius = 10;
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const b1 = balls[i], b2 = balls[j];
                if (b1.isBlackhole || b2.isBlackhole)
                    continue;
                let collided = false;
                switch (collisionMode) {
                    case "point":
                        collided = checkPointCollision(b1, b2);
                        break;
                    case "circle":
                        collided = checkCircleCollision(b1, b2, radius);
                        break;
                    case "rect":
                        collided = checkRectCollision(b1, b2, radius * 2, radius * 2);
                        break;
                }
                if (collided) {
                    const temp = b1.velocity;
                    b1.velocity = b2.velocity;
                    b2.velocity = temp;
                }
            }
        }
    }
    function checkPointCollision(b1, b2) {
        const tolerance = 5;
        const dx = b1.position.x - b2.position.x;
        const dy = b1.position.y - b2.position.y;
        return Math.abs(dx) < tolerance && Math.abs(dy) < tolerance;
    }
    function checkCircleCollision(b1, b2, radius) {
        const dx = b1.position.x - b2.position.x;
        const dy = b1.position.y - b2.position.y;
        return Math.sqrt(dx * dx + dy * dy) < radius * 2;
    }
    function checkRectCollision(b1, b2, width, height) {
        return (b1.position.x < b2.position.x + width &&
            b1.position.x + width > b2.position.x &&
            b1.position.y < b2.position.y + height &&
            b1.position.y + height > b2.position.y);
    }
    function createBlackhole() {
        const span = document.createElement("span");
        span.classList.add("ball", "blackhole");
        span.style.backgroundColor = "black";
        span.style.border = "2px solid white";
        document.body.appendChild(span);
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const blackhole = {
            element: span,
            position: { x, y },
            velocity: {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200
            },
            color: "black",
            isBlackhole: true
        };
        balls.push(blackhole);
        updateScore();
        const duration = 8000;
        const attractInterval = setInterval(() => attractBalls(blackhole), 30);
        setTimeout(() => {
            span.remove();
            balls.splice(balls.indexOf(blackhole), 1);
            clearInterval(attractInterval);
            updateScore();
        }, duration);
    }
    function attractBalls(blackhole) {
        for (let i = balls.length - 1; i >= 0; i--) {
            const ball = balls[i];
            if (ball === blackhole || ball.isBlackhole)
                continue;
            const dx = blackhole.position.x - ball.position.x;
            const dy = blackhole.position.y - ball.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const force = 300 / (dist + 1);
            ball.velocity.x += (dx / dist) * force;
            ball.velocity.y += (dy / dist) * force;
            if (dist < 20) {
                ball.element.remove();
                balls.splice(i, 1);
                updateScore();
            }
        }
    }
})(BallGame || (BallGame = {}));
//# sourceMappingURL=ball.js.map