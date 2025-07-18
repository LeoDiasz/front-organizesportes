

export const modalityOptions = [{
    label: "Selecione...",
    value: "Selecione..."
}, {
    label: "Vôlei",
    value: "Vôlei",
}, {
    label: "Futebol Society",
    value: "Futebol Society"
}, {
    label: "Futebol Campo",
    value: "Futebol Campo"
}];

export const filterStatusOptions = [
    {
        label: "Todas",
        value: "Todas"
    },
    {
        label: "Cancelada",
        value: "Cancelada"
    },
    {
        label: "Agendada",
        value: "Agendada",
    },
    {
        label: "Finalizada",
        value: "Finalizada"
    }
]

export const durationOptions =
    [{
        label: "Selecione...",
        value: "Selecione..."
    }, {
        label: "1 Hora",
        value: "1",
    }, {
        label: "2 Horas",
        value: "2"
    }, {
        label: "3 Horas",
        value: "3"
    }, {
        label: "4 Horas",
        value: "4"
    }, {
        label: "5 Horas",
        value: "5"
    }];

export const switchStatus = (status: string) => {

    switch (status) {
        case "Cancelada":
            return "default";
        case "Agendada":
            return "secondary";
        case "Finalizada":
            return "primary"
    }
}