import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { usersController } from '../controllers/usersController.js';

const usersRouter = Router();

usersRouter.post('/login', authController.login);
usersRouter.post('/register', authController.register);
usersRouter.delete('/:userId', usersController.deleteUser);
usersRouter.get('/:userId', usersController.getUserById);
usersRouter.get('/:userId/questions', usersController.getAllQuestionsFromUser);

export { usersRouter };
