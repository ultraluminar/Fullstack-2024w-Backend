import { ParsedQs } from 'qs';
import { QuestionArray as QuestionArrayResponseInterface } from '../../../interface/question-array.js';
import { PublicQuestion } from './PublicQuestion.js';
import { Question } from './Question.js';

export class QuestionArrayResponse extends Array<PublicQuestion> implements QuestionArrayResponseInterface {
    static async fromQuestionArray(questionArray: Question[]): Promise<QuestionArrayResponse> {
        const publicQuestionArray = questionArray.map(PublicQuestion.fromQuestion);
        return await QuestionArrayResponse.fromAsync(publicQuestionArray);
    }
}
