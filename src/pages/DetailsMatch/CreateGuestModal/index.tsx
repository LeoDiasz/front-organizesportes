import { Box, Button, CircularProgress, Modal, Stack, Typography } from "@mui/material"
import { useForm } from "react-hook-form";
import AppInput from "../../../components/AppInput";
import AppSelect from "../../../components/AppSelect";
import { useUserStore } from "../../../store/userStore";
import { useEffect } from "react";
import { GuestServices } from "../../../services/guest.service";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchemaCreateGuest } from "../../../utils/validationSchemas";
import { futebolOptions, voleiOptions } from "../../../utils/guest.utils";


interface ICreateGuestModalProps {
    isOpen: boolean;
    handleClose: () => void;
    fetchMatch: (idMatch: string, idOrganization: string) => void;
}

export interface IForm {
    name: string;
    email: string;
    phoneNumber: string;
    preferencePosition: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    minWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: "8px",
    boxShadow: 24,
    p: 4,
};

export const CreateGuestModal = ({ isOpen, handleClose, fetchMatch }: ICreateGuestModalProps) => {
    const { register, reset, handleSubmit, setValue, getValues, formState: { errors, isValid } } = useForm<IForm>({ mode: "all", resolver: yupResolver(validationSchemaCreateGuest), defaultValues: { preferencePosition: "Selecione..." } });
    const { match, organization, setIsLoading, isLoading } = useUserStore();
    const guestServices = GuestServices.getInstance();

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
                fetchMatch(match.id, organization.id)
                handleClose();

            }).catch(err => {
                const errorMessage = err.response.data.error || 'Não foi possivel se cadastrar na partida';
                const errorMessageReplace = errorMessage.replace("Error:", "")
                toast.error(errorMessageReplace);
            }).finally(() => {
                reset({ email: "", phoneNumber: "", name: "", preferencePosition: "Selecione..." });
                setIsLoading(false);
            })
        }
    })

    useEffect(() => {

    }, [match])

    if (isLoading) {
        return <CircularProgress />
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Box sx={{
                ...style, "@media (max-width:700px)": {
                    minWidth: 400
                }, "@media (max-width:500px)": {
                    minWidth: 300
                }
            }}>
                {match && (
                    <Stack padding="0 1rem">
                        <Typography textAlign="center" variant="h6" color="textSecondary" fontWeight="bold" marginBottom="1rem">Adicionar Jogador</Typography>
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
                                <Button type="submit" variant="contained" color="secondary" size="large" sx={{ color: "#f2f2f2", fontWeight: "bold", marginTop: "1rem" }} disabled={!isValid} >Cadastrar</Button>
                            </>
                        </form>
                    </Stack>
                )}
            </Box>
        </Modal>
    )
}