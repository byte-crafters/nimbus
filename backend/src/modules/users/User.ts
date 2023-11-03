import { v4 as uuidv4 } from 'uuid';

export type TCreateUserParams = {
    password: string;
    username: string;
};

export class User {
    public password: string;
    public username: string;
    public id: number;

    constructor(createUserParams: TCreateUserParams) {
        this.id = uuidv4();
        this.password = createUserParams.password;
        this.username = createUserParams.username;
    }
}