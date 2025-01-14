import { Request, Response } from 'express';
import { User } from '../models/user/User.js';
import { PublicUser } from '../models/user/PublicUser.js';
import { ErrorResponse } from '../models/ErrorResponse.js';
import { Token } from '../models/Token.js';

export const usersController = {
    async getUserById(request: Request, response: Response) {
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            const errorResponse = ErrorResponse.invalidId(userId);
            response.status(400).json(errorResponse);
            return;
        }
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        const publicUser = PublicUser.fromUser(user);
        response.status(200).json(publicUser);
    },

    async deleteUser(request: Request, response: Response) {
        const token = Token.fromRequest(request);
        if (token == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            const errorResponse = ErrorResponse.invalidId(userId);
            response.status(400).json(errorResponse);
            return;
        }
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        if (token.isAutherizedUser(user)) {
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        await user.remove();
        console.log(`User with ID "${userId}" removed`);
        response.status(204).end();
    },
    async getAllQuestionsFromUser(request: Request, response: Response) {
        // TODO: implement
        response.status(501).end();
    },
}
