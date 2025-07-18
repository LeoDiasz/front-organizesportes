import { Box, Button, Stack, Typography } from "@mui/material";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import { AppContainer } from "../../components/AppContainer";
import toast from "react-hot-toast";
import { useUserStore } from "../../store/userStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { PAGE } from "../../constants";
import { OrganizationService } from "../../services/organization.service";
import AddIcon from '@mui/icons-material/Add';
import logoPng from "../../assets/logo.png";
import { modalityOptions } from "../../utils/match.utils";
import { validationSchemaCreateOrganization } from "../../utils/validationSchemas";

interface IForm {
    name: string;
    modality: string;
}

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
    p: "4rem 10px",
};

export const CreateOrganization = () => {
    const { setOrganization, setIsLoading } = useUserStore();
    const navigate = useNavigate();

    const organizationService = OrganizationService.getInstance();

    const { handleSubmit, register, setValue, getValues, reset, formState: { errors } } = 
    useForm<IForm>(
        { mode: "all", 
            defaultValues: {modality: modalityOptions[0].value }, resolver: yupResolver(validationSchemaCreateOrganization) });

    const onSubmit = handleSubmit(async () => {
        setIsLoading(true);
        const body = {
            name: getValues().name,
            modality: getValues().modality,
        }

        organizationService.createOrganization(body).then(response => {
            toast.success("Organização criada com sucesso.");
            setOrganization(response.data);
            navigate(PAGE.HOME());
        }).catch(err => {
            toast.error("Não foi possivel criar sua organização", err);
            reset({modality: modalityOptions[0].value, name: "" });
        }).finally(() => setIsLoading(false));
    })

    return (
        <AppContainer>
            <Box sx={style}>
                <Stack justifyContent="center" alignItems="center"  padding="1rem 0" gap="2rem">
                    <img src={logoPng} style={{ width: "200px" }}/>
                    <Typography variant="h6" sx={{ color: "#03588C", fontWeight: "bold" }}>
                        Crie sua Organização
                    </Typography>
                    <form onSubmit={onSubmit} style={{width: "80%", display: "flex", flexDirection: "column", gap: "1.5rem"}}>
                        <AppInput<IForm>
                            {...register("name")}
                            label="Nome"
                            setValue={setValue}
                            getValues={getValues}
                            errorMessage={errors.name?.message}
                        />
                        <AppSelect<IForm>
                            {...register("modality")}
                            label="Modalidade"
                            setValue={setValue}
                            getValues={getValues}
                            errorMessage={errors.modality?.message}
                            data={modalityOptions}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            color="secondary"
                            sx={{ fontWeight: "bold", color: "whitesmoke", alignSelf: "center", marginTop: "2rem" }}
                            
                        >
                            Criar Organização
                            <AddIcon />
                        </Button>
                    </form>
                </Stack>
            </Box>
        </AppContainer>
    )
}