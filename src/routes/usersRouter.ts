import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { usersController } from '../controllers/usersController.js';

export const usersRouter = Router()
    .post('/login', authController.login)
    .post('/register', authController.register)
    .delete('/:userId', usersController.deleteUser)
    .get('/:userId', usersController.getUserById)
    .get('/:userId/questions', usersController.getAllQuestionsFromUser);
