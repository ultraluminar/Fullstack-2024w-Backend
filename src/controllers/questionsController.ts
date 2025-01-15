import { Request, Response } from "express";
import { ErrorResponse } from "../models/ErrorResponse.js";
import { Question } from "../models/question/Question.js";
import { PublicQuestion } from "../models/question/PublicQuestion.js";
import { UpdateQuestion } from "../models/question/UpdateQuestion.js";
import { Token } from "../models/Token.js";
import { User } from "../models/user/User.js";
import { CreateQuestion } from "../models/question/CreateQuestion.js";
import { QuestionArrayResponse } from "../models/question/QuestionArrayResponse.js";
import { validate } from "class-validator";

export const questionsController = {
    async getQuestions(request: Request, response: Response) {
        const questionArray = await QuestionArrayResponse.fromSearchQuery(request.query);
        response.status(200).json(questionArray);
    },
    async createQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const createQuestion = CreateQuestion.fromRequest(request);
        if (createQuestion == null){
            const errorResponse = ErrorResponse.badParameters();
            response.status(400).json(errorResponse);
            return;
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        const question = Question.fromCreateQuestionAndUser(createQuestion, user);
        const errors = await validate(question);
        if (errors.length > 0) {
            const errorResponse = ErrorResponse.fromValidationErrors(errors);
            response.status(400).json(errorResponse);
            return;
        }
        await question.save();
        const publicQuestion = await PublicQuestion.fromQuestion(question);
        response.status(201).json(publicQuestion);
    },
    async getQuestionById(request: Request, response: Response) {
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)){
            const errorResponse = ErrorResponse.invalidId(questionId);
            response.status(400).json(errorResponse);
            return;
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null){
            const errorResponse = ErrorResponse.questionNotFound(questionId);
            response.status(404).json(errorResponse);
            return;
        }
        const publicQuestion = await PublicQuestion.fromQuestion(question);
        response.status(200).json(publicQuestion);

    },
    async updateQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)) {
            const errorResponse = ErrorResponse.invalidId(questionId);
            response.status(400).json(errorResponse);
            return;
        }
        const updateQuestion = UpdateQuestion.fromRequest(request);
        if (updateQuestion == null){
            const errorResponse = ErrorResponse.badParameters();
            response.status(400).json(errorResponse);
            return;
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null) {
            const errorResponse = ErrorResponse.questionNotFound(questionId);
            response.status(404).json(errorResponse);
            return;
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        if (token.isAutherizedUser(question.user)) {
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        if (updateQuestion.body !== undefined){
            question.body = updateQuestion.body;
        }
        if (updateQuestion.title !== undefined){
            question.title = updateQuestion.title;
        }
        const errors = await validate(question);
        if (errors.length > 0) {
            const errorResponse = ErrorResponse.fromValidationErrors(errors);
            response.status(400).json(errorResponse);
            return;
        }
        await question.save();
        const publicQuestion = await PublicQuestion.fromQuestion(question);
        response.status(200).json(publicQuestion);

    },
    async deleteQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)){
            const errorResponse = ErrorResponse.invalidId(questionId);
            response.status(400).json(errorResponse);
            return;
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null){
            const errorResponse = ErrorResponse.questionNotFound(questionId);
            response.status(404).json(errorResponse);
            return;
        }
        const userId = token.userId;
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        if (token.isAutherizedUser(question.user)) {
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        await question.remove();
        console.log(`Question with ID "${questionId}" removed`);
        response.status(204).end();
    },
    async getAllAnswers(request: Request, response: Response) {
        //TODO: implement
        response.sendStatus(501);
    },
    async createAnswer(request: Request, response: Response) {
        //TODO: implement
        response.sendStatus(501);
    }
};
