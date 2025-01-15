import { Router } from "express";
import { answersController } from "../controllers/answersController.js";

export const answersRouter = Router()
    .get('/:answerId', answersController.getAnswerById)
    .patch('/:answerId', answersController.updateAnswer)
    .delete('/:answerId', answersController.deleteAnswer);
