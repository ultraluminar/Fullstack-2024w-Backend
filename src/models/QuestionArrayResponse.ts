import { QuestionArray as QuestionArrayResponseInterface } from '../../../interface/question-array.js';
import { PublicQuestion } from './PublicQuestion.js';

export class QuestionArrayResponse extends Array<PublicQuestion> implements QuestionArrayResponseInterface {
    constructor() {
        super();
    }

    static fromArray(array: PublicQuestion[]): QuestionArrayResponse {
        const questionArray = new QuestionArrayResponse();
        questionArray.push(...array);
        return questionArray;
    }
}
