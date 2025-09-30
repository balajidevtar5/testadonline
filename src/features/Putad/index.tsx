import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import InfoIcon from '@mui/icons-material/Info';
import InvertColorsOffOutlinedIcon from '@mui/icons-material/InvertColorsOffOutlined';
import InputAdornment from "@mui/material/InputAdornment";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import {
    Button, Card, CardActions, CardContent, Checkbox, Chip, CircularProgress, Dialog,
    DialogContent, Divider, FormControl, FormControlLabel, Grid,
    IconButton,
    ListItem,
    Radio,
    RadioGroup,
    Skeleton,
    Tooltip, Typography
} from "@mui/material";
import { Dropdown, Menu, Space, Steps, message } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import HashMap from '../../common/datastructures/hashmap';
import { CloseDialogComponent } from '../../components/CloseDialogComponent';
import AddFundComponent from '../../components/addFund/AddFundComponent';
import InputField, { CheckboxField, SelectField, TextAreaField } from "../../components/formField/FormFieldComponent";
import { LayoutContext } from '../../components/layout/LayoutContext';
import i18n from '../../i18n';
import { API_ENDPOINT_PROFILE, LOGEVENTCALL, LanguageEnum, POST_TYPE_ENUM, colorMap, colorMapping, contactTypesEnum, logEvents, stateId } from '../../libs/constant';
import { deepClone } from "../../libs/helper";
import { RootState } from '../../redux/reducer';
import { AddNewMobileNumber, AddWalletTransaction, DeleteFile, GetContactOptions, PostFileUpload, createPost, fetchAvailablePostSlot, getTags, verifyPostOtp } from '../../redux/services/post.api';
import { getAllSettingsAPI } from '../../redux/services/setting.api';
import { LoginUserState, loginUserUpdate } from '../../redux/slices/auth';
import ImageSliderDialog from '../../dialog/ImageSliderDialog';
import postDetailsStyle from "../../dialog/postDetails/PostDetailStyles.module.scss";
import AccordionComponent from '../../dialog/postDetails/acording';
import DeletePost from '../../dialog/postDetails/deatepostpopup';
import LocationPicker from '../../components/locationpicker/locationpicker';
import { getLocationById } from '../../redux/services/locations.api';
import { getData, storeData } from '../../utils/localstorage';
import * as Yup from "yup";
import { useEmailFormSchema } from "../../schema/EmailValidationSchema";
import { logEffect } from '../../utils/logger';
import { useCookies } from "react-cookie";
import { getDecryptedCookie } from '../../utils/useEncryptedCookies';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { validateAndProcessFiles, processImageFiles } from '../../utils/fileUploadUtils';
import { handleVerificationSubmit } from './functions/verificationSubmit';
import { handleResendOtp as resendOtp, ResendOtpProps } from './functions/resendOtp';
import { fetchRepostData } from './functions/fetchRepostData';
import PrizeDistribution from './components/PrizeDistribution';
import useHighlightCalculation from "./hooks/useHighlightCalculation";
import StarsIcon from '@mui/icons-material/Stars';

export interface PostDetailsProps {
    open: boolean;
    handleOk?: (data?: any) => void,
    handleClose: (data?: any) => void;
    isRepost?: any,
    isEditPost?: any,
    editPostData?: any
}

interface OTPCredential extends Credential {
    code: string;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
const PutAdPage = (props: PostDetailsProps) => {
    const { open, handleClose, handleOk, isRepost, isEditPost, editPostData } = props
    const { register, formState, handleSubmit, watch, control, setValue } = useForm();
    const { data: settingData } = useSelector((state: RootState) => state.settingList);
    const { position, selectedCity, setFilterValue, filterValue, categoryList, SHOW_WHATSAPP_OTP_OPTION, defaultMessageType, selectedLanguage, selectedCityName, setIsLocationApiCall, setIsDarkMode,
        isDarkMode, setIsRefetch } = useContext(LayoutContext);
    const { data: cityData } = useSelector((state: RootState) => state.cities);
    const [tags, setTags]: any = useState([]);
    const [totalTargetAmount, setTargetAmount] = useState(0);
    const [amountCalculation, setAmountCalculation] = useState(0)
    const [filteredTags, setFilteredTags]: any = useState([]);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [selectedTag, setSelectedTag] = useState<any>([]);
    const { data: loginUserState }: LoginUserState = useSelector((state: RootState) => state.loginUser);
    const [showLabelCard, setShowLabelCard] = useState(false);
    const [selectedColor, setSelectedColor] = useState(isDarkMode ? colorMap.darkgray : colorMap.white);
    const [searchTagsList, setSearchTagList] = useState([]);
    const [slotData, setSlotData] = useState([]);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const [addFundModalOpen, setIsAddFundModalOpen] = useState(false);
    const [isStateSelect, setIsStateSelect] = useState(false);

    const watchField: any = watch();
    const dispatch: any = useDispatch();
    const renderTags = watchField?.label?.trim() !== "" ? filteredTags : tags;
    const mode = isDarkMode ? "dark" : "light";
    const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3
    const colors = Object.keys(colorMapping.light)
        .filter((key) => key !== "white") // Exclude white & darkgray
        .map((key) => colorMapping[mode][key]);



    const inputRefs: any = useRef([])
    const firstInputRef: any = useRef(null);
    const [otp, setOtp] = useState<any>("");
    const [elapsedTime, setElapsedTime] = useState(0);
    const [minutes, setMinutes] = useState(4);
    const [seconds, setSeconds] = useState(59);
    const [formValues, setFormValues] = useState(null);
    const [showOtpComponent, setShowOtpComponent] = useState(false);
    const [shouldCallOnSubmit, setShouldCallOnSubmit] = useState(false)
    const [isNewMobileNumVerified, setIsNewMobileNumVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageDeque, setImageDeque] = useState(new HashMap());
    const [imageSlideOpen, setImageSlideOpen] = useState(false);
    const [imageMultipleData, setImageMultipleData] = useState([]);
    const [activeStep, setActiveStep] = useState(1);
    const [selectedFileUpload, setSelectedFileUpload] = useState(new HashMap())
    const [updatedCategoryList, setUpdatedCategortyList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [ImageKey, setImageKey] = useState(null);
    const [ImageIndex, setImageIndex] = useState(null);
    const [isShowDeletePopup, setIsShowDeletePopup] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionCity, setSelectedOptionCity] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(1);
    const [previousMobileNumber, setPreviousMobileNumber] = useState(loginUserData?.data && loginUserData?.data[0]?.mobileno);
    const [previousMobileno, setPreviousMobileno] = useState(loginUserData?.data && loginUserData?.data[0]?.mobileno);
    const [prevEmail, setPrevEmail] = useState("");
    const [lastErrorTime, setLastErrorTime] = useState<number>(0);
    const [prevTelegram, setPrevTelegram] = useState(loginUserData?.data && loginUserData?.data[0]?.mobileno);
    const [prevWhatsapp, setPrevWhatsapp] = useState(loginUserData?.data && loginUserData?.data[0]?.mobileno);
    const [cities, setCities] = useState([]);
    const [priceValue, setPriceValue] = useState<number | null>(null);
    const [highLightAmount, setHighLightAmount] = useState(0);
    const [highLightColor, setHighLightColor] = useState("#0000");
    const [highLight, setHighLight] = useState(false);
    const [showPlusIcon, setShowPlusIcon] = useState("");
    const [optionData, setOptionData] = useState([]);
    const { t } = useTranslation();
    const [categoryId, setCategoryId] = useState(null);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [tooltipOpen, setTooltipOpen] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [categoryClick, setCategoryClick] = useState(false)
    const [contactOptions, setContactOptions] = useState([])
    const [isLocationPicker, setIsLocationPicker] = useState(false);
    const [locationObject, setLocationObject] = useState({ id: "", name: "" });
    const [selectedLocation, setSelectedLoction] = useState(selectedCityName);
    const validationSchema = useEmailFormSchema();
    const priceValidationSchema = Yup.object().shape({
        price: Yup.number()
            .transform((value) => (isNaN(value) || value === '' ? null : value))
            .max(1000000000, () => t("toastMessage.Price Limit Exceeded"))
            .nullable()
    });
    const [{ adminAuth }]: any = useCookies(["adminAuth"]);
    const encryptedAdminAuth = getDecryptedCookie(adminAuth)
    const [isUploading, setIsUploading] = useState(false);
    const [displayPrice, setDisplayPrice] = useState("");
    const [priceTypeId, setPriceTypeId] = useState(isRepost?.pricetypeid || 1);
    const [postPurposeId, setPostPurposeId] = useState(isRepost?.purposetypeid || null);
    const navigate = useNavigate();
    const priceTypeMapping = {
        1: 'negotiable',
        2: 'non-negotiable'
    };

    const handlePriceChange = (typeId) => {
        setPriceTypeId((prev) => prev === typeId ? null : typeId);
    };

    const handlePurposeChange = (selected) => {
        setPostPurposeId(selected.id);
    };

    const formatIndianPrice = (value) => {
        if (!value) return "";
        const cleanValue = value.replace(/[^0-9.]/g, '');

        // Split number into whole and decimal parts
        const parts = cleanValue.split('.');
        let wholePart = parts[0];
        const decimalPart = parts[1] || '';
        if (wholePart) {
            const lastThree = wholePart.substring(wholePart.length - 3);
            const otherNumbers = wholePart.substring(0, wholePart.length - 3);
            wholePart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + (otherNumbers ? "," : "") + lastThree;
        }
        // Combine whole and decimal parts
        return wholePart + (decimalPart ? '.' + decimalPart : '');
    };

    const postPurposeOptions = [
        { value: 'Buying', label: t("General.posting options.Buy"), id: 1 },
        { value: 'Selling', label: t("General.posting options.Sell"), id: 2 },
        { value: 'others', label: t("General.posting options.Others"), id: 3 },
    ];

    const selectedPurpose = postPurposeOptions.find(option => option.id === postPurposeId);

    const isAdFree = slotData[0]?.isadfree === 1;
    const isHighlightAmountNotZero = highLightAmount != 0;
    let gridSize = 12;

    //if (isHighlightAmountNotZero) {
    //    // If Ad-Free, use full width
    //    gridSize = 7.5;
    //} else if (isAdFree || isAdmin) {
    //    // If Highlight Amount is zero, use full width
    //    gridSize = 12;
    //} else {
    //    // Default case
    //    gridSize = 7.5;
    //}


    const isIOS = () => {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    };

    const handleTooltipOpen = (id) => {
        setTooltipOpen(id);
    };


    const handleTooltipClose = () => {
        setTooltipOpen(null); // Close tooltip on other interactions (optional)
    };

    const handleGetOtpOptions = async () => {
        try {
            const response = await getAllSettingsAPI();
            if (response.data) {
                setOptionData(response.data)
            }
        } catch (error) {

        }
    }

    const PRIZE_DISTRIBUTION = [
        { id: 0, name: t("General.Weekly Ad"), price: slotData[0]?.totalcount, showCurrency: false, classsName: "bg-lightPrimary", type: "weekly_ad" },
        {
            id: 1, name: t("General.Ad Charge"), price: slotData[0]?.postprice + "*" + slotData[0]?.totalcount, showCurrency: false, type: "ad_charge",
            infoIcon: <InfoIcon style={{ fontSize: "1rem", color: "grey", marginLeft: "3px" }} />
        },
        { id: 2, name: t("General.Highlight"), highLight: highLight, price: highLightAmount, icon: showPlusIcon, showCurrency: true },
    ]
    const tagsSelectHandler = (value: any) => {
        if (tags?.length > 9) {
            message.error("You can add up to 10 tags.")
            return
        }
        if (tags?.length > 0) {
            setTags([...tags, value]);
            setSelectedTag([...selectedTag, value]);
            setSearchTagList([])
        } else {
            setTags([value]);
            setSelectedTag([value]);
            setSearchTagList([])
        }
        setValue("label", "")
    };
    const handleMenuClick = (e) => {
        setSelectedOption(e.id);
        setSelectedOptionId(e.id);

        setPrevEmail("")
        // if (e.id === contactTypesEnum.TELEGRAM) {
        //     // Update TelegramNo and WhatsappNo based on MobileNo
        //     setValue("TelegramNo", watchField.MobileNo);
        //     setValue("WhatsappNo", watchField.MobileNo);
        //   } else if (e.id === contactTypesEnum.PHONEWHATSAPP) {
        //     // Update MobileNo based on TelegramNo, and WhatsappNo based on MobileNo
        //     setValue("MobileNo", watchField.TelegramNo);
        //     setValue("WhatsappNo", watchField.TelegramNo);
        //   } else if (e.id === contactTypesEnum.WHATSAPP) {
        //     // Update MobileNo based on TelegramNo, and TelegramNo based on MobileNo
        //     setValue("MobileNo", watchField.WhatsappNo);
        //     setValue("TelegramNo", watchField.WhatsappNo);
        //   }

        //   WhatsappNo
    };



    const handleCityMenuClick = (e) => {
        setSelectedOptionCity(e)
    }
    const handleDelete = (chipToDelete: any) => () => {
        setSelectedTag((chips: any[]) => chips.filter((chip) => chip?.label !== chipToDelete?.label));
    };
    const handleChange = (item: any) => {
        setSelectedTag((d: any) => {
            const temp = deepClone(d);
            const index = temp.findIndex((t: { label: string; }) => t?.label === item?.label);
            if (index > -1) {
                temp.splice(index, 1);
            } else {
                temp.push(item);
            }
            return temp;
        })
    }
    const filterTags = async (tag: any) => {
        const response = await getTags(tag);
        const tagListData = response.data.map((elm) => ({
            label: elm.tagname,
            id: elm.id
        }))
        const filteredTagListData = tagListData.filter(tag => !tags.some(removeTag => removeTag?.label === tag.label));
        setSearchTagList(filteredTagListData)
        if (tags?.length > 0) {
            const filteredTags = tags.filter((t: { label: any; }) => t?.label === tag);
            setFilteredTags(filteredTags)
        }
    }

    const validateEmail = async (email: string, t: any): Promise<boolean> => {
        try {
            await validationSchema.validate({ Email: email });
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errorMessageKey = `${error.message}`;
                const translatedMessage = t(errorMessageKey) || error.message;
                message.error(translatedMessage);
            }
            return false;
        }
    };

    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const email = event.target.value.trim();
        await validateEmail(email, t);
    };

    const getColorKey = (hexValue) => {
        return Object.keys(colorMap).find((key) => colorMap[key] === hexValue) || hexValue;
    };

    const requiresPaymentStep = () => {
        return !isEditPost &&  slotData?.[0]?.isadfree === 0 || highLightAmount !== 0;
    };

    
    interface PremiumAdUrls {
        LargeImage?: string;
        SmallImage?: string;
    }



    const submitPost = async (payLoad) => {
        if (slotData && slotData?.length > 0) {
            if (slotData[0]?.balance >= amountCalculation) {
                const resp = await createPost(payLoad);

                if (resp?.success) {
                    setIsLocationApiCall(false);
                    setIsRefetch(true)

                    const formData = new FormData();
                    const files = selectedFileUpload.getAllData();
                    let filenameArray = [];
                    let filePathArray = [];
                    const imageDequeArray = imageDeque.getAllDataWithKey();

                    imageDequeArray.forEach((entry: { key: string; value: string }) => {
                        const filePath = entry.value.split('/Uploads/Original/')[1];
                        filenameArray.push(entry.key);
                        filePathArray.push(filePath);
                    });

                    if (files && files.length > 0) {
                        files.forEach((file) => {
                            formData.append(`fileList`, file);
                        });

                        if (isRepost && Object.keys(isRepost)?.length > 0) {
                            await PostFileUpload(formData, resp.data[0].postid, 0, filePathArray);
                        } else {
                            await PostFileUpload(formData, resp.data[0].postid, 0);
                        }
                    }

                    const walletPayload = {
                        ReferenceId: resp.data[0].postid,
                        Amount: amountCalculation,
                        CodeName: POST_TYPE_ENUM.POST
                    };

                    if ((slotData[0]?.isadfree !== 1 || highLightAmount > 0) && !isAdmin && !isEditPost) {
                        const walletResponse = await AddWalletTransaction(walletPayload);
                        if (walletResponse?.success) {
                            const loginUserUpdatePayload: any = deepClone(loginUserData);
                            setShouldCallOnSubmit(false);
                            loginUserUpdatePayload.data[0].balance -= amountCalculation;
                            dispatch(loginUserUpdate(loginUserUpdatePayload));
                            setIsLocationApiCall(true);
                        }
                    }

                    // if (resp?.data[0]?.availableforrating  === 1) {
                    // Navigate to review page with necessary data
                    navigate('/success', {
                        state: {
                            postId: resp.data[0].postid,
                            languageId: 2 // Set your default language ID or get it from your app state
                        }
                    });
                    storeData("adUpdateResponse", resp.data[0])
                    // handleOk(resp)
                    handleClose()
                    // } else {
                    //     // Continue with your existing success handler
                    //     handleOk(resp)
                    // }

                    if (LOGEVENTCALL) {
                        logEffect(logEvents.Create_Post);
                        if (loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3) {
                            logEffect(logEvents.AddedByAdonline_Post);
                        } else {
                            logEffect(logEvents.Orgonic_Post);
                        }
                        if (isRepost && Object.keys(isRepost)?.length > 0) {
                            logEffect(logEvents.Reposted_Post);
                        }
                    }
                }
                if (resp.data[0]?.availableforrating === 1) {
                    let parsedPremiumUrls: PremiumAdUrls = {};
                    try {
                       
                        const premiumadurls = resp.data[0]?.premiumadurls;
                        if (premiumadurls) {
                            parsedPremiumUrls = JSON.parse(premiumadurls.replace(/\\/g, ''));
                        }
                    } catch (e) {
                        console.error("Failed to parse premiumadurls:", e);
                    }

                    const imageUrl = parsedPremiumUrls?.LargeImage
                        ? `https://adonline.in/${parsedPremiumUrls.LargeImage.replace(/^~\//, '')}`
                        : null;

                    navigate('/success', {
                        state: {
                            postId: resp.data[0].postid,
                            languageId: 2,
                            premiumadurls: JSON.stringify({
                                LargeImage: parsedPremiumUrls?.LargeImage || ""
                            })
                        }
                    });
                } else {
                    // Continue with your existing success handler
                    handleOk(resp)
                }
            } else {
                message.info(t("toastMessage.Your account balance is insufficient. Please add money into wallet before proceeding."));
                setIsAddFundModalOpen(true);
            }
        }
    };


    const onSubmit = async (values: any) => {
        try {

            await priceValidationSchema.validate({ price: priceValue });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                message.error(error.message);
                return;
            }
        }

        if (values?.Title === "") {
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }

        if (values.Advertise_details === "") {
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }


        if (selectedLocation === t("General.All Cities")) {
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }

        if(isStateSelect){
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }
        if (selectedLocation === "") {
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }

        if (values?.MobileNo?.length != 10 && selectedOption === contactTypesEnum.PHONEWHATSAPP) {
            message.error(t("toastMessage.Mobile number should consist of 10 digits."))
            return
        }

        if (values?.MobileNo?.length != 10 && selectedOption === contactTypesEnum.PHONE) {
            message.error(t("toastMessage.Mobile number should consist of 10 digits."))
            return
        }

        if (values?.WhatsappNo?.length != 10 && selectedOption === contactTypesEnum.WHATSAPP) {
            message.error(t("toastMessage.Mobile number should consist of 10 digits."))
            return
        }
        if (selectedOption === contactTypesEnum.TELEGRAM && (values?.TelegramNo?.length != 10 || values?.TelegramNo === "")) {
            message.error(t("toastMessage.Telegram number should consist of 10 digits."))
            return
        }
        if (selectedOption === contactTypesEnum.EMAIL) {
            const email = values?.Email?.trim();

            // Ensure email exists before validation
            if (!email) {
                message.error(t("toastMessage.email")); // Show error if email is empty
                return false;
            }

            const isValid = await validateEmail(email, t); // Await validation (if it's async)

            if (!isValid) {
                return false; // Stop form submission on invalid email
            }
        }

        if (categoryId === null) {
            message.error(t("toastMessage.Please select category."))
            return
        }
        const tagList = selectedTag.map((elm) => ({
            TagName: elm?.label,
            ID: elm?.id
        }))
        let allFilled = otpValues.every((value) => value.trim() !== '');

        if (activeStep === 3) {
            if (!allFilled) {
                message.error(t("toastMessage.Enter OTP"))
                return
            }
        }

        let isEmailNotEqual = true;
        if (isRepost && Object.keys(isRepost).length > 0) {
            if (selectedOption === contactTypesEnum.PHONEWHATSAPP) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isMobileNumChanged = values.MobileNo !== loginUserData?.data[0]?.mobileno;
                const isMobileNumVerified = values.MobileNo === previousMobileNumber && isNewMobileNumVerified;

                if (!isAdmin && isMobileNumChanged && !isMobileNumVerified) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPreviousMobileNumber(values.MobileNo);
                } else if (!isAdmin && isMobileNumChanged && isMobileNumVerified) {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.EMAIL) {

                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isEmailChanged = values.Email !== prevEmail;
                if (!isAdmin && isEmailChanged && values.Email != isRepost?.email) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                } else if (!isAdmin && !isEmailChanged && !allFilled && showOtpComponent && values.Email != isRepost?.email) {
                    setActiveStep(3);
                    setShowOtpComponent(true);

                    isEmailNotEqual = false
                } else {
                    setActiveStep(4);
                    setShowOtpComponent(false);
                    isEmailNotEqual = false
                }
            } else if (selectedOption === contactTypesEnum.TELEGRAM) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isTelegramNumberChanged = values.TelegramNo !== loginUserData?.data[0]?.mobileno;
                const isTelegramNumVerified = values.TelegramNo === prevTelegram && isNewMobileNumVerified;
                if (!isAdmin && isTelegramNumberChanged && !isTelegramNumVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPrevTelegram(values.TelegramNo);

                } else if (!isAdmin && !isTelegramNumberChanged && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);

                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.PHONE) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isMobileNumberChange = values.MobileNo !== loginUserData?.data[0]?.mobileno;
                const isMobileNumVerified = values.MobileNo === previousMobileNumber && isNewMobileNumVerified;
                if (!isAdmin && isMobileNumberChange && !isMobileNumVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPreviousMobileno(values.MobileNo)

                } else if (!isAdmin && !isMobileNumberChange && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);

                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            }

            else if (selectedOption === contactTypesEnum.WHATSAPP) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isWhatsAppNumberChanged = values.WhatsappNo !== loginUserData?.data[0]?.mobileno;
                const isWhatsappVerified = values.WhatsappNo === prevWhatsapp && isNewMobileNumVerified;
                if (!isAdmin && isWhatsAppNumberChanged && !isWhatsappVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPrevWhatsapp(values.WhatsappNo);

                } else if (!isAdmin && !isWhatsAppNumberChanged && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);
                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else {
                //setActiveStep(4);
            }
        }
        else {
            if (selectedOption === contactTypesEnum.PHONEWHATSAPP) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isMobileNumChanged = values.MobileNo !== loginUserData?.data[0]?.mobileno;
                const isMobileNumVerified = values.MobileNo === previousMobileNumber && isNewMobileNumVerified;
                if (!isAdmin && isMobileNumChanged && !isMobileNumVerified) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPreviousMobileNumber(values.MobileNo);

                } else if (!isAdmin && isMobileNumChanged && isMobileNumVerified) {
                    //setActiveStep(4);
                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.EMAIL) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isEmailChanged = values.Email !== prevEmail;

                if (!isAdmin && isEmailChanged) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);

                    setActiveStep(3);
                } else if (!isAdmin && !isEmailChanged && !allFilled && showOtpComponent && values.Email != isRepost?.email) {
                    setActiveStep(3);
                    setShowOtpComponent(true);

                    isEmailNotEqual = false
                } else {
                    setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.TELEGRAM) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isTelegramNumChanged = values.TelegramNo !== loginUserData?.data[0]?.mobileno;
                const isTelegramNumVerified = values.TelegramNo === prevTelegram && isNewMobileNumVerified;

                if (!isAdmin && isTelegramNumChanged && !isTelegramNumVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    // setActiveStep(activeStep === 1 ? 3 : activeStep + 1);
                    setActiveStep(3);
                    setPrevTelegram(values.TelegramNo);

                } else if (!isAdmin && !isTelegramNumChanged && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);
                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.PHONE) {
                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isMobileNumChanged = values.MobileNo !== loginUserData?.data[0]?.mobileno;
                const isMobileNumVerified = values.MobileNo === previousMobileNumber && isNewMobileNumVerified;
                if (!isAdmin && isMobileNumChanged && !isMobileNumVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    // setActiveStep(activeStep === 1 ? 3 : activeStep + 1);
                    setActiveStep(3);
                    setPreviousMobileno(values.MobileNo)
                } else if (!isAdmin && !isMobileNumChanged && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);

                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else if (selectedOption === contactTypesEnum.WHATSAPP) {

                const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                const isWhatsAppNumberChanged = values.WhatsappNo !== loginUserData?.data[0]?.mobileno;
                const isWhatsAppNumberVerified = values.WhatsappNo === prevWhatsapp && isNewMobileNumVerified;
                if (!isAdmin && isWhatsAppNumberChanged && !isWhatsAppNumberVerified
                ) {
                    setIsNewMobileNumVerified(false);
                    setShowOtpComponent(true);
                    setActiveStep(3);
                    setPrevWhatsapp(values.WhatsappNo);
                } else if (!isAdmin && !isWhatsAppNumberChanged && !allFilled && activeStep != 4) {
                    setActiveStep(4);
                    setShowOtpComponent(false);
                } else {
                    //setActiveStep(4);
                    setShowOtpComponent(false);
                }
            } else {
                //setActiveStep(4);
            }
        }
        // debugger
        //       console.log("loginUserData",   values.MobileNo === loginUserData?.data[0]?.mobileno 
        //         ? values.MobileNo != loginUserData?.data[0]?.mobileno
        //         : values.MobileNo !== previousMobileNumber);



        if (loginUserData?.data[0]?.roleid != 1 && loginUserData?.data[0]?.roleid != 3) {


            if (
                selectedOption === contactTypesEnum.PHONEWHATSAPP
                    ? (
                        activeStep === 1 && !isNewMobileNumVerified && (
                            values.MobileNo === loginUserData?.data[0]?.mobileno
                                ? values.MobileNo != loginUserData?.data[0]?.mobileno
                                : values.MobileNo !== previousMobileNumber
                        )
                    ) : selectedOption === contactTypesEnum.PHONE ?
                        activeStep === 1 && !isNewMobileNumVerified && (
                            values.MobileNo === loginUserData?.data[0]?.mobileno
                                ? values.MobileNo != loginUserData?.data[0]?.mobileno
                                : values.MobileNo !== previousMobileno
                        )
                        : selectedOption === contactTypesEnum.TELEGRAM
                            ? (
                                activeStep === 1 && !isNewMobileNumVerified && (
                                    values.TelegramNo === loginUserData?.data[0]?.mobileno
                                        ? values.TelegramNo != loginUserData?.data[0]?.mobileno
                                        : values.TelegramNo !== prevTelegram
                                )
                            )
                            : selectedOption === contactTypesEnum.WHATSAPP
                                ? (
                                    values.WhatsappNo === loginUserData?.data[0]?.mobileno
                                        ? values.WhatsappNo != loginUserData?.data[0]?.mobileno
                                        : values.WhatsappNo !== prevWhatsapp
                                )
                                : (
                                    activeStep === 1 &&
                                    ((selectedOption === contactTypesEnum.EMAIL && values.Email !== prevEmail) ||
                                        (selectedOption === contactTypesEnum.TELEGRAM && values.TelegramNo !== prevTelegram))
                                ) && isEmailNotEqual === true
            ) {
                try {
                    setPrevEmail(values.Email);
                    let payload;

                    if (selectedOption === contactTypesEnum.EMAIL) {
                        payload = {
                            Email: values.Email,
                            ISWhatsapp: false,
                            IsMobile: false
                        };
                    } else {
                        // if (!SHOW_WHATSAPP_OTP_OPTION) {
                        //     if (defaultMessageType === "sms") {
                        //         payload = {
                        //             MobileNo: values.MobileNo,
                        //             ISWhatsapp: false,
                        //             IsMobile: true
                        //         }
                        //     } else {
                        //         payload = {
                        //             MobileNo: values.MobileNo,
                        //             ISWhatsapp: true,
                        //             IsMobile: false
                        //         }
                        //     }
                        // }else 
                        if (selectedOption === contactTypesEnum.PHONE || selectedOption === contactTypesEnum.PHONEWHATSAPP) {
                            payload = {
                                MobileNo: values.MobileNo,
                                ISWhatsapp: false,
                                IsMobile: true
                            }
                        } else if (selectedOption === contactTypesEnum.TELEGRAM) {
                            payload = {
                                MobileNo: values.TelegramNo,
                                ISWhatsapp: false,
                                IsMobile: true
                            }
                        } else if (selectedOption === contactTypesEnum.WHATSAPP) {
                            payload = {
                                MobileNo: values.WhatsappNo,
                                ISWhatsapp: true,
                                IsMobile: false
                            }
                        }
                        // else {
                        //     payload = {
                        //         MobileNo: selectedOption === contactTypesEnum.TELEGRAM ? values.TelegramNo : selectedOption === contactTypesEnum.PHONEWHATSAPP || selectedOption === contactTypesEnum.PHONE  ? values.MobileNo : selectedOption === contactTypesEnum.WHATSAPP && values.WhatsappNo ,
                        //         ISWhatsapp: values.messageType === "WhatsApp" ? true : false,
                        //         IsMobile: values.messageType === null ? true : false
                        //     }

                        // }

                        // }else{

                        //     if(selectedOption === "Phone"){
                        //         payload = {
                        //             MobileNo: values.MobileNo,
                        //             ISWhatsapp: false,
                        //             IsMobile: true
                        //         }
                        //     }
                        //     if (selectedOption === "Email") {
                        //         payload = {
                        //             Email: values.Email,
                        //             ISWhatsapp: false,
                        //             IsMobile:false
                        //         };
                        //     } else if (selectedOption === "WhatsApp") {
                        //         payload = {
                        //             MobileNo: values.WhatsappNo,
                        //             ISWhatsapp: true,
                        //             IsMobile:false
                        //         };
                        //     } else if (selectedOption === "Telegram") {
                        //         payload = {
                        //             MobileNo: values.TelegramNo,
                        //             ISWhatsapp: false,
                        //             IsMobile:true
                        //         }
                        //     } else {
                        // payload = {
                        //     MobileNo: values.MobileNo,
                        //     ISWhatsapp: values.messageType === "WhatsApp" ? true : false,
                        //     IsMobile:values.messageType === null ? true : false
                        // };
                        // }
                    }

                    // Send the payload to the server
                    const resp = await AddNewMobileNumber(payload);
                    if (resp?.success) {
                        message.success(resp.message);
                        setShowOtpComponent(true);
                        setFormValues(values);
                        setOtpValues(["", "", "", "", "", ""]);
                    }
                } catch (error) {
                }
                return;
            }
        }
        const currentUserLocation = await getData("currentUserLocation");


        
        let payLoad = {
            Id: 0,
            Title: values?.Title,
            ShortDescription: values?.Advertise_details,
            MobileNo: "",
            LocationId: locationObject?.id || currentUserLocation && currentUserLocation?.id || selectedCity,
            Latitude: currentUserLocation && currentUserLocation?.latitude,
            Longitude: currentUserLocation && currentUserLocation?.longitude,
            CategoryId: categoryId,
            SubCategoryId: subCategoryId,
            PostTypeId: 1,
            TagList: tagList,
            ContactTypeId: selectedOptionId,
            Email: "",
            Price: priceValue || "",
            PriceTypeId: priceTypeId || null,
            PurposeTypeId: postPurposeId,
            IsSold: false,
            Properties: [{
                Name: "BackgroundColor",
                Value: (() => {
                    // If selectedColor is white or darkgray, return empty string
                    if (selectedColor === colorMap.white || selectedColor === colorMap.darkgray) {
                        return "";
                    }

                    // Reverse map dark mode color to light mode equivalent
                    for (const [lightKey, darkColor] of Object.entries(colorMapping.dark)) {
                        if (darkColor.toLowerCase() === selectedColor.toLowerCase()) {
                            return colorMapping.light[lightKey] || selectedColor; // Convert to light mode color
                        }
                    }


                    return selectedColor; // If not in any mapping, use as is
                })()
            }]

        };
        if (isRepost && Object.keys(isRepost).length > 0 && isEditPost) {
            payLoad.Id = isRepost.id
        }
        if (isRepost && Object.keys(isRepost).length === 0) {
            payLoad.LocationId = locationObject?.id || currentUserLocation?.id || selectedCity
        } else {
            payLoad.LocationId = locationObject?.id || isRepost?.locationid || selectedCity
        }
        if (selectedOption == contactTypesEnum.EMAIL) {
            payLoad.Email = values.Email
        }
        if (selectedOption == contactTypesEnum.PHONEWHATSAPP) {
            payLoad.MobileNo = values.MobileNo
        }
        if (selectedOption == contactTypesEnum.PHONE) {
            payLoad.MobileNo = values.MobileNo
        }
        if (selectedOption == contactTypesEnum.WHATSAPP) {
            payLoad.MobileNo = values.MobileNo
        }
        if (selectedOption == contactTypesEnum.TELEGRAM) {
            payLoad.MobileNo = values.TelegramNo
        }
        
        if (selectedOption == contactTypesEnum.HIDEME) {
            if (requiresPaymentStep()) {
                setActiveStep(4)
                if (activeStep === 4) {
                    await submitPost(payLoad);
                }
            } else {
                setActiveStep(1)
                if (activeStep === 1) {
                    await submitPost(payLoad);
                }
            }
        }

        if (activeStep === 1 && !showOtpComponent && selectedOption != contactTypesEnum.HIDEME) {
            if (requiresPaymentStep() && !isEditPost) {
                if (loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3) {
                    await submitPost(payLoad);
                } else {

                    setActiveStep(4);
                }
                return;
            } else {
                await submitPost(payLoad);
                return;
            }
        }
        if (activeStep === 3) {
            if (isEditPost) {
                await submitPost(payLoad); // For edit post, submit directly after step 3
                return;
            }
            const shouldShowStep4 = slotData?.[0]?.isadfree === 0 || highLightAmount !== 0;
            if (shouldShowStep4) {
                setActiveStep(4); // Go to payment step
            } else {
                await submitPost(payLoad); // Skip Step 4 and post directly
            }
            return;
        }

        if (activeStep === 4 && !isEditPost && selectedOption != contactTypesEnum.HIDEME) {
            await submitPost(payLoad);
            return;
        }
    };

    const handleVerificationSubmitWrapper = async () => {
        await handleVerificationSubmit({
            selectedOption,
            watchField,
            otpValues,
            formValues,
            firstInputRef,
            onSubmit,
            setIsNewMobileNumVerified,
            setShowOtpComponent,
            setOtpValues
        });
    };

    useEffect(() => {
        const allFilled = otpValues.every(value => value.trim() !== '');
        if (allFilled) {
            handleVerificationSubmitWrapper();
        }
    }, [otpValues]);

    const handleOtpInputChange = (index, value) => {
        const newValue = value.slice(0, 1);
        const newOtpValues = [...otpValues];
        newOtpValues[index] = newValue;
        setOtpValues(newOtpValues);
        if (newValue && index < otpValues?.length - 1) {
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

    const handleResendOtpWrapper = async (resendProps?: ResendOtpProps) => {
        const props: ResendOtpProps = {
            selectedOption,
            watchField,
            setElapsedTime,
            setSeconds,
            setMinutes
        };
        await resendOtp(props);
    };

    const handleResendOtp = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
        }
        await handleResendOtpWrapper();
    };

    const handleColorSelect = (color) => {
        if (isDarkMode ? color === colorMap.darkgray : color === colorMap.white) {
            setHighLightColor("#4B5563")
        }
        setSelectedColor(color);
        // onClose();
    };


    const fetchAvailableSlot = async (mode) => {
        try {
            setIsLoading(true);
            const response = await fetchAvailablePostSlot();
            if (response.success) {
                setIsLoading(false);
                setSlotData(response.data)

                if (mode) {
                    setShouldCallOnSubmit(true);
                }
            } else {
                setIsLoading(false);
                message.error("Opps, an error occurred. Please try after sometime.");
            }
        } catch (error) {
            setIsLoading(false);
        }
    }
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files as FileList;
        if (!files || files.length === 0) return;

        // Get the maximum file size from optionData
        let maxFileSize;
        settingData?.data?.forEach((elm) => {
            if (elm?.name === "ImageSize") {
                maxFileSize = elm?.value * 1024; // Convert KB to bytes
            }
        });

        // Validate files
        const validationResult = await validateAndProcessFiles(files, {
            maxImages: 8,
            maxFileSize,
            t
        });

        if (!validationResult.isValid) {
            message.error(validationResult.errorMessage);
            return;
        }

        // Check if adding new files will exceed the maximum limit
        const currentImageCount = imageDeque.size || 0;
        if (currentImageCount + files.length > 8) {
            message.error(t('toastMessage.You can only upload a maximum of 8 images'));
            return;
        }

        // Process the files
        await processImageFiles(
            validationResult.processedFiles,
            imageDeque,
            setImageDeque,
            setImageMultipleData,
            setSelectedFileUpload
        );
    };

    const handleRemoveImage = async (keyToRemove, indexToRemove) => {
        setImageMultipleData((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));

        setSelectedFileUpload((prevDeque) => {
            const newHashMap = new HashMap();
            prevDeque.map.forEach((value, key) => {
                if (key !== keyToRemove) {
                    newHashMap.add(key, value);
                }
            });
            return newHashMap;
        });



        setImageDeque((prevDeque) => {
            const newHashMap = new HashMap();
            prevDeque.map.forEach((value, key) => {
                if (key !== keyToRemove) { // Exclude the image with the specified key
                    newHashMap.add(key, value);
                }
            });
            return newHashMap;
        });

        if (!isRepost) {
            if (Number.isInteger(keyToRemove)) {
                const deleteResp = await DeleteFile(isRepost?.id, keyToRemove);
                if (deleteResp?.success) {
                    setFilterValue({ ...filterValue, PageNumber: 1 })
                }
            } else {
                console.error('Key to remove is not an integer:', keyToRemove);
            }
        }
        if (isEditPost) {
            if (keyToRemove) {
                const deleteEditImage = await DeleteFile(isRepost?.id, keyToRemove);
                if (deleteEditImage?.sucess) {
                    setFilterValue({ ...filterValue, PageNumber: 1 })
                }

            } else {
                console.error("Not getting currect keyToRemove", keyToRemove)
            }
        }

        setIsShowDeletePopup(false);
    };

    const featchContactType = async () => {
        const response = await GetContactOptions(selectedLanguage);
        if (response?.success) {
            setContactOptions(response?.data)
        }

    }

    const items = contactOptions.map((option, index) => ({
        label: (
            <>
                <div className="d-flex align-items-center" style={{ width: "12" }}>
                    {/* Dynamically render the icon using the URL */}
                    <img
                        src={option.icon}
                        alt={option.name}
                        style={{ marginRight: 5 }}
                        className="h-w-20px"
                    />
                    <span className="selectedhide" style={{ color: "#252525" }}>
                        {option.name}
                    </span>
                </div>
            </>
        ),
        Title: option.name,
        key: String(index),
        id: option.id,
    }));




    const filteredItems = items.filter(item => item?.id !== selectedOption);



    const menu = (
        <Menu style={{ background: isDarkMode ? colorMap.darkgray : colorMap.white }} >
            {filteredItems.map(item => (
                <Menu.Item onClick={(event) => handleMenuClick(item)} key={item.key}>{item?.label}</Menu.Item>
            ))}
        </Menu>
    );

    const cityMenu = (
        <Menu style={{ maxHeight: '300px', overflowY: 'auto' }} >
            {
                cities?.length > 0 &&
                cities?.map(item => (
                    <Menu.Item style={{ padding: "5px 5px" }} onClick={(event) => handleCityMenuClick(item)} key={item.value}>{item.label}</Menu.Item>
                ))
            }

        </Menu>
    );

    const handleOptionSelected = () => {
        const selectedItem = items.find(item => item.id === selectedOption);
        return selectedItem?.label;
    }

    const isMobileView = () => {
        return window.innerWidth <= 768; // Adjust the width as needed for your mobile view breakpoint
    };

    const handleAccordinCategoryOk = (subCategory, category) => {
        setSelectedSubcategory(subCategory);
        setCategoryId(category?.id)
        setSubCategoryId(subCategory.SubCategoryId);
    }

    const handleFetchRepostData = async () => {
        await fetchRepostData(
            isRepost,
            isDarkMode,
            updatedCategoryList,
            categoryList,
            setValue,
            setPriceValue,
            setDisplayPrice,
            setSelectedColor,
            setSelectedOptionId,
            setPreviousMobileNumber,
            setPreviousMobileno,
            setPrevWhatsapp,
            setPrevTelegram,
            setPrevEmail,
            setSelectedCategory,
            setSubCategoryId,
            setCategoryId,
            setSelectedSubcategory,
            setCategoryClick,
            setSelectedOption,
            setSelectedLoction,
            setSelectedFileUpload,
            setImageDeque,
            selectedPurpose?.value
        );
    };

    const handleOtpRetrieval = () => {
        const ac = new AbortController();

        const options: any = { // Use `any` here to avoid TypeScript errors
            otp: { transport: ['sms'] },
            signal: ac.signal,
        };
        navigator.credentials.get(options).then((credential) => {
            if (credential && 'code' in credential) { // Check if credential has a 'code' property
                const otpMessage = (credential as OTPCredential).code; // Assert credential as OTPCredential

                // Extract 6 digits from the received message using regex
                const otp = otpMessage.match(/\d{6}/)?.[0]; // Look for the first 6-digit sequence in the message
                if (otp) {
                    const newOtpValues = otp.split(''); // Split OTP into individual digits
                    setOtpValues(newOtpValues); // Update OTP input values
                    // Focus on the last input if applicable
                    inputRefs.current[otp.length - 1]?.focus();
                } else {
                    //console.log('OTP not found in the message.');
                }
            } else {
                //console.log(`Unexpected credential type: ${credential}`);
            }
        }).catch((err: Error) => {
            //console.log(`Error retrieving OTP: ${err}`);
        });
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

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    const [isListening, setIsListening] = useState(false);
    const [currentType, setCurrentType] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [detailTranscript, setDetailTranscript] = useState("");
    const [recognitionLang, setRecognitionLang] = useState(null)


    const startListening = (type) => {
        if (!SpeechRecognition) {
            alert('Your browser does not support speech recognition.');
            return;
        }

        recognition.start();
        setIsListening(true);
        setCurrentType(type);

        recognition.onresult = (event) => {
            const currentTranscript = event.results[0][0].transcript;

            if (type === 'Title') {
                setTranscript((prev) => {
                    const updatedTranscript = prev + ' ' + currentTranscript;
                    setValue('Title', updatedTranscript); // Use the updated transcript here
                    return updatedTranscript; // Ensure state is updated
                });
            } else if (type === 'detail') {
                setDetailTranscript((prev) => {
                    const updatedDetailTranscript = prev + ' ' + currentTranscript;
                    setValue('Advertise_details', updatedDetailTranscript); // Use the updated detail transcript here
                    return updatedDetailTranscript; // Ensure state is updated
                });
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error: ', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            setCurrentType(null); // Reset current type
        };
    };


    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
        setIsListening(false);
        setCurrentType(null);
    };



    const memoizedFetchRepostData = useMemo(() => {
        return async () => {
            if (!isEditPost) {
                await handleFetchRepostData();
            }
        };
    }, [isRepost, updatedCategoryList, cities, isEditPost]);

    useEffect(() => {
        const allFilled = otpValues.every(value => value.trim() !== '');
        if (allFilled) {
            handleVerificationSubmitWrapper();
        }
    }, [otpValues]);

    useEffect(() => {
        if (cityData?.length > 0) {
            const convertibleArray = cityData.map((elm) => ({
                label: elm?.label,
                value: elm?.value
            }));
            // Prepend an object with label and value as null

            setCities(convertibleArray);
        }
    }, [cityData]);

    useEffect(() => {
        if (shouldCallOnSubmit) {
            onSubmit(watchField);
            setIsAddFundModalOpen(false);
        }
    }, [shouldCallOnSubmit])



    useEffect(() => {
        setValue("MobileNo", loginUserState?.data && loginUserState?.data[0]?.mobileno)
        setValue("TelegramNo", loginUserState?.data && loginUserState?.data[0]?.mobileno)
        setValue("WhatsappNo", loginUserState?.data && loginUserState?.data[0]?.mobileno)


    }, [loginUserState])



    const { calculateAmount } = useHighlightCalculation({
        selectedColor,
        slotData,
        isDarkMode,
        highLightAmount,
        setHighLightAmount,
        setHighLightColor,
        setShowPlusIcon,
        setHighLight,
        amountCalculation,
        setAmountCalculation,
        totalTargetAmount,
        activeStep,
        setTargetAmount,
        colorMap,
    });

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
            }, 3000);
            return () => {
                clearInterval(interval);
            };
        }

    }, [showOtpComponent, seconds]);

    useEffect(() => {
        memoizedFetchRepostData();
    }, [memoizedFetchRepostData]);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowDown') {
                const menuElement = dropdownRef.current;
                if (menuElement) {
                    const activeElement = document.activeElement as HTMLElement;
                    if (activeElement && activeElement.tagName === 'LI') {
                        const nextElement = activeElement.nextElementSibling as HTMLElement;
                        if (nextElement) {
                            nextElement.focus();
                            nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    } else {
                        const firstItem = menuElement.querySelector('li') as HTMLElement;
                        if (firstItem) {
                            firstItem.focus();
                            firstItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            }
        };

        if ('OTPCredential' in window) {
            handleOtpRetrieval()
        }

        featchContactType()

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (isRepost && Object.keys(isRepost).length === 0) {
            let selectedCityValue = cities?.find((d) => d?.value === selectedCity);
            setSelectedOptionCity(selectedCityValue);
        }
    }, [cities])

    useEffect(() => {
        const titleValue = watchField?.Title;
        const detailsValue = watchField?.Advertise_details;

        setTranscript(titleValue || '');
        setDetailTranscript(detailsValue || '');
    }, [watchField?.Title, watchField?.Advertise_details]);


    const [expanded, setExpanded] = useState<string | false>(false);

    const handleCAChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const fetchSelectedCityById = async (locationId) => {
        try {
            if (selectedLanguage) {
                const payload = {
                    LanguageId: selectedLanguage,
                    LocationId: locationId
                }
                const response = await getLocationById(payload)

                if (response.success) {
                    // setSelectedCityName(response.data[0].name)
                    const cityName = response.data?.[0]?.name

                     
                    return cityName
                }
            } else {
                // setSelectedCityName(t("General.All Cities"))
                return t("General.All Cities")
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        const updateLocationName = async () => {
            const currentUserLocation = await getData("currentUserLocation");
            // Determine the location ID to use, either from loginUserData or locationObject
            let locationId;
            if (isRepost && Object.keys(isRepost).length === 0) {
                locationId = locationObject?.id  || selectedCity;
            } else {
                locationId = locationObject?.id || isRepost?.locationid || selectedCity;

            }



            if (locationId) {
                const cityName = await fetchSelectedCityById(locationId);
                setSelectedLoction(cityName)
            } 
        };

        updateLocationName()
    }, [locationObject])

    useEffect(() => {
        if (recognition) {
            const recognitionLangvalue = LanguageEnum[i18n?.language?.toUpperCase()] || LanguageEnum.EN;
            recognition.lang = recognitionLang;
            setRecognitionLang(recognitionLangvalue)
        } else {
            console.error("Speech recognition is not supported in this browser.");
        }
    }, [recognition])

    useEffect(() => {
        if (locationObject && locationObject.name) {
            setSelectedLoction(locationObject.name);
        }
    }, [locationObject]);





    useEffect(() => {
        fetchAvailableSlot(false)
        setSelectedOption(1);
        const ModifiedCategoryList = categoryList?.data?.map((elm) => ({
            label: <><div style={{ display: "flex", alignItems: "center" }}>
                <img src={elm.icon} /> <span style={{ marginLeft: "10px" }}>{elm.Name}</span></div></>,
            value: elm.Name,
            id: elm.id
        }))
        // handleGetOtpOptions();
        setUpdatedCategortyList(ModifiedCategoryList)
        const timer = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
            setOtp("");
            setElapsedTime(0)
            setShowOtpComponent(false);
            setMinutes(4);
            setSeconds(59);
            setFormValues(null);
            setShouldCallOnSubmit(false);
            setIsNewMobileNumVerified(false);
            setIsLoading(false);
            setImageDeque(new HashMap());
            setImageSlideOpen(false);
            setImageMultipleData([]);
            setActiveStep(1);
            setSelectedFileUpload(new HashMap());
            setUpdatedCategortyList([]);
            setSelectedCategory(null);
            setImageKey(null);
            setImageIndex(null);
            setIsShowDeletePopup(false);
            setPreviousMobileNumber(false);
        }
    }, [])


    function trigger(arg0: string) {
        throw new Error('Function not implemented.');
    }



    useEffect(() => {
        if (activeStep === 4 && !isEditPost) {
            setHighLight(true);

            if (amountCalculation > 0) {
                const timer = setTimeout(() => {
                    setHighLight(false);
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [activeStep, amountCalculation, isEditPost]);


    useEffect(() => {

        if (isEditPost && editPostData) {

            setValue('Title', editPostData.title);
            setValue('Advertise_details', editPostData.shortdescription);
            setValue('price', editPostData.price);
            setPriceValue(editPostData.price);
            setDisplayPrice(editPostData.price);
            setPriceTypeId(editPostData.pricetypeid);
            setPostPurposeId(editPostData.purposetypeid);
            const category = updatedCategoryList.find((elm) => elm.id === editPostData.categoryid);
            setValue("categoryName", category);
            setSelectedCategory(category);
            const categoryData = categoryList?.data?.find((elm) => elm.id === editPostData.categoryid);

            const transformCategoryData = (categoryData) => {
                return {
                    Name: categoryData?.displayname,
                    Icon: categoryData?.icon,
                };
            };

            let subcategory;
            if (categoryData?.subcategory && editPostData.subcategoryid) {
                subcategory = JSON.parse(categoryData?.subcategory)?.find(
                    (elm) => elm.SubCategoryId === editPostData.subcategoryid
                );
                setSubCategoryId(subcategory.SubCategoryId);
            }

            setCategoryId(categoryData?.id);
            if (categoryData?.subcategory && editPostData.subcategoryid) {
                setSelectedSubcategory(subcategory);
            } else {
                const transformedData = transformCategoryData(categoryData);
                setSelectedSubcategory(transformedData);
                setCategoryClick(true);
            }

            setValue("SubCategoryId", editPostData.subcategoryid);
            setSelectedOptionId(editPostData.contacttypeid);
            setSelectedOption(editPostData.contacttypeid);

            if (editPostData.contacttypeid === contactTypesEnum.EMAIL) {
                setValue('Email', editPostData.email);
                setPrevEmail(editPostData.email);
            } else if (editPostData.contacttypeid === contactTypesEnum.PHONE ||
                editPostData.contacttypeid === contactTypesEnum.PHONEWHATSAPP) {
                const mobileNo = editPostData.mobileno?.replace(/^\+91/, '');
                setValue('MobileNo', mobileNo);
                setPreviousMobileNumber(mobileNo);
                setPreviousMobileno(mobileNo);
            } else if (editPostData.contacttypeid === contactTypesEnum.TELEGRAM) {
                const mobileNo = editPostData.mobileno?.replace(/^\+91/, '');
                setValue('TelegramNo', mobileNo);
                setPrevTelegram(mobileNo);
            } else if (editPostData.contacttypeid === contactTypesEnum.WHATSAPP) {
                const mobileNo = editPostData.mobileno?.replace(/^\+91/, '');
                setValue('WhatsappNo', mobileNo);
                setPrevWhatsapp(mobileNo);
            }
            if (editPostData.locationid) {
                fetchSelectedCityById(editPostData.locationid);
            }
            if (editPostData.image && editPostData.image.length > 0) {
                try {
                    const newDeque = new HashMap();
                    editPostData.image.forEach((img) => {
                        if (img.key && img.adsimage) {
                            newDeque.add(img.key, img.adsimage);
                        }
                    });
                    setImageDeque(newDeque);
                } catch (error) {
                    console.error('Error setting images:', error);
                }
            }
        }
    }, [isEditPost, editPostData, updatedCategoryList, categoryList]);
    
    const isGujarat = selectedCity === stateId.Gujarat ; 
    useEffect(() => {
      if (!isEditPost && !isRepost && isGujarat) {
        setIsStateSelect(true);
      }
      return () => {
          setIsStateSelect(false);
      };
    }, [isGujarat, selectedCity, isEditPost, isRepost]);
    

    return (
        <>
            <div className='dialog-wrapper'>
                <div className="dialog-body pt-0">
                    <form id="advertiseDetailsForm" onSubmit={handleSubmit(onSubmit)} className='poststiper'>
                        <Grid display="flex" className='overflow-hidden putDialogStepper' container wrap="wrap">
                            {/* <div className={postDetailsStyle.antStepperTitle}> */}
                            <Steps
                                className={postDetailsStyle.antStepperTitle}
                                items={[
                                    {
                                        title: isEditPost ? t('General.Edit') : t('General.Create an Ad'),
                                        icon: <EditNoteIcon className={activeStep > 1 ? 'bg-lightgreen' : ""} />,
                                    },


                                    ...(showOtpComponent ? [
                                        {
                                            title: t('General.Verify OTP'),
                                            icon: <LockIcon className={activeStep === 4 ? 'bg-lightgreen' : activeStep < 2 ?
                                                "bg-darkGray" : ""} />,
                                        },
                                        //{
                                        //    title: t('General.Upload Image'),
                                        //    icon: (
                                        //        <span className={`text-xl ${activeStep === 4 ? '' : 'text-darkGray'}`}>
                                        //            <img
                                        //                src="/upload_image.png"
                                        //                alt="Upload icon"
                                        //                className="h-5 w-5"  // Adjust size as needed
                                        //            />
                                        //        </span>
                                        //    ),
                                        //},
                                    ] : [
                                        // {
                                        //     title: t('General.Upload Image'),
                                        //     icon: <CloudUploadIcon className={activeStep === 1 ? 'bg-darkGray' : ''} />,
                                        // },
                                    ]),

                                ]}
                                labelPlacement='vertical'
                            />
                            {/* </div> */}
                            {activeStep === 1 && (
                                <>

                                    <div className='w-100'>
                                        <div className="putContainer">
                                            <Grid item lg={gridSize} md={gridSize} xl={gridSize} sm={gridSize} xs={12} className={postDetailsStyle.postAdd}>
                                                <DialogContent sx={{ p: "2px", }}>
                                                    <div className="">
                                                        <div className="input w-100  categorydropdown">
                                                            {/* <SelectField
                                    {...{
                                        register,
                                        formState,
                                        control,
                                        id: "categoryName",
                                        name: "categoryName",
                                        options: updatedCategoryList,
                                        label: t("General.Select category*"),
                                        onSelectChange: (value: any) => setSelectedCategory(value),
                                        placeholder: t("General.Select Category")+"*",
                                        classNamePrefix: "react-select",  
                                        isMulti: false,
                                        isClearable: false,
                                        // menuIsOpen: true,
                                    }}
                                /> */}
                                                            <AccordionComponent categoryClick={categoryClick} setCategoryClick={setCategoryClick} selectedSubcategory={selectedSubcategory} categoryList={categoryList} handleOk={handleAccordinCategoryOk} />

                                                        </div>
                                                        <div className='relative mt-10'>
                                                            <label className='font-13 font-bold' style={{ margin: "5px 0px" }}>{t("General.Title")}*</label>
                                                            <InputField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "Title",
                                                                    id: "Title",
                                                                    type: "text",
                                                                    placeholder: t("General.Title") + "*",
                                                                    autoComplete: "true",
                                                                    style: {
                                                                        width: "calc(100% - 1px)",
                                                                        backgroundColor: selectedColor,
                                                                        borderRadius: "4px",
                                                                        marginTop: "5px"
                                                                        // border: "1px solid #ced4da",
                                                                    },
                                                                    maxLength: 200,
                                                                    // className: `p-0 font-13 font-bold ${watchField?.Title?.length > 20 ? "text-red" : ""} title-width`,

                                                                    onInput: (e) => {
                                                                        const maxLength = 200;
                                                                        const inputValue = e.target.value;

                                                                        if (inputValue.length > maxLength) {
                                                                            e.target.value = inputValue.slice(0, maxLength);
                                                                            setValue("Title", e.target.value);
                                                                        } else {
                                                                            setValue("Title", inputValue);
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& .MuiInputBase-input": {
                                                                            padding: "10px 12px !important",
                                                                            "&::placeholder": {
                                                                                color: isDarkMode ? "#FF0000" : "#888888",
                                                                                opacity: 1,
                                                                            },
                                                                        },
                                                                        "& .MuiOutlinedInput-root": {
                                                                            border: isDarkMode ? "1px solid #504f4f" : "",
                                                                            borderRadius: "4px",
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            border: isDarkMode ? "none" : "",
                                                                        },
                                                                    },
                                                                    endAdornment: (
                                                                        !isIOS() && (
                                                                            <div className="mickeicon">
                                                                                <KeyboardVoiceIcon
                                                                                    onClick={() => (isListening && currentType === 'Title' ? stopListening() : startListening('Title'))}
                                                                                    className={isListening && currentType === 'Title' ? 'listening' : ''}
                                                                                    style={{
                                                                                        background: 'white',
                                                                                        color: 'green',
                                                                                        border: 'none',
                                                                                        borderRadius: '50%',
                                                                                        cursor: 'pointer',
                                                                                        fontSize: "20px"
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    ),
                                                                }}
                                                            />
                                                            <div className='wordcount'>
                                                                <span className='mt-4'>{watchField?.Title?.length}/200</span>
                                                            </div>
                                                        </div>
                                                        {/* <Divider className='mb-3' /> */}
                                                        <label className='font-13 font-bold' style={{ margin: "5px 0px" }}>{t("General.Description")}*</label>
                                                        <div className='relative mb-10' >

                                                            <TextAreaField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "Advertise_details",
                                                                    id: "Advertise_details",
                                                                    type: "textarea",

                                                                    placeholder: t("General.Advertise details") + "*",
                                                                    autoComplete: "true",
                                                                    multiline: true,
                                                                    draggable: false,
                                                                    className: `${postDetailsStyle.customtextarea}`,
                                                                    style: {
                                                                        backgroundColor: selectedColor,
                                                                        borderRadius: "4px",
                                                                        width: "90%",
                                                                        border: "1px solid #ced4da",
                                                                        marginTop: "5px",
                                                                        color: isDarkMode
                                                                            ? colorMap.white
                                                                            : colorMap.darkgray,
                                                                    },
                                                                    onKeyDown: (e) => {
                                                                        if (e?.target?.value?.trim() === "" && e?.keyCode === 13) {
                                                                            e.preventDefault();
                                                                        }
                                                                    },
                                                                    onInput: (e) => {
                                                                        const maxLength = 600;
                                                                        const inputValue = e.target.value;

                                                                        if (inputValue.length > maxLength) {
                                                                            e.target.value = inputValue.slice(0, maxLength);
                                                                            setValue("Advertise_details", e.target.value);
                                                                        } else {
                                                                            setValue("Advertise_details", inputValue);
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& .MuiInputBase-input": {
                                                                            padding: "10px 12px !important",
                                                                        },
                                                                        "& .MuiOutlinedInput-root": {
                                                                            border: isDarkMode ? "1px solid #504f4f" : "1px solid #ff780c",
                                                                            borderRadius: "4px",
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            border: isDarkMode ? "none" : "",
                                                                        },
                                                                    },
                                                                }}

                                                            />
                                                            {
                                                                !isIOS() && (
                                                                    <div className="mickeicon mt-10">
                                                                        <KeyboardVoiceIcon
                                                                            onClick={() => (isListening && currentType === 'detail' ? stopListening() : startListening('detail'))}
                                                                            className={isListening && currentType === 'detail' ? 'listening' : ''}
                                                                            style={{
                                                                                background: 'white',
                                                                                color: 'green',
                                                                                border: 'none',
                                                                                borderRadius: '50%',
                                                                                cursor: 'pointer',
                                                                                fontSize: "20px"

                                                                            }}
                                                                        />
                                                                    </div>
                                                                )
                                                            }


                                                            <div className='wordcount'>
                                                                <span>{watchField?.Advertise_details?.length}/600</span>
                                                            </div>
                                                            <div className={`mb-10`}>
                                                                <label className='font-13 font-bold' style={{ width: "calc(100% - 1px) !important" }}>{t("General.Price")}</label>
                                                                <InputField
                                                                    {...{
                                                                        register,
                                                                        formState,
                                                                        control,
                                                                        variant: "outlined",
                                                                        name: "price",
                                                                        id: "price",
                                                                        type: "Number",
                                                                        value: displayPrice || "",
                                                                        autoComplete: "true",
                                                                        placeholder: t("General.Price"),
                                                                        style: {
                                                                            backgroundColor: selectedColor,
                                                                            marginTop: "5px"
                                                                        },
                                                                        onChange: (e) => {
                                                                            const value = e.target.value;
                                                                            const sanitizedValue = value.replace(/[^0-9.]/g, '');
                                                                            const decimalCount = (sanitizedValue.match(/\./g) || []).length;
                                                                            if (decimalCount > 1) return;
                                                                            const parts = sanitizedValue.split('.');
                                                                            if (parts[1] && parts[1].length > 2) return;
                                                                            if (parseFloat(sanitizedValue) > 1000000000) return;
                                                                            setPriceValue(sanitizedValue);
                                                                            setDisplayPrice(sanitizedValue);
                                                                        },
                                                                        className: `p-0 min-h-auto ${postDetailsStyle.priceInput}`,
                                                                        startAdornment: <InputAdornment position="start" className="font-16 ruppescontent mr-10 pl-8">₹</InputAdornment>,
                                                                        sx: {
                                                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                                                WebkitAppearance: "none",
                                                                                margin: 0,
                                                                            },
                                                                            "& .MuiInputBase-input": {
                                                                                "&::placeholder": {
                                                                                    color: isDarkMode ? "#fff" : "#888888",
                                                                                    opacity: 1,
                                                                                },
                                                                            },
                                                                            "& .MuiOutlinedInput-root": {
                                                                                border: isDarkMode ? "1px solid #504f4f" : "",
                                                                                borderRadius: "4px",
                                                                            },
                                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                                border: isDarkMode ? "none" : "",
                                                                            },
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className='d-flex mb-5 custdrodownscroll flex-column'>
                                                                <label className="font-13 font-bold mb-10 mt-10">
                                                                    {t("General.Location")}
                                                                </label>
                                                                <div
                                                                    className='d-flex align-items-center mb-4'
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => setIsLocationPicker(true)}
                                                                >
                                                                    <LocationOnIcon style={{ color: "#e73c2e" }} className="font-16  mr-5" />
                                                                    {/* <p className='mt-0 mb-0'>{cityData?.data?.find((d) => d?.id === selectedCity).city}</p> */}

                                                                    {/* <Dropdown placement="bottomCenter" className='custdrodown' overlayStyle={{ zIndex: 9999, }} overlay={<div className='custdrodownscroll' ref={dropdownRef}>{cityMenu} </div>}  >
                                                <a onClick={(e) => e.preventDefault()}>
                                                    <Space>
                                                        {selectedOptionCity ? <div className='dropdownlabel d-flex align-items-center' >{cities?.find((d) => d?.value === selectedOptionCity.value)?.label} <KeyboardArrowDownIcon sx={{ marginLeft: "2px", marginRight: "10px", height: "25px", width: "20px" }} />  </div> : t("General.select city")}
                                                    </Space>
                                                </a>
                                            </Dropdown> */}
                                                                    <span className={isDarkMode && selectedColor !== "#242424" ? "black-text" : ""} onClick={() => setIsLocationPicker(true)}>{ isStateSelect || !selectedLocation ? t("General.Choose State") : selectedLocation}</span>
                                                                </div>
                                                            </div>
                                                            {/*                             <div className="items-center mb-10 mt-10">
                                                                <div>
                                                                    <Typography variant="subtitle1" className='font-13 font-bold pb-0' gutterBottom>
                                                                        {t("General.PriceType")}
                                                                    </Typography>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={priceTypeId === 1}
                                                                                onChange={() => handlePriceChange(1)}

                                                                                sx={{
                                                                                    fontSize: "13px",
                                                                                    color: 'success.main',
                                                                                    '&.Mui-checked': {
                                                                                        color: 'success.main',
                                                                                    },
                                                                                }}
                                                                            />
                                                                        }
                                                                        label={t("General.PriceTypeOptions.Negotiable")}
                                                                    />
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={priceTypeId === 2}
                                                                                onChange={() => handlePriceChange(2)}
                                                                            />
                                                                        }
                                                                        label={t("General.PriceTypeOptions.NonNegotiable")}
                                                                    />

                                                                </div>

                                                            </div> 
                                                            <div className="mb-10 mt-10">
                                                                <label className="block font-13 font-bold mb-10 text-sm">
                                                                    {t("General.Why are you posting?")}
                                                                </label>

                                                                <SelectField
                                                                    {...{
                                                                        register,
                                                                        formState,
                                                                        control,
                                                                        id: "Purpose",
                                                                        name: "Purpose",
                                                                        options: postPurposeOptions,
                                                                        label: t("General.posting options.purpose"),
                                                                        placeholder: t("General.posting options.purpose"),
                                                                        classNamePrefix: "react-select",
                                                                        isMulti: false,
                                                                        isClearable: false,
                                                                        onSelectChange: handlePurposeChange,
                                                                        value: selectedPurpose,
                                                                        isSearchable: false,
                                                                        className: `${isDarkMode ? 'react-select dark' : 'react-select'} mt-8`,
                                                                        styles: {
                                                                            control: (base) => ({
                                                                                ...base,
                                                                                border: '1px solid #d9d9d9',
                                                                                boxShadow: 'none',
                                                                            }),
                                                                            singleValue: (base) => ({
                                                                                ...base,
                                                                                color: isDarkMode ? '#e2e8f0' : '#333', 
                                                                            }),
                                                                            dropdownIndicator: (base) => ({
                                                                                ...base,
                                                                                color :`#ff780c`,
                                                                              }),
                                                                        },
                                                                        
                                                                    }}
                                                                />

                                                            </div>


                                                            {/*<div className='wordcount'>
                                                    <span>{watchField?.Advertise_details?.length}/600</span>
                                                </div>*/}
                                                            {/*</div>*/}



                                                            {/*<label className="label">
                                <div className='pl-20 pr-20'>
                                    <div className="drag-file-area">
                                        <span className="browse-files">*/}
                                                            {/*<CloudUploadIcon className='upload-icon' />
                                            */}
                                                            {/*<div className="upload-icon">🖼️</div>
                                            <input type="file" accept="image/*" name="Document" id="contained-button-file" title="" onChange={(e: any) => handleFileUpload(e)} multiple={true} className="default-file-input" />
                                            <span className="browse-files-text">{t("General.browse file")} </span>
                                            <span>{t("General.from device")}</span>
                                        </span>
                                    </div>
                                </div>
                            </label>*/}
                                                            {/* Put Ads Component - Image Upload */}
                                                            <div className={`mb-10 mt-10 ${postDetailsStyle.p}`} >
                                                                <Grid item xs={12}>
                                                                    <div className={postDetailsStyle.imageUploadContainer}>
                                                                        <label className={postDetailsStyle.imageUploadLabel}>
                                                                            {t("General.Image Upload")} ({imageDeque.size || 0}/8)
                                                                        </label>
                                                                    </div>
                                                                </Grid>

                                                                {/* Grid container for images */}
                                                                <Grid container spacing={2}>
                                                                    {/* Map through existing images */}
                                                                    {imageDeque?.getAllDataWithKey()?.map((elm, index) => (


                                                                        <Grid item xs={4} key={elm.key}>
                                                                            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", position: "relative" }}>
                                                                                <img
                                                                                    src={elm.value}
                                                                                    alt={`Image ${index + 1}`}
                                                                                    style={{ width: '100%', borderRadius: '8px', maxHeight: "80px", objectFit: "cover" }}
                                                                                />
                                                                                <DeleteOutlineIcon
                                                                                    className='delete-icon'
                                                                                    onClick={() => {
                                                                                        setIsShowDeletePopup(true);
                                                                                        setImageKey(elm.key);
                                                                                        setImageIndex(index)
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </Grid>
                                                                    ))}

                                                                    {/* Upload button - only show if less than 8 images */}
                                                                    {imageDeque.size < 8 && (
                                                                        <Grid item xs={4}>
                                                                            <div className={postDetailsStyle.imageUploadContainer}>
                                                                                <label className={`${postDetailsStyle.dragFileBox} ${isDarkMode ? postDetailsStyle.darkModeDragFileBox : ''}`}>
                                                                                    <span className={postDetailsStyle.uploadPlus}>+</span>
                                                                                    <input
                                                                                        type="file"
                                                                                        accept="image/*"
                                                                                        multiple
                                                                                        className={postDetailsStyle.imageUploadInput}
                                                                                        onChange={handleFileUpload}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        </Grid>
                                                                    )}
                                                                </Grid>
                                                                <div className="d-flex mb-0 mt-10" style={{ flexDirection: "column", marginBottom: "5px" }}>

                                                                    <div className='d-flex  iconsdrodown' style={{ flexDirection: "column" }}>
                                                                        <label className="font-13 font-bold mb-0  mt-10">
                                                                            {t("contactType.Contact")}
                                                                        </label>
                                                                        <div className='d-flex align-items-start mb-3 iconsdrodown input-field'>
                                                                            <Dropdown placement="bottomLeft" overlayStyle={{ zIndex: 9999 }} overlay={menu}>
                                                                                <a onClick={(e) => e.preventDefault()}>
                                                                                    <Space>
                                                                                        {selectedOption ? (
                                                                                            <div className='dropdownlabel d-flex align-items-center mt-5 ' >
                                                                                                {handleOptionSelected()}
                                                                                                <KeyboardArrowDownIcon sx={{ marginLeft: "0px", marginRight: "0px" }} />
                                                                                            </div>
                                                                                        ) : (
                                                                                            "select option"
                                                                                        )}
                                                                                    </Space>
                                                                                </a>
                                                                            </Dropdown>
                                                                            {
                                                                                selectedOption === contactTypesEnum.EMAIL &&
                                                                                <InputField style={{ top: "-6px" }}
                                                                                    {...{
                                                                                        register,
                                                                                        formState,
                                                                                        control,
                                                                                        name: "Email",
                                                                                        id: "Email",
                                                                                        type: "text",
                                                                                        placeholder: t("General.Email*"),
                                                                                        className: `p-0  min-h-auto ${postDetailsStyle.textArea}`,
                                                                                        autoComplete: "true",
                                                                                        onBlur: handleBlur,

                                                                                        onInput: (e) => {

                                                                                            const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                                                                                            if (!isAdmin && loginUserData?.data[0]?.mobileno !== e.target.value) {
                                                                                                setShowOtpComponent(true);
                                                                                            } else {
                                                                                                setShowOtpComponent(false);
                                                                                            }

                                                                                        },
                                                                                        sx: {
                                                                                            "& fieldset": { border: 'none' },
                                                                                            "& .MuiInputBase-input": {
                                                                                                color: isDarkMode
                                                                                                    && "#fff",
                                                                                                width: "265px !important"
                                                                                            },
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }

                                                                            {
                                                                                (selectedOption === contactTypesEnum.PHONE || selectedOption === contactTypesEnum.PHONEWHATSAPP) &&
                                                                                <InputField style={{ top: "-6px" }}
                                                                                    {...{
                                                                                        register,
                                                                                        formState,
                                                                                        control,
                                                                                        name: "MobileNo",
                                                                                        id: "MobileNo",
                                                                                        type: "number",
                                                                                        placeholder: t("General.Mobile number*"),
                                                                                        className: `p-0 mt-2 hideNumberSpin min-h-auto ${postDetailsStyle.textArea}`,
                                                                                        autoComplete: "true",
                                                                                        // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,

                                                                                        onInput: (e) => {
                                                                                            // Remove whitespace and non-numeric characters
                                                                                            let rawValue = e.target.value.replace(/\s+/g, '');
                                                                                            let sanitizedValue = rawValue.replace(/\D/g, '');

                                                                                            // Dynamically handle country code stripping as user types
                                                                                            if (sanitizedValue.length > 10) {
                                                                                                if (sanitizedValue.startsWith('91') && sanitizedValue.length === 12) {
                                                                                                    sanitizedValue = sanitizedValue.substring(2);
                                                                                                } else if (sanitizedValue.startsWith('+91') && sanitizedValue.length === 13) {
                                                                                                    sanitizedValue = sanitizedValue.substring(3);
                                                                                                }
                                                                                            }




                                                                                            // Ensure the sanitized value doesn't exceed 10 digits
                                                                                            sanitizedValue = sanitizedValue.slice(0, 10);
                                                                                            if (/^000+/.test(sanitizedValue)) {
                                                                                                sanitizedValue = sanitizedValue.replace(/^0+/, '');
                                                                                            } else if (/^00\d/.test(sanitizedValue)) {
                                                                                                sanitizedValue = sanitizedValue;
                                                                                            } else if (/^0{3,}/.test(sanitizedValue)) {
                                                                                                sanitizedValue = sanitizedValue.replace(/^0{3,}/, '00');
                                                                                            }

                                                                                            // Prevent repetitive patterns (e.g., 0808080808, 1212121212)
                                                                                            const isRepeatedPattern = (num) => {
                                                                                                if (num.length !== 10) return false;
                                                                                                return /^(\d\d)\1{4}$/.test(num);
                                                                                            };

                                                                                            if (isRepeatedPattern(sanitizedValue)) {
                                                                                                sanitizedValue = "";
                                                                                            }
                                                                                            e.target.value = sanitizedValue;

                                                                                            setShowOtpComponent(true);
                                                                                            const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                                                                                            if (!isAdmin && loginUserData?.data[0]?.mobileno !== sanitizedValue) {
                                                                                                setShowOtpComponent(true);
                                                                                            } else {
                                                                                                setShowOtpComponent(false);
                                                                                            }

                                                                                            // Trigger the register handler if provided
                                                                                            if (register) {
                                                                                                register("MobileNo").onChange({
                                                                                                    target: { name: "MobileNo", value: sanitizedValue },
                                                                                                });
                                                                                                setValue("TelegramNo", sanitizedValue);
                                                                                                setValue("WhatsappNo", sanitizedValue);
                                                                                            }
                                                                                        },

                                                                                        sx: {
                                                                                            "& fieldset": { border: 'none' },
                                                                                            "& .MuiInputBase-input": {
                                                                                                color: isDarkMode
                                                                                                    && "#fff"
                                                                                            },
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }

                                                                            {
                                                                                selectedOption === contactTypesEnum.TELEGRAM &&
                                                                                <InputField style={{ top: "-2px" }}
                                                                                    {...{
                                                                                        register,
                                                                                        formState,
                                                                                        control,
                                                                                        name: "TelegramNo",
                                                                                        id: "TelegramNo",
                                                                                        type: "number",
                                                                                        placeholder: t("General.Telegram number*"),
                                                                                        className: `p-0 min-h-auto ${postDetailsStyle.textArea}`,
                                                                                        autoComplete: "true",
                                                                                        // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,
                                                                                        onInput: (e) => {
                                                                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                                                                                            setValue("WhatsappNo", e.target.value);
                                                                                            setValue("MobileNo", e.target.value);
                                                                                            const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                                                                                            if (!isAdmin && loginUserData?.data[0]?.mobileno !== e.target.value) {
                                                                                                setShowOtpComponent(true);
                                                                                            } else {
                                                                                                setShowOtpComponent(false);
                                                                                            }

                                                                                        },

                                                                                        sx: {
                                                                                            "& fieldset": { border: 'none' },
                                                                                            "& .MuiInputBase-input": {
                                                                                                color: isDarkMode
                                                                                                    && "#fff"
                                                                                            },
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }

                                                                            {
                                                                                selectedOption === contactTypesEnum.WHATSAPP &&
                                                                                <InputField style={{ top: "-2px" }}
                                                                                    {...{
                                                                                        register,
                                                                                        formState,
                                                                                        control,
                                                                                        name: "WhatsappNo",
                                                                                        id: "WhatsappNo",
                                                                                        type: "number",
                                                                                        placeholder: t("General.WhatsApp number*"),
                                                                                        className: `p-0  min-h-auto ${postDetailsStyle.textArea}`,
                                                                                        autoComplete: "true",
                                                                                        // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,
                                                                                        onInput: (e) => {
                                                                                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                                                                                            setValue("TelegramNo", e.target.value);
                                                                                            setValue("MobileNo", e.target.value);
                                                                                            const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3;
                                                                                            if (!isAdmin && loginUserData?.data[0]?.mobileno !== e.target.value) {
                                                                                                setShowOtpComponent(true);
                                                                                            } else {
                                                                                                setShowOtpComponent(false);
                                                                                            }
                                                                                        },

                                                                                        sx: {
                                                                                            "& fieldset": { border: 'none' },
                                                                                            "& .MuiInputBase-input": {
                                                                                                color: isDarkMode
                                                                                                    && "#fff"
                                                                                            },
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            }

                                                                            {/* <InputField
                                                {...{
                                                    register,
                                                    formState,
                                                    control,
                                                    name: "MobileNo",
                                                    id: "MobileNo",
                                                    type: "number",
                                                    placeholder: "Mobile number*",
                                                    className: "p-0 hideNumberSpin min-h-auto",
                                                    autoComplete: "true",
                                                    // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,
                                                    onInput: (e) => {
                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                    },
                                                    sx: {
                                                        "& fieldset": { border: 'none' },
                                                    }
                                                }}
                                            /> */}
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                                {
                                                                    !isEditPost &&
                                                                    <div className=''>
                                                                        <Grid container lg={12} className="cursor-pointer d-flex align-items-center tag">
                                                                            {selectedTag.map((data: any) => {
                                                                                return (
                                                                                    <div className='d-flex'>
                                                                                        <ListItem key={data.key} sx={{ p: "0px" }}>
                                                                                            <Chip
                                                                                                label={data?.label}
                                                                                                onDelete={handleDelete(data)}
                                                                                                className='customChip'
                                                                                            />
                                                                                        </ListItem>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </Grid>
                                                                        {showLabelCard && (
                                                                            <Grid lg={3} >
                                                                                <Card variant="elevation" elevation={5} sx={{ position: "absolute" }} style={{
                                                                                    left: "99px", bottom: "55px", maxWidth: "225px", width: "225px", maxHeight: "165px", overflow: "auto", zIndex: "9"
                                                                                }}>
                                                                                    <CloseDialogComponent handleClose={() => setShowLabelCard(false)} className="p-0 close-icon" />
                                                                                    <CardContent sx={{ p: "10px", pb: "0px" }}>
                                                                                        <Typography sx={{ fontSize: "13px", mb: "8px", width: "calc(100% - 20px)" }}>Label note</Typography>
                                                                                        <InputField
                                                                                            {...{
                                                                                                register,
                                                                                                formState,
                                                                                                control,
                                                                                                name: "label",
                                                                                                id: "label",
                                                                                                type: "text",
                                                                                                placeholder: "Enter label name",
                                                                                                onChange: (e) => filterTags(e.target.value),
                                                                                                autoComplete: "true",
                                                                                                className: "p-0",
                                                                                                sx: {
                                                                                                    "& fieldset": { border: 'none' },
                                                                                                    "& .MuiOutlinedInput-root": {
                                                                                                        padding: "0px !important",
                                                                                                        minHeight: "0px !important",
                                                                                                        fontSize: "13px !important"
                                                                                                    }
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                        {renderTags?.length > 0 && renderTags?.map((tag) => (
                                                                                            <Grid key={tag?.key} >
                                                                                                <FormControlLabel
                                                                                                    control={
                                                                                                        <Checkbox checked={selectedTag?.some((s: { label: string }) => s?.label === tag?.label)}
                                                                                                            onChange={() => handleChange(tag)} name={tag.label} />
                                                                                                    }
                                                                                                    label={tag?.label}
                                                                                                />
                                                                                            </Grid>
                                                                                        ))}
                                                                                    </CardContent>
                                                                                    <Divider className="mt-5" />
                                                                                    {watchField.label && filteredTags?.length === 0 && !tags.some((tag) => tag?.label === watchField?.label) && !searchTagsList.some((elm) => elm.label === watchField.label) && (
                                                                                        <CardActions className="cursor-pointer" onClick={() => tagsSelectHandler({ id: 0, label: watchField?.label })}
                                                                                            sx={{ p: "4px", fontSize: "13px", display: "flex", alignItems: "center" }}>
                                                                                            <AddOutlinedIcon sx={{ color: "GrayText", fontSize: "17px", mr: "1px" }} />
                                                                                            <div>Create '<b>{watchField?.label}</b>'</div>
                                                                                        </CardActions>
                                                                                    )}
                                                                                    {searchTagsList.map((elm) => {
                                                                                        return (
                                                                                            <CardActions className="cursor-pointer" onClick={() => tagsSelectHandler(elm)}
                                                                                                sx={{ p: "4px", fontSize: "13px", display: "flex", alignItems: "center" }}>
                                                                                                <div>{elm?.label}</div>
                                                                                            </CardActions>
                                                                                        )
                                                                                    })}
                                                                                </Card>
                                                                            </Grid>
                                                                        )}
                                                                        <div className="d-flex align-items-center  mt-10 desktop-color-picker">
                                                                            <div className="d-flex align-items-center mr-5"
                                                                                style={{ border: "1px solid #e0e0e0", borderRadius: "50%", width: "28px", height: "28px" }}
                                                                                onClick={() => handleColorSelect(isDarkMode ? colors[0] : "#fff")}
                                                                            >
                                                                                <IconButton style={{ padding: "6px" }}>
                                                                                    <InvertColorsOffOutlinedIcon sx={{ fontSize: "15px" }} />
                                                                                </IconButton>
                                                                            </div>
                                                                            {colors.slice(1).map((color, index) => (
                                                                                <div
                                                                                    key={index}
                                                                                    className="mr-5"
                                                                                    style={{ backgroundColor: color, minWidth: "30px", height: "30px", borderRadius: "50%", cursor: "pointer" }}
                                                                                    onClick={() => handleColorSelect(color)}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                }

                                                            </div>




                                                        </div>
                                                        {/* Icon for Details */}
                                                    </div>

                                                </DialogContent>
                                            </Grid>
                                            {/* <div className="border-r"></div> */}
                                            {  !isEditPost && <div className="d-flex align-items-center cursor-pointer mt-5 mobile-color-picker">
                                                <div className="d-flex align-items-center mr-5"
                                                    style={{ border: "1px solid #e0e0e0", borderRadius: "50%", width: "28px", height: "28px" }}
                                                    onClick={() => handleColorSelect(isDarkMode ? colors[0] : "#fff")}
                                                >
                                                    <IconButton style={{ padding: "6px" }}>
                                                        <InvertColorsOffOutlinedIcon sx={{ fontSize: "15px" }} />
                                                    </IconButton>
                                                </div>
                                                {colors.slice(1).map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="mr-5"
                                                        style={{ backgroundColor: color, minWidth: "30px", height: "30px", borderRadius: "50%", cursor: "pointer" }}
                                                        onClick={() => handleColorSelect(color)}
                                                    />
                                                ))}
                                            </div>

                                            }
                                            
                                        </div>
                                    </div>

                                </>
                            )}
                            {activeStep === 2 &&
                                <>
                                    <Divider className='w-100 mt-10' />
                                    <FormControl className='mt-20 w-100 p-10'>
                                        <div className='' style={{ textAlign: "center", color: "#252525" }}>
                                            {t("General.OTPSelectionMessage")}
                                        </div>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="messageType"
                                            defaultValue="WhatsApp"
                                            {...register('messageType')}
                                            sx={{ justifyContent: "center" }}
                                        >
                                            <FormControlLabel value="WhatsApp" control={<Radio />} label={t("General.WhatsApp")} />
                                            <FormControlLabel value="sms" control={<Radio />} label={t("General.SMS")} />
                                        </RadioGroup>
                                    </FormControl>
                                </>}
                            {activeStep === 3 && (
                                <div style={{ width: "100%", padding: "10px", marginTop: "20px" }}>
                                    <div className='otp-input-container hideNumberSpin' >
                                        {otpValues.map((value, index) => (
                                            <input
                                                key={index}
                                                type="number"
                                                className="otp-input hideNumberSpin"
                                                style={{ textAlign: "center" }}
                                                value={value}
                                                autoFocus={index === 0}
                                                onChange={(e) => {
                                                    // Allow only numbers, dot (.), and minus (-)
                                                    const newValue = e.target.value?.replace(/[^\d.-]/g, "");
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
                                    <Typography className="mt-10 mb-10 text-center font-13" style={{ color: isDarkMode ? "#fff" : "#000", }}>
                                        <p className='mb-3'>{t("General.We've sent an otp to entered")} {selectedOption === contactTypesEnum.EMAIL ? t("General.Email") : t("General.mobile number")}</p>
                                        <p className='mt-0'>{t("General.This code will expire in")} {" "}
                                            <span style={{ fontWeight: 600 }}>{minutes < 10 ? `0${minutes}` : minutes}</span>:
                                            <span style={{ fontWeight: 600 }}>{seconds < 10 ? `0${seconds}` : seconds}</span>{" "}
                                            {t("minutes.")}</p>
                                    </Typography>
                                </div>
                            )}
                            {activeStep === 4 && (loginUserData?.data[0]?.roleid != 1 && loginUserData?.data[0]?.roleid != 3) && (
                                <>
                                    {
                                        (requiresPaymentStep() && !isEditPost) && (
                                            <>
                                                <Grid xs={12} item className={postDetailsStyle.prizeDistribution}>
                                                    <div className='d-flex justify-content-between mt-10'>
                                                        <span className='justify-content-start text-grey font-13'>{t('Menus.Balance')}</span>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 4,
                                                        }}>
                                                            {isLoading ? (
                                                                <Skeleton animation="wave" width="30%" />
                                                            ) : (
                                                                <>  
                                                                    <StarsIcon style={{ fontSize: 15 }} />
                                                                    <span className='text-grey font-13 font-sans-serif'>
                                                                        {slotData.length !== 0 ? slotData[0]?.balance : null}
                                                                    </span>
                                                                    <span className='text-grey font-13 font-sans-serif'>
                                                                        {t('General.Ptr')}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {PRIZE_DISTRIBUTION?.map((d) => (
                                                        <PrizeDistribution
                                                            key={d.id}
                                                            item={d}
                                                            tooltipOpen={tooltipOpen}
                                                            handleTooltipOpen={handleTooltipOpen}
                                                            handleTooltipClose={handleTooltipClose}
                                                            isLoading={isLoading}
                                                            slotData={slotData}
                                                            highLightAmount={calculateAmount}
                                                            showPlusIcon={showPlusIcon}
                                                        />
                                                    ))}
                                                    <div className='d-flex justify-content-between mt-10 pt-10 border-t align-items-center'>
                                                        <span className='justify-content-start text-grey font-13 font-bold'>{t('General.Total')}</span>
                                                        {isLoading ? (
                                                            <Skeleton animation="wave" width="30%" />
                                                        ) : (
                                                            <div className='d-flex align-items-center justify-content-center font-13 font-bold'>
                                                                <StarsIcon style={{ fontSize: 15, marginRight: 4 }} />
                                                                <span className={`font-sans-serif ${highLight ? 'highlighted-text' : 'font-13'}`}>
                                                                    {highLight ? `${amountCalculation}${showPlusIcon}` : amountCalculation}&nbsp;{t('General.Ptr')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Grid>
                                            </>
                                        )
                                    }


                                </>
                            )}
                        </Grid>
                    </form>
                    {addFundModalOpen && (
                        <Dialog
                            onClose={() => setIsAddFundModalOpen(false)}
                            sx={{ m: '0px' }}
                            open={open}
                            maxWidth="xs"
                            fullWidth
                        >
                            <AddFundComponent {...{
                                amountCalculation: amountCalculation - slotData[0].balance,
                                handleOk: (response) => {
                                    if (response.success) {
                                        fetchAvailableSlot(true)
                                    }
                                    setIsAddFundModalOpen(false)
                                }
                            }} />
                        </Dialog>
                    )}
                </div>

                <div className="d-flex cursor-pointer gap p-10 align-items-center justify-content-end border-t footer-dialog sticky-footer">
                    <div className='d-flex justify-content-between' style={{ width: "100%" }}>
                        <div className=''>
                            {
                                activeStep != 1 &&
                                <Button disabled={formState.isSubmitting} type="reset" variant="outlined" color="error" className='close-btn'
                                    onClick={() => {
                                        activeStep === 3 && showOtpComponent ? setActiveStep(1) : activeStep === 4 &&
                                            setActiveStep(1)
                                    }}>
                                    {t("General.GO BACK")}</Button>
                            }
                        </div>
                        <div className='gap'>
                            <Button disabled={formState.isSubmitting} style={{ marginRight: "14px" }} type="reset" variant="outlined" color="error" className='close-btn'
                                onClick={() => {
                                    handleClose()
                                }}>
                                {t("General.Cancel")}</Button>
                            <Button
                                disabled={formState.isSubmitting}
                                type="submit"
                                form="advertiseDetailsForm"
                                variant="contained"
                                style={{ minWidth: "88px" }}
                            >
                                {formState.isSubmitting ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    activeStep === 4
                                        ? isEditPost ? t("General.Update") : t("General.Post")
                                        : (activeStep === 3 && !(slotData?.[0]?.isadfree === 0 || highLightAmount !== 0))
                                            ? isEditPost ? t("General.Update") : t("General.Post")
                                            : (activeStep === 1 && (loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3))
                                                ? isEditPost ? t("General.Update") : t("General.Post")
                                                : (activeStep === 1 && !showOtpComponent && !requiresPaymentStep() && (isNewMobileNumVerified || watchField?.MobileNo === loginUserData?.data[0]?.mobileno))
                                                    ? isEditPost ? t("General.Update") : t("General.Post")
                                                    : (activeStep === 2 || activeStep === 3 || (activeStep === 1 && showOtpComponent))
                                                        ? t("General.Continue")
                                                        : t("General.Next")
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                {imageSlideOpen && (
                    <ImageSliderDialog
                        open={imageSlideOpen}
                        images={imageMultipleData}
                        handleRemoveImage={handleRemoveImage}
                        // responseDetails={editPostData}
                        handleClose={() => setImageSlideOpen(false)}
                        handleOk={() => {
                            setImageSlideOpen(false);
                        }}
                    />
                )}
                {isShowDeletePopup && (
                    <DeletePost
                        handleOk={() => setIsShowDeletePopup(false)}
                        deleteMessage={t("General.Are you sure you want to delete this image?")}
                        open={isShowDeletePopup}
                        handleClose={() => setIsShowDeletePopup(false)}
                        handleDeleteClick={() => handleRemoveImage(ImageKey, ImageIndex)}
                    />
                )}

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
                            <LocationPicker setIsStateSelect={setIsStateSelect} setIsLocationPicker={setIsLocationPicker} lattitude={position?.latitude} longitude={position?.longitude} languageId={selectedLanguage} isSeprateLocation={true} setLocationObject={setLocationObject} />
                        </Dialog>
                    </div>
                )}
            </div>
        </>
    )
}
export default PutAdPage