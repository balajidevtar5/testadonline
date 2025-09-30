import { message } from 'antd';
import { contactTypesEnum } from '../../../libs/constant';
import { verifyPostOtp } from '../../../redux/services/post.api';
import { getData } from '../../../utils/localstorage';

interface VerificationSubmitProps {
    selectedOption: number;
    watchField: any;
    otpValues: string[];
    formValues: any;
    firstInputRef: React.RefObject<HTMLInputElement>;
    onSubmit: (values: any) => Promise<boolean>;
    setIsNewMobileNumVerified: (value: boolean) => void;
    setShowOtpComponent: (value: boolean) => void;
    setOtpValues: (values: string[]) => void;
}

export const handleVerificationSubmit = async ({
    selectedOption,
    watchField,
    otpValues,
    formValues,
    firstInputRef,
    onSubmit,
    setIsNewMobileNumVerified,
    setShowOtpComponent,
    setOtpValues
}: VerificationSubmitProps) => {
    try {
        let payload;
        const languageId = await getData("i18nextLng") || 2;

        if (selectedOption === contactTypesEnum.EMAIL) {
            payload = {
                "Email": watchField.Email,
                "Otp": otpValues.join(''),
                LanguageId: languageId
            };
        } else if (selectedOption === contactTypesEnum.TELEGRAM) {
            payload = {
                "MobileNo": watchField?.TelegramNo,
                "Otp": otpValues.join(''),
                LanguageId: languageId
            };
        } else if (selectedOption === contactTypesEnum.PHONEWHATSAPP) {
            payload = {
                "MobileNo": watchField?.WhatsappNo,
                "Otp": otpValues.join(''),
                LanguageId: languageId
            };
        } else {
            payload = {
                "MobileNo": watchField?.MobileNo,
                "Otp": otpValues.join(''),
                LanguageId: languageId
            };
        }

        const resp = await verifyPostOtp(payload);
        if (resp.success) {
            await onSubmit(formValues);
            setIsNewMobileNumVerified(true);
            setShowOtpComponent(false);
            setOtpValues(["", "", "", "", "", ""]);
        } else {
            message.error(resp.message);
            setOtpValues(["", "", "", "", "", ""]);
            firstInputRef.current?.focus();
        }
    } catch (error) {
        console.error('Verification submit error:', error);
        message.error('An error occurred during verification');
    }
}; 