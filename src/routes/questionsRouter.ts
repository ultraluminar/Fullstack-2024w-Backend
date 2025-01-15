import { Router } from "express";
import { questionsController } from "../controllers/questionsController.js";

export const questionsRouter = Router()
    .get('/', questionsController.getQuestions)
    .post('/', questionsController.createQuestion)
    .get('/:questionId', questionsController.getQuestionById)
    .patch('/:questionId', questionsController.updateQuestion)
    .delete('/:questionId', questionsController.deleteQuestion)
    .get('/:questionId/answers', questionsController.getAllAnswersFromQuestion)
    .post('/:questionId/answers', questionsController.createAnswer);
