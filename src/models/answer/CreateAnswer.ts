import { Request } from "express";
import { CreateAnswer as CreateAnswerInterface } from "../../../../interface/create-answer.js";

export class CreateAnswer implements CreateAnswerInterface {
    body: string;

    constructor(body: string){
        this.body = body;
    }

    static fromRequest(request: Request): CreateAnswer | null {
        if (request.body?.body == null){
            return null;
        }
        return new CreateAnswer(request.body.body);
    }
}
