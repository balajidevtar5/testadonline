import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../redux/reducer";
import { VerificationOtpAPI, resendOtpAPI } from "../../redux/services/auth.api";
import { LoginState, LoginUserState, doLogin, loginReset } from "../../redux/slices/auth";
import { useLoginFormSchema } from "../../schema/LoginFormSchema";
import LoginScene from "./LoginScene";
import { useCookies } from "react-cookie";
import { COOKIES_EXPIRE_TIME, LOGEVENTCALL, logEvents, LoginMethod } from "../../libs/constant";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { isRunningAsPWA } from "../../utils/pwaUtils";
import { DeviceUUID } from "device-uuid";
import { getLocationById } from "../../redux/services/locations.api";
import { getData, removeItem, storeData } from "../../utils/localstorage";
import  { setEncryptedCookie } from "../../utils/useEncryptedCookies";
import { logEffect } from "../../utils/logger";
import { fetchSettingData } from "../../redux/slices/setting";

interface OTPCredential extends Credential {
    code: string;
}

message.config({
    duration: 10, 
  });
const LoginContainer = ({ handleOk, handleCloseDialog }) => {
    const [showOtpComponent, setShowOtpComponent] = useState(false);
    const [step, setStep] = useState(1);
    const [minutes, setMinutes] = useState(4);
    const [loginMode, setLoginMode] = useState(null);
    const [seconds, setSeconds] = useState(59);
    const numInputs = 6;
    const inputRefs: any = useRef([])
    const [otp, setOtp] = useState<any>("");
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const firstInputRef: any = useRef(null);
    const loginState: LoginState = useSelector((state: RootState) => state.login);
   
    const loginUserState: LoginUserState = useSelector((state: RootState) => state.loginUser);
    const validationSchema = useLoginFormSchema();
    const { register, formState, watch, control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const { t } = useTranslation();
    const { setPostData, setIsLoading, setFilterValue, filterValue, SHOW_WHATSAPP_OTP_OPTION, defaultMessageType,setIsRefetch,
        setIsPostClear, setIsLoginLanguageSet,setIsDarkMode, selectedCity, setIsOpenProfilePopup,setSelectedCityName ,selectedLanguage,isDarkMode} = useContext(LayoutContext)
    const [elapsedTime, setElapsedTime] = useState(0);
    const { data: loginUserData, isLoading } = useSelector(
        (state: RootState) => state.loginUser
    );
    const [messageType, setMessageType] = useState(defaultMessageType);
    const [visitedUser, setVisitedUser] = useState(null);

    const watchField = watch();
    const navigate = useNavigate();
    const dispatch: any = useDispatch();
    const allFilled = otpValues.every(value => value.trim() !== '');
    const isDemoUserExist = visitedUser;


    const onSubmit = async(values) => {
        try {
             const visiteduserData = await getData("visitedUser")
             const installedId = await getData("installId")
            const payload = {
                MobileNo: values?.MobileNo,
                IsMobile: messageType === "sms" ? true : false,
                ISWhatsapp: messageType === "Whatsapp" ? true : false,
                LanguageId: await getData("i18nextLng") || 2,
                DesignId: await getData("DesignId") || 1,
                LocationId: selectedCity,
                userId: visiteduserData?.id,
                ...(installedId ? { InstalledId: installedId } : {})
                // DeviceId: new DeviceUUID().get(),
                // demoToOriginal: isDemoUserExist?.role === USER_TYPE_ENUM.DemoUser ? true : false,
            };

            
            // setMessageType(values.messageType)
            setLoginMode(LoginMethod.userLogin)
            dispatch(doLogin(payload, LoginMethod.userLogin));

        } catch (e) {
            message.error(loginState?.error);
        }
    }
    const handleResendOtp = async () => {
        try {
            const payload = {
                MobileNo: watchField?.MobileNo,
                IsMobile: messageType === "sms" ? true : false,
                ISWhatsapp: messageType === "Whatsapp" ? true : false,
                LanguageId: await getData("i18nextLng") || 2,
            };
            const response = await resendOtpAPI(payload);
            setElapsedTime(0);
            if (minutes == 0 && seconds == 0) {
                setSeconds(59)
                setMinutes(4)
            }
            if (response?.success) {
                message.success({content:response.message, key: 'resendOtp'});
            } else {
                message.error(response.message);
            }
        } catch (e) {
        }
    }

    const isAppRunning = !isRunningAsPWA();

     const fetchSelectedCityById = async (language?: any) => {
        try {
          // Ensure selectedLanguage and selectedCity are available
          if (selectedLanguage && selectedCity) {
            const payload = {
              LanguageId: language ?? selectedLanguage, // Use provided language or fallback to selectedLanguage
              LocationId: selectedCity, // The selected city ID
            };
    
            // Fetch city data
            const response = await getLocationById(payload);
    
            if (response?.success) {
              setSelectedCityName(response.data[0].name); // Update city name on successful response
            }
          } else {
            // If no selected city, fallback to default translation
            setSelectedCityName(t("General.All Cities"));
          }
        } catch (error) {
          console.error("Error fetching selected city:", error);
          // Handle errors as needed
        }
      };

    /**
     * Resets focus to the first input field on the page.
     * This function is used to bring the focus back to the
     * first input field after submitting the form or 
     * clicking the resend OTP button.
     */
    const handleVerificationSubmit = async () => {
        try {
            if (!allFilled) {
                message.error(t("toastMessage.Enter OTP"))
            }
            const visiteduserData = await getData("visitedUser")
            
            if (loginState?.data?.success && allFilled) {
                const payload = {
                    MobileNo: watchField?.MobileNo?.toString(),
                    Otp: otpValues.join(''),
                    LanguageId: await getData("i18nextLng") || 2,
                    UnregisteredUserId: visiteduserData?.id,
                    IsDarkMode:isDarkMode
                }
                const res = await VerificationOtpAPI(payload);
                if (res?.success) {
                    message.success({content:res?.message, key: 'verificationOtp'});
                    await storeData("i18nextLng", res?.data?.preferredLanguageId);
                    fetchSelectedCityById(res?.data?.preferredLanguageId)
                    setIsLoginLanguageSet(true);
                    const cookiePayload = {
                        user: {
                            id: res?.data?.id,
                            firstName: res?.data?.firstName,
                            lastName: res?.data?.lastName,
                            phoneNo: res?.data?.phoneNo,
                            role: res?.data?.role,
                            token: res?.data?.token,
                        },
                        session: {
                            expireAt: COOKIES_EXPIRE_TIME
                        }
                    }
                    setPostData([])
                    setIsLoading(true)
                    setIsPostClear(true)
                    setFilterValue({ ...filterValue, PageNumber: 1 })
                    setEncryptedCookie("adminAuth", cookiePayload, { path: "/", expires: COOKIES_EXPIRE_TIME });
                    setIsRefetch(true);
                    // message.success("Login successfully")
                    // console.log("adminAuth",adminAuth);
                    if(LOGEVENTCALL){
                        logEffect(logEvents.User_Login)
                    }
                     setIsDarkMode(res?.data?.isdarkmode)
                    await removeItem("visitedUser")

                    
                    if (res?.data?.firstName === "" && res?.data?.lastName === "" ) {
                        setIsOpenProfilePopup(true);
                        if(LOGEVENTCALL){
                    logEffect(logEvents.New_User)
                        }
                    
                        fetchSelectedCityById(selectedLanguage)
                    }
                    handleOk(res);
                    

                } else {
                    message.error(res?.message);
                    setOtpValues(["", "", "", "", "", ""]);
                    firstInputRef.current.focus();
                }
            }
        } catch (e: any) {
        }
    };
    const handleOtpInputChange = (index, value) => {
        // Limit input value length to 1
        const newValue = value.slice(0, 1);
        // Update the OTP value at the specified index
        const newOtpValues = [...otpValues];
        newOtpValues[index] = newValue;
        setOtpValues(newOtpValues);
        // Move focus to the next input box if available
        if (newValue && index < otpValues.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        const newOtpValues = [...otpValues];
        // Split the pasted data and fill the otpValues
        pasteData.split('').forEach((char, i) => {
            if (index + i < otpValues.length) {
                newOtpValues[index + i] = char;
            }
        });
        setOtpValues(newOtpValues);
        // Move focus to the last filled input box or the next available input
        const nextIndex = Math.min(index + pasteData.length, otpValues.length - 1);
        inputRefs.current[nextIndex].focus();
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

    useEffect(() => {
        if ('OTPCredential' in window) {
            const ac = new AbortController();
            const getOtp = async () => {
                try {
                    const credential = await navigator.credentials.get({
                        otp: { transport: ['sms'] },
                        signal: ac.signal
                    } as CredentialRequestOptions);
                    if (credential) {
                        const otpCredential = credential as OTPCredential;
                        const otpCode = otpCredential.code;
                        const otpArray = otpCode.split('').slice(0, 6);
                        setOtpValues(otpArray);
                    } else {
                        //console.log('No OTP received');
                    }
                } catch (err: any) {
                    if (err.name === 'AbortError') {
                        //console.log('OTP retrieval was aborted');
                    } else {
                        console.error('Error retrieving OTP:', err);
                    }
                }
            };

            getOtp();

            return () => {
                //console.log("Cleaning up: aborting OTP retrieval");
                ac.abort();
            };
        } else {
            //console.log("OTPCredential is not available");
        }

          const visiteduserFeatch = async() =>{
      const visiteduserData = await getData("visitedUser")
      setVisitedUser(visiteduserData )
    }
    visiteduserFeatch()
    }, []);


    useEffect(() => {
        if (loginState?.data?.success && loginMode === LoginMethod.userLogin) {
            setShowOtpComponent(true);
            if (step === 1) setStep(step + 1)
        };
    }, [loginState]);

    useEffect(() => {
        if (showOtpComponent) {
            const interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                    } else {
                        setSeconds(59);
                        setMinutes(minutes - 1);
                    }
                }
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
    }, [showOtpComponent, seconds]);

    useEffect(() => {
        const allFilled = otpValues.every(value => value.trim() !== '');
        if (allFilled) {
            handleVerificationSubmit();
        }
    }, [otpValues]);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
            setShowOtpComponent(false);
            setMinutes(0);
            setSeconds(59);
            setOtp(["", "", "", "", "", ""]);
            setStep(1);
            dispatch(loginReset());
        }
    }, []);

    return (
        <LoginScene
            {...{
                handleSubmit, onSubmit, register, control, formState, loginState, setOtp, otp, showOtpComponent, firstInputRef,
                minutes, seconds, elapsedTime, watchField: watch, setValue, otpValues, handleOtpInputChange, inputRefs, handleVerificationSubmit, handleResendOtp, setStep, step
                , handleBackspace, messageType, SHOW_WHATSAPP_OTP_OPTION, defaultMessageType, handleCloseDialog, setShowOtpComponent, handleOk, setMessageType, handlePaste
            }} />
    )
}
export default LoginContainer