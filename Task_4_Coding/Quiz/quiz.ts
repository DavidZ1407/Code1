namespace QuizGame {


    checkQuestion(data["singleChoice"]["question1"][1], prompt(data["singleChoice"]["question1"][0]) || "", data["singleChoice"]["question1"][0])


    console.log("(1) Runtime Error")
    console.log("(2) Compiletime Error")
    console.log("(3) Didacticle Error")
    console.log("(4) Designtime Error")
    checkQuestion(data["multipleChoice"]["question1"][1], prompt(data["multipleChoice"]["question1"][0]) || "", data["multipleChoice"]["question1"][0])
    checkQuestion(data["textEntry"]["question1"][1], prompt(data["textEntry"]["question1"][0]) || "", data["textEntry"]["question1"][0])
    checkQuestion(data["estimation"]["question1"][1], prompt(data["estimation"]["question1"][0]) || "", data["estimation"]["question1"][0])

    alert("You have won the game!");


    function checkQuestion(_rightAnswer: string, _answer: string, _question: string) {

        if (_rightAnswer.toLowerCase() === _answer.toLowerCase()) {
            alert("Correct");
            return;
        }

        else {
            alert("Wrong Answer");

            return checkQuestion(_rightAnswer, prompt(_question) || "", _question)
        }
    }
}