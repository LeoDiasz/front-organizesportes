import request from "./api";


interface ICreateGuestRequest {
    name: string;
    email: string;
    phoneNumber: string;
    preferencePosition: string;
    matchId: string;
    idOrganization: string;
}

interface IDeleteGuestRequest {
    idGuest: string;
    idMatch: string;
}

interface IUpdateGuestRequest {
    idMatch: string;
    idGuest: string;
    confirmNow: boolean;
}

export class GuestServices {
    private static INSTANCE: GuestServices;

    async createGuest(body: ICreateGuestRequest) {
        const data = await request.post("/guests", body);
        console.log("Data aqui", data)

        return data;
        
    }

    async deleteGuest({idMatch, idGuest}: IDeleteGuestRequest) {
        const data = await request.delete(`/matchs/${idMatch}/guests/${idGuest}`);

        return data;
    }

    async updateGuest(body: IUpdateGuestRequest) {
        const data = await request.put("/guests", body);

        return data;
    }

     static getInstance() {
        if(!this.INSTANCE) this.INSTANCE = new GuestServices();
        return this.INSTANCE
    }

}