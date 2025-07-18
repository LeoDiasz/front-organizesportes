import dayjs from "dayjs";
import request from "./api";
import type { IGetListMatchsResponse } from "../model/match.model";

interface ICreateOrganizationRequest {
    name: string;
    modality: string;
}

interface IGetOrganizationAndMatchWithCodeRequest {
    inviteCode: string;
}

export class OrganizationService {
    private static INSTANCE: OrganizationService;

    async createOrganization(body: ICreateOrganizationRequest) {
        const data = await request.post("/organizations", body);

        return data;
    }

    async getOrganization() {
        const { data } = await request.get("/organizations/email")

        return data;
    }

    async getOrganizationAndMatchWithCode({ inviteCode }: IGetOrganizationAndMatchWithCodeRequest) {
        const { data } = await request.get<IGetListMatchsResponse>(`/organizations/${inviteCode}`);
        console.log("Data aqui", data)

        const dateTime = new Date(data.dateTime);
        dateTime.setHours(dateTime.getHours() + 3);

        const hour = dayjs(dateTime).format("HH:mm");
        const date = dayjs(dateTime).format("DD/MM/YYYY");

        const dataFormatted = {
            ...data,
            hour,
            date
        }

        return dataFormatted;
    }

    static getInstance() {
        if (!this.INSTANCE) this.INSTANCE = new OrganizationService();
        return this.INSTANCE
    }
}