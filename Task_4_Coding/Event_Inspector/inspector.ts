namespace EventInspector {

    window.addEventListener("load", handleLoad);

    function handleLoad(): void {
        document.addEventListener("mousemove", updateInfoBox);

        ["click", "keyup"].forEach(_eventType => {
            document.addEventListener(_eventType, logEventInfo);
            document.body.addEventListener(_eventType, logEventInfo);
            document.getElementById("div0")?.addEventListener(_eventType, logEventInfo);
            document.getElementById("div1")?.addEventListener(_eventType, logEventInfo);
        });

        document.getElementById("bt")?.addEventListener("click", triggerCustomEvent);
        document.addEventListener("customEvent", handleCustomEvent);

        document.querySelectorAll("button").forEach(_button => {
            _button.addEventListener("click", () => {
                _button.classList.toggle("active");
            });
        });
    }

    function updateInfoBox(_event: MouseEvent): void {
        const span: HTMLElement | null = document.getElementById("span");
        if (!span) return;

        const offsetX: number = 10, offsetY:number = 10;
        span.innerHTML = "X: " + _event.clientX + ", Y: " + _event.clientY + ", Target: " + _event.target;
        span.style.left = (_event.clientX + offsetX) + "px";
        span.style.top = (_event.clientY + offsetY) + "px";
    }

    function logEventInfo(_event: Event): void {
        console.log("Standard event:", _event.type, _event.target, _event.currentTarget);
    }

    function triggerCustomEvent(_event: Event): void {
        const customEvent: CustomEvent = new CustomEvent("customEvent", {
            bubbles: true,
            detail: { source: _event.target }
        });

        (_event.target as HTMLElement).dispatchEvent(customEvent);
    }

    function handleCustomEvent(_event: Event): void {
        console.log("📢 CustomEvent received on document!");

        const rootStyles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
        const colorVars:string[] = [
            "--neon-pink",
            "--neon-green",
            "--neon-orange",
            "--neon-yellow",
            "--neon-cyan",
            "--neon-red",
            "--neon-purple"
        ];

        const randomVar:string = colorVars[Math.floor(Math.random() * colorVars.length)];
        const randomColor:string = rootStyles.getPropertyValue(randomVar).trim();

        const source:HTMLElement = (_event as CustomEvent).detail.source as HTMLElement;

        if (source && source.tagName === "BUTTON") {
            source.style.color = randomColor;
            source.style.textShadow = "0 0 8px " + randomColor;
        }

        const rightBox:HTMLElement | null = document.getElementById("div1");
        if (rightBox) {
            if (rightBox.classList.contains("pulse")) {
                rightBox.classList.remove("pulse");
                rightBox.style.boxShadow = "";
                rightBox.style.animationDuration = "";
                rightBox.style.setProperty("--pulse-color", "");
            } else {
                rightBox.style.boxShadow = "0 0 10px " + randomColor;
                rightBox.style.setProperty("--pulse-color", randomColor);
                const randomDuration:string = (Math.random() * 2 + 1).toFixed(2) + "s";
                rightBox.style.animationDuration = randomDuration;
                rightBox.classList.add("pulse");
            }
        }
    }
}
