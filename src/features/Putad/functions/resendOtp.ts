import { message } from 'antd';
import { contactTypesEnum } from '../../../libs/constant';
import { AddNewMobileNumber } from '../../../redux/services/post.api';

export interface ResendOtpProps {
    selectedOption: number;
    watchField: any;
    setElapsedTime: (time: number) => void;
    setSeconds: (seconds: number) => void;
    setMinutes: (minutes: number) => void;
}

export const handleResendOtp = async ({
    selectedOption,
    watchField,
    setElapsedTime,
    setSeconds,
    setMinutes
}: ResendOtpProps) => {
    try {
        let payload;
        if (selectedOption === contactTypesEnum.EMAIL) {
            payload = {
                Email: watchField.Email,
                ISWhatsapp: false,
                IsMobile: false
            };
        } else if (selectedOption === contactTypesEnum.PHONEWHATSAPP) {
            payload = {
                MobileNo: watchField.WhatsappNo,
                ISWhatsapp: true,
                IsMobile: false
            };
        } else if (selectedOption === contactTypesEnum.PHONE) {
            payload = {
                MobileNo: watchField.WhatsappNo,
                ISWhatsapp: false,
                IsMobile: true
            };
        } else if (selectedOption === contactTypesEnum.TELEGRAM) {
            payload = {
                MobileNo: watchField.TelegramNo,
                ISWhatsapp: false,
                IsMobile: true
            }
        } else if (selectedOption === contactTypesEnum.WHATSAPP) {
            payload = {
                MobileNo: watchField.WhatsappNo,
                ISWhatsapp: true,
                IsMobile: false
            }
        } else {
            payload = {
                MobileNo: watchField.MobileNo,
                ISWhatsapp: watchField.messageType === "WhatsApp" ? true : false,
                IsMobile: watchField.messageType === null ? true : false
            };
        }
        const response = await AddNewMobileNumber(payload);
        if (response?.success) {
            message.success(response.message)
        } else {
            message.error(response.message);
        }
        setElapsedTime(0);
        setSeconds(59);
        setMinutes(0);
    } catch (e) {
    }
}; 