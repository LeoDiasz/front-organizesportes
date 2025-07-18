import request from "./api";

interface ILoginUserRequest {
    email: string;
    name: string;
    uid: string;
    phoneNumber?: string;
}

export class UserServices {
    private static INSTANCE: UserServices;

    async loginUser(body: ILoginUserRequest) {
        const {data} = await request.post("/users/login", body);

        return data;
    }

    static getInstance() {
        if (!this.INSTANCE) this.INSTANCE = new UserServices();
        return this.INSTANCE
    }
}