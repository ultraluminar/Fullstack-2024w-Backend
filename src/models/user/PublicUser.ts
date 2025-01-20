import { User } from "./User.js";
import { User as PublicUserInterface } from "../../../../interface/user.js";

export class PublicUser implements PublicUserInterface {
    id: number;
    isAdmin: boolean;
    username: string;
    createdAt: Date;

    constructor(id: number, isAdmin: boolean, username: string, createdAt: Date) {
        this.id = id;
        this.isAdmin = isAdmin
        this.username = username;
        this.createdAt = createdAt;
    }

    static fromUser(user: User): PublicUser {
        return new PublicUser(user.id, user.isAdmin, user.username, user.createdAt);
    }
}
