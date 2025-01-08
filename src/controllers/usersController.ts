import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { PublicUser } from '../models/PublicUser.js';
import { ErrorResponse } from '../models/ErrorResponse.js';

export const usersController = {
    async getUserById(request: Request, response: Response) {
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            const errorResponse = ErrorResponse.invalidId(request.params.userId);
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
        let token = request.headers.authorization;
        if (token != null && token.startsWith('Bearer ')) {
            token = token.slice(7);
        } else {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const tokenPayload = User.decodeToken(token);
        if (typeof tokenPayload === 'string' || tokenPayload == null) {
            const errorResponse = ErrorResponse.invalidToken();
            response.status(401).json(errorResponse);
            return;
        }
        const userId = Number(request.params.userId);
        if (isNaN(userId)) {
            const errorResponse = ErrorResponse.invalidId(request.params.userId);
            response.status(400).json(errorResponse);
            return;
        }
        if (tokenPayload.userId !== userId) {
            const errorResponse = ErrorResponse.forbiddenAction();
            response.status(403).json(errorResponse);
            return;
        }
        const user = await User.findOneBy({id: userId});
        if (user == null) {
            const errorResponse = ErrorResponse.userNotFound(userId);
            response.status(404).json(errorResponse);
            return;
        }
        await user.remove();
        console.log(`User with ID "${userId}" removed`);
        response.status(204).end();
    }
}
