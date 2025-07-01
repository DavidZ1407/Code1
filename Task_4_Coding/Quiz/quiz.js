"use strict";
var QuizGame;
(function (QuizGame) {
    let answer = prompt(QuizGame.data["singleChoice"]["question1"][0]) || "";
    checkQuestion(QuizGame.data["singleChoice"]["question1"][0], answer);
    console.log("(1) Runtime Error");
    console.log("(2) Compiletime Error");
    console.log("(3) Didacticle Error");
    console.log("(4) Designtime Error");
    answer = prompt(QuizGame.data["multipleChoice"]["question1"][0]) || "";
    checkQuestion(QuizGame.data["multipleChoice"]["question1"][0], answer);
    answer = prompt(QuizGame.data["textEntry"]["question1"][0]) || "";
    checkQuestion(QuizGame.data["textEntry"]["question1"][0], answer);
    answer = prompt(QuizGame.data["estimation"]["question1"][0]) || "";
    checkQuestion(QuizGame.data["estimation"]["question1"][0], answer);
    alert("You have won the game!");
    function checkQuestion(_question, _answer) {
        if (_question.toLowerCase == _answer.toLowerCase) {
            alert("Correct");
            return;
        }
        else {
            alert("Wrong Answer");
            return checkQuestion(_question, _answer);
        }
    }
})(QuizGame || (QuizGame = {}));
//# sourceMappingURL=quiz.js.map