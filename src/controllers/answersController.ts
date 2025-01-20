import { Request, Response } from "express";
import { Answer } from "../models/answer/Answer.js";
import { PublicAnswer } from "../models/answer/PublicAnswer.js";
import { Token } from "../models/Token.js";
import { User } from "../models/user/User.js";
import { UpdateAnswer } from "../models/answer/UpdateAnswer.js";
import { MongoDBUser } from "../models/user/MongoDBUser.js";
import {
    AnswerNotFoundResponse,
    BadParametersResponse,
    ForbiddenActionResponse,
    InvalidIdResponse,
    InvalidTokenResponse,
    QuestionNotFoundResponse,
    UserNotFoundResponse,
} from "../models/ErrorResponse.js";

export const answersController = {
    async getAnswerById(request: Request, response: Response) {
        const answerId = Number(request.params.answerId);
        if (isNaN(answerId)){
            return InvalidIdResponse.send(response, answerId);
        }
        const answer = await Answer.findOne({
            where: { id: answerId },
            relations: { user: true },
        });
        if (answer == null){
            return AnswerNotFoundResponse.send(response, answerId);
        }
        const publicAnswer = PublicAnswer.fromAnswer(answer);
        response.status(201).json(publicAnswer);
    },
    async updateAnswer(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null){
            return InvalidTokenResponse.send(response);
        }
        const answerId = Number(request.params.answerId);
        if (isNaN(answerId)) {
            return InvalidIdResponse.send(response, answerId);
        }
        const answer = await Answer.findOneBy({ id: answerId });
        if (answer == null) {
            return AnswerNotFoundResponse.send(response, answerId);
        }
        if (!await token.isAutherizedUser(answer.user)) {
            return ForbiddenActionResponse.send(response);
        }
        const updateAnswer = UpdateAnswer.fromRequest(request);
        if (updateAnswer == null){
            return BadParametersResponse.send(response);
        }
        answer.body = updateAnswer.body;
        await answer.save();
        const publicAnswer = PublicAnswer.fromAnswer(answer);

        const mongoDBUser = await MongoDBUser.findOrCreate(answer.user.id);
        mongoDBUser.answersUpdated += 1;
        await mongoDBUser.save();

        response.status(200).json(publicAnswer);


    },
    async deleteAnswer(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const answerId = Number(request.params.answerId);
        if (isNaN(answerId)){
            return InvalidIdResponse.send(response, answerId);
        }
        const answer = await Answer.findOne({
            where: { id: answerId },
            relations: { user: true },
        });
        if (answer == null){
            return AnswerNotFoundResponse.send(response, answerId);
        }
        if (!await token.isAutherizedUser(answer.user)){
            return ForbiddenActionResponse.send(response);
        }
        await answer.remove();
        console.log(`Answer with ID "${answerId}" removed`);
        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.answersDeleted += 1;
        await mongoDBUser.save();
        response.status(204).end();
    },
};
