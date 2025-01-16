import { Request, Response } from "express";
import { ErrorResponse } from "../models/ErrorResponse.js";
import { Answer } from "../models/answer/Answer.js";
import { PublicAnswer } from "../models/answer/PublicAnswer.js";
import { Token } from "../models/Token.js";
import { User } from "../models/user/User.js";
import { UpdateAnswer } from "../models/answer/UpdateAnswer.js";

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
        const token = Token.fromRequest(request);
        if (token == null){
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const answerId = Number(request.params.answerId);
        if (isNaN(answerId)) {
            const errorResponse = ErrorResponse.invalidId(answerId);
            response.status(400).json(errorResponse);
            return;
        }
        const answer = await Answer.findOneBy({ id: answerId });
        if (answer == null) {
            const errorResponse = ErrorResponse.questionNotFound(answerId);
            response.status(404).json(errorResponse);
            return;
        }
        if (!token.isAutherizedUser(answer.user)) {
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        const updateAnswer = UpdateAnswer.fromRequest(request);
        if (updateAnswer == null){
            const errorResponse = ErrorResponse.badParameters();
            response.status(400).json(errorResponse);
            return;
        }
        answer.body = updateAnswer.body;
        await answer.save();
        const publicAnswer = PublicAnswer.fromAnswer(answer);
        response.status(200).json(publicAnswer);


    },
    async deleteAnswer(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
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
        if (!token.isAutherizedUser(answer.user)){
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        await answer.remove();
        console.log(`Answer with ID "${answerId}" removed`);
        response.status(204).end();
    },
};
