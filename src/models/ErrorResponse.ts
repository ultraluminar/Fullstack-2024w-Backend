import { Response } from 'express';
import { ErrorResponse as ErrorResponseInterface } from '../../../interface/error-response.js';
import { ValidationError } from 'class-validator';

abstract class ErrorResponseBase  {
    static error: string;
    static code: number = -1;

    static send(response: Response, param?: string | number | ValidationError[]){
        response.status(this.code).json({
            code: this.code,
            error: this.error,
        } satisfies ErrorResponseInterface);
    }
}

export class BadParametersResponse extends ErrorResponseBase {
    static error = "Übermittelte Daten sind nicht vollständig";
    static code = 400;
}

export class ForbiddenActionResponse extends ErrorResponseBase {
    static error = "Aktion nicht erlaubt";
    static code = 403;
}

export class InvalidCredentialsResponse extends ErrorResponseBase {
    static error = "Nutzername oder Passwort falsch!";
    static code = 401;
}

export class InvalidTokenResponse extends ErrorResponseBase {
    static error = "Ungültiges Token";
    static code = 401;
}

export class UsernameAlreadyTakenResponse extends ErrorResponseBase {
    static code = 409;

    static send(response: Response, username: string){
        this.error = `Nutzername '${username}' bereits vergeben`;
        super.send(response);
    }
}

export class InvalidIdResponse extends ErrorResponseBase {
    static code = 400;

    static send(response: Response, id: string | number) {
        this.error = `Ungültige ID '${id}'`;
        super.send(response);
    }
}

export class UserNotFoundResponse extends ErrorResponseBase {
    static code = 404;

    static send(response: Response, id: number) {
        this.error = `Benutzer mit der ID '${id}' nicht gefunden!`;
        super.send(response);
    }
}

export class QuestionNotFoundResponse extends ErrorResponseBase {
    static code = 404;

    static send(response: Response, id: number) {
        this.error = `Frage mit der ID '${id}' nicht gefunden!`;
        super.send(response);
    }
}

export class AnswerNotFoundResponse extends ErrorResponseBase {
    static code = 404;

    static send(response: Response, id: number) {
        this.error = `Antwort mit der ID '${id}' nicht gefunden!`;
        super.send(response);
    }
}

export class ValidationErrorResponse extends ErrorResponseBase {
    static code = 400;

    static send(response: Response, errors: ValidationError[]) {
        this.error = errors.map((e) => Object.values(e.constraints!)[0]).join(", ");
        super.send(response);
    }
}
