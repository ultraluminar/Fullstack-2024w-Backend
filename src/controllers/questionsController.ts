import { Request, Response } from "express";
import { Question } from "../models/question/Question.js";
import { PublicQuestion } from "../models/question/PublicQuestion.js";
import { UpdateQuestion } from "../models/question/UpdateQuestion.js";
import { Token } from "../models/Token.js";
import { QuestionArray as PublicQuestionArray } from "../../../interface/question-array.js";
import { User } from "../models/user/User.js";
import { CreateQuestion } from "../models/question/CreateQuestion.js";
import { validate } from "class-validator";
import { PublicAnswer } from "../models/answer/PublicAnswer.js";
import { AnswerArray as PublicAnswerArray } from "../../../interface/answer-array.js";
import { CreateAnswer } from "../models/answer/CreateAnswer.js";
import { Answer } from "../models/answer/Answer.js";
import { MongoDBUser } from "../models/user/MongoDBUser.js";
import {
    BadParametersResponse,
    ForbiddenActionResponse,
    InvalidIdResponse,
    InvalidTokenResponse,
    QuestionNotFoundResponse,
    UserNotFoundResponse,
    ValidationErrorResponse,
} from "../models/ErrorResponse.js";

export const questionsController = {
    async getQuestions(request: Request, response: Response) {
        const questionArray = await Question.fromQuery(request.query);
        const publicQuestionArray: PublicQuestionArray = questionArray.map(PublicQuestion.fromQuestion);
        response.status(200).json(publicQuestionArray);
    },
    async createQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const createQuestion = CreateQuestion.fromRequest(request);
        if (createQuestion == null){
            return BadParametersResponse.send(response);
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const question = Question.fromCreateQuestionAndUser(createQuestion, user);
        const errors = await validate(question);
        if (errors.length > 0) {
            return ValidationErrorResponse.send(response, errors);
        }
        await question.save();
        const publicQuestion = await PublicQuestion.fromQuestion(question);

        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.questionsCreated += 1;
        await mongoDBUser.save();

        response.status(201).json(publicQuestion);
    },
    async getQuestionById(request: Request, response: Response) {
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)){
            return InvalidIdResponse.send(response, questionId);
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null){
            return QuestionNotFoundResponse.send(response, questionId);
        }
        const publicQuestion = await PublicQuestion.fromQuestion(question);
        response.status(200).json(publicQuestion);

    },
    async updateQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)) {
            return InvalidIdResponse.send(response, questionId);
        }
        const updateQuestion = UpdateQuestion.fromRequest(request);
        if (updateQuestion == null){
            return BadParametersResponse.send(response);
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null) {
            return QuestionNotFoundResponse.send(response, questionId);
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        if (token.isAutherizedUser(question.user)) {
            return ForbiddenActionResponse.send(response);
        }
        if (updateQuestion.body !== undefined){
            question.body = updateQuestion.body;
        }
        if (updateQuestion.title !== undefined){
            question.title = updateQuestion.title;
        }
        const errors = await validate(question);
        if (errors.length > 0) {
            return ValidationErrorResponse.send(response, errors);
        }
        await question.save();
        const publicQuestion = await PublicQuestion.fromQuestion(question);

        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.questionsUpdated += 1;
        await mongoDBUser.save();

        response.status(200).json(publicQuestion);

    },
    async deleteQuestion(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)){
            return InvalidIdResponse.send(response, questionId);
        }
        const question = await Question.findOne({
            where: {id: questionId},
            relations: {user: true},
        });
        if (question == null){
            return QuestionNotFoundResponse.send(response, questionId);
        }
        const userId = token.userId;
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        if (token.isAutherizedUser(question.user)) {
            return ForbiddenActionResponse.send(response);
        }
        await question.remove();
        console.log(`Question with ID "${questionId}" removed`);

        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.questionsDeleted += 1;
        await mongoDBUser.save();
        response.status(204).end();
    },
    async getAllAnswersFromQuestion(request: Request, response: Response) {
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)) {
            return InvalidIdResponse.send(response, questionId);
        }
        const question = await Question.findOne({
            where: { id: questionId },
            relations: { answers: { user: true } },
        });
        if (question == null) {
            return QuestionNotFoundResponse.send(response, questionId);
        }
        const publicAnswerArray: PublicAnswerArray = question.answers.map(PublicAnswer.fromAnswer);
        response.status(200).json(publicAnswerArray);
    },
    async createAnswer(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            return InvalidTokenResponse.send(response);
        }
        const userId = token.userId;
        const user = await User.findOneBy({ id: userId });
        if (user == null) {
            return UserNotFoundResponse.send(response, userId);
        }
        const questionId = Number(request.params.questionId);
        if (isNaN(questionId)) {
            return InvalidIdResponse.send(response, questionId);
        }
        const question = await Question.findOne({
            where: { id: questionId },
            relations: { answers: true, user: true },
        });
        if (question == null) {
            return QuestionNotFoundResponse.send(response, questionId);
        }
        const createAnswer = CreateAnswer.fromRequest(request);
        if (createAnswer == null) {
            return BadParametersResponse.send(response);
        }
        const answer = Answer.fromCreateAnswer(createAnswer, user, question);
        const errors = await validate(answer);
        if (errors.length > 0) {
            return ValidationErrorResponse.send(response, errors);
        }
        await answer.save();
        const publicAnswer = PublicAnswer.fromAnswer(answer);

        const mongoDBUser = await MongoDBUser.findOrCreate(user.id);
        mongoDBUser.answersCreated += 1;
        await mongoDBUser.save();

        response.status(201).json(publicAnswer);
    }
};
