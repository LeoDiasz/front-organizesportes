
export const PAGE = {
    LOGIN: () => "/",
    HOME: () => "/home",
    CREATE_ORGANIZATION: () => "/organizacao/cadastrar",
    CREATE_MATCH: () => "/partidas/cadastrar",
    DETAILS_MATCH: () => `/partidas/:id`,
    INVITE_MATCH: () => "/partidas/convite/:inviteCode",
    LIST_MATCHS: () => "/partidas/listagem",
    CREATE_GUEST: () => "/convidado/cadastrar"
}

export const REQUIRED_MSG = "Campo Obrigatório";
export const MAX_MSG = "Maximo 100";
export const MIN_MSG = "Minimo 1";