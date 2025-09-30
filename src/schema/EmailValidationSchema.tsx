import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export const createEmailFormSchema = (t: (key: string) => string) => {
  return Yup.object({
    Email: Yup.string()
      .trim()
      .required(t("toastMessage.email"))
      .matches(/^(?!\s*$)\S+$/, t("toastMessage.Please enter a valid Email address."))
      .matches(/^[^A-Z\s]+$/, t("toastMessage.Email should not contain uppercase letters"))
      .matches(/^(?!.*\.\.)(?!^-)(?!.*@\d+$)(?!.*@-)(?!.*@[-.])[a-z0-9._%+-]{2,}(?<![.-])@[a-z0-9.-]+(?<![-])\.(com|org|net|info|us|uk|de|fr|edu|gov|mil|in|cc|io)$/,
        t("toastMessage.Please enter a valid Email address.")
      )
      .test(
        "valid-local-part",
        t("toastMessage.Please enter a valid Email address."),
        (email) => {
          const local = email?.split("@")[0] || "";
          return !local.startsWith(".") && !local.startsWith("-") && !/^\d+$/.test(local);
        }
      ),
  }).required();
};

// Custom Hook for using the Email validation schema
export const useEmailFormSchema = () => {
  const { t } = useTranslation();
  return createEmailFormSchema(t);
};
