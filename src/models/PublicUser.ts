import { User } from "./User.js";
import { User as PublicUserInterface } from "./../../../interface/user.js";

export class PublicUser implements PublicUserInterface {
    id: string;
    username: string;
    created_at: Date;

    constructor(id: string, username: string, created_at: Date) {
        this.id = id;
        this.username = username;
        this.created_at = created_at;
    }

    static fromUser(user: User): PublicUser {
        return new PublicUser(user.id.toString(), user.username, user.created_at);
    }
}
