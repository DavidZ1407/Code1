namespace Nim {

    const rows: number[] = [];
    const player: boolean = false;

    for (let i: number = 0; i < 4; i++) {
        const value: number = Number(prompt(`Fill Row ${i + 1}`)) || 0;
        rows.push(value);
    }

    gameLoop(rows, player);

    function gameLoop(_rows: number[], _player: boolean): void {
        displayState(_rows, _player);

        const selectedRow: number = getRow(_rows);
        const available: number = _rows[selectedRow - 1];

        const lightsToRemove: number = promptNumberUserInput(available, selectedRow);

        _rows[selectedRow - 1] -= lightsToRemove;

        if (checkWinner(_rows)) {
            console.log(_player ? "Player 2 has won the game" : "Player 1 has won the game");
            return;
        } else {
            gameLoop(_rows, !_player);
        }
    }

    function checkWinner(_rows: number[]): boolean {
        return _rows.reduce((_sum, _val) => _sum + _val, 0) === 0;
    }

    function getRow(_rows: number[]): number {
        const userRowSelection: number = promptRowUserInput();

        if (_rows[userRowSelection - 1] === 0) {
            console.log(`Row ${userRowSelection} is empty. Please select a different row.`);
            return getRow(_rows);
        }

        console.log("Selected row:", userRowSelection);
        return userRowSelection;
    }

    function promptNumberUserInput(_available: number, _currentRow: number): number {
        const input: number = Number(prompt(`How many lights to remove on line ${_currentRow}`));

        if (isNaN(input) || input <= 0 || input > _available) {
            console.log(`Ungültiger Zug! Gib eine gültige Anzahl zwischen 1 und ${_available} ein.`);
            return promptNumberUserInput(_available, _currentRow);
        }

        return input;
    }

    function promptRowUserInput(): number {
        const input: number = Number(prompt("What Row to select?"));

        if (checkGameActionInput(input)) {
            return input;
        } else {
            console.log("Ungültige Reihe! Bitte 1 bis 4 eingeben.");
            return promptRowUserInput();
        }
    }

    function checkGameActionInput(_input: number): boolean {
        return _input >= 1 && _input <= 4;
    }

    function displayState(_rows: number[], _player: boolean): void {
        console.log(`Current Player: --Player ${_player ? "2" : "1"}--`);
        console.log("_________________________________________________________");
        _rows.forEach((_count, _index) => {
            console.log(`Current Row ${_index + 1}: ${_count}`);
            console.log("_________________________________________________________");
        });
    }
}
