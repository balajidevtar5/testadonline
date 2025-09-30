// useProfileValidation.js
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

export const useProfileValidation = () => {
  const { t } = useTranslation();

  const ProfileSchema = Yup.object({
    MobileNo: Yup.string()
      .when('$isReferralSourceId', {
        is: 0,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema
          .required(t("toastMessage.Mobile Number is required field"))
          .matches(/^\s*\S[\s\S]*$/, t("toastMessage.Mobile Number cannot contain only blankspaces"))
          .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, t("toastMessage.Invalid mobile number, must be 10 digits"))
      }),

    Firstname: Yup.string()
      .when('$isReferralSourceId', {
        is: 0,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema
          .required(t("toastMessage.First Name is required field"))
          .matches(/^\s*\S[\s\S]*$/, t("toastMessage.First Name cannot contain only blankspaces"))
      }),

    Lastname: Yup.string()
      .when('$isReferralSourceId', {
        is: 0,
        then: (schema) => schema.nullable(),
        otherwise: (schema) => schema
          .required(t("toastMessage.Last Name is required field"))
          .matches(/^\s*\S[\s\S]*$/, t("toastMessage.Last Name cannot contain only blankspaces"))
      }),

    LocationId: Yup.string(),
    referral: Yup.string().max(6, t("toastMessage.ReferralLength")),
  }).required();

  return ProfileSchema;
};
