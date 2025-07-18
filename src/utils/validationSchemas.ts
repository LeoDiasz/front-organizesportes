import * as yup from "yup";
import { REQUIRED_MSG } from "../constants";
import { isValidPhone } from "@brazilian-utils/brazilian-utils";


export const validationSchemaCreateOrganization = yup.object().shape({
  name: yup
    .string()
    .required(REQUIRED_MSG)
    .max(25, 'Máximo 25 caracteres')
    .matches(
      /^\D*$/,
   'Não pode conter números'
    ),

  modality: yup
    .string()
    .required(REQUIRED_MSG)
    .notOneOf(
      ['Selecione...'],
      'Por favor, selecione uma modalidade válida.'
    ),
})

export const validationSchemaCreateGuest = yup.object().shape({
    name: yup.string().required(REQUIRED_MSG).max(20, "Maximo 20 caracteres").matches(
        /^[a-zA-Z\s]*$/,
        'O nome não pode conter números e caracteres especiais'
    ),
    email: yup.string().required(REQUIRED_MSG).email("E-mail inválido"),
    phoneNumber: yup.string().required(REQUIRED_MSG).matches(/^\(\d{2}\)\s\d{5}-\d{4}$/, 'Telefone inválido').test(
      'isPhoneValid',
      'Telefone inválido',
      (value) => {
        if (!value) return false;

        const cleanValue = value.replace(/\D/g, '');

        return isValidPhone(cleanValue);
      }
    ),
    preferencePosition: yup.string().required(REQUIRED_MSG).notOneOf(
      ['Selecione...'],
      'Por favor, selecione uma posição válida'
    ),

})
