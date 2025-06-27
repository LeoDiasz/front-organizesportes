import { Button, Container, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import styles from "./styles.module.scss";
import AppInput from "../../components/AppInput";
import AppSelect from "../../components/AppSelect";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import logoPng from "../../assets/logo.png";
import { REQUIRED_MSG } from "../../constants";
import { OrganizationService } from "../../services/organization.service";

interface IForm {
    name: string;
    modality: string;
}

export const validationSchemaCreate = yup.object({
  name: yup.string().required(REQUIRED_MSG),
  modality: yup.string().required(REQUIRED_MSG),
});
 
export const CreateOrganization = () => {

    const organizationService = OrganizationService.getInstance();

    const { handleSubmit, register, setValue, getValues, formState: { errors } } = useForm<IForm>({mode: "all", resolver: yupResolver(validationSchemaCreate)})

    const onSubmit = handleSubmit(async () => {


    })


    const modalityOptions = [{
        label: "Vôlei",
        value: "Vôlei",
    }, {
        label: "Futebol",
        value: "Futebol"
    }]

    return (
        <Container maxWidth="md" className={styles.containerLogin}>
            <img src={logoPng} style={{width: "120px"}} />
            <form onSubmit={onSubmit} className={styles.form}>
                <div>
                    <Typography variant="h6" sx={{ color: "#03588C", fontWeight: "bold" }}>
                        Crie sua Organização
                    </Typography>
                </div>
                <div className={styles.divInputs}>
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
                    
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ backgroundColor: "#FDBF00", fontWeight: "bold" }}
                >
                    Criar
                </Button>
            </form>
        </Container>
    )
}