import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import toast from "react-hot-toast";
import { Alert, Box, Button, CircularProgress, Stack, Typography, useMediaQuery } from "@mui/material"
import { AppContainer } from "../../components/AppContainer"
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import { useForm } from "react-hook-form";
import { useUserStore } from "../../store/userStore";
import { OrganizationService } from "../../services/organization.service";
import { GuestServices } from "../../services/guest.service";
import PersonIcon from '@mui/icons-material/Person';
import logoPng from "../../assets/logo.png";
import theme from "../../theme";
import { futebolOptions, voleiOptions } from "../../utils/guest.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemaCreateGuest } from "../../utils/validationSchemas";

export const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    width: "100%",
    bgcolor: 'background.paper',
    border: '2px solid primary',
    boxShadow: 24,
    p: 4,
};

export interface IForm {
    name: string;
    email: string;
    phoneNumber: string;
    preferencePosition: string;
}

export const InviteMatch = () => {
    const { inviteCode } = useParams();
    const [toggleCreateGuest, setToggleCreateGuest] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [messageError, setMessageError] = useState("");
    const { setIsLoading, isLoading, match, organization, setMatch, setOrganization } = useUserStore();
    const { register, reset, handleSubmit, setValue, getValues, formState: { errors, isValid } } = useForm<IForm>({ mode: "all", resolver: yupResolver(validationSchemaCreateGuest) });
    const organizationServices = OrganizationService.getInstance();
    const guestServices = GuestServices.getInstance();


    useEffect(() => {
        if (inviteCode) {
            setIsLoading(true);

            organizationServices.getOrganizationAndMatchWithCode({ inviteCode }).then(response => {
                if (response.organization) {
                    setOrganization(response.organization);

                }
                const matchResult = { ...response }
                setMatch(matchResult)
            }).catch(err => {
                const errorMessage = err.response.data.error || 'Não foi possivel se cadastrar na partida';
                const errorMessageReplace = errorMessage.replace("Error:", "")
                toast.error(errorMessageReplace);
                setMessageError(errorMessageReplace)

            })
                .finally(() => setIsLoading(false));
        } else {
            setMessageError("Sem Dados aqui")
        }
    }, [toggleCreateGuest])


    const onSubmit = handleSubmit(async () => {
        if (organization && match) {
            setIsLoading(true);
            const body = {
                email: getValues().email,
                name: getValues().name,
                phoneNumber: getValues().phoneNumber,
                preferencePosition: getValues().preferencePosition,
                idOrganization: organization.id,
                matchId: match.id,
            }

            guestServices.createGuest(body).then(() => {
                reset({ email: "", phoneNumber: "", name: "", preferencePosition: "" });
                toast.success("cadastro na partida realizado com sucesso!");
                setToggleCreateGuest(!toggleCreateGuest);
                setMatch(null);

            }).catch(err => {
                const errorMessage = err.response.data.error || 'Não foi possivel se cadastrar na partida';
                const errorMessageReplace = errorMessage.replace("Error:", "")
                toast.error(errorMessageReplace);
            }).finally(() => {
                reset({ email: "", phoneNumber: "", name: "", preferencePosition: "" });
                setIsLoading(false);
            })
        }
    })

    
    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <AppContainer>
            <Box sx={{
                ...style, "@media (max-width:700px)": {
                    maxWidth: 500
                }
            }}>
                {match ? (
                    <Stack padding="0 1rem">
                        <Stack padding="1rem 0" direction={isMobile ? "column-reverse" : "row"} alignItems="center" justifyContent="space-between">
                            <Stack textAlign={isMobile ? "center" : "start"}>
                                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color="primary" >Organização {organization?.name}</Typography>
                                <Typography variant="body1" fontWeight="bold" color="textSecondary" >Partida de {match.modality}</Typography>
                            </Stack>
                            <img src={logoPng} style={{ width: "150px", alignSelf: "center" }} />

                        </Stack>
                        <Stack sx={{ marginTop: "0.2rem", marginBottom: "1rem", textAlign: isMobile ? "center" : "start" }} gap="rem">
                            <Typography variant="body2" color="textSecondary" fontWeight="bold">Data e Hora: {`${match.date} as ${match.hour} - duração: ${match.duration} ${match.duration > 1 ? "horas " : "hora"}`}</Typography>
                            <Box sx={{ display: "flex", alignItems: 'center', gap: "0.3rem", justifyContent: isMobile ? "center" : "flex-start" }}>
                                <Typography variant="body2" color="textSecondary" fontWeight="bold">Jogadores: {`${match.numberPlayers} de ${match.numberMaxPlayers}`}</Typography>
                                <PersonIcon color="primary" />
                            </Box>
                        </Stack>
                        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={onSubmit}>
                            <>
                                <AppInput<IForm>
                                    {...register("name")}
                                    label="Nome"
                                    getValues={getValues}
                                    setValue={setValue}
                                    errorMessage={errors.name?.message}
                                    required
                                />
                                <AppInput<IForm>
                                    {...register("email")}
                                    label="E-mail"
                                    getValues={getValues}
                                    setValue={setValue}
                                    errorMessage={errors.email?.message}
                                    required
                                />
                                <AppInput<IForm>
                                    {...register("phoneNumber")}
                                    label="Telefone"
                                    getValues={getValues}
                                    setValue={setValue}
                                    errorMessage={errors.phoneNumber?.message}
                                    isMaskPhone
                                    required
                                />
                                <AppSelect<IForm>
                                    {...register("preferencePosition")}
                                    label="Posição de preferência"
                                    getValues={getValues}
                                    setValue={setValue}
                                    data={match.modality === "Vôlei" ? [{ label: "Selecione...", value: "Selecione..." }, ...voleiOptions] : [{ label: "Selecione...", value: "Selecione..." }, ...futebolOptions]}
                                    errorMessage={errors.preferencePosition?.message}
                                    required
                                />
                                <Button type="submit" variant="contained" color="secondary" size="large" sx={{ color: "#f2f2f2", fontWeight: "bold", marginTop: "1rem" }} disabled={!isValid}>Cadastrar</Button>
                            </>
                        </form>
                    </Stack>
                ) : (
                    <Alert color="info">{messageError}</Alert>
                )}
            </Box>

        </AppContainer>
    )
}