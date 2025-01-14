import { CreateQuestion as CreateQuestionInterface } from '../../../interface/create-question.js';

export class CreateQuestion implements CreateQuestionInterface {
    title: string;
    body: string;

    constructor(title: string, body: string) {
        this.title = title;
        this.body = body;
    }

    static fromRequest(request: any): CreateQuestion | null {
        if (request.body?.title == null || request.body?.body == null) {
            return null;
        }
        return new CreateQuestion(request.body.title, request.body.body);
    }
}
