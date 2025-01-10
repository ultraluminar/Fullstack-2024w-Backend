import { UpdateQuestion as UpdateQuestionInterface } from '../../../interface/update-question.js';
import { Request } from 'express';

export class UpdateQuestion implements UpdateQuestionInterface {
    title: string;
    body: string;

    constructor(title: string, body: string) {
        this.title = title;
        this.body = body;
    }

    static fromRequest(request: Request): UpdateQuestion | null {
        if (request.body?.title == null && request.body?.body == null) {
            return null;
        }
        return new UpdateQuestion(request.body.title, request.body.body);
    }
}
