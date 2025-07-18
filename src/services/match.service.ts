import dayjs from "dayjs";
import request from "./api";
import type { IGetListMatchsResponse } from "../model/match.model";

interface ICreateMatchRequest {
    local: string;
    date: string;
    hour: string;
    duration: number;
    modality: string;
    numberMaxPlayers: number;
    numberMinPlayers: number;
    organizationId: string;
}

interface IGetListMatchsRequest {
    organizationId: string;
}

interface ICancelMatchRequest {
    id: string;
    idOrganization: string;
}

interface IFinishMatchRequest {
    id: string;
    idOrganization: string;
}

interface IGetMatchRequest {
    idOrganization: string;
    idMatch?: string;
}

interface IGenerateCodeMatchRequest {
    idOrganization: string;
    idMatch: string;
}

export class MatchServices {
    private static INSTANCE: MatchServices;

    async createMatch(body: ICreateMatchRequest) {
        const data = await request.post<IGetListMatchsResponse>("/matchs", body);

        const dateTime = new Date(data.data.dateTime);
        dateTime.setHours(dateTime.getHours() + 3);

        const hour = dayjs(dateTime).format("HH:mm");
        const date = dayjs(dateTime).format("DD/MM/YYYY");

        console.log("Data", data)

        return {...data.data, hour, date};
    }

    async getMatchs(body: IGetListMatchsRequest) {
        const data = await request.post<IGetListMatchsResponse[]>("/matchs/list", body);

        const dataFormmated = data.data.map(match => {
            const dateTime = new Date(match.dateTime);
            dateTime.setHours(dateTime.getHours() + 3);

            const hour = dayjs(dateTime).format("HH:mm");
            const date = dayjs(dateTime).format("DD/MM/YYYY");

            return { ...match, date, hour}
        })

        console.log("DataFormated", dataFormmated)

        return dataFormmated
    }

    async getMatch({ idMatch, idOrganization }: IGetMatchRequest) {
        const data = await request.get<IGetListMatchsResponse>(`/organizations/${idOrganization}/matchs/${idMatch}`);

        const dateTime = new Date(data.data.dateTime);
        dateTime.setHours(dateTime.getHours() + 3);

        const hour = dayjs(dateTime).format("HH:mm");
        const date = dayjs(dateTime).format("DD/MM/YYYY");
  

        const dataFormatted = {
            ...data.data,
            hour,
            date
        }

        return dataFormatted;

    }

    async cancelMatch(body: ICancelMatchRequest) {
        const data = await request.put("/matchs", body);

        return data;
    }

    async finishMatch(body: IFinishMatchRequest) {
        const data = await request.put("/matchs/finish", body);

        return data;
    }

    async generateCodeMatch(body: IGenerateCodeMatchRequest) {
        const data = await request.post("/matchs/generate/code", body);

        return data;
    }

    static getInstance() {
        if (!this.INSTANCE) this.INSTANCE = new MatchServices();
        return this.INSTANCE
    }
}