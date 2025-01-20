import { Answer as AnswerInterface } from "../../../../interface/answer.js";
import { Answer } from "./Answer.js";

export class PublicAnswer implements AnswerInterface {
    id: number;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    votes: number;

    constructor(id: number, body: string, createdAt: Date, updatedAt: Date, userId: number, votes: number){
        this.id = id;
        this.body = body;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.userId = userId;
        this.votes = votes;
    }

    static fromAnswer(answer: Answer): PublicAnswer {
        return new PublicAnswer(
            answer.id,
            answer.body,
            answer.createdAt,
            answer.updatedAt,
            answer.user.id,
            answer.getVotes()
        );
    }

}
