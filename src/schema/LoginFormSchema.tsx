// LoginFormSchema.js
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

// Define the schema creation function
export const createLoginFormSchema = (t) => {
  return Yup.object({
    MobileNo: Yup.string()
      .required(t("toastMessage.Mobile Number is required field"))
      .matches(
        /^\s*\S[\s\S]*$/,
        t("toastMessage.Mobile Number cannot contain only blankspaces")
      )
      .matches(
        /^(\+\d{1,3}[- ]?)?\d{10}$/,
        t("toastMessage.Invalid mobile number, must be 10 digits")
      ),
  }).required();
};

// Define a hook to use the schema in a React component
export const useLoginFormSchema = () => {
  const { t } = useTranslation();
  return createLoginFormSchema(t);
};
