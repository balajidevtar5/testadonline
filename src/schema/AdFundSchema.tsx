import * as Yup from "yup";

export const AdFundSchema = Yup.object({
    Amount: Yup.number().typeError("Amount must be a number")
        .min(0, "Amount must be greater than 50").required("Amount is required field").nullable()
}).required();