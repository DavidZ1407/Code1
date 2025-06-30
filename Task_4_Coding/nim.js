"use strict";
var Nim;
(function (Nim) {
    let a;
    let b;
    let c;
    let d;
    let Player = false;
    a = Number(prompt("Fill Row 1"));
    b = Number(prompt("Fill Row 2"));
    c = Number(prompt("Fill Row 3"));
    d = Number(prompt("Fill Row 4"));
    gameLoop(a, b, c, d, Player);
    function gameLoop(_a, _b, _c, _d, _Player) {
        let hasGameEnded = false;
        displayState(_a, _b, _c, _d, _Player);
        let CurrentSelectedRow = getRow(_a, _b, _c, _d);
        let UpdatedLights = promptNumberUserInput(_a, _b, _c, _d, CurrentSelectedRow);
        //Change Row Values
        switch (CurrentSelectedRow) {
            case 1: {
                _a = UpdatedLights;
                break;
            }
            case 2: {
                _b = UpdatedLights;
                break;
            }
            case 3: {
                _c = UpdatedLights;
                break;
            }
            case 4: {
                _d = UpdatedLights;
                break;
            }
        }
        if (checkWinner(_a, _b, _c, _d) == true) {
            if (_Player == false) {
                console.log("Player 1 has won the game");
                hasGameEnded = true;
            }
            else {
                console.log("Player 2 has won the game");
                hasGameEnded = true;
            }
        }
        else {
            _Player = !_Player;
            gameLoop(_a, _b, _c, _d, _Player);
        }
    }
    function checkWinner(_a, _b, _c, _d) {
        let CalculationResult;
        let winnerResult;
        CalculationResult = _a ^ _b;
        CalculationResult = CalculationResult ^ _c;
        CalculationResult = CalculationResult ^ _d;
        if (CalculationResult <= 0) {
            winnerResult = true;
        }
        else {
            winnerResult = false;
        }
        return winnerResult;
    }
    function getRow(_a, _b, _c, _d) {
        let userRowSelection = promptRowUserInput();
        console.log(userRowSelection);
        switch (userRowSelection) {
            case 1:
                {
                    console.log("Currently Selected Row 1");
                    break;
                }
                ;
            case 2:
                {
                    console.log("Currently Selected Row 2");
                    break;
                }
                ;
            case 3:
                {
                    console.log("Currently Selected Row 3");
                    break;
                }
                ;
            case 4:
                {
                    console.log("Currently Selected Row 4");
                    break;
                }
                ;
        }
        return userRowSelection;
    }
    function promptNumberUserInput(_a, _b, _c, _d, _CurrentSelectedRow) {
        let input = (Number(prompt("How many lights to remove on line " + _CurrentSelectedRow)));
        let result;
        switch (_CurrentSelectedRow) {
            //Work in Progress !!!!!!!!!!!!!!!!!!!!!!
            case 1: result = _CurrentSelectedRow - input;
            case 2: result = _CurrentSelectedRow - input;
            case 3: result = _CurrentSelectedRow - input;
            case 4: result = _CurrentSelectedRow - input;
            default: result = -1;
        }
        return result;
    }
    function promptRowUserInput() {
        let input = (Number(prompt("What Row to select?")));
        if (checkGameActionInput(input) == true) {
            return input;
        }
        else {
            return promptRowUserInput();
        }
    }
    ;
    function checkGameActionInput(_Input) {
        if (_Input < 1 || _Input > 4) {
            return false;
        }
        else {
            return true;
        }
    }
    function displayState(_a, _b, _c, _d, _Player) {
        if (Player == false) {
            console.log("Current Player: --Player 1-- ");
        }
        else {
            console.log("Current Player: --Player 2-- ");
        }
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
})(Nim || (Nim = {}));
