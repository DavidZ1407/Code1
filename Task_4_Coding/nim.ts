namespace Nim {

    let rows: number[] = [];
    let Player: boolean = false;

    for (let i = 0; i < 4; i++) {
        let value = Number(prompt(`Fill Row ${i + 1}`)) || 0;
        rows.push(value);
    }

    gameLoop(rows, Player);

    function gameLoop(_rows: number[], _Player: boolean) {
        displayState(_rows, _Player);

        let selectedRow: number = getRow(_rows);
        let available = _rows[selectedRow - 1];

        let lightsToRemove: number = promptNumberUserInput(available, selectedRow);

        _rows[selectedRow - 1] -= lightsToRemove;

        if (checkWinner(_rows)) {
            console.log(_Player ? "Player 2 has won the game" : "Player 1 has won the game");
            return;
        } else {
            gameLoop(_rows, !_Player);
        }
    }

    function checkWinner(rows: number[]): boolean {
        return rows.reduce((sum, val) => sum + val, 0) === 0;
    }

    function getRow(rows: number[]): number {
        let userRowSelection: number = promptRowUserInput();

        if (rows[userRowSelection - 1] === 0) {
            console.log(`Row ${userRowSelection} is empty. Please select a different row.`);
            return getRow(rows);
        }

        console.log("Selected row:", userRowSelection);
        return userRowSelection;
    }

    function promptNumberUserInput(available: number, currentRow: number): number {
        let input: number = Number(prompt(`How many lights to remove on line ${currentRow}`));

        if (isNaN(input) || input <= 0 || input > available) {
            console.log(`Ungültiger Zug! Gib eine gültige Anzahl zwischen 1 und ${available} ein.`);
            return promptNumberUserInput(available, currentRow);
        }

        return input;
    }

    function promptRowUserInput(): number {
        let input: number = Number(prompt("What Row to select?"));

        if (checkGameActionInput(input)) {
            return input;
        } else {
            console.log("Ungültige Reihe! Bitte 1 bis 4 eingeben.");
            return promptRowUserInput();
        }
    }

    function checkGameActionInput(input: number): boolean {
        return input >= 1 && input <= 4;
    }

    function displayState(rows: number[], player: boolean) {
        console.log(`Current Player: --Player ${player ? "2" : "1"}--`);
        console.log("_________________________________________________________");
        rows.forEach((count, index) => {
            console.log(`Current Row ${index + 1}: ${count}`);
            console.log("_________________________________________________________");
        });
    }
}
