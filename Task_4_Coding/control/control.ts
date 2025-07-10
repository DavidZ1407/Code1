namespace Control {

    // ================================
    // Refactor to polling 
    // ================================


    type Vector2 = { x: number; y: number };
    type Tank = {
        element: HTMLDivElement;
        position: Vector2;
    };

    let tank1: Tank;
    let tank2: Tank;

    const keysPressed: { [key: string]: boolean } = {};
    let mousePosition: Vector2 = { x: 0, y: 0 };


    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        tank1 = {
            element: createTank("red"),
            position: { x: 100, y: 100 }
        };

        tank2 = {
            element: createTank("blue"),
            position: { x: 200, y: 200 }
        };

        document.body.appendChild(tank1.element);
        document.body.appendChild(tank2.element);

        window.addEventListener("keydown", (_e) => keysPressed[_e.key] = true);
        window.addEventListener("keyup", (_e) => keysPressed[_e.key] = false);

        window.addEventListener("mousemove", (_e) => {
            mousePosition = { x: _e.clientX - 20, y: _e.clientY - 20 };
        });

        requestAnimationFrame(update);
    }

    function createTank(_color: string): HTMLDivElement {
        const tank: HTMLDivElement = document.createElement("div");
        tank.style.position = "absolute";
        tank.style.width = "40px";
        tank.style.height = "40px";
        tank.style.background = _color;
        tank.style.borderRadius = "4px";
        return tank;
    }

    function update(): void {
        const speed: number = 5;

        if (keysPressed["ArrowUp"]) tank1.position.y -= speed;
        if (keysPressed["ArrowDown"]) tank1.position.y += speed;
        if (keysPressed["ArrowLeft"]) tank1.position.x -= speed;
        if (keysPressed["ArrowRight"]) tank1.position.x += speed;

        tank2.position.x = mousePosition.x;
        tank2.position.y = mousePosition.y;

        updateTank(tank1);
        updateTank(tank2);

        requestAnimationFrame(update);
    }

    function updateTank(_tank: Tank): void {
        _tank.element.style.left = _tank.position.x + "px";
        _tank.element.style.top = _tank.position.y + "px";
    }



    // ================================
    // Events (Immediate Reaction)
    // ================================


    // type Vector2 = { x: number; y: number };

    // type Tank = {
    //     element: HTMLDivElement;
    //     position: Vector2;
    // };

    // let tank1: Tank;
    // let tank2: Tank;

    // window.addEventListener("load", handleLoad);

    // function handleLoad(): void {
    //     // Tank 1 (keyboard)
    //     tank1 = {
    //         element: createTank("red"),
    //         position: { x: 100, y: 100 }
    //     };

    //     // Tank 2 (mouse)
    //     tank2 = {
    //         element: createTank("blue"),
    //         position: { x: 200, y: 200 }
    //     };

    //     document.body.appendChild(tank1.element);
    //     document.body.appendChild(tank2.element);

    //     window.addEventListener("keydown", handleKeyDown);
    //     window.addEventListener("mousemove", handleMouseMove);

    //     requestAnimationFrame(update);
    // }

    // function createTank(_color: string): HTMLDivElement {
    //     const tank: HTMLDivElement = document.createElement("div");
    //     tank.style.position = "absolute";
    //     tank.style.width = "40px";
    //     tank.style.height = "40px";
    //     tank.style.background = _color;
    //     tank.style.borderRadius = "4px";
    //     return tank;
    // }

    // function handleKeyDown(_event: KeyboardEvent): void {
    //     const speed: number= 5;
    //     switch (_event.key) {
    //         case "ArrowUp":
    //             tank1.position.y -= speed;
    //             break;
    //         case "ArrowDown":
    //             tank1.position.y += speed;
    //             break;
    //         case "ArrowLeft":
    //             tank1.position.x -= speed;
    //             break;
    //         case "ArrowRight":
    //             tank1.position.x += speed;
    //             break;
    //     }
    // }

    // function handleMouseMove(_event: MouseEvent):void {
    //     tank2.position.x = _event.clientX - 20;
    //     tank2.position.y = _event.clientY - 20;
    // }

    // function update(): void {
    //     updateTank(tank1);
    //     updateTank(tank2);
    //     requestAnimationFrame(update);
    // }

    // function updateTank(_tank: Tank): void {
    //     _tank.element.style.left = _tank.position.x + "px";
    //     _tank.element.style.top = _tank.position.y + "px";
    // }
}
