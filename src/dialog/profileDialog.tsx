import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Dialog, DialogActions, Grid, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { components } from 'react-select';
import { toast } from "react-toastify";
import InputField, { SelectField } from '../components/formField/FormFieldComponent';
import { LayoutContext } from "../components/layout/LayoutContext";
import { deepClone } from "../libs/helper";
import { RootState } from "../redux/reducer";
import { deleteAccountAPI, updateProfileAPI, ReferralDetail} from "../redux/services/user.api";
import { loginUserUpdate } from "../redux/slices/auth";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { useProfileValidation } from "../schema/ProfileSchema";
import LocationPicker from "../components/locationpicker/locationpicker";
import { getLocationById } from "../redux/services/locations.api";
import { logEffect } from "../utils/logger";
import { LOGEVENTCALL, logEvents } from "../libs/constant";
import CongratulationsDialog from "../components/CongratulationsDialog";
import referEng from "../assets/images/referEng.png";
import referGuj from "../assets/images/referGuj.png";
import referHindi from "../assets/images/referHindi.png";
import { useNavigate } from "react-router-dom";
 

interface MyProfileSceneProps {
    open?: boolean;
    handleClose?: (data: any) => void;
    handleOk?: () => void;
    handleSubmit?: (data: any) => () => void;
    onSubmit?: (d: any) => void;
    register?: any,
    control?: any,
    formState?: any,
    watchField?: any
    cityName?: any
    cities?: any,
    openProfilePopup?:any
}

interface SocialPlatform {
  [x: string]: any;
  Id: number;
  label: string;
  value: string;
}

const ProfileDialog = (props: MyProfileSceneProps) => {
    const ProfileSchema = useProfileValidation();
    const { handleClose, handleOk, open, cityName, cities,openProfilePopup } = props
    const dispatch: any = useDispatch();
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const { position,doLogout,selectedLanguage,selectedCityName,selectedCity } = useContext(LayoutContext)
    const [mobileNumber, setMobileNumber] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);
    const [selectedLocationName, setSlectedLocationName] = useState("");
    const [locationObject, setLocationObject] = useState({id:""});
    const { t } = useTranslation();
    const [isLocationPicker, setIsLocationPicker] = useState(false);
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<SocialPlatform | null>(null);
    const isReferralSourceId = loginUserData?.data?.[0]?.referralsourceid;
    const referralAvailable = loginUserData?.data?.[0]?.isreferrelavailable;
    const [referralStatus, setReferralStatus] = useState<"idle" | "valid" | "invalid" | "checking">("idle");
    const [showCongrats, setShowCongrats] = useState(false);
    const [isReferralVerified, setIsReferralVerified] = useState(false);
    const [showReferralField, setShowReferralField] = useState(true);

    const navigate = useNavigate();

    const referralsource = (() => {
        try {
            const source = loginUserData?.data?.[0]?.referralsource;
            if (!source) return [];
            if (typeof source === 'string' && source.trim().startsWith('[') && source.trim().endsWith(']')) {
                return JSON.parse(source);
            }
            return [];
        } catch (error) {
            console.error('Error parsing referralsource:', error);
            return [];
        }
    })();

    const { register, formState, watch, control, handleSubmit, setValue, setError, clearErrors  } = useForm({
        resolver: yupResolver(ProfileSchema),
        context: { isReferralSourceId }
    });
    const watchField = watch();

    
    const userReferralCode = Array.isArray(loginUserData?.data) && loginUserData.data.length > 0
        ? loginUserData.data[0].referralcode
        : loginUserData?.data?.referralcode || "";

    
    const handleReferralChange = async (e) => {
        const code = e.target.value;
        clearErrors("referral");
        setIsReferralVerified(false);
        setReferralStatus("idle");
        if (code && code.length === 6) {
            setReferralStatus("checking");
            const response = await ReferralDetail({ CODE: code.trim() });
            if (response?.success) {
                const loginUserUpdatePayload: any = deepClone(loginUserData);
                loginUserUpdatePayload.data[0].isreferrelavailable = false;
                dispatch(loginUserUpdate(loginUserUpdatePayload));
                setReferralStatus("valid");
                setIsReferralVerified(true);
                setShowReferralField(false);
                setShowCongrats(true)
                clearErrors("referral");
            } else {
                setReferralStatus("invalid");
                setIsReferralVerified(false);
                setShowReferralField(true);
                setError("referral", {
                    type: "manual",
                    message: t("General.Invalidreferral")
                });
                setValue("referral", "");
            }
        }
    };

    const handleSocial = (selectedOption: SocialPlatform) => {
        setSelectedSocialPlatform(selectedOption);
    };
    
    const onSubmit = async (values) => { 
        try {
            
            if (referralAvailable && values?.referral?.trim()) {
                if (!isReferralVerified) {
                    setError("referral", {
                        type: "manual",
                        message: t("General.Invalidreferral")
                    });
                    return;
                }
            }
            const payload = {
                Id: loginUserData.data[0]?.id,
                Firstname: values?.Firstname,
                Lastname: values?.Lastname,
                MobileNo: values?.MobileNo,
                LocationId: locationObject?.id || loginUserData.data[0]?.locationid || selectedCity ,
                Latitude: position?.latitude,
                Longitude: position?.longitude,
                ReferralSourceId: selectedSocialPlatform?.id,
                ReferralCode: values?.referral?.trim()
            } 
            const response = await updateProfileAPI(payload)
            if (response.success) {
                handleOk()
                message.success(response.message);
                const loginUserUpdatePayload: any = deepClone(loginUserData);
                loginUserUpdatePayload.data[0].firstname = values?.Firstname;
                loginUserUpdatePayload.data[0].lastname = values?.Lastname;
                loginUserUpdatePayload.data[0].mobileno = values?.MobileNo;
                loginUserUpdatePayload.data[0].cityid = Number(values?.LocationId?.value);
                loginUserUpdatePayload.data[0].referralsourceid = Number( selectedSocialPlatform?.id);
                dispatch(loginUserUpdate(loginUserUpdatePayload));
                if(LOGEVENTCALL){
                logEffect(logEvents.Edit_Profile)
                }
            } else {
                message.error(response.message);
            }
        } catch (error) {
            message.error(error);
        }
    }
   
    const socialPlatformOptions = referralsource.map((option: SocialPlatform) => ({
        id: option.Id,
        label: option.DisplayName,
        value: option.CodeName
    }));

    

    
    const handleMenuOpen = () => {
        setIsDropdownOpen(true);
      };
    
      const handleMenuClose = () => {
        setIsDropdownOpen(false);
      };

        const fetchSelectedCityById = async(locationId) =>{
         try {
          if(selectedLanguage){
            const payload= {
              LanguageId:selectedLanguage,
              LocationId:locationId
            }
              const response = await getLocationById(payload)
      
              if(response.success){
                // setSelectedCityName(response.data[0].name)
                const cityName = response.data?.[0]?.name

                
                
                return cityName
              }
          }else{
            // setSelectedCityName(t("General.All Cities"))
            return t("General.All Cities")
          }
         
         } catch (error) {
          
         }
        }
   
        // const handleCityValues = async () => {
        //     let cityValues;
          
        //     if (loginUserData.data[0]?.locationid !== null) {
        //       cityValues = await fetchSelectedCityById(loginUserData.data[0]?.locationid); // Await the promise
        //     }
        //     setSlectedLocationName(cityValues)
        //     console.log("cityValues", cityValues); // Use the resolved value
        //   };
    useEffect(() => {
        if (loginUserData?.data?.length > 0) {
            setValue("Firstname", loginUserData.data[0]?.firstname);
            setValue("Lastname", loginUserData.data[0]?.lastname);
            setValue("MobileNo", loginUserData.data[0]?.mobileno);
            // setMobileNumber(loginUserData.data[0]?.mobileno)
            // handleCityValues()

            // setSlectedLocationName(cityValues)
            
            // setValue("LocationId", selectedCityName)
            // if()
        }
    }, [cityName, cities, loginUserData, setValue]);
    
    useEffect(() => {
        const updateLocationName = async () => {
          // Determine the location ID to use, either from loginUserData or locationObject
          const locationId = locationObject?.id || (loginUserData?.data && loginUserData.data[0]?.locationid);
      
          if (locationId) {
            const cityName = await fetchSelectedCityById(locationId);
            setSlectedLocationName(cityName);
          } else {
            setSlectedLocationName(selectedCityName); // Default value
          }
        };
      
        updateLocationName();
      }, [loginUserData, selectedLanguage, locationObject]);
  
    useEffect(() => {
        if (open) {
            setShowReferralField(true);
            setIsReferralVerified(false);
        }
    }, [open]);
    
      
    return (
        <>
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            fullWidth
        >
            <form id="profileForm" className="profileForm" onSubmit={handleSubmit(onSubmit)}>
                <Grid container component="main">
                    <Grid
                        item
                        xs={12}
                        md={15}
                        component={Paper}
                        elevation={6}
                        square
                        width={"30vw"}
                        alignItems="center"
                        p="20px 20px 10px"
                    >
                        <Typography variant="h5" className="d-flex justify-content-center mb-10">{t("General.Profile details")}</Typography>
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    watchField,
                                    control,
                                    autoFocus: true,
                                    id: "Firstname",
                                    name: "Firstname",
                                  
                                    label: t("General.First name*")
                                }} />
                        </div>
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    id: "Lastname",
                                    name: "Lastname",
                                    label: t("General.Last name*"),
                                   
                                }} />
                        </div>
                        <div className="input">
                            <InputField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    className: "hideNumberSpin",
                                    id: "MobileNo",
                                    disabled: true,
                                    // value:{mobileNumber},
                                    name: "MobileNo",
                                    label: t("General.Phone number*"),
                                    type: "number",
                                    maxLength: 10,
                                    shrink: watchField.MobileNo !== "" ? true :undefined,
                                    onInput: (e) => {
                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                    }
                                    
                                    }} />
                            </div>
                            {referralAvailable && showReferralField && <div className="input">
                                <InputField
                                    {...{
                                        register,
                                        formState,
                                        control,
                                        watchField,
                                        id: "referral",
                                        name: "referral",
                                        label: t("General.referral"),
                                        maxLength: 6,
                                        onBlur: handleReferralChange,
                                        onChange: handleReferralChange,
                                    }}
                                />
                            </div>}

                            <div className="input profilecity" >
                            {/* <SelectField
                                {...{
                                    register,
                                    formState,
                                    control,
                                    watchField,
                                    id: "LocationId",
                                    name: "LocationId",
                                    options: cities,
                                    label: "Select city*",
                                    placeholder: t("General.Select City*"),
                                    isMulti: false,
                                    isClearable: false,
                                    onMenuOpen:{handleMenuOpen},
                                    onMenuClose:{handleMenuClose},
                                    menuIsOpen:false,
                                    menuPlacement: "bottom",
                                    styles: { menuPortal: (base) => ({ ...base, zIndex: 9999 }) },
                                    menuPortalTarget: document.body
                                }}
                            /> */}
                                {/* <div
                                    onClick={() => setIsLocationPicker(true)}
                                    style={{
                                        cursor: "pointer",
                                        display: "inline-block",
                                        width: "100%",
                                        zIndex:9999
                                    }}
                                >
                                    <InputField
                                        {...{
                                            register,
                                            formState,
                                            control,
                                            watchField,
                                            id: "LocationId",
                                            name: "LocationId",
                                            label: t("General.Location*"),
                                            disabled: true,

                                        }} />
                                </div> */}
                                <div onClick={() => setIsLocationPicker(true)} className="proficleCityBox">
                                    <span>{selectedCityName}</span>
                                </div>
                                { (isReferralSourceId === 0 || Number.isNaN(isReferralSourceId) ) && (
                                    <div className="input mt-10">
                                    <SelectField
                                        {...{
                                            register,
                                            formState,
                                            control,
                                            id: "socialPlatform",
                                            name: "socialPlatform",
                                            isSearchable: false,
                                            isMulti: false,
                                            menuPortalTarget: document.body,
                                            styles: {
                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                })
                                            }
                                        }}
                                        placeholder={t("General.Where did you find us?")}
                                        options={socialPlatformOptions}
                                        onSelectChange={handleSocial}
                                        isClearable={false}
                                        value={selectedSocialPlatform}
                                    />
                                </div>
                                )    
                                }
                            </div>
                            <Box className="d-flex justify-content-center">
                                {selectedLanguage === 1 ? (
                                    <img
                                        src={referEng}
                                        alt="referimg"
                                        style={{ width: "60%", borderRadius: "5%", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/transactionhistory");
                                            if (handleClose) handleClose(null);
                                        }}
                                    />
                                ) : selectedLanguage === 2 ? (
                                    <img
                                        src={referGuj}
                                        alt="referimg"
                                        style={{ width: "60%", borderRadius: "5%", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/transactionhistory");
                                            if (handleClose) handleClose(null);
                                        }}
                                    />
                                ) : selectedLanguage === 3 ? (
                                    <img
                                        src={referHindi}
                                        alt="referimg"
                                        style={{ width: "60%", borderRadius: "5%", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/transactionhistory");
                                            if (handleClose) handleClose(null);
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={referEng}
                                        alt="referimg"
                                        style={{ width: "60%", borderRadius: "5%", cursor: "pointer" }}
                                        onClick={() => {
                                            navigate("/transactionhistory");
                                            if (handleClose) handleClose(null);
                                        }}
                                    />
                                )}
                            </Box>
                            <DialogActions className="pr-0">
                                {/* <Box> */}
                                <Button variant="outlined" color="error" className='close-btn mr-10' onClick={handleClose}>{t("General.Cancel")}</Button>
                                <Button form="profileForm" type="submit" variant="contained" >{t("General.Save")}</Button>
                              
                                {/* <Button variant="outlined" color="error" className='delete-btn'  onClick={deleteAccount}>Delete Account</Button> */}
                            {/* </Box> */}
                        </DialogActions>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
        {isLocationPicker && (
                <div>
                    <Dialog
                        className="location-dialog"
                        onClose={() => setIsLocationPicker(false)}
                        sx={{ m: "0px" }}
                        open={isLocationPicker}
                        maxWidth="xs"
                        fullWidth
                    >
                        <LocationPicker setIsLocationPicker={setIsLocationPicker} lattitude={position?.latitude} longitude={position?.longitude} languageId={selectedLanguage}  setLocationObject={setLocationObject} />
                    </Dialog>
                </div>
            )}
            <CongratulationsDialog open={showCongrats} onClose={() => {
                setShowCongrats(false);
            }} />
        </>
        

        
    )
}
export default ProfileDialog