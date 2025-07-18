import { Box, Button, Typography } from "@mui/material"
import { AppContainer } from "../../components/AppContainer"
import Header from "../../components/Header"
import AppInput from "../../components/AppInput";
import { useForm } from "react-hook-form";
import AppSelect from "../../components/AppSelect";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./styles.module.scss";
import { MatchServices } from "../../services/match.service";
import toast from "react-hot-toast";
import * as yup from "yup";
import { useUserStore } from "../../store/userStore";
import { AppContent } from "../../components/AppContent";
import { AppNavigation } from "../../components/AppNavigation";
import { useNavigate } from "react-router-dom";
import { durationOptions, modalityOptions } from "../../utils/match.utils";
import { REQUIRED_MSG } from "../../constants";
import { yupResolver } from "@hookform/resolvers/yup";

interface IForm {
    local: string;
    date?: string;
    hour?: string;
    duration: string;
    modality: string;
    numberMaxPlayers: number;
    numberMinPlayers: number;
}
const NUMBER_MSG = "Somente número";

export const validationSchemaCreate = yup.object().shape({
  local: yup
    .string()
    .required(REQUIRED_MSG),
  duration: yup
    .string()
    .required(REQUIRED_MSG)
     .notOneOf(
      ['Selecione...'],
      'Por favor, selecione uma duração válida.'
    ),
  modality: yup
    .string()
    .required(REQUIRED_MSG)
    .notOneOf(
      ['Selecione...'],
      'Por favor, selecione uma modalidade válida.'
    ),

  numberMaxPlayers: yup
    .number()
    .required(REQUIRED_MSG)
    .typeError(NUMBER_MSG)
    .min(1, 'Deve haver pelo menos 1 jogador.')
    .test(
      'maxGreaterThanMin',
      'Não pode ser menor que o minímo de jogadores',
      function(maxPlayers) {
        const { numberMinPlayers } = this.parent; 
        if (typeof numberMinPlayers === 'number' && typeof maxPlayers === 'number') {
          return maxPlayers >= numberMinPlayers;
        }
        return true;
      }
    ),
  numberMinPlayers: yup
    .number()
    .typeError(NUMBER_MSG)
    .required(REQUIRED_MSG)
    .min(1, 'Deve haver pelo menos 1 jogador.')
    .test(
      'minLessThanMax',
      'Não pode ser maior que o máximo de jogadores',
      function(minPlayers) {
        const { numberMaxPlayers } = this.parent; 
        if (typeof numberMaxPlayers === 'number' && typeof minPlayers === 'number') {
          return minPlayers <= numberMaxPlayers;
        }
        return true;
      }
    ),
});

export const CreateMatch = () => {
    const { handleSubmit, setValue, getValues, register, formState: { errors, isValid: isValidForm }, reset } = useForm<IForm>({ mode: "all", resolver: yupResolver(validationSchemaCreate),
        defaultValues: { modality: modalityOptions[0].value, duration: durationOptions[0].value } })
    const { organization, setIsLoading, setMatch } = useUserStore();
    const matchServices = MatchServices.getInstance();
    const navigate = useNavigate();
    const [dateMatch, setDateMatch] = useState(dayjs());
    const [hourMatch, setHourMatch] = useState(dayjs());
    const [messageErrorDate, setMessageErrorDate] = useState("");
    const [messageErrorTime, setMessageErrorTime] = useState("")

    const onSubmit = handleSubmit(async () => {
        setIsLoading(true)
        const body = {
            numberMaxPlayers: Number(getValues().numberMaxPlayers),
            numberMinPlayers: Number(getValues().numberMinPlayers),
            modality: getValues().modality,
            duration: Number(getValues().duration),
            hour: hourMatch && hourMatch.format("HH:mm"),
            date: dateMatch && dateMatch.format("DD/MM/YYYY"),
            local: getValues().local,
            organizationId: organization?.id!
        }

        matchServices.createMatch(body).then(response => {
            toast.success("Partida criada com sucesso");
            reset();
            setDateMatch(dayjs());
            setHourMatch(dayjs());
            setMatch(response);
            navigate(`/partidas/${response.id}`)
        }).catch(err => {
            const messageError = err.response.data.error || "Não foi possivel cadastrar a partida."
            const messageErrorReplace = messageError.replace("Error:", "")
            setDateMatch(dayjs());
            setHourMatch(dayjs());
            toast.error(messageErrorReplace);
            reset({ local: "", numberMinPlayers: 14, numberMaxPlayers: 16, modality: "Selecione...", duration: "Selecione..." })
        }).finally(() => setIsLoading(false));

    })

    useEffect(() => {

    }, [reset])


    return (
        <AppContainer>
            <Header />
            <AppContent>
                <Typography variant="h4" color="textSecondary" fontWeight="bold">Criar Partida</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <form onSubmit={onSubmit} style={{ width: "80%", display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
                        <AppInput<IForm>
                            {...register("local")}
                            getValues={getValues}
                            setValue={setValue}
                            label="Local"
                            errorMessage={errors.local?.message}
                            required
                        />
                        <div className={styles.divDatePicker}>
                            <DatePicker
                                label="Data da Partida"
                                value={dateMatch}
                                onChange={(newValue) => {
                                  setDateMatch(newValue!)
                                  setMessageErrorDate("")
                                }} 
                                format="DD/MM/YYYY"
                                minDate={dayjs()}
                                onError={(err) => {
                                  console.log("Error", err)
                                  if(err === "minDate") {
                                    setMessageErrorDate("Data não pode ser anterior a hoje.")
                                  } else if(err === "invalidDate") {
                                    setMessageErrorDate("Data inválida")
                                  } else {
                                    setMessageErrorDate("")
                                  }
                                }}
                                 slotProps={{
                                  textField: {
                                    helperText: messageErrorDate
                                  }
                                }}
                               
                            />
                            <TimePicker
                                label="Hora da Partida"
                                value={hourMatch}
                                onChange={(newValue) => {
                                  console.log("newValue", newValue)
                                  console.log("dayjs", dayjs)
                                  setHourMatch(newValue!)
                           
                                }} 
                                format="HH:mm"
                                minTime={dayjs()}
                                onError={(err) => {
                                   if(err === "minTime") {
                                    setMessageErrorTime("Hora não pode ser anterior ou igual a hora atual.")
                                  } else if(err === "invalidDate") {
                                    setMessageErrorTime("Hora inválida")
                                  } else {
                                    setMessageErrorTime("")
                                  }
                                }}
                                slotProps={{
                                  textField: {
                                    helperText: messageErrorTime
                                  }
                                }}
                             
                            />
                        </div>
                        <AppSelect<IForm>
                            {...register("modality")}
                            label="Modalidade"
                            setValue={setValue}
                            getValues={getValues}
                            errorMessage={errors.modality?.message}
                            data={modalityOptions}
                        />
                        <AppSelect<IForm>
                            {...register("duration")}
                            label="Duração"
                            setValue={setValue}
                            getValues={getValues}
                            errorMessage={errors.duration?.message}
                            data={durationOptions}
                        />
                        <Box sx={{ display: "flex", gap: "20px", width: "100%" }}>
                            <AppInput<IForm>
                                {...register("numberMinPlayers")}
                                getValues={getValues}
                                setValue={setValue}
                                label="Minimo de Jogadores"
                                errorMessage={errors.numberMinPlayers?.message}
                                required
                            />
                            <AppInput<IForm>
                                {...register("numberMaxPlayers")}
                                getValues={getValues}
                                setValue={setValue}
                                label="Máximo de Jogadores"
                                errorMessage={errors.numberMaxPlayers?.message}
                                required
                            />
                        </Box>
                        <Button type="submit" variant="contained" color="secondary" size="large" sx={{ color: "#f2f2f2", fontWeight: "bold", marginTop: "1rem" }} disabled={!isValidForm} >Criar partida</Button>
                    </form>
                </LocalizationProvider>
            </AppContent>
            <AppNavigation />
        </AppContainer>
    )
}