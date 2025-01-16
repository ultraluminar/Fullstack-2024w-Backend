import { ErrorResponse as ErrorResponseInterface } from '../../../interface/error-response.js';
import { ValidationError } from 'class-validator';

export class ErrorResponse implements ErrorResponseInterface {
    error: string;
    code: number;

    constructor(error: string, code: number) {
        this.error = error;
        this.code = code;
    }

    static fromValidationErrors(errors: ValidationError[], isPasswordValid: boolean = true): ErrorResponse {
        const messages = errors.map(error => Object.values(error.constraints!)[0]);
        if (!isPasswordValid) {
            messages.push("Passwort ist zu kurz");
        }
        return new ErrorResponse(messages.join(", "), 400);
    }

    static badParameters(): ErrorResponse {
        return new ErrorResponse("Übermittelte Daten sind nicht vollständig", 400);
    }

    static forbiddenAction(): ErrorResponse {
        return new ErrorResponse("Aktion nicht erlaubt", 403);
    }

    static invalidCredentials(): ErrorResponse {
        return new ErrorResponse("Nutzername oder Passwort falsch!", 401);
    }

    static invalidToken(): ErrorResponse {
        return new ErrorResponse("Ungültiges Token", 401);
    }

    static usernameAlreadyTaken(username: string): ErrorResponse {
        return new ErrorResponse(`Nutzername '${username}' bereits vergeben`, 409);
    }

    static invalidId(id: number): ErrorResponse {
        return new ErrorResponse(`Ungültige ID '${id}'`, 400);
    }

    static userNotFound(id: number): ErrorResponse {
        return new ErrorResponse(`User mit der ID '${id}' nicht gefunden!`, 404);
    }

    static questionNotFound(id: number): ErrorResponse{
        return new ErrorResponse(`Frage mit der ID '${id}' nicht gefunden!`, 404);
    }
    static answerNotFound(id: number): ErrorResponse {
        return new ErrorResponse(`Antwort mit der ID '${id}' nicht gefunden!`, 404);
    }
}
