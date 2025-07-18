import { FormControl, TextField } from "@mui/material";
import { forwardRef, type ReactElement, type Ref } from "react";
import { useMask } from "@react-input/mask";

interface IAppInputProps<IForm> {
  name: string;
  label: string;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  setValue: (name: keyof IForm, value: any, options: any) => void;
  getValues: (name: keyof IForm) => any;
  maxLength?: number | undefined;
  isMaskPhone?: boolean;
}

type CompRef = Ref<HTMLSelectElement>;

const AppInput = function <IForm>({
  setValue,
  getValues,
  errorMessage,
  isMaskPhone,
  ...props
}: IAppInputProps<IForm>) {

  const inputRef = useMask({ mask: '(00) 00000-0000', replacement: { '0': /\d/ } });

  return (
    <FormControl sx={{width: "100%"}}>
      <TextField
        {...props}
        data-testid={props.name}
        value={getValues(props.name as keyof IForm)}
        autoComplete="off"
        error={errorMessage ? true : false}
        helperText={errorMessage}
        inputRef={isMaskPhone ? inputRef : undefined}
        onChange={(event: any) => {
          setValue(props.name as keyof IForm, event.target.value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }
        }
      />
    </FormControl>
  );
};

export default forwardRef(AppInput) as <IForm>(
  p: IAppInputProps<IForm> & { ref?: CompRef }
) => ReactElement;
