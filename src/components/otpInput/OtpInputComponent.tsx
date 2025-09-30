import { Grid, TextField, Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import OtpStyles from "./otpInputStyles.module.scss";
import { useTranslation } from 'react-i18next';

interface otpComponentProps {
    numInputs: number;
    setOtp: (d: any) => void;
    otp: any;
}
let combinedOtp;
const OtpInputComponent = (props: any) => {
    const { numInputs = 6, setOtp, otp } = props;
    const inputRefs: any = useRef([]);
    const {t} = useTranslation();

    // const handleClick = (index) => {
    //     console.log(inputRefs.current[index - 1], "ll");
    //     if (index > 0 && inputRefs.current[index - 1] && inputRefs.current) {
    //         inputRefs.current[otp.indexOf("")].focus();
    //     }
    // };

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;
        const newOtp = [...otp];
        const elIndex = newOtp.findIndex((i) => i?.trim() === "");
        if (elIndex > -1) {
            newOtp[elIndex] = value.substring(value.length - 1);
            inputRefs.current[elIndex].value = value.substring(value.length - 1);
            setOtp(newOtp);
        }
        combinedOtp = newOtp.join("");
        if (value && index < numInputs - 1 && elIndex > -1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleBackspace = index => {
        if (index > 0) {
            setOtp(prevOTP => {
                const newOTP = [...prevOTP];
                newOTP.splice(index, 1);
                return newOTP.join('');
            });
            if (!otp[index] && inputRefs.current[index].value === "") inputRefs.current[index - 1].focus();
        } else if (index === 0) {
            setOtp(prevOTP => {
                const newOTP = [...prevOTP];
                newOTP[0] = '';
                return newOTP.join('');
            });
        }
    };

    return (
        <>
            <Grid container display="flex" spacing={2} justifyContent="center" sx={{ mt: "10px" }}>
                {Array(numInputs).fill("").map((_, index) => (
                    <Grid item>
                        <TextField
                            key={index}
                            className={`hideNumberSpin ${OtpStyles.otpInput}`}
                            autoFocus={index === 0 && true}
                            type='number'
                            inputRef={ref => (inputRefs.current[index] = ref)}
                            // onClick={() => handleClick(index)}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => e.key === "Backspace" && handleBackspace(index)}
                            onInput={(e: any) => {
                                e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 1)
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
            <div className=' justify-content-end d-flex'>
                <Button className='text-primary text-capitalize'>{t("General.Resend otp")}</Button>
            </div>
        </>
    )
}

export default OtpInputComponent;
