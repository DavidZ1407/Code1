namespace Nim {

    let a: number;
    let b: number;
    let c: number;
    let d: number;

    let Player: boolean = false;

    a = Number(prompt("Fill Row 1")) || 0;
    b = Number(prompt("Fill Row 2")) || 0;
    c = Number(prompt("Fill Row 3")) || 0;
    d = Number(prompt("Fill Row 4")) || 0;

    gameLoop(a, b, c, d, Player);

    function gameLoop(_a: number, _b: number, _c: number, _d: number, _Player: boolean) {
        displayState(_a, _b, _c, _d, _Player);

        let CurrentSelectedRow: number = getRow(_a, _b, _c, _d);
        let available: number;

        switch (CurrentSelectedRow) {
            case 1: available = _a; break;
            case 2: available = _b; break;
            case 3: available = _c; break;
            case 4: available = _d; break;
            default: available = 0;
        }

        let lightsToRemove: number = promptNumberUserInput(available, CurrentSelectedRow);

        switch (CurrentSelectedRow) {
            case 1: _a -= lightsToRemove; break;
            case 2: _b -= lightsToRemove; break;
            case 3: _c -= lightsToRemove; break;
            case 4: _d -= lightsToRemove; break;
        }


        if (checkWinner(_a, _b, _c, _d)) {
            console.log(_Player ? "Player 2 has won the game" : "Player 1 has won the game");
            return;
        } else {
            gameLoop(_a, _b, _c, _d, !_Player);
        }
    }

    function checkWinner(_a: number, _b: number, _c: number, _d: number): boolean {
        return (_a + _b + _c + _d) === 0;
    }

    function getRow(_a: number, _b: number, _c: number, _d: number): number {
        let userRowSelection: number = promptRowUserInput();

        console.log("Selected row:", userRowSelection);

        switch (userRowSelection) {
            case 1: console.log("Currently Selected Row 1"); break;
            case 2: console.log("Currently Selected Row 2"); break;
            case 3: console.log("Currently Selected Row 3"); break;
            case 4: console.log("Currently Selected Row 4"); break;
        }
        return userRowSelection;
    }

    function promptNumberUserInput(available: number, _CurrentSelectedRow: number): number {
        let input: number = Number(prompt("How many lights to remove on line " + _CurrentSelectedRow));

        if (isNaN(input) || input <= 0 || input > available) {
            console.log("Ungültiger Zug! Gib eine gültige Anzahl zwischen 1 und " + available + " ein.");
            return promptNumberUserInput(available, _CurrentSelectedRow);
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

    function checkGameActionInput(_Input: number): boolean {
        return _Input >= 1 && _Input <= 4;
    }

    function displayState(_a: number, _b: number, _c: number, _d: number, _Player: boolean) {
        console.log("Current Player: --Player " + (_Player ? "2" : "1") + "--");
        console.log("_________________________________________________________");
        console.log("Current Row 1: " + _a);
        console.log("_________________________________________________________");
        console.log("Current Row 2: " + _b);
        console.log("_________________________________________________________");
        console.log("Current Row 3: " + _c);
        console.log("_________________________________________________________");
        console.log("Current Row 4: " + _d);
        console.log("_________________________________________________________");
    }

}
