"use strict";
var DiceRoll;
(function (DiceRoll) {
    DiceRoll.currentDieData = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
    DiceRoll.maxDieData = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 };
    DiceRoll.rollResults = { d4: [], d6: [], d8: [], d10: [], d12: [], d20: [] };
    DiceRoll.rollSum = 0;
    DiceRoll.rollAverage = 0;
    DiceRoll.minimal = Infinity;
    DiceRoll.maximal = -Infinity;
    DiceRoll.median = 0;
    selectionLoop();
    function selectionLoop() {
        const dieType = selectDieType();
        if (dieType !== "0") {
            const amount = selectDieAmount(dieType);
            saveData(dieType, amount);
            selectionLoop();
        }
        else {
            startSimulation();
        }
    }
    DiceRoll.selectionLoop = selectionLoop;
    function selectDieType() {
        const input = prompt("Choose a die type:\n" +
            "(1) d4\n" +
            "(2) d6\n" +
            "(3) d8\n" +
            "(4) d10\n" +
            "(5) d12\n" +
            "(6) d20\n" +
            "(0) Start simulation");
        const choice = parseInt(input !== null && input !== void 0 ? input : "", 10);
        switch (choice) {
            case 1: return "d4";
            case 2: return "d6";
            case 3: return "d8";
            case 4: return "d10";
            case 5: return "d12";
            case 6: return "d20";
            case 0: return "0";
            default: return selectDieType();
        }
    }
    DiceRoll.selectDieType = selectDieType;
    function selectDieAmount(dieType) {
        const input = prompt(`How many ${dieType} dice do you want to roll?`);
        const amount = parseInt(input !== null && input !== void 0 ? input : "", 10);
        if (isNaN(amount) || amount < 1) {
            return selectDieAmount(dieType);
        }
        return amount;
    }
    DiceRoll.selectDieAmount = selectDieAmount;
    function saveData(dieType, amount) {
        DiceRoll.currentDieData[dieType] += amount;
    }
    DiceRoll.saveData = saveData;
    function startSimulation() {
        for (const dieType in DiceRoll.currentDieData) {
            const die = dieType;
            const count = DiceRoll.currentDieData[die];
            for (let i = 0; i < count; i++) {
                const roll = rollDie(DiceRoll.maxDieData[die]);
                DiceRoll.rollSum += roll;
                DiceRoll.rollResults[die].push(roll);
            }
        }
        calculateStats();
        showResults();
    }
    DiceRoll.startSimulation = startSimulation;
    function rollDie(max) {
        return Math.floor(Math.random() * max) + 1;
    }
    function calculateStats() {
        const allRolls = Object.values(DiceRoll.rollResults).flat();
        if (allRolls.length === 0)
            return;
        DiceRoll.minimal = Math.min(...allRolls);
        DiceRoll.maximal = Math.max(...allRolls);
        DiceRoll.rollAverage = DiceRoll.rollSum / allRolls.length;
        DiceRoll.median = (DiceRoll.minimal + DiceRoll.maximal) / 2;
    }
    function showResults() {
        console.log(`
+---------------------------------+
|          ROLL RESULTS            |
+---------------------------------+
| Total Sum:        | ${DiceRoll.rollSum.toString().padEnd(14)} |
| Average Roll:     | ${DiceRoll.rollAverage.toFixed(2).padEnd(14)} |
| Minimal Roll:     | ${DiceRoll.minimal.toString().padEnd(14)} |
| Maximal Roll:     | ${DiceRoll.maximal.toString().padEnd(14)} |
| Median (simplified): | ${DiceRoll.median.toString().padEnd(14)} |
+---------------------------------+
`);
        console.log("Individual rolls:", DiceRoll.rollResults);
    }
    DiceRoll.showResults = showResults;
})(DiceRoll || (DiceRoll = {}));
//# sourceMappingURL=dice.js.map