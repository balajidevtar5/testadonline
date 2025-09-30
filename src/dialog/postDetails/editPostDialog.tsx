import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from "@mui/material/InputAdornment";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography
} from "@mui/material";
import { Dropdown, Menu, Space, Steps, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { set, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import HashMap from "../../common/datastructures/hashmap";
import InputField, { SelectField, TextAreaField } from "../../components/formField/FormFieldComponent";
import { LayoutContext } from '../../components/layout/LayoutContext';
import { API_ENDPOINT_PROFILE, colorMap, colorMapping, contactTypesEnum, LanguageEnum, LOGEVENTCALL, logEvents } from "../../libs/constant";
import { RootState } from "../../redux/reducer";
import { loginAPI } from "../../redux/services/auth.api";
import { AddNewMobileNumber, DeleteFile, GetContactOptions, PostFileUpload, updatePost, verifyPostOtp } from '../../redux/services/post.api';
import postDetailsStyle from "./PostDetailStyles.module.scss";
import DeletePost from "./deatepostpopup";
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HideSourceSharpIcon from '@mui/icons-material/HideSourceSharp';
import { GmailIcon } from '../../assets/icons/GmailIcon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useTranslation } from 'react-i18next';
import { getAllSettingsAPI } from '../../redux/services/setting.api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccordionComponent from './acording';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import i18n from '../../i18n';
// import { Dialog, DialogContent } from "@mui/material";
import LocationPicker from '../../components/locationpicker/locationpicker';
import { getLocationById } from '../../redux/services/locations.api';
import { getData, storeData } from '../../utils/localstorage';
import * as Yup from "yup";
import { useEmailFormSchema } from "../../schema/EmailValidationSchema";
import { logEffect } from '../../utils/logger';
import { Height, Padding } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

interface PostDetailsProps {
    open: boolean;
    handleOk?: (data?: any) => void,
    handleClose: (data?: any) => void;
    isEdit?: boolean;
    editPostData?: any;
    postEditData?: any
}
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
const EditPostDialog = (props: PostDetailsProps) => {
    const { open, handleClose, handleOk, isEdit, editPostData, postEditData } = props
    const { register, formState, handleSubmit, watch, control, setValue } = useForm();
    const { data: settingData } = useSelector((state: RootState) => state.settingList);
    const [displayPrice, setDisplayPrice] = useState("");
    const { position, selectedCity, setPostData, setFilterValue, filterValue, categoryList, SHOW_WHATSAPP_OTP_OPTION, defaultMessageType, setIsPostClear, selectedLanguage, selectedCityName } = useContext(LayoutContext)
    const [imageDeque, setImageDeque] = useState(new HashMap());
    const [selectedFileUpload, setSelectedFileUpload] = useState(new HashMap())
    const [isListening, setIsListening] = useState(false);
    const [currentType, setCurrentType] = useState(null);
    const [isShowDeletePopup, setIsShowDeletePopup] = useState(false);
    const [imageMultipleData, setImageMultipleData] = useState([]);
    const [ImageKey, setImageKey] = useState(null);
    const [ImageIndex, setImageIndex] = useState(null);
    const [updatedCategoryList, setUpdatedCategortyList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [activeStep, setActiveStep] = useState(1);
    const [isValidMobile, setIsValidMobile] = useState(false);
    const [mobileCheck, setMobileCheck] = useState(false);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const inputRefs: any = useRef([])
    const firstInputRef: any = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [minutes, setMinutes] = useState(4);
    const [seconds, setSeconds] = useState(59);
    const [otp, setOtp] = useState<any>("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [formValues, setFormValues] = useState(null);
    const [isNewMobileNumVerified, setIsNewMobileNumVerified] = useState(false);
    const [prevMobileNumber, setPreviousMobileNumber] = useState(false);
    const [prevEmail, setPrevEmail] = useState(false);
    const watchField: any = watch();
    const [messageType, setMessageType] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionId, setSelectedOptionId] = useState(1);
    const [prevTelegram, setPrevTelegram] = useState("");
    const [prevWhatsapp, setPrevWhatsapp] = useState("");
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedOptionCity, setSelectedOptionCity] = useState(null);
    const { data: cityData } = useSelector((state: RootState) => state.cities);
    const [optionData, setOptionData] = useState([]);
    const [colorValue, setColorValue] = useState("#fff")
    const [cities, setCities] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const dropdownRef = useRef(null);
    const [categoryClick, setCategoryClick] = useState(false);
    const [detailTranscript, setDetailTranscript] = useState("");
    const [transcript, setTranscript] = useState("");
    const [contactOptions, setContactOptions] = useState([])
    const [locationObject, setLocationObject] = useState({ id: "", name: "" });
    const [selectedLocation, setSelectedLoction] = useState(selectedCityName)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;
    const [recognitionLang, setRecognitionLang] = useState(null)

    const [isLocationPicker, setIsLocationPicker] = useState(false);
    const validationSchema = useEmailFormSchema();
    const priceValidationSchema = Yup.object().shape({
        price: Yup.number()
            .transform((value) => (isNaN(value) || value === '' ? null : value))
            .max(1000000000, () => t("toastMessage.Price Limit Exceeded"))
            .nullable()
    });
    const { isDarkMode } = useContext(LayoutContext);
    const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" : "#fff");
    const [priceValue, setPriceValue] = useState("");
    const [postPurposeId, setPostPurposeId] = useState(editPostData?.purposetypeid);
    const [priceTypeId, setPriceTypeId] = useState(editPostData?.pricetypeid);
    const handlePriceChange = (typeId) => {
        setPriceTypeId((prev) => prev === typeId ? null : typeId);
    };
   const navigate = useNavigate();

    const isIOS = () => {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    };
    const formatIndianPrice = (value) => {
        if (!value) return "";

        // Convert to string if value is a number
        const stringValue = value.toString();
        const cleanValue = stringValue.replace(/[^0-9.]/g, '');

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

    const handleOptionSelected = () => {
        const selectedItem = items.find(item => item.id === selectedOption);
        return selectedItem?.label;
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

    const onSubmit = async (values: any, e?: React.FormEvent<HTMLFormElement>) => {

        try {
            await priceValidationSchema.validate({ price: priceValue });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                message.error(error.message);
                return;
            }
        }

        if (values?.Title === "" || values.Advertise_details === "") {
            message.error(t("toastMessage.Please fill all mandatory fields."))
            return
        }
        if (values?.MobileNo?.length != 10 && selectedOption === contactTypesEnum.PHONEWHATSAPP) {
            message.error(t("toastMessage.Mobile number should consist of 10 digits."))
            return
        }
        if (selectedOption === contactTypesEnum.TELEGRAM) {
            if (values?.TelegramNo?.length != 10 || values?.TelegramNo === "") {
                message.error(t("toastMessage.Telegram number should consist of 10 digits."))
                return
            }
        }
        if (values?.MobileNo?.length != 10 && selectedOption === contactTypesEnum.PHONE) {
            message.error(t("toastMessage.Mobile number should consist of 10 digits."))
            return
        }


        if (selectedOption === contactTypesEnum.WHATSAPP) {
            if (values?.WhatsappNo?.length != 10 || values?.WhatsappNo === "") {
                message.error(t("toastMessage.WhatsApp number should consist of 10 digits."))
                return
            }
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
        if (selectedCategory === null) {
            message.error(t("toastMessage.Please select category."))
            return
        }
        setMobileCheck(false)
        if (activeStep === 3 && isValidMobile) {
            const allFilled = otpValues.every((value) => value.trim() !== '');
            if (!allFilled) {
                message.error(t("toastMessage.Enter OTP"))
                return
            }
        }
        if (activeStep === 2 && isValidMobile) {
            try {
                const payload = {
                    MobileNo: values?.MobileNo,
                    IsMobile: values.messageType === null ? true : false,
                    ISWhatsapp: values.messageType === "Whatsapp" ? true : false
                };
                setMessageType(values.messageType)
                // dispatch(doLogin(payload));
            } catch (error) {
            }
        }

        const mobileNumber = editPostData?.mobileno?.replace(/^\+91/, '');

        if (loginUserData?.data[0]?.roleid !== 1 && loginUserData?.data[0]?.roleid !== 3) {
            if (selectedOption === contactTypesEnum.PHONEWHATSAPP) {
                if (
                    (values.MobileNo !== mobileNumber && values?.MobileNo !== loginUserData?.data[0]?.mobileno) &&
                    (activeStep === 1 || activeStep === 2)
                ) {
                    try {
                        setActiveStep(3)
                        let payload = {
                            MobileNo: values.MobileNo,
                            ISWhatsapp: false,
                            IsMobile: true
                        }


                        const resp = await AddNewMobileNumber(payload);
                        if (resp.success) {
                            message.success(resp.message);
                            setPreviousMobileNumber(values.MobileNo);
                            setMobileNumber(values.MobileNo);
                            setFormValues(values);
                            setMobileCheck(true);
                            setIsValidMobile(true);
                            setOtpValues(["", "", "", "", "", ""]);
                        }

                        if (activeStep === 2) {
                            const payload = {
                                MobileNo: values.MobileNo,
                                ISWhatsapp: values.messageType === "Whatsapp" ? true : false,
                                IsMobile: values.messageType === null ? true : false
                            }
                            const resp = await AddNewMobileNumber(payload);
                            if (resp?.success) {
                                message.success(resp.message);
                                setPreviousMobileNumber(values.MobileNo);
                                setMobileNumber(values.MobileNo);
                                setFormValues(values);
                                setMobileCheck(true);
                                setIsValidMobile(true);
                                setOtpValues(["", "", "", "", "", ""]);
                            }
                        }

                        // }


                    } catch (error) {
                    }
                    return
                }
            } else if (selectedOption === contactTypesEnum.EMAIL) {
                if (
                    (values.Email != editPostData?.email) &&
                    (activeStep === 1 || activeStep === 2)
                ) {
                    try {
                        setActiveStep(3)
                        if (values.Email !== prevEmail) {
                            const payload = {
                                Email: values.Email,
                                MobileNo: false,
                                ISWhatsapp: false,
                                IsMobile: false,
                            }
                            const resp = await AddNewMobileNumber(payload);
                            if (resp?.success) {
                                message.success(resp.message);
                                setPrevEmail(values.Email);
                                setFormValues(values);
                                setMobileCheck(true);
                                setIsValidMobile(true);
                                setOtpValues(["", "", "", "", "", ""]);
                            }
                        }


                    } catch (error) {
                    }
                    return
                }
            } else if (selectedOption === contactTypesEnum.TELEGRAM) {

                if (
                    (values.TelegramNo !== mobileNumber) &&
                    (activeStep === 1 || activeStep === 2) && (values.TelegramNo != loginUserData?.data[0]?.mobileno)
                ) {
                    setActiveStep(3)
                    try {
                        if (values.TelegramNo !== prevTelegram) {
                            const payload = {
                                Email: "",
                                MobileNo: values.TelegramNo,
                                ISWhatsapp: false,
                                IsMobile: true
                            }
                            const resp = await AddNewMobileNumber(payload);
                            if (resp.success) {
                                message.success(resp.message);
                                setPrevTelegram(values.TelegramNo);
                                setFormValues(values);
                                setMobileCheck(true);
                                setIsValidMobile(true);
                                setOtpValues(["", "", "", "", "", ""]);
                            }
                        }


                    } catch (error) {
                    }
                    return
                }
            }
            else if (selectedOption === contactTypesEnum.WHATSAPP) {

                if (
                    (values.WhatsappNo !== mobileNumber) &&
                    (activeStep === 1 || activeStep === 2) && (values.WhatsappNo != loginUserData?.data[0]?.mobileno)
                ) {
                    try {
                        setActiveStep(3)
                        if (values.WhatsappNo !== prevWhatsapp) {
                            const payload = {
                                Email: "",
                                MobileNo: values.WhatsappNo,
                                ISWhatsapp: true,
                                IsMobile: false
                            }
                            const resp = await AddNewMobileNumber(payload);
                            if (resp.success) {
                                message.success(resp.message);
                                setPrevWhatsapp(values.WhatsappNo);
                                setFormValues(values);
                                setMobileCheck(true);
                                setIsValidMobile(true);
                                setOtpValues(["", "", "", "", "", ""]);
                            }
                        }


                    } catch (error) {
                    }
                    return
                }
            } else if (selectedOption === contactTypesEnum.PHONE) {
                if (
                    (values.MobileNo != prevMobileNumber && values?.MobileNo !== loginUserData?.data[0]?.mobileno) &&
                    (activeStep === 1 || activeStep === 2)
                ) {
                    try {
                        setActiveStep(3)
                        if (values.MobileNo !== prevMobileNumber) {
                            const payload = {
                                Email: "",
                                MobileNo: values.MobileNo,
                                ISWhatsapp: false,
                                IsMobile: true,
                            }
                            const resp = await AddNewMobileNumber(payload);
                            if (resp.success) {
                                message.success(resp.message);
                                setPreviousMobileNumber(values.MobileNo);
                                setFormValues(values);
                                setMobileCheck(true);
                                setIsValidMobile(true);
                                setOtpValues(["", "", "", "", "", ""]);
                            }
                        }


                    } catch (error) {
                    }
                    return
                }
            }
        }
        let payLoad = {
            Id: editPostData?.id,
            Title: values?.Title,
            ShortDescription: values?.Advertise_details,
            Price: priceValue || "",
            PriceTypeId: priceTypeId || null,
            PurposeTypeId: postPurposeId,
            MobileNo: "",
            LocationId: locationObject?.id || editPostData.locationid,
            Latitude: position?.latitude,
            Longitude: position?.longitude,
            CategoryId: categoryId,
            SubCategoryId: subCategoryId,
            PostTypeId: 1,
            ContactTypeId: selectedOptionId,
            Email: "",
        };
        if (selectedOption == contactTypesEnum.EMAIL) {
            payLoad.Email = values.Email
        }
        if (selectedOption == contactTypesEnum.PHONEWHATSAPP) {
            payLoad.MobileNo = values.MobileNo
        }
        if (selectedOption == contactTypesEnum.TELEGRAM) {
            payLoad.MobileNo = values.TelegramNo
        }
        if (selectedOption == contactTypesEnum.WHATSAPP) {
            payLoad.MobileNo = values.WhatsappNo
        }

        if (selectedOption == contactTypesEnum.PHONE) {
            payLoad.MobileNo = values.MobileNo
        }
        try {
            const resp = await updatePost(payLoad);
            if (resp?.success) {
                message.success(resp.message)
                if (LOGEVENTCALL) {
                    logEffect(logEvents.Edit_Post)
                }

                handleClose()
                // setPostData([])
                const formData = new FormData();
                const files = selectedFileUpload.getAllData();
                let filenameArray = [];
                let filePathArray = [];
                const imageDequeArray = imageDeque.getAllDataWithKey();


                imageDequeArray.forEach((entry: { key: string; value: string }) => {
                    const filePath = entry.value.split('/Uploads/Original/')[1]; // Extract "5159/Oct062024-152606_eaf.webp"
                    filenameArray.push(entry.key); // Push the filename
                    filePathArray.push(filePath); // Push the extracted file path
                });

                if (files && files.length > 0) {
                    files.forEach((file, index) => {
                        // Append each file to the formData
                        formData.append(`fileList`, file); // file is a Blob or File
                    });
                }
                const fileUploadResponse = await PostFileUpload(formData, editPostData?.id, 0);
                if (files && files.length > 0) {
                    postEditData(values, imageDequeArray, editPostData?.id)
                    if (fileUploadResponse.success) {
                        handleOk(resp)
                        navigate('/success', {
                            state: {
                                postId: resp.data[0].postid,
                                languageId: 2 // Set your default language ID or get it from your app state
                            }
                        });
                        storeData("adUpdateResponse", resp.data[0])
                        if (LOGEVENTCALL) {
                            logEffect(logEvents.Edit_Post)
                        }

                        setIsPostClear(true)
                    }
                } else {
                    handleOk(resp)
                    navigate('/success', {
                        state: {
                            postId: resp.data[0].postid,
                            languageId: 2 // Set your default language ID or get it from your app state
                        }
                    });
                    storeData("adUpdateResponse", resp.data[0])
                    if (LOGEVENTCALL) {
                        logEffect(logEvents.Edit_Post)
                    }

                    setIsPostClear(true)


                }






            }
        } catch (error) {
            message.error("Opps, an error occurred. Please try after sometime.");
        }
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
                        style={{ width: 16, height: 16, marginRight: 5 }}
                        className="font-16"
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


    const handleMenuClick = (e) => {
        setSelectedOption(e.id);
        setSelectedOptionId(e.id);
        const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');

        if (e.id == contactTypesEnum.PHONEWHATSAPP) {
            if (mobileNo != loginUserData?.data[0]?.mobileno) {
                setIsValidMobile(true)
            }
        }
        if (e.id == contactTypesEnum.TELEGRAM) {
            if (mobileNo != loginUserData?.data[0]?.mobileno) {
                setIsValidMobile(true)
            }
        }
        if (e.id == contactTypesEnum.WHATSAPP) {
            if (mobileNo != loginUserData?.data[0]?.mobileno) {
                setIsValidMobile(true)
            }
        }

        if (e.id == contactTypesEnum.PHONE) {
            if (mobileNo != loginUserData?.data[0]?.mobileno) {
                setIsValidMobile(true)
            }
        }
    };

    const handleAccordinCategoryOk = (subCategory, category) => {
        setSelectedSubcategory(subCategory);
        setCategoryId(category?.id)
        setSubCategoryId(subCategory.SubCategoryId)
    }

    const handleGetOtpOptions = async () => {
        try {
            const response = await getAllSettingsAPI();
            if (response.data) {
                setOptionData(response.data)
            }
        } catch (error) {

        }
    }

    const filteredItems = items.filter(item => item?.id !== selectedOption);

    const menu = (
        <Menu style={{ background: isDarkMode ? colorMap.darkgray : colorMap.white }}>
            {filteredItems.map(item => (
                <Menu.Item onClick={(event) => handleMenuClick(item)} key={item.key}>{item?.label}</Menu.Item>
            ))}
        </Menu>
    );

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files as FileList;
        let maxFileSize;

        // Define the maximum number of images allowed
        const maxImages = 8;
        const currentImageCount = imageDeque.size || 0;

        // Check if adding the new files will exceed the maximum limit
        if (currentImageCount + files.length > maxImages) {
            message.error(t('toastMessage.You can only upload a maximum of 8 images'));
            return;
        }

        // Get the maximum file size from optionData
        settingData?.data.forEach((elm) => {
            if (elm?.name === "ImageSize") {
                maxFileSize = elm?.value * 1024; // Convert KB to bytes
            }
        });

        const unsupportedFiles = []; // To track files with unsupported extensions
        const oversizedFiles = [];   // To track files exceeding the size limit
        const disallowedWebpFiles = [];
        for (const file of Array.from(files)) {
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                unsupportedFiles.push(file.name.trim());
            } else if (file.size > maxFileSize) {
                oversizedFiles.push(file.name.trim());
            }
        }

        // Create error messages based on the issues
        const errorMessages = [];

        if (unsupportedFiles.length) {
            errorMessages.push(
                `${t("toastMessage.The following files have unsupported extensions")} ${unsupportedFiles.join(', ')}`
            );
        }
        if (oversizedFiles.length) {
            errorMessages.push(
                `${t("toastMessage.The following files exceed the maximum size of 10 MB")} ${oversizedFiles.join(', ')}`
            );
        }

        // Display all error messages
        if (errorMessages.length) {
            message.error(errorMessages.join(' '));
            return; // Stop the upload process
        }

        // Proceed if all validation passes
        setImageDeque((prevDeque) => {
            const newHashMap = new HashMap();
            prevDeque.map.forEach((value, key) => {
                newHashMap.add(key, value);
            });

            // Handle file reading and processing
            Array.from(files).forEach((file) => {
                if (file instanceof File) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        newHashMap.add(file.name, reader.result as string);
                    };
                    reader.readAsDataURL(file);
                } else {
                    console.error('Invalid file object:', file);
                }
            });
            return newHashMap;
        });

        // Update the image data array
        const updatedARR = imageDeque.getAllDataWithKey().map((elm) => ({
            image: elm.value,
            id: elm.key
        }));
        setImageMultipleData(updatedARR);

        // Set selected files for upload
        setSelectedFileUpload((prevDeque) => {
            const newHashMap = new HashMap();
            prevDeque.map.forEach((file, key) => {
                newHashMap.add(key, file);
            });

            Array.from(files).forEach((file) => {
                const fileKey = file.name;
                newHashMap.add(fileKey, file);
            });
            return newHashMap;
        });
    };

    const handleVerificationSubmit = async () => {

        try {

            let payload;
            if (selectedOption == contactTypesEnum.EMAIL) {
                payload = {
                    "Email": watchField.Email,
                    "Otp": otpValues.join(''),
                    LanguageId: await getData("i18nextLng") || 2
                }
            } else if (selectedOption == contactTypesEnum.TELEGRAM) {
                payload = {
                    "MobileNo": watchField?.TelegramNo,
                    "Otp": otpValues.join(''),
                    LanguageId: await getData("i18nextLng") || 2
                }
            } else if (selectedOption == "WhatsApp") {
                payload = {
                    "MobileNo": watchField?.WhatsappNo,
                    "Otp": otpValues.join(''),
                    LanguageId: await getData("i18nextLng") || 2
                }
            } else {
                payload = {
                    "MobileNo": watchField?.MobileNo,
                    "Otp": otpValues.join(''),
                    LanguageId: await getData("i18nextLng") || 2
                }
            }
            const resp = await verifyPostOtp(payload)
            if (resp.success) {
                await onSubmit(formValues);
                message.success(resp.message)
                setIsNewMobileNumVerified(true)
            } else {
                message.error(resp.message)
                setOtpValues(["", "", "", "", "", ""])
                firstInputRef.current.focus();
            }
        } catch (error) {
        }
    };
    const handleRemoveImage = async (keyToRemove, indexToRemove,) => {
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
        if (Number.isInteger(keyToRemove)) {
            const deleteResp = await DeleteFile(editPostData?.id, keyToRemove);
            if (deleteResp?.success) {
                setFilterValue({ ...filterValue, PageNumber: 1 })
                // setPostData([])
            }
        } else {
            console.error('Key to remove is not an integer:', keyToRemove);
        }
        setIsShowDeletePopup(false)
    };

    const handleCityMenuClick = (e) => {
        setSelectedOptionCity(e)
    }
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
    const handleResendOtp = async () => {
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
            }
            else {
                message.error(response.message);
            }
            setElapsedTime(0);
            // if (minutes == 0 && seconds == 0) {
            setSeconds(59)
            setMinutes(4)
            // }
        } catch (e) {
        }
    }

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


    useEffect(() => {
        setValue("Title", editPostData?.title)
        const jsonArray = JSON.parse(editPostData?.properties);

        const colorObject = jsonArray?.find(item => item.Name === "BackgroundColor");
        const colorValue = colorObject ? colorObject.Value : null;

        const mode = isDarkMode ? "dark" : "light";


        let selectedColor;

        if (isDarkMode) {
            if (!colorValue || colorValue === colorMap.white) {
                selectedColor = colorMap.darkgray;
            } else if (colorMapping.dark[colorValue]) {
                // If the color is present in dark mode, use it
                selectedColor = colorMapping.dark[colorValue];
            } else {
                // Find the key in light mode that has this color value
                const lightModeKey = Object.keys(colorMapping.light).find(
                    key => colorMapping.light[key] === colorValue
                );

                // Use the corresponding dark mode color
                selectedColor = lightModeKey ? colorMapping.dark[lightModeKey] : colorValue;
            }
        } else {
            // In light mode, use the mapped value or the original value
            selectedColor = colorMapping.light[colorValue] || colorValue;
        }

        setSelectedColor(selectedColor);


        setValue("Advertise_details", editPostData?.shortdescription)
        setDisplayPrice(editPostData?.price)
        setValue("Purpose", selectedPurpose)

        setValue("price", formatIndianPrice(editPostData?.price))
        // let selectedCityValue = cityData?.find((d) => d?.label === editPostData?.city);
        setSelectedOptionCity(editPostData.location)
        const categoryData = categoryList?.data?.find((elm) => elm.id === editPostData.categoryid)

        const transformCategoryData = (categoryData) => {
            return {
                Name: categoryData.displayname,
                Icon: categoryData.icon,
            };
        };
        let subcategory;
        if (categoryData?.subcategory && editPostData.subcategoryid) {
            subcategory = JSON.parse(categoryData?.subcategory)?.find((elm) => elm.SubCategoryId === editPostData.subcategoryid)
            setSubCategoryId(subcategory.SubCategoryId)
        }
        setCategoryId(categoryData?.id)
        if (categoryData?.subcategory && editPostData.subcategoryid) {
            setSelectedSubcategory(subcategory)
        } else {
            const transformedData = transformCategoryData(categoryData);
            setSelectedSubcategory(transformedData)
            setCategoryClick(true)
        }

        if (editPostData?.contacttypeid === contactTypesEnum.PHONEWHATSAPP) {
            const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo)
            setValue("WhatsappNo", mobileNo)
            setValue("TelegramNo", mobileNo)
            setSelectedOptionId(contactTypesEnum.PHONEWHATSAPP)
        } else if (editPostData?.contacttypeid === contactTypesEnum.WHATSAPP) {
            const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo)
            setValue("WhatsappNo", mobileNo)
            setValue("TelegramNo", mobileNo)
            setSelectedOptionId(contactTypesEnum.WHATSAPP)
        } else if (editPostData?.contacttypeid === contactTypesEnum.TELEGRAM) {
            const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo)
            setValue("WhatsappNo", mobileNo)
            setValue("TelegramNo", mobileNo)
            setSelectedOptionId(contactTypesEnum.TELEGRAM)
        } else if (editPostData?.contacttypeid === contactTypesEnum.EMAIL) {
            setValue("Email", editPostData?.email)
            setSelectedOptionId(contactTypesEnum.EMAIL)
        } else if (editPostData?.contacttypeid === contactTypesEnum.PHONE) {
            const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo)
            setValue("WhatsappNo", mobileNo)
            setValue("TelegramNo", mobileNo)
            setSelectedOptionId(contactTypesEnum.PHONE)
        }
        setSelectedOptionId(editPostData?.contacttypeid)
        setSelectedOption(editPostData?.contacttypeid)
        const slideData = editPostData?.pictures ? JSON?.parse(editPostData?.pictures)?.map((elm) => {
            const imagePath = elm?.SmallImage?.replace(/^~/, '');
            const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
            return { key: elm?.id, id: elm?.id, image: imageUrl };
        }) : [];
        if (slideData[0]?.key !== undefined) {
            setImageDeque((prevDeque) => {
                const newHashMap = new HashMap();
                prevDeque.map.forEach((value, key) => {
                    newHashMap.add(key, value);
                });
                slideData.forEach((elm) => {
                    newHashMap.add(elm.id, elm.image);
                });
                return newHashMap;
            });
        }
        const ModifiedCategoryList = categoryList?.data?.map((elm) => ({
            label: <><div style={{ display: "flex", alignItems: "center" }}><img src={elm.icon} /> <span style={{ marginLeft: "10px" }}>{t(elm.Name)}</span></div></>,
            value: elm.Name,
            id: elm.id
        }))
        setUpdatedCategortyList(ModifiedCategoryList)
        featchContactType()
    }, [])

    const postPurposeOptions = [
        { value: 'Buying', label: t("General.posting options.Buy"), id: 1 },
        { value: 'Selling', label: t("General.posting options.Sell"), id: 2 },
        { value: 'others', label: t("General.posting options.Others"), id: 3 },
    ];
    const selectedPurpose = postPurposeOptions.find(option => option.id === postPurposeId);

    const handlePurposeChange = (selected) => {
        setPostPurposeId(selected.id);
    };

    useEffect(() => {
        if (updatedCategoryList.length > 0) {
            const category = updatedCategoryList.find((elm) => elm.id === editPostData?.categoryid)
            setSelectedCategory(category)
            setValue("categoryName", category)
        }
    }, [updatedCategoryList])

    useEffect(() => {
        if (recognition) {
            const recognitionLangvalue = LanguageEnum[i18n?.language?.toUpperCase()] || LanguageEnum.EN;
            recognition.lang = recognitionLang;
            setRecognitionLang(recognitionLangvalue)
        } else {
            console.error("Speech recognition is not supported in this browser.");
        }
    }, [recognition])
    const handleDeleteClick = () => {
    }
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
        const allFilled = otpValues.every(value => value.trim() !== '');
        if (allFilled) {
            handleVerificationSubmit();
        }
    }, [otpValues]);

    useEffect(() => {
        const titleValue = watchField?.Title;
        const detailsValue = watchField?.Advertise_details;

        setTranscript(titleValue || '');
        setDetailTranscript(detailsValue || '');
    }, [watchField?.Title, watchField?.Advertise_details]);
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
        // handleGetOtpOptions()
        const timer = setInterval(() => {
            setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
            setMinutes(0);
            setSeconds(59);
            setOtp(["", "", "", "", "", ""]);
        }
    }, []);

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
            // Determine the location ID to use, either from loginUserData or locationObject
            const locationId = locationObject?.id || editPostData.locationid || selectedCity;
            if (locationId) {
                const cityName = await fetchSelectedCityById(locationId);
                setSelectedLoction(cityName)
            } else {
                setSelectedLoction(t("General.All Cities")); // Default value
            }
        };

        updateLocationName()
    }, [locationObject])



    useEffect(() => {
        if (isValidMobile) {
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
    }, [isValidMobile, seconds]);


    return (
        <>

            <div className="relative min-h-screen">
                <div className="pb-20 overflow-y-auto">
                    <form id="advertiseDetailsForm" className={loginUserData?.data[0]?.roleid != 1 && loginUserData?.data[0]?.roleid !== 3 && selectedOptionId != contactTypesEnum.HIDEME ? !isValidMobile ? "editstiper" : "editstiper" : "editstiper"} onSubmit={handleSubmit(onSubmit)}>
                        <div className='putDialogStepper'>
                            <Steps
                                items={[
                                    {
                                        title: t('General.Update an Ad'),
                                        icon: <EditNoteIcon className={activeStep === 2 || activeStep === 3 ? 'bg-lightgreen' : ""} />,
                                    },
                                    ...(isValidMobile && loginUserData?.data[0]?.roleid !== 1 && loginUserData?.data[0]?.roleid !== 3 && selectedOptionId != contactTypesEnum.HIDEME
                                        ? [
                                            {
                                                title: t('General.Verify OTP'),
                                                icon: <LockIcon className={activeStep === 4 ? 'bg-lightgreen' : activeStep === 1 ? "bg-darkGray" : ""} />, // Replace with your desired icon component
                                            }
                                        ] : []),
                                ]}
                                labelPlacement='vertical'
                            />
                        </div>
                        {
                            activeStep === 1 && (
                                <>
                                    <div className="input w-96 p-10 pb-0">
                                        {/* <SelectField
                                    {...{
                                        register,
                                        formState,
                                        control,
                                        id: "categoryName",
                                        name: "categoryName",
                                        options: updatedCategoryList,
                                        
                                        label: "Select category*",
                                        onSelectChange: (value: any) => setSelectedCategory(value),
                                        placeholder: "Select Category*",
                                        classNamePrefix: "react-select",
                                        isMulti: false,
                                        isClearable: false,
                                    }}
                                /> */}
                                        <AccordionComponent categoryClick={categoryClick} setCategoryClick={setCategoryClick} selectedSubcategory={selectedSubcategory} categoryList={categoryList} handleOk={handleAccordinCategoryOk} />

                                    </div>
                                    <Grid display="flex" className='overflow-hidden edit-upload-post putContainer' container wrap="wrap">

                                        <DialogContent sx={{ p: "0px" }}>
                                            <div className="add-box-post-details ">
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                    {t("General.Title")}*
                                                </Typography>
                                                <div className='relative'>
                                                    <InputField
                                                        {...{
                                                            register,
                                                            formState,
                                                            control,
                                                            name: "Title",
                                                            id: "Title",
                                                            type: "text",
                                                            placeholder: "Title",
                                                            autoComplete: "true",
                                                            maxLength: 200,
                                                            className: "p-0 font-13 font-bold title-width",
                                                            style: {
                                                                backgroundColor: selectedColor,
                                                            },
                                                            sx: {
                                                                "& .MuiInputBase-input": {
                                                                    color: isDarkMode
                                                                        && "#fff",
                                                                    Padding: "10px 7px"

                                                                },
                                                            },
                                                            onInput: (e) => {
                                                                const maxLength = 200;
                                                                const inputValue = e.target.value;

                                                                // Truncate value to maxLength
                                                                if (inputValue.length > maxLength) {
                                                                    e.target.value = inputValue.slice(0, maxLength);
                                                                    setValue("Title", e.target.value);
                                                                } else {
                                                                    setValue("Title", inputValue);
                                                                }
                                                            },
                                                        }}
                                                    />
                                                    <div className='wordcount mt-3'>
                                                        <span>{watchField?.Title?.length}/200</span>
                                                    </div>
                                                    {
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
                                                    }

                                                </div>
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                    {t("General.Description")}*
                                                </Typography>
                                                <div className='relative'>
                                                    <TextAreaField
                                                        {...{
                                                            register,
                                                            formState,
                                                            control,
                                                            name: "Advertise_details",
                                                            id: "Advertise_details",
                                                            type: "textarea",
                                                            placeholder: "Advertise details...",
                                                            autoComplete: "true",
                                                            multiline: true,
                                                            draggable: false,
                                                            maxLength: 600,
                                                            onKeyDown: (e) => {
                                                                if (e?.target?.value?.trim() === '' && e?.keyCode === 13) {
                                                                    e.preventDefault();
                                                                }
                                                            },
                                                            style: {
                                                                backgroundColor: selectedColor, color: isDarkMode
                                                                    && "#fff",
                                                                Height: "100px"

                                                            },
                                                            onInput: (e) => {
                                                                const maxLength = 600;
                                                                const inputValue = e.target.value;

                                                                // Truncate value to maxLength
                                                                if (inputValue.length > maxLength) {
                                                                    e.target.value = inputValue.slice(0, maxLength);
                                                                    setValue("Advertise_details", e.target.value); // Update the form state
                                                                } else {
                                                                    setValue("Advertise_details", inputValue);
                                                                }
                                                            },
                                                        }}
                                                    />

                                                    <div className='wordcount'>
                                                        <span>{watchField?.Advertise_details?.length}/600</span>
                                                    </div>
                                                    {
                                                        !isIOS() && (
                                                            <div className="mickeicon">
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
                                                </div>
                                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                    {t("General.Price")}
                                                </Typography>
                                                <div className='priceContainer mb-10'>
                                                    <InputField
                                                        {...{
                                                            register,
                                                            formState,
                                                            control,
                                                            name: "price",
                                                            id: "price",
                                                            type: "Number",
                                                            value: displayPrice || "",
                                                            placeholder: t("General.Price"),
                                                            autoComplete: "true",
                                                            className: `p-0 min-h-auto ${postDetailsStyle.priceInput}`,
                                                            startAdornment: <InputAdornment position="start" className="font-16 ruppescontent mr-10 pl-8">₹</InputAdornment>,
                                                            onChange: (e) => {
                                                                const value = e.target.value;
                                                                const sanitizedValue = value.replace(/[^0-9.]/g, '');

                                                                // Ensure only one decimal point
                                                                const decimalCount = (sanitizedValue.match(/\./g) || []).length;
                                                                if (decimalCount > 1) return; // Limit to 2 decimal places
                                                                const parts = sanitizedValue.split('.');
                                                                if (parts[1] && parts[1].length > 2) return;
                                                                if (parseFloat(sanitizedValue) > 1000000000) return;
                                                                setPriceValue(sanitizedValue);
                                                                setDisplayPrice(sanitizedValue);
                                                            },
                                                            style: {
                                                                backgroundColor: selectedColor,
                                                            },
                                                            sx: {
                                                                "& .MuiInputBase-input": {
                                                                    color: isDarkMode
                                                                        && "#fff",
                                                                },
                                                            }
                                                        }}
                                                    />

                                                </div>
                                                <div className='mb-10'>
                                                    <Typography variant="subtitle1" className='font-13 font-bold' gutterBottom>
                                                        {t("General.PriceType")}
                                                    </Typography>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={priceTypeId === 1}
                                                                onChange={() => handlePriceChange(1)}
                                                                sx={{
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

                                                <div className='mb-10'>
                                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        {t("General.Why are you posting?")}
                                                    </Typography>
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
                                                            },
                                                            className: `${isDarkMode ? 'react-select dark' : 'react-select'} `
                                                        }}
                                                    />

                                                </div>

                                                <div className={postDetailsStyle.p}>
                                                    <Grid item xs={12}>
                                                        <div className={postDetailsStyle.imageUploadContainer} mt-3>
                                                            <label className={postDetailsStyle.imageUploadLabel} mt-3>
                                                                {t("General.Image Upload")} ({imageDeque.size || 0}/8)
                                                            </label>
                                                        </div>
                                                    </Grid>
                                                    <Grid container spacing={2}>
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

                                                    <Typography className='mt-10' variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        {t("General.Location")}
                                                    </Typography>
                                                    <div className='d-flex align-items-center custdrodownscroll mt-5 mb-5'>
                                                        <LocationOnIcon style={{ color: "#e73c2e" }} className="font-16  mr-5" />
                                                        <p className='mt-0 mb-0' style={{
                                                            color: isDarkMode
                                                                && "#fff"
                                                        }}>{cityData?.data?.find((d) => d?.id === selectedCity).city}</p>

                                                        {/* <Dropdown placement="bottomCenter" className='custdrodown' overlayStyle={{ zIndex: 9999, }} overlay={<div className='custdrodownscroll' ref={dropdownRef}>{cityMenu} </div>}  >
                                                    <a onClick={(e) => e.preventDefault()}>
                                                        <Space>
                                                            {selectedOptionCity ? <div className='dropdownlabel d-flex ' >{cities?.find((d) => d?.value === selectedOptionCity.value)?.label} <KeyboardArrowDownIcon sx={{ marginLeft: "2px", marginRight: "10px", height: "25px", width: "20px" }} />  </div> : t("General.select city")}
                                                        </Space>
                                                    </a>
                                                </Dropdown> */}
                                                        <span style={{
                                                            color: isDarkMode
                                                                && "#fff"
                                                        }} onClick={() => setIsLocationPicker(true)}>{selectedLocation}</span>
                                                    </div>
                                                    <Typography className='mt-10' variant="subtitle1" fontWeight="bold" gutterBottom>
                                                        {t("contactType.Contact")}
                                                    </Typography>
                                                    <div className='d-flex align-items-center iconsdrodown'>
                                                        <Dropdown placement="bottomLeft" overlayStyle={{ zIndex: 9999 }} overlay={menu}>
                                                            <a onClick={(e) => e.preventDefault()}>
                                                                <Space>
                                                                    {selectedOption ? <div className='dropdownlabel d-flex mt-5' >{handleOptionSelected()}<KeyboardArrowDownIcon sx={{ marginLeft: "0px", marginRight: "0px", height: "20px", width: "20px" }} />  </div> : "select option"}
                                                                </Space>
                                                            </a>
                                                        </Dropdown>
                                                        {
                                                            selectedOption === contactTypesEnum.EMAIL &&
                                                            <InputField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "Email",
                                                                    id: "Email",
                                                                    type: "text",
                                                                    placeholder: t("General.Email*"),
                                                                    className: `p-0 min-h-auto ${postDetailsStyle.textArea}`,
                                                                    autoComplete: "true",
                                                                    onBlur: handleBlur,
                                                                    onInput: (e) => {
                                                                        e.target.value = e.target.value.replace(/\s/g, '')
                                                                        if (e.target.value != editPostData?.email) {
                                                                            setIsValidMobile(true)
                                                                        }

                                                                        if (e.target.value === editPostData.email || selectedOption === contactTypesEnum.HIDEME) {
                                                                            setIsValidMobile(false)
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& fieldset": { border: 'none' },
                                                                        "& .MuiInputBase-input": {
                                                                            color: isDarkMode
                                                                                && "#fff"

                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        }

                                                        {
                                                            (selectedOption === contactTypesEnum.PHONEWHATSAPP || selectedOption === contactTypesEnum.PHONE) &&
                                                            <InputField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "MobileNo",
                                                                    id: "MobileNo",
                                                                    type: "number",
                                                                    placeholder: t("General.Mobile number*"),
                                                                    className: "p-0 hideNumberSpin min-h-auto",
                                                                    autoComplete: "true",
                                                                    onInput: (e) => {
                                                                        let rawValue = e.target.value.replace(/\s+/g, ''); // Remove spaces
                                                                        let sanitizedValue = rawValue.replace(/\D/g, ''); // Remove non-numeric characters

                                                                        // Ensure only up to 10 digits
                                                                        sanitizedValue = sanitizedValue.slice(0, 10);

                                                                        // Prevent all zeros
                                                                        if (/^000+/.test(sanitizedValue)) {
                                                                            sanitizedValue = sanitizedValue.replace(/^0+/, ''); // Remove all leading zeros
                                                                        } else if (/^00\d/.test(sanitizedValue)) {
                                                                            // If it starts with "00" followed by a digit, allow only two leading zeros
                                                                            sanitizedValue = sanitizedValue;
                                                                        } else if (/^0{3,}/.test(sanitizedValue)) {
                                                                            // If more than two leading zeros are found, reduce them to "00"
                                                                            sanitizedValue = sanitizedValue.replace(/^0{3,}/, '00');
                                                                        }

                                                                        e.target.value = sanitizedValue;

                                                                        if (e.target.value !== editPostData?.mobileno && e.target.value !== loginUserData?.data[0]?.mobileno) {
                                                                            setIsValidMobile(true);
                                                                        }
                                                                        if (e.target.value === editPostData?.mobileno || e.target.value === loginUserData?.data[0]?.mobileno || selectedOption === contactTypesEnum.HIDEME) {
                                                                            setIsValidMobile(false);
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& fieldset": { border: 'none' },
                                                                        "& .MuiInputBase-input": {
                                                                            color: isDarkMode
                                                                                && "#fff"

                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        }

                                                        {
                                                            selectedOption === contactTypesEnum.TELEGRAM &&
                                                            <InputField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "TelegramNo",
                                                                    id: "TelegramNo",
                                                                    type: "number",
                                                                    placeholder: t("General.Telegram number*"),
                                                                    className: `p-0  min-h-auto ${postDetailsStyle.textArea}`,
                                                                    autoComplete: "true",
                                                                    // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,
                                                                    onInput: (e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                        if (e.target.value != editPostData?.mobileno && e.target.value != loginUserData?.data[0]?.mobileno) {
                                                                            setIsValidMobile(true)
                                                                        }
                                                                        if (e.target.value === editPostData.mobileno || e.target.value == loginUserData?.data[0]?.mobileno || selectedOption === "hideme") {
                                                                            setIsValidMobile(false)
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& fieldset": { border: 'none' },
                                                                        "& .MuiInputBase-input": {
                                                                            color: isDarkMode
                                                                                && "#fff"

                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        }

                                                        {
                                                            selectedOption === contactTypesEnum.WHATSAPP &&
                                                            <InputField
                                                                {...{
                                                                    register,
                                                                    formState,
                                                                    control,
                                                                    name: "WhatsappNo",
                                                                    id: "WhatsappNo",
                                                                    type: "number",
                                                                    placeholder: t("General.WhatsApp number*"),
                                                                    className: `p-0 min-h-auto ${postDetailsStyle.textArea}`,
                                                                    autoComplete: "true",
                                                                    // startAdornment:<LocalPhoneIcon  className="font-16 text-grey-200 mr-10"/>,
                                                                    onInput: (e) => {
                                                                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10)
                                                                        if (e.target.value != editPostData?.mobileno && e.target.value != loginUserData?.data[0]?.mobileno) {
                                                                            setIsValidMobile(true)
                                                                        }
                                                                        if (e.target.value === editPostData.mobileno || e.target.value == loginUserData?.data[0]?.mobileno || selectedOption === contactTypesEnum.HIDEME) {
                                                                            setIsValidMobile(false)
                                                                        }
                                                                    },
                                                                    sx: {
                                                                        "& fieldset": { border: 'none' },
                                                                        "& .MuiInputBase-input": {
                                                                            color: isDarkMode
                                                                                && "#fff"

                                                                        }
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
                                        </DialogContent>

                                        {/* <div className="border-r"></div> */}
                                        {/* <Grid lg={4.5} md={4.5} xl={4.5} sm={4.5} xs={12} item className={postDetailsStyle.prizeDistribution}>
                                        <label className="label">
                                            <div className="drag-file-area">
                                                <span className="browse-files">
                                                    <div className="upload-icon">
                                                        <img src="/upload_image.png" alt="Upload icon" style={{ maxWidth: "25%", borderRadius: "7px", cursor: "pointer", marginTop: "20px" }} />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        name="Document"
                                                        id="contained-button-file"
                                                        title=""
                                                        onChange={(e: any) => handleFileUpload(e)}
                                                        multiple={true}
                                                        className="default-file-input"
                                                    />
                                                    <span className="browse-files-text">{t("General.browse file")} </span>
                                                    <span>{t("General.from device")}</span>
                                                </span>
                                            </div>
                                        </label>

                                    </Grid> */}
                                        {/* {imageDeque?.getAllDataWithKey()?.length > 0 &&
                                        <Swiper
                                            spaceBetween={30}
                                            slidesPerView={3}
                                            slidesPerGroup={1}
                                            pagination={{
                                                clickable: false,
                                            }}
                                            navigation={true}
                                            loop={true}
                                            modules={[Pagination, Navigation]}
                                            // watchSlidesProgress={true}
                                            className="mx-3 mySwiper editSwiper"
                                        >
                                            {imageDeque?.getAllDataWithKey()?.map((elm, index) => (
                                                <SwiperSlide key={index}>
                                                    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", position: "relative", minHeight: "150px" }}>
                                                        <img
                                                            src={elm.value}
                                                            alt="image"
                                                        />
                                                        <DeleteOutlineIcon className='delete-icon' onClick={() => { setIsShowDeletePopup(true); setImageKey(elm.key); setImageIndex(index) }}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    } */}
                                    </Grid>
                                </>
                            )
                        }

                        {/* 
                    {activeStep === 2 && isValidMobile &&
                        (
                            <>
                                <Divider className='w-100 mt-10' />
                                <FormControl className='mt-20 w-96 p-10' >
                                    <div className='' style={{ textAlign: "center", color: "#252525" }}>
                                        {t("General.OTPSelectionMessage")}
                                    </div>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="messageType"
                                        defaultValue="Whatsapp"
                                        {...register('messageType')}
                                        sx={{ justifyContent: "center" }}
                                    >
                                        <FormControlLabel value="Whatsapp" control={<Radio />} label={t("General.WhatsApp")} />
                                        <FormControlLabel value="sms" control={<Radio />} label={t("General.SMS")} />
                                    </RadioGroup>
                                </FormControl>
                                <Divider className='w-100 mt-10' />
                            </>
                        )
                    } */}
                        {activeStep === 3 && isValidMobile &&
                            (
                                <>
                                    <Grid display="flex" className='overflow-hidden edit-upload-post' container wrap="wrap">
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
                                            <Typography className="mt-10 mb-10 text-center font-13">
                                                <p className='mb-3'>{t("General.We've sent an otp to entered mobile number")}</p>
                                                <p className='mt-0'>This code will expire in {" "}
                                                    <span style={{ fontWeight: 600 }}>{minutes < 10 ? `0${minutes}` : minutes}</span>:
                                                    <span style={{ fontWeight: 600 }}>{seconds < 10 ? `0${seconds}` : seconds}</span>{" "}
                                                    minutes.</p>
                                            </Typography>
                                        </div>
                                    </Grid>
                                </>
                            )
                        }
                    </form >

                    <div className="bottom-0 left-0 right-0 z-50 bg-white border-t">
                        <div className="d-flex gap p-10 align-items-center justify-content-between">
                            <div>
                                {
                                    activeStep != 1 &&
                                    <Button disabled={formState.isSubmitting} type="reset" variant="outlined" color="error" className='close-btn' onClick={() => { activeStep === 1 ? handleClose() : !SHOW_WHATSAPP_OTP_OPTION || selectedOption != contactTypesEnum.PHONEWHATSAPP ? setActiveStep(1) : setActiveStep(1) }}>{activeStep != 1 && t("General.GO BACK")}</Button>
                                }
                            </div>
                            <div className='gap' >
                                <Button type="reset" style={{ marginRight: '10px' }} variant="outlined" color="error" className='close-btn' onClick={() => handleClose()}>{t("General.Cancel")}</Button>
                                <Button disabled={formState.isSubmitting} type="submit" form="advertiseDetailsForm" variant="contained">
                                    {formState.isSubmitting ? <CircularProgress style={{ height: "25px", width: "25px" }} /> : activeStep != 3 && isValidMobile && loginUserData?.data[0]?.roleid !== 1 && loginUserData?.data[0]?.roleid !== 1 && selectedOptionId != contactTypesEnum.HIDEME ? t("General.Next") : t("General.Update")}
                                </Button>

                            </div>
                        </div>
                    </div>

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
                                <LocationPicker setIsLocationPicker={setIsLocationPicker} lattitude={position?.latitude} longitude={position?.longitude} languageId={selectedLanguage} setLocationObject={setLocationObject} isSeprateLocation={true} />
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default EditPostDialog
