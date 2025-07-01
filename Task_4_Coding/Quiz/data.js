"use strict";
var QuizGame;
(function (QuizGame) {
    QuizGame.data = { singleChoice: { question1: ["Is a array a simple datatype?", "false"], },
        multipleChoice: { question1: ["Which of these Error Types is not used in computersience", "didactical Error"] },
        textEntry: { question1: ["How do you write Camel Case in German?", "Binnenmajuskel"] },
        estimation: { question1: ["How long does a signal (in fiberoptic) take from the earth to the sun? (Min:Seconds)", "12:30"] } };
    console.log(QuizGame.data["singleChoice"]["question1"][0]);
})(QuizGame || (QuizGame = {}));
