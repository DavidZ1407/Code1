namespace DiceRoll {
    type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
    type DieData = Record<DieType, number>;
    type RollStash = Record<DieType, number[]>;

    let currentDieData: DieData = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
    const maxDieData: DieData = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 };
    let rollResults: RollStash = { d4: [], d6: [], d8: [], d10: [], d12: [], d20: [] };

    let rollSum: number = 0;
    let rollAverage: number = 0;
    let minimal: number = Infinity;
    let maximal: number = -Infinity;
    let median: number = 0;

    selectionLoop();

    function selectionLoop(): void {
        const dieType: string = selectDieType();
        if (dieType !== "0") {
            const amount: number = selectDieAmount(dieType as DieType);
            saveData(dieType as DieType, amount);
            selectionLoop();
        } else {
            startSimulation();
        }
    }

    function selectDieType(): string {
        const input: string | null = prompt(
            "Choose a die type:\n" +
            "(1) d4\n" +
            "(2) d6\n" +
            "(3) d8\n" +
            "(4) d10\n" +
            "(5) d12\n" +
            "(6) d20\n" +
            "(0) Start simulation"
        );

        const choice: number = parseInt(input ?? "", 10);
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

    function selectDieAmount(_dieType: DieType): number {
        const input: string | null = prompt(`How many ${_dieType} dice do you want to roll?`);
        const amount: number = parseInt(input ?? "", 10);
        if (isNaN(amount) || amount < 1) {
            return selectDieAmount(_dieType);
        }
        return amount;
    }

    function saveData(_dieType: DieType, _amount: number): void {
        currentDieData[_dieType] += _amount;
    }

    function startSimulation(): void {
        for (const dieType in currentDieData) {
            const die: DieType = dieType as DieType;
            const count: number = currentDieData[die];
            for (let i: number = 0; i < count; i++) {
                const roll: number = rollDie(maxDieData[die]);
                rollSum += roll;
                rollResults[die].push(roll);
            }
        }

        calculateStats();
        showResults();
        askRestart();
    }

    function rollDie(_max: number): number {
        return Math.floor(Math.random() * _max) + 1;
    }

    function calculateStats(): void {
        const allRolls: number[] = Object.values(rollResults).flat();

        if (allRolls.length === 0) return;

        minimal = Math.min(...allRolls);
        maximal = Math.max(...allRolls);
        rollAverage = rollSum / allRolls.length;
        median = (minimal + maximal) / 2;
    }

    function showResults(): void {
        const individualRolls:string = Object.entries(rollResults)
            .map(([_die, _rolls]) => `${_die}: ${_rolls.join(", ")}`)
            .filter(_line => !_line.endsWith(": "))
            .join("\n");

        const resultText: string = `
+-----------------------------+
|        ROLL RESULTS         |
+-----------------------------+
Total Sum:         ${rollSum}
Average Roll:      ${rollAverage.toFixed(2)}
Minimal Roll:      ${minimal}
Maximal Roll:      ${maximal}
Median (simple):   ${median}

Individual Rolls:
${individualRolls}
`;
        console.log(resultText);
        alert(resultText);
    }

    function askRestart(): void {
        const input: string | undefined = prompt("Would you like to roll again? (y/n)")?.toLowerCase();
        if (input === "y") {

            currentDieData = { d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0 };
            rollResults = { d4: [], d6: [], d8: [], d10: [], d12: [], d20: [] };
            rollSum = 0;
            rollAverage = 0;
            minimal = Infinity;
            maximal = -Infinity;
            median = 0;

            selectionLoop();
        } else if (input === "n") {
            alert("Thanks for playing!");
        } else {
            askRestart();
        }
    }
}
