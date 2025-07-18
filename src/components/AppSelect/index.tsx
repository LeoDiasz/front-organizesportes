import { Box, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { forwardRef, type ReactElement, type Ref } from "react";
import styles from "./styles.module.scss";

interface IAppSelectProps<IForm> {
  name: string;
  label: string;
  data?: { label?: string; value?: any }[];
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  setValue: (name: keyof IForm, value: any, options: any) => void;
  getValues: (name: keyof IForm) => any;
}

type CompRef = Ref<HTMLSelectElement>;

const AppSelect = function <IForm>({
  setValue,
  getValues,
  errorMessage,
  data,
  label,
  ...props
}: IAppSelectProps<IForm>) {

  return (
    <Box className={styles.boxSelect}>
      <InputLabel sx={{marginBottom: "0.4rem"}}>{label}</InputLabel>
      <Select
        {...props}
        data-testid={props.name}
        defaultValue={data && data[0].value}
        value={getValues(props.name as keyof IForm)}
        onChange={(event: any) => {
          setValue(props.name as keyof IForm, event.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })}
        }
      >
        {data &&
          data.map((item) => (
            <MenuItem value={item.value}>{item.label}</MenuItem>
          ))}
      </Select>
      {errorMessage && (
        <Typography variant="body2" fontSize={"0.75rem"} color="error" textAlign="start">
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default forwardRef(AppSelect) as <IForm>(
  p: IAppSelectProps<IForm> & { ref?: CompRef }
) => ReactElement;
