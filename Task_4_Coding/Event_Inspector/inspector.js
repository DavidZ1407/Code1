"use strict";
var EventInspector;
(function (EventInspector) {
    window.addEventListener("load", handleLoad);
    function handleLoad() {
        var _a;
        document.addEventListener("mousemove", updateInfoBox);
        ["click", "keyup"].forEach(eventType => {
            var _a, _b;
            document.addEventListener(eventType, logEventInfo);
            document.body.addEventListener(eventType, logEventInfo);
            (_a = document.getElementById("div0")) === null || _a === void 0 ? void 0 : _a.addEventListener(eventType, logEventInfo);
            (_b = document.getElementById("div1")) === null || _b === void 0 ? void 0 : _b.addEventListener(eventType, logEventInfo);
        });
        (_a = document.getElementById("bt")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", triggerCustomEvent);
        document.addEventListener("customEvent", handleCustomEvent);
        document.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                button.classList.toggle("active");
            });
        });
    }
    function updateInfoBox(_event) {
        const span = document.getElementById("span");
        if (!span)
            return;
        const offsetX = 10, offsetY = 10;
        span.innerHTML = "X: " + _event.clientX + ", Y: " + _event.clientY + ", Target: " + _event.target;
        span.style.left = (_event.clientX + offsetX) + "px";
        span.style.top = (_event.clientY + offsetY) + "px";
    }
    function logEventInfo(_event) {
        console.log("Standard event:", _event.type, _event.target, _event.currentTarget);
    }
    function triggerCustomEvent(_event) {
        const customEvent = new CustomEvent("customEvent", {
            bubbles: true,
            detail: { source: _event.target }
        });
        _event.target.dispatchEvent(customEvent);
    }
    function handleCustomEvent(_event) {
        console.log("📢 CustomEvent received on document!");
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
        const randomVar = colorVars[Math.floor(Math.random() * colorVars.length)];
        const randomColor = rootStyles.getPropertyValue(randomVar).trim();
        const source = _event.detail.source;
        if (source && source.tagName === "BUTTON") {
            source.style.color = randomColor;
            source.style.textShadow = "0 0 8px " + randomColor;
        }
        const rightBox = document.getElementById("div1");
        if (rightBox) {
            if (rightBox.classList.contains("pulse")) {
                rightBox.classList.remove("pulse");
                rightBox.style.boxShadow = "";
                rightBox.style.animationDuration = "";
                rightBox.style.setProperty("--pulse-color", "");
            }
            else {
                rightBox.style.boxShadow = "0 0 10px " + randomColor;
                rightBox.style.setProperty("--pulse-color", randomColor);
                const randomDuration = (Math.random() * 2 + 1).toFixed(2) + "s";
                rightBox.style.animationDuration = randomDuration;
                rightBox.classList.add("pulse");
            }
        }
    }
})(EventInspector || (EventInspector = {}));
//# sourceMappingURL=inspector.js.map