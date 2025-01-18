import { User } from "./User.js";
import { User as PublicUserInterface } from "../../../../interface/user.js";

export class PublicUser implements PublicUserInterface {
    id: number;
    isAdmin: boolean;
    username: string;
    createdAt: Date;

    constructor(id: number, isAdmin: boolean, username: string, created_at: Date) {
        this.id = id;
        this.isAdmin = isAdmin
        this.username = username;
        this.createdAt = created_at;
    }

    static fromUser(user: User): PublicUser {
        return new PublicUser(user.id, user.isAdmin, user.username, user.created_at);
    }
}
