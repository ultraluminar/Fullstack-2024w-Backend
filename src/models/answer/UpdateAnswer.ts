import { Request } from "express";
import { UpdateAnswer as UpdateAnswerInterface } from "../../../../interface/update-answer.js";

export class UpdateAnswer implements UpdateAnswerInterface {
    body: string;

    constructor(body: string){
        this.body = body;
    }

    static fromRequest(request: Request): UpdateAnswer | null {
        if (request.body?.body == null){
            return null;
        }
        return new UpdateAnswer(request.body.body);
    }
}
