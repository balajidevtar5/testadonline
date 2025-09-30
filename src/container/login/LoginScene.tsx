import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import AdOnlineLogo from "../../assets/images/adOnlineLogo.png";

import InputField from '../../components/formField/FormFieldComponent';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { LayoutContext } from '../../components/layout/LayoutContext';
import { colorMap } from '../../libs/constant';



interface LoginSceneProps {
    handleSubmit?: (data: any) => () => void;
    handleVerificationSubmit?: (data: any) => void;
    handleResendOtp?: () => void;
    onSubmit?: (d: any) => void;
    register?: any,
    control?: any,
    formState?: any,
    loginState?: any,
    firstInputRef?: any,
    setOtp?: (d: any) => void,
    otp?: any,
    showOtpComponent?: boolean
    seconds?: number;
    minutes?: number;
    step?: number,
    setMessageType?: (d: string) => void,
    elapsedTime?: any,
    defaultMessageType?: string,
    messageType?: string,
    setStep?: (d: number) => void;
    handleOtpInputChange?: (index: any, value: any) => void,
    handleBackspace?: (index: any) => void,
    inputRefs?: any,
    otpValues?: any
    mode?: any,
    watchField?: any,
    setValue?: any,
    setShowOtpComponent?: (d: boolean) => void
    setMobileCheck?: (d: boolean) => void
    SHOW_WHATSAPP_OTP_OPTION?: boolean
    handleCloseDialog?: () => void,
    handleOk?: () => void,
    handlePaste?: (e: any, index: any) => void
}
const LoginComponent: any = ({ RenderInput, loginState, form, step, setStep, mode, setShowOtpComponent, setMobileCheck, handleCloseDialog, handleOk }) => {
    const { t } = useTranslation()
    const { isDarkMode } = useContext(LayoutContext);

    
    return (
        // <Grid container component="main" justifyContent="space-between" >
        <Grid container component="main" justifyContent="space-between" sx={{ p: "25px" }}>
            {/* <Grid
                item
                sx={{ display: { sm: "none", md: "flex" } }}
                xs={false}
                
                md={7}
                lg={6}
                justifyContent="flex-start"
            >
                <img src={loginPageImage} alt="loginPageImage" width="100%" height="100%" style={{ background: "rgb(249 249 249)" }} />
            </Grid> */}
            <Grid
                item
                xs={12}
                md={12}
                lg={12}
                textAlign="center"
                justifyContent="center" display="flex" alignItems="center"

            // className="box-shadow-loginPage"
            >
                <Box style={mode === "FromPost" ? { width: "389px" } : {}}>
                    <Typography component="h1" variant="h4" sx={{ mb: "20px" }}>
                        {/* AdOnline */}
                        <img src={AdOnlineLogo} width={200} />
                    </Typography>
                    <Typography style={{color:isDarkMode && colorMap.white}}> {mode === "FromPost" ? null : t("General.loginpopupmessage")}  </Typography>
                    <Grid item lg={12} sx={{ mt: "20px" }}>
                        {RenderInput}

                        <Grid lg={12} className={`d-flex ${form === "otpForm" ? 'justify-content-between' : 'justify-content-end'} align-items-center gap border-t footer-dialog mt-20 pt-10`}>
                            {form === "otpForm" && (
                                <div className='  cursor-pointer pt-10'>
                                    {
                                        mode === "FromPost" ?
                                            <Button variant="contained" className="font-semibold w-100 close-btn" onClick={() => { setShowOtpComponent(false); setMobileCheck(false) }}  >{t("General.GO BACK")}</Button> :
                                            <Button variant="contained" onClick={() => setStep(step - 1)} className="font-semibold w-100 close-btn"
                                            >{t("General.GO BACK")}</Button>
                                    }
                                </div>
                            )}
                            <div className='d-flex justify-content-end Loginsubmitbtn gap pt-10 loginfooter'>
                                {
                                    step === 1 ?
                                        <Button onClick={handleCloseDialog} className="font-semibold w-100 close-btn" type="reset" variant="contained">
                                            {t("General.Cancel")}
                                        </Button> :
                                        <Button onClick={() => { setShowOtpComponent(false); handleOk() }} className="font-semibold w-100 close-btn" type="reset" variant="contained">
                                            {t("General.Cancel")}
                                        </Button>
                                }
                                {
                                    step === 1 ?
                                        <Button className="font-semibold  w-100" type="submit" form={form} variant="contained">
                                            {loginState?.isLoading ? <CircularProgress size={20} color="inherit" /> : t("Send Code")}
                                        </Button> :
                                        <Button className="font-semibold  w-100" type="submit" form={form} variant="contained">
                                            {loginState?.isLoading ? <CircularProgress size={20} color="inherit" /> : t("Submit")}
                                        </Button>
                                }
                               
                            </div>

                        </Grid>

                    </Grid>
                </Box>
            </Grid>
        </Grid>
    )
}
const LoginScene = (props: LoginSceneProps) => {
   
    const { handleSubmit, onSubmit, register, control, formState, loginState, setOtp, otp, showOtpComponent,
        firstInputRef, seconds, minutes, otpValues, elapsedTime, handleOtpInputChange, inputRefs, handleVerificationSubmit, messageType, setMessageType,
        step, setStep, handleResendOtp, handleBackspace, mode, setValue, setShowOtpComponent, setMobileCheck, SHOW_WHATSAPP_OTP_OPTION, defaultMessageType,
        handleCloseDialog, handleOk,handlePaste } = props;
        const  { isDarkMode } = useContext(LayoutContext);
        const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");
        

    useEffect(() => {
        setValue('Text');// Reset the messageType field value to an empty string
    }, [setValue]);


    // const isBrowserSupport = () => globalThis.OTPCredential;

    // console.log("isBrowserSupport",isBrowserSupport);
    
    // useEffect(() => {
    //     // Only run if the Web OTP API is supported
    //     navigator.credentials.get({
    //         otp: { transport: ['sms'] },
    //       })
    //       .then((otp) => {
    //         const { code } = otp; 
    //         console.log(code); // Provide OTP you got in your sms
    //       })
    //       .catch((error) => console.log('ERROR'));
    //   }, []); 

   

    const { t } = useTranslation()
    return (
        <>
            {step === 1 && (
                <form id="LoginForm" onSubmit={handleSubmit(onSubmit)}>
                    <LoginComponent RenderInput={
                        <>
                                                
                                                <Grid container spacing={1} >
                                {/* Country Code Box */}
                                <Grid item xs={2}>
                                <div
                                    style={{
                                        padding: "0.5rem",
                                        backgroundColor: selectedColor, // Light gray background
                                        border: "1px solid #ff8c00",  // Border to match InputField
                                        borderRadius: "4px",
                                        textAlign: "center",
                                        pointerEvents: "none",    // Makes it uneditable
                                        
                                    }}
                                >
                                    +91
                                </div>
                               </Grid>
                               <Grid item xs={10}>
                                <InputField
                                    {...{
                                        register,
                                        control,
                                        formState,
                                        id: "MobileNo",
                                        name: "MobileNo",
                                        autoFocus: true,
                                        type: "text", // Use "text" to allow complete flexibility
                                        className: "hideNumberSpin",
                                        placeholder: t("General.Enter your mobile number"),
                                        label: t("General.Mobile number*"),
                                        mode: mode,
                                        autoComplete: "on",
                                        style: {
                                            backgroundColor: isDarkMode ? "#242424" : "#fff",
                                            color: isDarkMode ? "#fff" : "#000",
                                            borderColor: isDarkMode ? "#555" : "#ccc",
                                            WebkitTextFillColor: isDarkMode ? "#fff" : "#000", // Ensure text color is white in dark mode
                                            transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                                        },
                                        onInput: (e) => {
                                            let rawValue = e.target.value.replace(/\s+/g, '');  // Remove spaces
                                            let sanitizedValue = rawValue.replace(/\D/g, ''); // Remove non-numeric characters except `+`

                                            // If the input starts with '+91' or '91', strip those out
                                            if (sanitizedValue.length > 10) {
                                            if (sanitizedValue.startsWith('91')) {
                                                sanitizedValue = sanitizedValue.substring(2); // Remove the '91' prefix
                                            } else if (sanitizedValue.startsWith('+91')) {
                                                sanitizedValue = sanitizedValue.substring(3); // Remove the '+91' prefix
                                            }
                                        }

                                        const isRepeatedPattern = (num) => {
                                            if (num.length !== 10) return false;
                                            return /^(\d\d)\1{4}$/.test(num);
                                        };
                                        if (isRepeatedPattern(sanitizedValue)) {
                                            sanitizedValue = "";
                                            message.warning(t("toastMessage.InvalidMobileNo"));
                                        }
                                            // Limit the number of digits to 10 (or less if the input is shorter)
                                            e.target.value = sanitizedValue.slice(0, 10);

                                            // Update state with the sanitized value (no '+91' or '91' prefixes)
                                            if (register) {
                                                register("MobileNo").onChange({
                                                    target: { name: "MobileNo", value: sanitizedValue.slice(0, 10) },
                                                });
                                            }
                                        },
                                    }}
                                />
                                </Grid>
                            </Grid>

                            {SHOW_WHATSAPP_OTP_OPTION && (
                                <FormControl className='mt-20 w-100'>
                                    <div className='' style={{ fontSize: "16px", textAlign: "left", color: "#898989" }}>
                                        {t("General.where do you want to receive otp?")}
                                    </div>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="messageType"
                                        {...register('messageType')}
                                        defaultValue={messageType}
                                        onChange={(e) => { setMessageType(e.target.value) }}
                                    >
                                        <FormControlLabel value="Whatsapp" control={<Radio />} label={t("General.WhatsApp")} />
                                        <FormControlLabel value="sms" control={<Radio />} label={t("General.SMS")} />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        </>
                    }
                        form="LoginForm" loginState={loginState} step={step} setStep={setStep} handleCloseDialog={handleCloseDialog} />
                </form>
            )}
            {step === 2 && showOtpComponent === true && (
                <form id="otpForm" onSubmit={handleSubmit(handleVerificationSubmit)}>
                    <LoginComponent mode={mode} setShowOtpComponent={setShowOtpComponent} setMobileCheck={setMobileCheck} RenderInput={
                        <>
                            <div className='otp-input-container hideNumberSpin' >
                                {otpValues.map((value, index) => (
                                    <input
                                        key={index}
                                        type="number"
                                        className="otp-input hideNumberSpin"
                                        style={{ textAlign: "center" }}
                                        value={value}
                                        autoFocus={index === 0}
                                        autoComplete="one-time-code"
                                        pattern="\d{6}"
                                        onChange={(e) => {
                                            // Allow only numbers, dot (.), and minus (-)
                                            const newValue = e.target.value.replace(/[^\d.-]/g, "");
                                            handleOtpInputChange(index, newValue);
                                        }}
                                        onPaste={(e) => handlePaste(e, index)} 
                                        onKeyDown={(e) => e.key === "Backspace" && handleBackspace(index)}
                                        ref={(inputRef) => {
                                            if (index === 0) {
                                                firstInputRef.current = inputRef;
                                            }
                                            inputRefs.current[index] = inputRef;
                                        }}
                                    />
                                ))}
                            </div>
                            <div className='justify-content-end d-flex cursor-pointer'>
                                <Button className={`text-primary text-capitalize`}
                                    style={elapsedTime < 120 ? { opacity: "0.5", pointerEvents: "none" } : { opacity: "1" }}
                                    disabled={elapsedTime < 120}
                                    // ${minutes > 3 && "btn-disable"}'`} disabled={minutes > 3}
                                    onClick={() => handleResendOtp()}>
                                    <u>{t("General.Resend otp")}</u></Button>
                            </div>
                            <Typography  className={`${isDarkMode && "text-white"} mt-10 mb-10 text-center font-13`} >
                                {t("General.We've sent an otp to entered mobile number")}<br />
                                {t("General.This code will expire in")} {" "}
                                <span style={{ fontWeight: 600 }}>{minutes < 10 ? `0${minutes}` : minutes}</span>:
                                <span style={{ fontWeight: 600 }}>{seconds < 10 ? `0${seconds}` : seconds}</span>{" "}
                                {("minutes.")}
                            </Typography>
                        </>
                    } form="otpForm"
                        step={step}
                        setStep={setStep} handleOk={handleOk} />
                </form>)}
        </>
    )
}
export default LoginScene