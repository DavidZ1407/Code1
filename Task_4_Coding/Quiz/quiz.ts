namespace QuizGame{


let answer: string = prompt(data["singleChoice"]["question1"][0]) || "";
checkQuestion(data["singleChoice"]["question1"][0], answer)

console.log("(1) Runtime Error")
console.log("(2) Compiletime Error")
console.log("(3) Didacticle Error")
console.log("(4) Designtime Error")
answer = prompt(data["multipleChoice"]["question1"][0]) || "";

checkQuestion(data["multipleChoice"]["question1"][0], answer)

answer = prompt(data["textEntry"]["question1"][0]) || "";
checkQuestion(data["textEntry"]["question1"][0], answer)

answer = prompt(data["estimation"]["question1"][0]) || "";
checkQuestion(data["estimation"]["question1"][0], answer)

alert("You have won the game!")

function checkQuestion(_question: string, _answer: string){

    if (_question.toLowerCase == _answer.toLowerCase){
        alert("Correct")
        return;
    }

    else{
        alert("Wrong Answer")
        return checkQuestion(_question, _answer)
    }
}


}