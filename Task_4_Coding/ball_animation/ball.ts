namespace BallGame {
  type Vector = { x: number; y: number };
  type Ball = {
    element: HTMLSpanElement;
    position: Vector;
    velocity: Vector;
    color: string;
    isBlackhole?: boolean;
  };

  const balls: Ball[] = [];
  let destroyedCount: number = 0;
  let collisionMode: "point" | "circle" | "rect" = "circle";

  window.addEventListener("load", handleLoad);

  function handleLoad(): void {
    const score: HTMLDivElement = document.createElement("div");
    score.id = "score";
    score.classList.add("ui-box");
    score.textContent = "Destroyed: 0";
    document.body.appendChild(score);

    const remaining: HTMLDivElement = document.createElement("div");
    remaining.id = "remaining";
    remaining.classList.add("ui-box");
    remaining.textContent = "Remaining: 0";
    document.body.appendChild(remaining);

    const toggle: HTMLButtonElement = document.createElement("button");
    toggle.id = "toggle";
    toggle.classList.add("ui-box");
    toggle.textContent = "Mode: Circle";
    toggle.onclick = (): void => {
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

  function setupInteraction(): void {
    window.addEventListener("click", (_event) => {
      const element: Element | null = document.elementFromPoint(_event.clientX, _event.clientY);
      if (!element) return;

      const ball: Ball | undefined = balls.find(_b => _b.element === element && !_b.isBlackhole);
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

  function updateScore(): void {
    const score: HTMLElement | null = document.getElementById("score");
    if (score) score.textContent = `Destroyed: ${destroyedCount}`;
    const remaining: HTMLElement | null = document.getElementById("remaining");
    if (remaining) remaining.textContent = `Remaining: ${balls.filter(_b => !_b.isBlackhole).length}`;
  }

  function createBalls(_count: number): void {
    for (let i: number = 0; i < _count; i++) {
      const x: number = Math.random() * window.innerWidth;
      const y: number = Math.random() * (window.innerHeight - 100) + 100;
      createBallAt(x, y);
    }
    updateScore();
  }

  function createBallAt(_x: number, _y: number): void {
    const rootStyles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const colorVars: string[] = [
      "--neon-pink", "--neon-green", "--neon-orange",
      "--neon-yellow", "--neon-cyan", "--neon-red", "--neon-purple"
    ];
    const randomVar: string = colorVars[Math.floor(Math.random() * colorVars.length)];
    const randomColor: string = rootStyles.getPropertyValue(randomVar).trim();

    const span: HTMLSpanElement = document.createElement("span");
    span.classList.add("ball");
    span.style.setProperty("--span-bg", randomColor);
    span.style.setProperty("--span-border", randomColor);
    span.style.setProperty("--highlight", randomColor);
    document.body.appendChild(span);

    const ball: Ball = {
      element: span,
      position: { x: _x, y: _y },
      velocity: {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100
      },
      color: randomColor
    };

    balls.push(ball);
    updateScore();
  }

  function update(): void {
    moveAllBalls(0.016);
  }

  function moveAllBalls(_dt: number): void {
    for (const ball of balls) {
      move(ball, _dt);
    }
    checkBallCollisions();
  }

  function move(_ball: Ball, _dt: number): void {
    _ball.position.x += _ball.velocity.x * _dt;
    _ball.position.y += _ball.velocity.y * _dt;

    if (_ball.position.x < 0 || _ball.position.x > window.innerWidth) _ball.velocity.x *= -1;
    if (_ball.position.y < 0 || _ball.position.y > window.innerHeight) _ball.velocity.y *= -1;

    const transform: string = `matrix(1, 0, 0, 1, ${_ball.position.x}, ${_ball.position.y})`;
    _ball.element.style.transform = transform;
  }

  function checkBallCollisions(): void {
    const radius: number = 10;
    for (let i: number = 0; i < balls.length; i++) {
      for (let j: number = i + 1; j < balls.length; j++) {
        const b1: Ball = balls[i], b2: Ball = balls[j];
        if (b1.isBlackhole || b2.isBlackhole) continue;

        let collided: boolean = false;
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
          const temp: Vector = b1.velocity;
          b1.velocity = b2.velocity;
          b2.velocity = temp;
        }
      }
    }
  }

  function checkPointCollision(_b1: Ball, _b2: Ball): boolean {
    const tolerance: number = 5;
    const dx: number = _b1.position.x - _b2.position.x;
    const dy: number = _b1.position.y - _b2.position.y;
    return Math.abs(dx) < tolerance && Math.abs(dy) < tolerance;
  }


  function checkCircleCollision(_b1: Ball, _b2: Ball, _radius: number): boolean {
    const dx:number = _b1.position.x - _b2.position.x;
    const dy:number = _b1.position.y - _b2.position.y;
    return Math.sqrt(dx * dx + dy * dy) < _radius * 2;
  }

  function checkRectCollision(_b1: Ball, _b2: Ball, _width: number, _height: number): boolean {
    return (
      _b1.position.x < _b2.position.x + _width &&
      _b1.position.x + _width > _b2.position.x &&
      _b1.position.y < _b2.position.y + _height &&
      _b1.position.y + _height > _b2.position.y
    );
  }

  function createBlackhole(): void {
    const span: HTMLSpanElement= document.createElement("span");
    span.classList.add("ball", "blackhole");
    span.style.backgroundColor = "black";
    span.style.border = "2px solid white";
    document.body.appendChild(span);

    const x:number = Math.random() * window.innerWidth;
    const y:number = Math.random() * window.innerHeight;
    const blackhole: Ball = {
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

    const duration:number = 8000; 
    const attractInterval:number = setInterval(() => attractBalls(blackhole), 30);

    setTimeout(() => {
      span.remove();
      balls.splice(balls.indexOf(blackhole), 1);
      clearInterval(attractInterval);
      updateScore();
    }, duration);
  }

  function attractBalls(_blackhole: Ball): void {
    for (let i:number = balls.length - 1; i >= 0; i--) {
      const ball: Ball = balls[i];
      if (ball === _blackhole || ball.isBlackhole) continue;

      const dx:number = _blackhole.position.x - ball.position.x;
      const dy:number = _blackhole.position.y - ball.position.y;
      const dist:number= Math.sqrt(dx * dx + dy * dy);
      const force:number = 300 / (dist + 1);

      ball.velocity.x += (dx / dist) * force;
      ball.velocity.y += (dy / dist) * force;

      if (dist < 20) {
        ball.element.remove();
        balls.splice(i, 1);
        updateScore();
      }
    }
  }
}