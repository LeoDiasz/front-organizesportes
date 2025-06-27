import { request } from "./api";



interface ICreateOrganizationRequest  {
    name: string;

}

interface ISearchOrganizationRequest {

}

export class OrganizationService {
    private static INSTANCE: OrganizationService;

    async createOrganization(body: ICreateOrganizationRequest) {

        await request.post("/organization/create", body);
    }

    async getOrganization(body: ISearchOrganizationRequest) {
        const {data} = await request.get("/organization/:id", {data: body})

        return data;

    }



    static getInstance() {
        if(!this.INSTANCE) this.INSTANCE = new OrganizationService();
        return this.INSTANCE
    }
}