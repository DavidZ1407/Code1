"use strict";
var QuizGame;
(function (QuizGame) {
    function checkQuestion(_rightAnswer, _answer, _question) {
        if (_rightAnswer.toLowerCase() === _answer.toLowerCase()) {
            alert("Correct");
            return;
        }
        else {
            alert("Wrong Answer");
            return checkQuestion(_rightAnswer, prompt(_question) || "", _question);
        }
    }
    checkQuestion(QuizGame.data["singleChoice"]["question1"][1], prompt(QuizGame.data["singleChoice"]["question1"][0]) || "", QuizGame.data["singleChoice"]["question1"][0]);
    console.log("(1) Runtime Error");
    console.log("(2) Compiletime Error");
    console.log("(3) Didacticle Error");
    console.log("(4) Designtime Error");
    checkQuestion(QuizGame.data["multipleChoice"]["question1"][1], prompt(QuizGame.data["multipleChoice"]["question1"][0]) || "", QuizGame.data["multipleChoice"]["question1"][0]);
    checkQuestion(QuizGame.data["textEntry"]["question1"][1], prompt(QuizGame.data["textEntry"]["question1"][0]) || "", QuizGame.data["textEntry"]["question1"][0]);
    checkQuestion(QuizGame.data["estimation"]["question1"][1], prompt(QuizGame.data["estimation"]["question1"][0]) || "", QuizGame.data["estimation"]["question1"][0]);
    alert("You have won the game!");
})(QuizGame || (QuizGame = {}));
//# sourceMappingURL=quiz.js.map