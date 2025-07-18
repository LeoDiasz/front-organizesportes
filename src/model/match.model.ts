import type { Guest, Organization } from "../store/userStore";


export interface IListMatchFormattedResponse {
    id: string;
    local: string;
    date: string;
    hour: string;
    duration: number;
    modality: string;
    guests?: Guest[];
    dateTime: string;
    numberMaxPlayers: number;
    numberMinPlayers: number;
    inviteCode?: string;
    numberPlayers: number;
    idOrganization: string;
    status: string;
}

export interface IGetListMatchsResponse {
    id: string;
    duration: number;
    guests?: Guest[];
    organization?: Organization;
    idOrganization: string,
    inviteCode?: string;
    local: string;
    modality: string;
    numberMaxPlayers: number;
    numberMinPlayers: number;
    numberPlayers: number;
    status: string;
    dateTime: string;
}