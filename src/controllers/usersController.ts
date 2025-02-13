import { Request, Response } from 'express';
import { User } from '../models/user/User.js';
import { PublicUser } from '../models/user/PublicUser.js';
import { Token } from '../models/Token.js';
import { QuestionArray as PublicQuestionArray } from "../../../interface/question-array.js";
import { PublicQuestion } from '../models/question/PublicQuestion.js';
import { MongoDBUser } from '../models/user/MongoDBUser.js';
import {
    ForbiddenActionResponse,
    InvalidIdResponse,
    InvalidTokenResponse,
    UserNotFoundResponse,
} from "../models/ErrorResponse.js";
import { Question } from '../models/question/Question.js';

export const usersController = {
    async getUserById(request: Request, response: Response) {
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            return InvalidIdResponse.send(response, userId);
        }
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const publicUser = PublicUser.fromUser(user);
        response.status(200).json(publicUser);
    },

    async deleteUser(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            return InvalidIdResponse.send(response, userId);
        }
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        if (!await token.isAutherizedUser(user)) {
            return ForbiddenActionResponse.send(response);
        }
        await user.remove();
        console.log(`User with ID "${userId}" removed`);
        response.status(204).end();
    },
    async getAllQuestionsFromUser(request: Request, response: Response) {
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            return InvalidIdResponse.send(response, userId);
        }
        const user = await User.findOne({
            where: { id: userId },
            relations: { questions: { user: true } },
            order: { questions: { createdAt: "DESC" } },
        });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const publicQuestionArray: PublicQuestionArray = user.questions.map(PublicQuestion.fromQuestion);
        response.status(200).json(publicQuestionArray);
    },
    async getUserStats(request: Request, response: Response){
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            return InvalidIdResponse.send(response, userId);
        }
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const mongoDBUser = await MongoDBUser.findOrCreate(userId);
        response.status(200).json(mongoDBUser);
    }
}
