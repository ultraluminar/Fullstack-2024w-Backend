import { ParsedQs } from 'qs';
import { QuestionArray as QuestionArrayResponseInterface } from '../../../interface/question-array.js';
import { PublicQuestion } from './PublicQuestion.js';
import { Question } from './Question.js';

export class QuestionArrayResponse extends Array<PublicQuestion> implements QuestionArrayResponseInterface {
    static fromArray(array: PublicQuestion[]): QuestionArrayResponse {
        const questionArray = new QuestionArrayResponse();
        questionArray.push(...array);
        return questionArray;
    }

    static async fromSearchQuery(query: ParsedQs): Promise<QuestionArrayResponse> {
        const questionArray = await Question.fromQuery(query);
        const publicQuestionArray = questionArray.map(PublicQuestion.fromQuestion);
        return await QuestionArrayResponse.fromAsync(publicQuestionArray);
    }
}
