namespace QuizGame {
    export type QuestionData = {
        [key: string]: [question: string, answer: string];
    };

    export type QuizData = {
        singleChoice: QuestionData;
        multipleChoice: QuestionData;
        textEntry: QuestionData;
        estimation: QuestionData;
    };

    export const data: QuizData = {
        singleChoice: {
            question1: ["Is an array a simple datatype?", "false"],
        },
        multipleChoice: {
            question1: ["Which of these Error Types is not used in computer science?", "didactical Error"],
        },
        textEntry: {
            question1: ["How do you write Camel Case in German?", "Binnenmajuskel"],
        },
        estimation: {
            question1: ["How long does a signal (in fiberoptic) take from the Earth to the Sun? (Min:Seconds)", "12:30"],
        }
    };
}
