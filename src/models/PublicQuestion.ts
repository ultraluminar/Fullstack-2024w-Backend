import { Question as QuestionInterface } from '../../../interface/question.js';

export class PublicQuestion implements QuestionInterface {
    id: number;
    title: string;
    body: string;
    userId: number;
    votes: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(id: number, title: string, body: string, userId: number, votes: number, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.userId = userId;
        this.votes = votes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
