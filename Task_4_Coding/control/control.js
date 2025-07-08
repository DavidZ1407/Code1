"use strict";
var Control;
(function (Control) {
    // ================================
    // Refactor to polling 
    // ================================
    let tank1;
    let tank2;
    const keysPressed = {};
    let mousePosition = { x: 0, y: 0 };
    window.addEventListener("load", handleLoad);
    function handleLoad() {
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
        window.addEventListener("keydown", (e) => keysPressed[e.key] = true);
        window.addEventListener("keyup", (e) => keysPressed[e.key] = false);
        window.addEventListener("mousemove", (e) => {
            mousePosition = { x: e.clientX - 20, y: e.clientY - 20 };
        });
        requestAnimationFrame(update);
    }
    function createTank(color) {
        const tank = document.createElement("div");
        tank.style.position = "absolute";
        tank.style.width = "40px";
        tank.style.height = "40px";
        tank.style.background = color;
        tank.style.borderRadius = "4px";
        return tank;
    }
    function update() {
        const speed = 5;
        if (keysPressed["ArrowUp"])
            tank1.position.y -= speed;
        if (keysPressed["ArrowDown"])
            tank1.position.y += speed;
        if (keysPressed["ArrowLeft"])
            tank1.position.x -= speed;
        if (keysPressed["ArrowRight"])
            tank1.position.x += speed;
        tank2.position.x = mousePosition.x;
        tank2.position.y = mousePosition.y;
        updateTank(tank1);
        updateTank(tank2);
        requestAnimationFrame(update);
    }
    function updateTank(tank) {
        tank.element.style.left = tank.position.x + "px";
        tank.element.style.top = tank.position.y + "px";
    }
    // ================================
    // Events (Immediate Reaction)
    // ================================
    //     type Vector2 = { x: number; y: number };
    //     type Tank = {
    //         element: HTMLDivElement;
    //         position: Vector2;
    //     };
    //     let tank1: Tank;
    //     let tank2: Tank;
    //     window.addEventListener("load", handleLoad);
    //     function handleLoad() {
    //         // Tank 1 (keyboard)
    //         tank1 = {
    //             element: createTank("red"),
    //             position: { x: 100, y: 100 }
    //         };
    //         // Tank 2 (mouse)
    //         tank2 = {
    //             element: createTank("blue"),
    //             position: { x: 200, y: 200 }
    //         };
    //         document.body.appendChild(tank1.element);
    //         document.body.appendChild(tank2.element);
    //         window.addEventListener("keydown", handleKeyDown);
    //         window.addEventListener("mousemove", handleMouseMove);
    //         requestAnimationFrame(update);
    //     }
    //     function createTank(color: string): HTMLDivElement {
    //         const tank = document.createElement("div");
    //         tank.style.position = "absolute";
    //         tank.style.width = "40px";
    //         tank.style.height = "40px";
    //         tank.style.background = color;
    //         tank.style.borderRadius = "4px";
    //         return tank;
    //     }
    //     function handleKeyDown(event: KeyboardEvent) {
    //         const speed = 5;
    //         switch (event.key) {
    //             case "ArrowUp":
    //                 tank1.position.y -= speed;
    //                 break;
    //             case "ArrowDown":
    //                 tank1.position.y += speed;
    //                 break;
    //             case "ArrowLeft":
    //                 tank1.position.x -= speed;
    //                 break;
    //             case "ArrowRight":
    //                 tank1.position.x += speed;
    //                 break;
    //         }
    //     }
    //     function handleMouseMove(event: MouseEvent) {
    //         tank2.position.x = event.clientX - 20;
    //         tank2.position.y = event.clientY - 20;
    //     }
    //     function update() {
    //         updateTank(tank1);
    //         updateTank(tank2);
    //         requestAnimationFrame(update);
    //     }
    //     function updateTank(tank: Tank) {
    //         tank.element.style.left = tank.position.x + "px";
    //         tank.element.style.top = tank.position.y + "px";
    //     }
})(Control || (Control = {}));
//# sourceMappingURL=control.js.map