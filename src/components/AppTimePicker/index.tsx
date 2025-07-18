import { Box, Typography } from "@mui/material";
import { forwardRef, type ReactElement, type Ref } from "react";
import styles from "./styles.module.scss"
import { TimePicker } from "@mui/x-date-pickers";

interface IAppInputProps<IForm> {
  name: string;
  label: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  setValue: (name: keyof IForm, value: any, options: any) => void;
  getValues: (name: keyof IForm) => any;
  maxLength?: number | undefined;
}

type CompRef = Ref<HTMLSelectElement>;

const AppDatePicker = function <IForm>({
  setValue,
  getValues,
  errorMessage,
  ...props
}: IAppInputProps<IForm>) {
  return (
    <Box className={styles.boxInput} >
      <TimePicker
        {...props}
        value={getValues(props.name as keyof IForm)}
        format="HH:mm"
        onChange={(event: any) => {
          setValue(props.name as keyof IForm, event.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }}
      />
      {errorMessage && <Typography variant="body2" sx={{color: "red"}}>{errorMessage}</Typography>}
    </Box>
  );
};

export default forwardRef(AppDatePicker) as <IForm>(
  p: IAppInputProps<IForm> & { ref?: CompRef }
) => ReactElement;
