namespace BallAnimation {
  type Vector = { x: number; y: number };
  type Ball = {
    element: HTMLSpanElement;
    position: Vector;
    velocity: Vector;
    color: string;
  };

  const balls: Ball[] = [];

  let animationFrameId: number | null = null;
  let intervalId: number | null = null;
  let timeoutId: number | null = null;

  window.addEventListener("load", () => {
    handleInput();
  });

  function handleInput(): void {
    const input = document.createElement("input");
    input.type = "number";
    input.id = "ballCount";
    input.value = "100";

    const select = document.createElement("select");
    select.id = "animationMethod";
    ["requestAnimationFrame", "setInterval", "setTimeout"].forEach(method => {
      const option = document.createElement("option");
      option.value = method;
      option.textContent = method;
      select.appendChild(option);
    });

    const button = document.createElement("button");
    button.textContent = "Play BALL";

    document.body.appendChild(input);
    document.body.appendChild(select);
    document.body.appendChild(button);

    button.addEventListener("click", () => {
      const count = parseInt(input.value, 10);
      const method = select.value;

      if (isNaN(count) || count <= 0) {
        alert("Please enter a valid number.");
        return;
      }

      clearBalls();
      createBalls(count);
      startAnimation(method);
    });
  }

  function clearBalls(): void {
    stopAllAnimations();
    for (const ball of balls) {
      ball.element.remove();
    }
    balls.length = 0;
  }

  function createBalls(count: number): void {
    const rootStyles = getComputedStyle(document.documentElement);
    const colorVars = [
      "--neon-pink",
      "--neon-green",
      "--neon-orange",
      "--neon-yellow",
      "--neon-cyan",
      "--neon-red",
      "--neon-purple"
    ];

    const uiHeight = getUIHeight();

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");

      const randomVar = colorVars[Math.floor(Math.random() * colorVars.length)];
      const randomColor = rootStyles.getPropertyValue(randomVar).trim();

      span.style.setProperty("--span-bg", randomColor);
      span.style.setProperty("--span-border", randomColor);
      span.style.setProperty("--highlight", randomColor);

      span.classList.add("ball");
      

      document.body.appendChild(span);

      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * (window.innerHeight - uiHeight) + uiHeight;

      const ball: Ball = {
        element: span,
        position: { x: posX, y: posY },
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10
        },
        color: randomColor
      };

      balls.push(ball);
    }
  }

  function getUIHeight(): number {
    const input = document.getElementById("ballCount");
    const button = document.querySelector("button");

    if (!input || !button) return 0;

    const inputRect = input.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    return Math.max(inputRect.bottom, buttonRect.bottom);
  }

  function stopAllAnimations() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  function animateWithRequestAnimationFrame() {
    for (const ball of balls) {
      move(ball);
    }
    animationFrameId = requestAnimationFrame(animateWithRequestAnimationFrame);
  }

  function animateWithSetInterval() {
    intervalId = window.setInterval(() => {
      for (const ball of balls) {
        move(ball);
      }
    }, 16);
  }

  function animateWithSetTimeout() {
    for (const ball of balls) {
      move(ball);
    }
    timeoutId = window.setTimeout(animateWithSetTimeout, 16);
  }

  function startAnimation(method: string) {
    stopAllAnimations();
    switch (method) {
      case "requestAnimationFrame":
        animateWithRequestAnimationFrame();
        break;
      case "setInterval":
        animateWithSetInterval();
        break;
      case "setTimeout":
        animateWithSetTimeout();
        break;
    }
  }

  function move(ball: Ball): void {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    if (ball.position.x <= 0 || ball.position.x >= window.innerWidth) {
      ball.velocity.x *= -1;
    }
    if (ball.position.y <= getUIHeight() || ball.position.y >= window.innerHeight) {
      ball.velocity.y *= -1;
    }

    ball.element.style.left = ball.position.x + "px";
    ball.element.style.top = ball.position.y + "px";
  }
}
