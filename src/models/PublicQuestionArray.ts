import { ParsedQs } from 'qs';
import { QuestionArray as PublicQuestionArrayInterface } from '../../../interface/question-array.js';
import { PublicQuestion } from './PublicQuestion.js';
import { Question } from './Question.js';

export class PublicQuestionArray extends Array<PublicQuestion> implements PublicQuestionArrayInterface {
    static async fromQuestionArray(questionArray: Question[]): Promise<PublicQuestionArray> {
        const publicQuestionArray = questionArray.map(PublicQuestion.fromQuestion);
        return await PublicQuestionArray.fromAsync(publicQuestionArray);
    }
}
