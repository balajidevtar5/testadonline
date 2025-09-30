import { InboxOutlined, Padding } from '@mui/icons-material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/Info';
import { Button, CircularProgress, Dialog, DialogTitle, Grid, Tooltip, Link, useMediaQuery } from '@mui/material';
import { GetProp, Tag, Upload, UploadProps, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import { useTheme } from "@mui/material/styles";
import { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddFundComponent from '../../components/addFund/AddFundComponent';
import InputField, { SelectField } from '../../components/formField/FormFieldComponent';
import { MAIN_COLOR } from '../../config/theme';
import { API_ENDPOINT_PROFILE, LOGEVENTCALL, POST_TYPE_ENUM, acceptedImageTypes, logEvents } from '../../libs/constant';
import { deepClone } from '../../libs/helper';
import { RootState } from '../../redux/reducer';
import { AddWalletTransaction, fetchAvailablePostSlot } from '../../redux/services/post.api';
import { AvailableAdsSlotApi, addPremiumAd } from '../../redux/services/premiumad';
import { loginUserUpdate } from '../../redux/slices/auth';
import "./premiumStyles.scss";
import axios from 'axios';
import { isEditable } from '@testing-library/user-event/dist/utils';
import { useTranslation } from 'react-i18next';
import { getAllSettingsAPI } from '../../redux/services/setting.api';
import LocationPicker from '../../components/locationpicker/locationpicker';
import { LayoutContext } from '../../components/layout/LayoutContext';
import { getLocationById } from '../../redux/services/locations.api';
import { getData } from '../../utils/localstorage';
import SmoothPopup from '../animations/FancyAnimatedDialog';
import { logEffect } from '../../utils/logger';
import AccordionComponent from '../../dialog/postDetails/acording';
import { Close } from '@mui/icons-material';
import { AccessTime as AccessTimeIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import StarsIcon from '@mui/icons-material/Stars';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { fetchCardItems } from '../../redux/slices/postSlice';
import type { AppDispatch } from '../../redux/store';
import { getDecryptedCookie } from '../../utils/useEncryptedCookies';
import { useCookies } from 'react-cookie';

const PremiumModal = (props: any) => {
    const { open, handleClose, handleOk, premiumAdData, isRepost, selectedCity } = props;
    const { t } = useTranslation();
    const premiumAdSchema = Yup.object().shape({
        viewCount: Yup.number(),
        categoryName: Yup.mixed(),
        url: Yup.string(),
    });
    const { register, formState, control, setValue, watch, handleSubmit, setError } = useForm({
        //resolver: yupResolver(premiumAdSchema),
    });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    const { position, selectedLanguage, setIsPostClear, setIsLoading, categoryList, filterValue, prevFilterData, searchValue, setIsRefetch, setIsScrooling, isScrolling } = useContext(LayoutContext)
    const { data: settingData } = useSelector((state: RootState) => state.settingList);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const { data: cityData } = useSelector((state: RootState) => state.cities);
    const [count, setCount] = useState<number | "">(30);
    const [totalCount, setTotalCount] = useState(30);
    const [initialValue, setInitialValue] = useState(50);
    const [incrementedValue, setIncrementedValue] = useState(50);
    const [incrementValueChanged, setIncrementValueChanged] = useState(false);
    const [isPremiumLoading, setIsPremiumLoading] = useState(false);
    const [addFundModalOpen, setIsAddFundModalOpen] = useState(false);
    const [cities, setCities] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [paymentSlot, setPaymentSlot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [optionData, setOptionData] = useState([]);
    const dispatch = useDispatch<AppDispatch>();
    const [isLocationPicker, setIsLocationPicker] = useState(false);
    const [locationObject, setLocationObject] = useState({ id: "" });
    const [selectedLocationName, setSlectedLocationName] = useState("");
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [categoryClick, setCategoryClick] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
        let isPremiumEdit = false;
    const navigate = useNavigate();
    const [{ adminAuth }]: any = useCookies(["adminAuth"]);
    const encryptedAdminAuth = getDecryptedCookie(adminAuth)
    const isAdmin = loginUserData?.data[0]?.roleid === 1 || loginUserData?.data[0]?.roleid === 3
    if (premiumAdData) {
        isPremiumEdit = Object.keys(premiumAdData).length > 0;
    }
    const ViewCount = [
        {
            id: 1, name: t("General.Number of Days"), price: 50, showCurrency: false, type: "ad_charge",
            infoIcon: <InfoIcon style={{ fontSize: "1rem", color: "grey", marginLeft: "3px", marginRight: "3px" }} />
        },
    ]
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const fixImageRotation = (file: File): Promise<File> => {
        return new Promise<File>((resolve) => {
            const img: HTMLImageElement = new Image();

            img.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

                // Set dimensions to match the original image
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                // Draw image with correct orientation
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.scale(1, 1);
                ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
                ctx.restore();

                // Convert to blob while maintaining quality
                canvas.toBlob((blob: Blob | null) => {
                    if (blob) {
                        const fixedFile: File = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(fixedFile);
                    } else {
                        resolve(file); // Fallback to original file if blob creation fails
                    }
                }, file.type, 1.0);
            };

            // Handle load errors
            img.onerror = () => {
                resolve(file); // Fallback to original file if loading fails
            };

            // Create object URL from the file
            img.src = URL.createObjectURL(file);
        });
    };

    const readFile = async (uploadedFiles) => {
        const file = uploadedFiles?.originFileObj;
        if (file) {
            try {
                setIsImageLoading(true);
                const fixedFile = await fixImageRotation(file);
                const reader = new FileReader();

                reader.onload = () => {
                    setPreviewUrl(reader.result);
                    setIsImageLoading(false);
                };

                reader.onerror = () => {
                    setIsImageLoading(false);
                    message.error(t("toastMessage.Error reading image"));
                };

                reader.readAsDataURL(fixedFile);

                // Update the original file with the fixed version
                uploadedFiles.originFileObj = fixedFile;
                setUploadedFile(uploadedFiles);
            } catch (error) {
                console.error('Error fixing image rotation:', error);
                setIsImageLoading(false);

                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
                setUploadedFile(uploadedFiles);
            }
        }
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

    const handleAccordinCategoryOk = (subCategory, category) => {
        setSelectedSubcategory(subCategory);
        setCategoryId(category?.id)
        setSubCategoryId(subCategory.SubCategoryId);
        setValue("categoryName", category);
        setSelectedCategory(category);
    }


    const handleUploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: "image/png, image/jpg, image/jpeg, image/gif",
        showUploadList: true,
        beforeUpload: (file: RcFile) => {
            const fileType = file.name.split(".").pop().toLowerCase();
            if (!acceptedImageTypes.includes(fileType)) {
                message.error(
                    <div>
                        <b>{file.name}</b> is not a jpg, png, jpeg, or gif file
                    </div>
                );
                return Upload.LIST_IGNORE;
            }
            return true;

        },
        onChange: async (info) => {
            const files = info.file;
            let maxFileSize;
            settingData?.data?.map((elm) => {
                if (elm?.name === "ImageSize") {
                    maxFileSize = elm?.value * 1024;
                }
            });

            if (files.size > maxFileSize) {
                if (files.status === "error") {
                    message.error(t("toastMessage.File exceeds the maximum size of 10 MB."));
                }
                return;
            }

            await readFile(info.file);
            if (info.file.status === "error") {
                // message.error(`${info.file.name} file upload failed.`);
                return;
            }
            //  else {
            //     setIsPremiumLoading(false);
            //     setError("viewCount", { type: "required", message: "" });
            // }
        },
        onDrop(e) {
        },
    };

    const isSubmitting = useRef(false);

    const onSubmit = async (values) => {
        setHasAttemptedSubmit(true);
        setIsPremiumLoading(true);
        

        if (uploadedFile === null && !previewUrl) {
            message.error(t("toastMessage.Please upload image"));
            setIsPremiumLoading(false);
            return;
        }
        if (selectedLocationName === t("General.All Cities")) {
            message.error("toastMessage.City is required field");
            setIsPremiumLoading(false);
            return;
        }
        if (!values.viewCount || values.viewCount === '') {
            setValue("viewCount", 30);
            setCount(30);
            values.viewCount = 30;
        }

        if (values.viewCount > 30) {
            setError("viewCount", { type: "required", message: t("General.Number of Days cannot exceed 30") });
            setIsPremiumLoading(false);
            return;
        }

        if (values.viewCount < 1) {
            setError("viewCount", { type: "required", message: t("General.Number of Days must be at least 1") });
            setIsPremiumLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('item', uploadedFile?.originFileObj);
            formData.append('Days', values.viewCount);
            formData.append('url', values.url);
            formData.append('buttonText', values.buttonText);

            if (categoryId != null) {
                formData.append('CategoryId', categoryId);
            }

            if (subCategoryId !== null && subCategoryId !== undefined && subCategoryId !== "undefined") {
                formData.append('SubCategoryId', subCategoryId);
            }

            const currentUserLocation = await getData("currentUserLocation");
            if (locationObject?.id || selectedCity || currentUserLocation) {
                if (isRepost && Object.keys(isRepost).length > 0) {
                    formData.append('LocationId', locationObject?.id || isRepost.locationid || selectedCity);
                } else {
                    formData.append('LocationId', locationObject?.id || premiumAdData?.locationid || selectedCity);
                }
            }

            if (isPremiumEdit) {

                formData.append('id', premiumAdData?.id);
                formData.append('isUploaded', 'true');
            } else {
                formData.append('id', '0');
                formData.append('isUploaded', 'false');
            }

            if (!isPremiumEdit) {

                if (paymentSlot?.balance >= (paymentSlot?.priceperview * Number(count))) {
                    const response = await addPremiumAd(formData);
                    if (response.success) {
                        const walletPayload = {
                            ReferenceId: response.data[0].adsid,
                            Amount: (paymentSlot?.priceperview * Number(count)),
                            CodeName: POST_TYPE_ENUM.ADS
                        };
                        if ((paymentSlot?.priceperview * Number(count)) > 0) {
                            const walletResponse = await AddWalletTransaction(walletPayload);
                            if (walletResponse?.success) {
                                const loginUserUpdatePayload: any = deepClone(loginUserData);
                                loginUserUpdatePayload.data[0].balance = loginUserUpdatePayload.data[0].balance - (paymentSlot?.priceperview * Number(count));
                                dispatch(loginUserUpdate(loginUserUpdatePayload));
                                setIsPremiumLoading(false);
                                handleClose();
                            }
                        }
                         navigate('/success', {
                        state: {
                            postId: response.data[0].postid,
                            languageId: 2 // Set your default language ID or get it from your app state
                        }
                    });
                        handleOk(response);
                        setIsLoading(true);

                        if (LOGEVENTCALL) {
                            logEffect(logEvents.Create_PremiumAd)
                        }
                        handleClose();
                        message.success(response.message);
                    }
                } else {
                    message.info(t("toastMessage.Your account balance is insufficient. Please add money into wallet before proceeding."));
                    setIsAddFundModalOpen(true);
                }
            } else {
                const response = await addPremiumAd(formData);
                if (response.success) {
                    handleOk(response);
                    if (LOGEVENTCALL) {
                        logEffect(logEvents.Edit_PremiumAd)
                    }
                    message.success(response.message);
                    // Refetch main post list after editing premium ad
                    dispatch(fetchCardItems({
                        isRefetch: true,
                        filterValue,
                        selectedCity,
                        selectedLanguage,
                        prevFilterData,
                        searchValue,        
                        setIsLoading,
                        setIsPostClear,
                        setIsScrooling,
                        isScrolling,
                        setIsRefetch,
                        encryptedAdminAuth
                    }));
                    navigate('/success', {
                        state: {
                            postId: response.data[0].postid,
                            languageId: 2 // Set your default language ID or get it from your app state
                        }
                    });
                    handleClose(null)
                }
            }
        } catch (error) {
            setIsPremiumLoading(false);
            isSubmitting.current = false;
        }
    };


    useMemo(async () => {
        try {
            const response = await AvailableAdsSlotApi()
            if (response) {
                setPaymentSlot(response?.data[0]);
            }
        } catch (error) {
        }
    }
        , [])

    useEffect(() => {
        if (cityData?.length > 0) {
            const convertibleArray = cityData.map((elm) => ({
                label: elm?.label,
                value: elm?.value
            }));
            const updatedArray = [{ label: t("General.All"), value: 0 }, ...convertibleArray];
            setCities(updatedArray);
        }
    }, [cityData])

    const fetchImage = async (imageUrl) => {

        try {
            const response = await axios.get(imageUrl, {
                responseType: 'blob'
            });

            const blob = response.data;
            const file = new File([blob], 'image.jpg', { type: blob.type });
            setUploadedFile({ originFileObj: file });
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    };


    const handleDeleteImage = () => {
        setUploadedFile(null);
        setPreviewUrl("");
        setHasAttemptedSubmit(false);
    };


    const handleClickViews = (d) => {
        setCount(d?.rupees)
        setValue("viewCount", d?.rupees)
    }

    useEffect(() => {
        if (paymentSlot?.priceperview !== undefined && count !== undefined) {
            setInitialValue(paymentSlot?.priceperview * Number(count));
        }
    }, [paymentSlot, count]);


    useEffect(() => {
        if (paymentSlot?.priceperview * Number(count) > 0) {
            //debugger
            const interval = setInterval(() => {
                setIncrementedValue(prevValue => {
                    if (prevValue < initialValue) {
                        setIncrementValueChanged(true);
                        return initialValue;
                    } if (prevValue > initialValue) {
                        setIncrementValueChanged(true);
                        return initialValue;
                    }
                    else {
                        clearInterval(interval);
                        setIncrementValueChanged(false)
                        return prevValue;
                    }
                });
            }, 100); // Adjust the interval timing as needed

            return () => clearInterval(interval);
        }
    }, [initialValue, count]);


    const fetchSelectedCityById = async (locationId) => {
        try {
            if (!locationId) {
                return t("General.All Cities");
            }

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
        const handleEditFuction = async () => {
            setPreviewUrl(null)

            if (isPremiumEdit) {
                const locationId = locationObject?.id || isRepost?.locationid || premiumAdData?.locationid;
                if (locationId) {
                    const cityName = await fetchSelectedCityById(locationId);
                    setSlectedLocationName(cityName);
                } else {
                    setSlectedLocationName(t("General.All Cities"));
                }
                setPreviewUrl(`${API_ENDPOINT_PROFILE}/${premiumAdData?.largeimage?.replace(/^~/, '')}`)
                fetchImage(`${API_ENDPOINT_PROFILE}/${premiumAdData?.largeimage?.replace(/^~/, '')}`)

                // Set category and subcategory
                if (premiumAdData?.categoryid) {
                    const categoryData = categoryList?.data?.find((elm) => elm.id === premiumAdData.categoryid);
                    if (categoryData) {
                        setCategoryId(categoryData.id);
                        setValue("categoryName", categoryData);
                        setSelectedCategory(categoryData);
                        
                
                        // Handle subcategory if exists
                        if (categoryData?.subcategory) {
                            
                            const subcategory = JSON.parse(categoryData?.subcategory)?.find(
                                (elm) => elm.SubCategoryId === premiumAdData.subcategoryid
                            );
                            if (subcategory !== undefined) {
                                setSubCategoryId(subcategory.SubCategoryId);
                                setSelectedSubcategory(subcategory);
                            } else {
                                // If no subcategory, set the category as subcategory
                                const transformedData = {
                                    Name: categoryData?.displayname,
                                    Icon: categoryData?.icon,
                                };
                                setSelectedSubcategory(transformedData);
                                setCategoryClick(true);
                            }
                        } 
                    }
                }
                //setValue("url", premiumAdData?.url)

                // Set the Number of Days value
                const targetViews = premiumAdData?.targetdays;
                setValue("viewCount", targetViews);
                setCount(targetViews);
                setTotalCount(targetViews);
            }

            if (isRepost) {
                const locationId = locationObject?.id || isRepost?.locationid || premiumAdData?.locationid;
                if (isRepost?.categoryid) {
                    const categoryData = categoryList?.data?.find((elm) => elm.id === isRepost.categoryid);
                    if (categoryData) {
                        setCategoryId(categoryData.id);
                        setValue("categoryName", categoryData);
                        setSelectedCategory(categoryData);

                        // Handle subcategory if exists
                        if (categoryData?.subcategory) {
                            const subcategory = JSON.parse(categoryData?.subcategory)?.find(
                                (elm) => elm.SubCategoryId === isRepost?.subcategoryid
                            );
                            if (subcategory) {
                                setSubCategoryId(subcategory.SubCategoryId);
                                setSelectedSubcategory(subcategory);
                            } else {
                                // If no subcategory, set the category as subcategory
                                const transformedData = {
                                    Name: categoryData?.displayname,
                                    Icon: categoryData?.icon,
                                };
                                setSelectedSubcategory(transformedData);
                                setCategoryClick(true);
                            }
                        } 
                    }
                }
                //setValue("url", isRepost?.url)
                if (locationId) {
                    const cityName = await fetchSelectedCityById(locationId);
                    setSlectedLocationName(cityName);
                } else {
                    setSlectedLocationName(t("General.All Cities"));
                }
                if (isRepost?.largeimage) {
                    setPreviewUrl(`${API_ENDPOINT_PROFILE}/${isRepost?.largeimage?.replace(/^~/, '')}`)
                    fetchImage(`${API_ENDPOINT_PROFILE}/${isRepost?.largeimage?.replace(/^~/, '')}`)
                }
                // Set the Number of Days value for repost
                if (isRepost?.targetdays) {

                    const targetViews = isRepost?.targetdays;
                    setValue("viewCount", targetViews);
                    setCount(targetViews);
                    setTotalCount(targetViews);
                }
            }
        }

        handleEditFuction()
    }, [premiumAdData, cities, isPremiumEdit, categoryList])



    // useEffect(() => {
    //     if (cities.length > 0 && !isPremiumEdit ) {
    //         const cityDataValue = cities.find((elm) => elm.value === selectedCity);
    //         setValue("city", cityDataValue)
    //     }
    // }, [cities])


    useEffect(() => {
        const updateLocationName = async () => {
            const currentUserLocation = await getData("currentUserLocation");
            let locationId;
            if (isRepost && Object.keys(isRepost).length > 0) {
                locationId = locationObject?.id || isRepost?.locationid || selectedCity;
            } else {
                locationId = locationObject?.id || selectedCity || currentUserLocation?.id;
            }
            if (locationId) {
                const cityName = await fetchSelectedCityById(locationId);
                setSlectedLocationName(cityName);
            } else {
                setSlectedLocationName(t("General.All Cities")); // Default value
            }
        };

        updateLocationName();
    }, [loginUserData.data[0]?.locationid, selectedLanguage, locationObject]);

    const rawUrl = watch('url')?.trim();

    const getSafeUrl = (url) => {
        if (!url) return '';
        if (/^https?:\/\//i.test(url)) return url;
        return `https://${url}`;
    };
    
    const safeUrl = getSafeUrl(rawUrl);


    return (
        <>
            <SmoothPopup
                onClose={handleClose}
                open={open}
                maxWidth="sm"
                fullWidth={isPremiumEdit ? false : true}
                PaperProps={{
                    className: "p-20 pt-20 w-100 premium-modal-paper"
                }}
                className={`putaddialog p-10 pt-14 ${isPremiumEdit && 'editDialog'}`}
            >
                <div className='dialog-wrapper premadHeight'>
                    <DialogTitle
                        sx={{
                            p: 0,
                            pb: { xs: "10px", sm: 0, md: 0, lg: 0, xl: 0 }
                        }}
                        className="premium-modal-sticky-header"
                    >
                        {isPremiumEdit ? t("General.Edit Premium Ad") : t("General.Create Premium Ad")}
                    </DialogTitle>

                    <div className="dialog-body pt-0 premium-modal-scrollable">
                        <form id="advertiseDetailsForm" onSubmit={handleSubmit(onSubmit)}>
                            <Grid

                                className={`overflow-hidden premiumaddContainer ${isPremiumEdit ? 'editPremiumAddClass' : ''}`}
                                container
                                wrap="wrap"
                                justifyContent="space-between"
                            >
                                <div className='premiumAdModal w-100'>
                                    <div className="input w-100 categorydropdown mb-3">
                                        <AccordionComponent
                                            categoryClick={categoryClick}
                                            setCategoryClick={setCategoryClick}
                                            selectedSubcategory={selectedSubcategory}
                                            categoryList={categoryList}
                                            handleOk={handleAccordinCategoryOk}
                                        />
                                    </div>
                                    <div onClick={() => setIsLocationPicker(true)} className="proficleCityBox">
                                        <span>{selectedLocationName === t("General.All Cities") ? t("General.Choose State") : selectedLocationName}</span>
                                    </div>
                                    <div className="mt-10 draggebleinput">
                                        {uploadedFile !== null || previewUrl ? (
                                            <div className='position-relative'>
                                                {isImageLoading ? (
                                                    <div className='preview-bg d-flex justify-content-center align-items-center'>
                                                        <CircularProgress />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div onClick={handleDeleteImage} className='deleteImage'>
                                                            <DeleteOutlineIcon />
                                                        </div>
                                                        <div className='preview-bg'>
                                                            <img className='preview-image' src={previewUrl} alt="Uploaded" />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <Dragger {...handleUploadProps} style={{ background: "#0000000a", height: "38vh" }}>
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">{t("General.Click on this area to upload file")}</p>
                                                <p className="ant-upload-hint"></p>
                                            </Dragger>
                                        )}
                                    </div>
                                </div>
                                {/*<div className="border-r"></div>*/}
                                {(!isPremiumEdit && !isRepost) ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '16px', width: '100%' }} className="pb-10 pt-10 viewCount days-url-count">
                                        <div className='d-flex justify-content-between align-items-center'  style={{ gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column',flex:1 }}>
                                            <span className='justify-content-start d-flex align-items-center text-grey font-13 whitespace-nowrap' style={{ marginBottom: 4 }}>
                                                {t("General.Number of Days")}
                                                <Tooltip placement='bottom' arrow={true} title={<span style={{ fontSize: '0.7rem' }}>{t("General.Please specify the number of days (1-30) you want your ad to be active.")}<br /></span>}>
                                                    <InfoIcon style={{ fontSize: "1rem", color: "grey", marginLeft: "3px", marginRight: "3px" }} />
                                                </Tooltip>
                                            </span>
                                            <InputField
                                                {...{
                                                    register,
                                                    control,
                                                    formState,
                                                    id: "viewCount",
                                                    name: "viewCount",
                                                    value: count,
                                                    parentClassName: "viewsInput",
                                                    label: "",
                                                    className: `h-7 hideNumberSpin viewsInput customInputField`,
                                                    min: 1,
                                                    max: 30,
                                                    style: { width: '100%' },
                                                    endAdornment: <div className="eyeSvg"><AccessTimeIcon /></div>,
                                                    readOnly: false,
                                                    onInput: (e) => {
                                                        const value = e.target.value;
                                                        if (value === "") {
                                                            setCount("");
                                                        } else {
                                                            let inputValue = parseInt(value);
                                                            setCount(isNaN(inputValue) ? "" : inputValue);
                                                        }
                                                    },
                                                    onBlur: (e) => {
                                                        let inputValue = parseInt(e.target.value) || 0;
                                                        if (inputValue < 1) {
                                                            message.error(t("toastMessage.MinimumViewDays"));
                                                            setCount(1);
                                                            setValue('viewCount', 1);
                                                        } else if (inputValue > 30) {
                                                            message.error(t("toastMessage.MaxViewDays"));
                                                            setCount(30);
                                                            setValue('viewCount', 30);
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                            <div style={{ display: 'flex', flexDirection: 'column',flex:1  }}>
                                             <span className='justify-content-start d-flex align-items-center text-grey font-13 whitespace-nowrap' style={{ marginBottom: 4 }}>
                                                {t("General.Redirection Button Text")}
                                            </span>
                                            <InputField
                                                {...{
                                                    register,
                                                    control,
                                                    formState,
                                                    id: "buttonText",
                                                    name: "buttonText",
                                                    parentClassName: "buttonText viewsInput",
                                                    label: "",
                                                    className: `h-7 hideNumberSpin viewsInput customInputField`,
                                                    style: { width: '100%' },
                                                    readOnly: false,
                                                        onInput: (e) => {
                                                            console.log(e.currentTarget.value);
                                                        }
                                                }}
                                            />
                                        </div>
                                        </div>
                                        <div className={`${isMobile ? "pt-10" : " "}`} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <span className='justify-content-start d-flex align-items-center text-grey font-13' style={{ marginBottom: 4, whiteSpace: 'nowrap' }}>
                                                {t("General.URL")}
                                            </span>
                                            <InputField
                                                {...{
                                                    register,
                                                    control,
                                                    formState,
                                                    id: "url",
                                                    name: "url",
                                                    value: watch('url'),
                                                    parentClassName: "buttonText viewsInput",
                                                    label: "",
                                                    className: `h-7 viewsInput customInputField`,
                                                    style: { width: '100%'},
                                                    onBlur: () => {
                                                        const current = watch('url');
                                                        if (current && !/^https?:\/\//i.test(current)) {
                                                          setValue('url', `https://${current.trim()}`);
                                                        }
                                                      },
                                                    endAdornment: (
                                                        <Link
                                                            href={safeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                color: '#ff780c',
                                                                textDecoration: 'none',
                                                                marginLeft: '9px',
                                                                fontSize: '14px'
                                                            }}
                                                        >
                                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                <OpenInNewIcon style={{ fontSize: '1rem', marginLeft: '0px' }} />
                                                            </span>
                                                        </Link>
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={isPremiumEdit ? { marginTop: '15px' } : {}} className={`align-items-center pb-10 viewCount days-url-count`}>
                                                
                                        <div className='d-flex justify-content-between align-items-center'  style={{ gap: '1rem' }}>
                                              <div  style={{ display: 'flex', flexDirection: 'column',flex:1 }}>
                                               {ViewCount?.map((d) => (
                                                    <div className='d-flex justify-content-between align-items-center mr-8' key={d?.id}>
                                                        <span className='justify-content-start d-flex align-items-center text-grey font-13 whitespace-nowrap'>
                                                            {t(`${d?.name}`)}
                                                            <Tooltip placement='bottom' arrow={true} title={<span style={{ fontSize: '0.7rem' }}>
                                                                {t("General.Please specify the number of days (1-30) you want your ad to be active.")}
                                                                <br />
                                                            </span>}>
                                                                {d?.infoIcon}
                                                            </Tooltip>
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className='mr-10 w-100'>
                                                    <InputField
                                                        {...{
                                                            register,
                                                            control,
                                                            formState,
                                                            id: "viewCount",
                                                            name: "viewCount",
                                                            value: count ?? (isPremiumEdit ? premiumAdData?.targetdays : isRepost ? isRepost?.targetdays : ""),
                                                            parentClassName: "viewsInput",
                                                            label: "",
                                                            className: `h-7 hideNumberSpin viewsInput customInputField`,
                                                            min: 1,
                                                            max: 30,
                                                            type: "number",
                                                            endAdornment: <div className="eyeSvg"><AccessTimeIcon /></div>,
                                                            readOnly: false,
                                                            disabled: isPremiumEdit,
                                                            onInput: (e) => {
                                                                const value = e.target.value;
                                                                if (value === "") {
                                                                    setCount("");
                                                                } else {
                                                                    let inputValue = parseInt(value);
                                                                    setCount(isNaN(inputValue) ? "" : inputValue);
                                                                }
                                                            },
                                                            onBlur: (e) => {
                                                                let inputValue = parseInt(e.target.value) || 0;
                                                                if (inputValue < 1) {
                                                                    message.error(t("toastMessage.MinimumViewDays"));
                                                                    setCount(1);
                                                                    setValue('viewCount', 1);
                                                                } else if (inputValue > 30) {
                                                                    message.error(t("toastMessage.MaxViewDays"));
                                                                    setCount(30);
                                                                    setValue('viewCount', 30);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                </div>
                                                         <div style={{ display: 'flex', flexDirection: 'column',flex:1  }}>
                                             <span className='justify-content-start d-flex align-items-center text-grey font-13 whitespace-nowrap' style={{ marginBottom: 4 }}>
                                                {t("General.Redirection Button Text")}
                                            </span>
                                            <InputField
                                                {...{
                                                    register,
                                                    control,
                                                    formState,
                                                    id: "buttonText",
                                                    name: "buttonText",
                                                    parentClassName: "buttonText viewsInput",
                                                    value:watch('buttonText') ?? (isPremiumEdit ? premiumAdData?.buttontext : isRepost ? isRepost?.buttontext : ""),
                                                    label: "",
                                                    className: `h-7 hideNumberSpin viewsInput customInputField`,
                                                    style: { width: '100%' },
                                                    readOnly: false,
                                                    onInput: (e) => {
                                                     setValue("buttonText",e.target.value)
                                                    },
                                                  
                                                }}
                                            />
                                        </div>
                                                </div>
                                            </div>
                                           
                                            <div style={isPremiumEdit ? { marginTop: '' } : {}} className='d-flex align-items-center w-100 pb-10'>
                                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                    <span className='justify-content-start d-flex align-items-center text-grey font-13' style={{ marginRight: 8, whiteSpace: 'nowrap' }}>
                                                        {t("General.URL")}
                                                    </span>
                                                    <div style={{ width: "100%" }}>
                                                        <InputField
                                                            {...{
                                                                register,
                                                                control,
                                                                formState,
                                                                id: "url",
                                                                name: "url",
                                                                value: watch('url') ?? (isPremiumEdit ? premiumAdData?.url : isRepost ? isRepost?.url : ""),
                                                                label: "",
                                                                className: `h-7 `,
                                                                parentClassName: "buttonText viewsInput",
                                                                type: "text",
                                                                style: { maxWidth: '100%' },
                                                                onBlur: () => {
                                                                    const current = watch('url');
                                                                    if (current && !/^https?:\/\//i.test(current)) {
                                                                      setValue('url', `https://${current.trim()}`);
                                                                    }
                                                                  },
                                                                endAdornment: (
                                                                    <Link
                                                                        href={safeUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{
                                                                            color: '#ff780c',
                                                                            textDecoration: 'none',
                                                                            marginLeft: '9px',
                                                                            fontSize: '14px'
                                                                        }}
                                                                    >
                                                                        <span style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <OpenInNewIcon style={{ fontSize: '1rem', marginLeft: '22px' }} />
                                                                        </span>
                                                                    </Link>
                                                                ),
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                )}
                                {(!isPremiumEdit && !isAdmin && paymentSlot?.priceperview > 0) && (
                                    <>
                                        <div className='d-flex justify-content-between'>
                                            <span className='justify-content-start text-grey font-13'>{t("Menus.Balance")}</span>
                                            <span className='justify-content-end d-flex align-items-center text-grey font-13'>
                                                <span className='font-sans-serif  '><StarsIcon style={{ fontSize: 15, marginRight: 4 }} /></span>{paymentSlot?.balance} {t("General.Ptr")}</span>
                                        </div>
                                        <div className='d-flex justify-content-between mt-10'>
                                            <span className='justify-content-start d-flex align-items-center text-grey font-13'>{t("General.Ad Charge")}
                                            </span>
                                            <div className={`justify-content-end text-grey  ${incrementValueChanged ? 'highlighted-text' : "font-13"}`} >
                                                <span>{incrementedValue}({paymentSlot?.priceperview}*{count})</span>
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-between mt-10 pt-10 border-t'>
                                            <span className='justify-content-start text-grey font-13 font-bold'>{t("General.Total")}</span>
                                            <span className={`justify-content-end text-grey d-flex  align-items-center font-bold ${incrementValueChanged ? 'highlighted-text' : "font-13"}`}>
                                                <span className={`font-sans-serif `} ><StarsIcon style={{ fontSize: 15, marginRight: 4 }} /></span>{paymentSlot?.balance - (incrementedValue)} {t("General.Ptr")}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </Grid>
                        </form>
                    </div>
                </div>
                <div className="d-flex gap cursor-pointer pt-10 align-items-center justify-content-end">
                    <Button variant="outlined" color="error" className='close-btn' onClick={handleClose}>{t("General.Cancel")}</Button>
                    <Button form="advertiseDetailsForm" type='submit' variant="contained" disabled={isPremiumLoading || isSubmitting.current}>
                        {isPremiumLoading ? <CircularProgress size={24} color="inherit" /> : isPremiumEdit ? t("General.Update") : t('General.Save')}
                    </Button>
                </div>
            </SmoothPopup>
            {addFundModalOpen && (
                <Dialog
                    onClose={() => setIsAddFundModalOpen(false)}
                    sx={{ m: '0px' }}
                    open={open}
                    maxWidth="xs"
                    fullWidth
                >
                    <AddFundComponent {...{
                        amountCalculation: (paymentSlot?.priceperview * Number(count)) - paymentSlot?.balance,
                        handleOk: (response) => { setIsAddFundModalOpen(false); handleOk(response) }
                    }} />
                </Dialog>
            )}
            {isLocationPicker && (
                <Dialog
                    className="location-dialog"
                    onClose={() => setIsLocationPicker(false)}
                    sx={{ m: "0px" }}
                    open={isLocationPicker}
                    maxWidth="xs"
                    fullWidth
                >
                    <LocationPicker
                        setIsLocationPicker={setIsLocationPicker}
                        lattitude={position?.latitude}
                        longitude={position?.longitude}
                        languageId={selectedLanguage}
                        isSeprateLocation={true}
                        setLocationObject={setLocationObject}
                    />
                </Dialog>
            )}
        </>
    )
}

export default PremiumModal