import { v4 as uuidv4 } from 'uuid';

export type TCreateUserParams = {
    password: string;
    username: string;
    email: string
};

export class User {
    public password: string;
    public username: string;
    public email: string;
    public id: string;

    constructor(createUserParams: TCreateUserParams) {
        this.id = uuidv4();
        this.password = createUserParams.password;
        this.username = createUserParams.username;
        this.email = createUserParams.email 
    }
}
