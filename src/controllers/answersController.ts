import { Request, Response } from "express";
import { ErrorResponse } from "../models/ErrorResponse.js";
import { Answer } from "../models/answer/Answer.js";
import { PublicAnswer } from "../models/answer/PublicAnswer.js";

export const answersController = {
    async getAnswerById(request: Request, response: Response) {
        const answerId = Number(request.params.answerId);
        if (isNaN(answerId)){
            const errorResponse = ErrorResponse.invalidId(answerId);
            response.status(400).json(errorResponse);
            return;
        }
        const answer = await Answer.findOne({
            where: { id: answerId },
            relations: { user: true },
        });
        if (answer == null){
            const errorResponse = ErrorResponse.questionNotFound(answerId);
            response.status(404).json(errorResponse);
            return;
        }
        const publicAnswer = PublicAnswer.fromAnswer(answer);
        response.status(201).json(publicAnswer);
    },
    async updateAnswer(request: Request, response: Response) {
        //TODO: implement
        response.sendStatus(501);
    },
    async deleteAnswer(request: Request, response: Response) {
        //TODO: implement
        response.sendStatus(501);
    },
};
