import { EnvironmentOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import { ShareOutlined } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ClearIcon from "@mui/icons-material/Clear";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteIcon from "@mui/icons-material/Favorite";
import HideSourceSharpIcon from "@mui/icons-material/HideSourceSharp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Typography } from "@mui/material";
import { Col, message, Row } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { EffectCube, FreeMode, Pagination, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { EyeIcon } from "../assets/icons/eyeIcon";
import { GmailIcon } from "../assets/icons/GmailIcon";
import ContactButton from "../components/contactButton/ContactButton";
import { LayoutContext } from "../components/layout/LayoutContext";
import CommonPopover from "../components/menuspopupover/menuspopover";
import { API_ENDPOINT_PROFILE, colorMap, contactTypesEnum } from "../libs/constant";
import { RootState } from "../redux/reducer";
import SmoothPopup from "./animations/FancyAnimatedDialog";
import HideMeDialog from "./HidemeDiaglog";
import { GetRelativePost, sendNotifyOwner } from "../redux/services/post.api";
import soldOut from "../assets/images/sold.svg"
import RelatedAdsList from "../components/relatedAds/relatedadscomponents";
import adonlineLogo from "../assets/images/adOnlineLogo.png";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import { useNavigate } from "react-router-dom";
import  Eye  from "../assets/icons/eye.gif";
import cardAdStyle from '../../src/features/Home/components/cardAdStyle.module.scss';

const ImageSliderDialog = (props: any) => {
  const {
    open,
    handleClose,
    imagedatas,
    responseDetailsData,
    onDialerOpen,
    setLoginModelOpen,
    handlePremiumClick,
    favoriteCount,
    handleClick,
    handleEditClick,
    handleDeletePopupClose,
    handleMarkAsSold,
    handleRepost,
    setIsReportConfirmation,
    setEditPostData,
    interactionCounts = { favorites: {}, shares: {} },
    selectedGridOption,
    isSmallScreen,
    handlePostDetailClick,
    handleNormalImageClick,
    handleFavorite,
    handleShareCount,
    setPostDetails,
    colorMapping,
    handleShareApp,
    setIsMarkAsRead,
    postDetailsId
  } = props;
  const [responseDetails, setResponseDetails] = useState(props.responseDetailsData);
  const [images, setImages] = useState(props.imagedatas);
  const { filterValue, selectedLanguage, selectedCity, setShouldHideBottomNavigation } = useContext(LayoutContext);
  const contactType = responseDetails?.contacttypeid;
  const { isDarkMode } = useContext(LayoutContext);
  const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
  const { data: settingData } = useSelector((state: RootState) => state.settingList);
  const { t } = useTranslation();
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [hideMeDialogShow, setHideMeDialogShow] = useState(false);
  const [relatedAdsData, setRelatedAdsData] = useState([]);
  const [relatedAdsLoading, setRelatedAdsLoading] = useState(false);
  const dialogContentRef = useRef(null);
  const navigate = useNavigate();
  const shareCount = Number(interactionCounts?.shares?.[responseDetails?.id] ?? responseDetails?.sharepost);
  const watchingCount = shareCount + Math.floor(Math.random() * 2) + 1

  const formatIndianPrice = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-IN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number);
  };

  const formatMobileNumber = (mobileNumber) => {
    return mobileNumber || "";
  };

  useEffect(() => {
    if (settingData?.data?.length > 0) {
      let messageKey = "";
      switch (selectedLanguage) {
        case 1:
          messageKey = "WhatsappContactEnglish";
          break;
        case 2:
          messageKey = "WhatsappContactGujarati";
          break;
        case 3:
          messageKey = "WhatsappContactHindi";
          break;
        default:
          messageKey = "WhatsappContactEnglish";
      }

      const foundMessage = settingData?.data?.find((item) => item.name === messageKey);
      if (foundMessage) {
        setWhatsappMessage(foundMessage.value);
      }
    }
  }, [selectedLanguage, settingData]);
  const fetchreltedAds = async (id) => {
    try {
      setRelatedAdsLoading(true)
      let payload = {
        id: id,
        LanguageId: ""
      }

      if (Object.keys(loginUserData).length === 0) {
        payload.LanguageId = selectedLanguage
      }
      const response = await GetRelativePost(payload)

      if (response.success) {
        const convertedArray = await Promise.all(
          response?.data.map(async (d) => {
            let imageData;

            if (d?.pictures) {
              try {
                const parsedPictures = JSON.parse(d.pictures);
                if (Array.isArray(parsedPictures) && parsedPictures.length > 0) {
                  imageData = parsedPictures.map((elm) => {
                    const imagePath = elm?.SmallImage ? elm.SmallImage.replace(/^~/, '') : '';
                    return {
                      key: d?.id,
                      adsimage: `${API_ENDPOINT_PROFILE}/${imagePath}`,
                    };
                  });
                }
              } catch (e) {
                console.error('Parsing image error:', e);
              }
            }

            return imageData
              ? { ...d, image: imageData }
              : { ...d };
          })
        );

        setRelatedAdsData(convertedArray);

        setRelatedAdsLoading(false)

      }
    } catch (error) {

    }
  }
  useEffect(() => {
    if(postDetailsId){
    fetchreltedAds(postDetailsId)
    }else{
    fetchreltedAds(responseDetails.id)
    }
  }, [responseDetails,postDetailsId])

  const formatCount = (count) => {
    const numericCount = Number(count || 0);
    return numericCount > 0 ? numericCount.toString() : null;
  };

  const handleFavoriteClick = (e, item) => {
    e.stopPropagation();

    if (!loginUserData?.data) {
      setLoginModelOpen(true);
      message.error(
        t("General.loginpopupmessage")
      );
      return;
    }

    // Get the current favorite state
    const isCurrentlyFavorited = favoriteCount[item?.id]?.fav ?? item?.userfavorite;

    // Calculate the new count before updating
    const currentCount = Number(interactionCounts?.favorites?.[item?.id] ?? item?.favorites ?? 0);
    const newCount = isCurrentlyFavorited ? currentCount - 1 : currentCount + 1;

    // Update the interaction counts immediately with the calculated value
    if (interactionCounts?.favorites) {
      interactionCounts.favorites[item.id] = newCount;
    }

    // Call the click handler after updating the count
    handleClick(e, "favUnFav", item);
  };
  const handleSendNotify = async () => {
    try {
      const payload = {
        UserId: loginUserData?.data[0]?.id,
        postId: responseDetails?.id,
      };
      const response = await sendNotifyOwner(payload);
      if (response.success) {
        message.success(response.message);
        setHideMeDialogShow(false);
      }
    } catch (error) {
    }
  };

  if (!responseDetails) {
    return null;
  }

  const onChatClick = (e, item) => {
    e.stopPropagation();
    if (loginUserData?.data) {
      if (item?.isowner) return message.info(t("toastMessage.You have created this post."))
      setShouldHideBottomNavigation(true);
      navigate('/chat', {
        state: {
          chat: item,
          fromHome: true,
        }
      });
    } else {
      setLoginModelOpen(true);
    }
  }

  return (
    <SmoothPopup
      onClose={handleClose}
      open={open}
      fullWidth
      PaperProps={{
        className: "w-100 detailContainer",
      }}
    >
      <div className="flex align-items-center justify-content-between border-b-solid" style={{ padding: "3px 12px" }}>
        <div>
          <p className="mt-5 mb-5 text-lg font-semibold">
            {t("General.Details")}
          </p>
        </div>
        <div onClick={handleClose} className="img-slider-close mt-2">
          {" "}
          <ClearIcon />
        </div>
      </div>

      <div className={`detailbox`} ref={dialogContentRef}>
        <div className={`adDetails-padding cursor-pointer ${images?.length == 0 && "wrapped-text-withaoutimg"} wrapped-text`}>
          <Row gutter={[24, 24]} align="top" style={{ minHeight: "30vh" }}>
            {
              images?.length > 0 && 
               <Col xs={24} md={12} lg={13}>
              <Swiper
                zoom={true}
                effect={"cube"}
                grabCursor={true}
                cubeEffect={{
                  shadow: true,
                  slideShadows: true,
                  shadowOffset: 20,
                  shadowScale: 0.94,
                }}
                loop={false}
                modules={[Pagination, FreeMode, EffectCube, Zoom]}
                className="mySwiper2 imageSlider cursor-pointer"
                pagination={{
                  dynamicBullets: true,
                }}
              >
                {images?.length > 0 ? images?.map((elm, index) => (
                  <SwiperSlide key={index}>
                    <div className="image-container w-full h-full">
                      <img
                        // onClick={() => handlePremiumClick(elm, images)}
                        src={elm.adsimage}
                        alt={responseDetails?.title || "Product image"}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    {shareCount > 0 && (
                      <>
                        <div className="watchingEye">
                          <img
                            src={Eye}
                            alt="watching eye"
                            style={{ borderRadius: "5px" }}
                          />
                          <span>{watchingCount} {t("General.watching")}</span>
                        </div>
                      </>
                    )}

                  </SwiperSlide>
                ))
                  :
                  <img
                    src={adonlineLogo}
                    alt={"Product image"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                }
              </Swiper>
            </Col>
            }
          
            <Col xs={24} md={ images?.length > 0 ? 12:24} lg={  images?.length > 0 ? 11:24}>
              <div className={`${responseDetails?.issold == 1 ? "sold-overlay" : ""}`}>
                {responseDetails && (
                  <>
                    <Typography sx={{ fontWeight: "1000", fontSize: "30px", color: isDarkMode ? colorMap.white : colorMap.darkgray }}>
                      {responseDetails?.title}
                    </Typography>
                    <Typography className={` mb-8`} gutterBottom sx={{ pt: "7px", mb: "0.7em", fontSize: "16px", }} variant="body2">
                      {responseDetails?.shortdescription}
                    </Typography>
                  </>
                )}
                <div className="d-flex align-items-cente gap flex-wrap mb-8" >
                  <div className={`d-flex `}>
                    <EnvironmentOutlined
                      style={{
                        color: "#f45962",
                        marginRight: "5px",
                        fontSize: "15px",
                      }}
                    />
                    <Typography className="mt-0" style={{ color: isDarkMode ? "#c7c7c7" : "#000000" }}>{responseDetails.location}</Typography>
                  </div>

                  {responseDetails?.price !== "" && responseDetails?.price !== 0 && responseDetails?.price !== null && (
                    <p className={`d-flex align-items-center mt-0 mb-0`}>
                      <CurrencyRupeeIcon
                        style={{ color: "#008000", fontSize: "15px" }}
                        className="font-14"
                      />
                      <Typography style={{ color: isDarkMode ? "#c7c7c7" : "#000000" }}>{formatIndianPrice(responseDetails?.price)}</Typography>
                    </p>
                  )}
                </div>

                <div className={`d-flex align-items-center gap pb-8 `} >
                  <p className="d-flex align-items-center mt-0 mb-0">
                    <EyeIcon className="mr-5 eye-icon" style={{ color: "#f45962" }} />
                    <span className={`${isDarkMode ? 'text-white' : ' text-black-500'} ml-2`}>{responseDetails?.views}</span>
                  </p>

                  <p className="d-flex align-items-center mt-0 mb-0">
                    <AccessTimeIcon style={{ color: "#f45962" }} className="font-15 mr-5" />
                    <span className={`${isDarkMode ? 'text-white' : ' text-black-500'} ml-2`}>{responseDetails.datestamp}</span>
                  </p>
                </div>

                {responseDetails?.issold != 0 && (
                  <img
                    src={soldOut}
                    alt="Sold"
                    className="sold-image"
                  />
                )}

                <div className={`d-flex justify-content-between align-items-start mb-0 mt-5 `} >
                  {/* <div className="d-flex align-items-center gap-x-10" style={{ gap: "15px"}}> */}
                  <div className="d-flex flex-wrap d-xs-space-between align-items-start gap-x-20" style={{ gap: "15px" }}>
                    {contactType === contactTypesEnum.EMAIL && (
                      <ContactButton
                        Icon={<GmailIcon width={22} height={22} style={{ color: "#131418" }} />}
                        link={`mailto:${responseDetails.email}`}
                        item={responseDetails}
                        loginUserData={loginUserData}
                        setLoginModelOpen={setLoginModelOpen}
                        selectedCity={selectedCity}
                        label={t("General.Email me")}
                      />
                    )}

                    {contactType === contactTypesEnum.TELEGRAM && (
                      <ContactButton
                        Icon={<TelegramIcon style={{ color: "#0099FF" }} className="font-20 text-[1DA1F2]" />}
                        link={`https://t.me/${responseDetails.mobileno}?text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${responseDetails.shareposturl}`))}`}
                        item={responseDetails}
                        loginUserData={loginUserData}
                        setLoginModelOpen={setLoginModelOpen}
                        selectedCity={selectedCity}
                        label={t("General.Chat me")}
                      />
                    )}

                    {contactType === contactTypesEnum.WHATSAPP && (
                      <ContactButton
                        Icon={<WhatsAppIcon className="font-20" style={{ color: "#25D366" }} />}
                        link={`https://api.whatsapp.com/send?phone=${formatMobileNumber(responseDetails.mobileno)}&text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${responseDetails.shareposturl}`))}`}
                        item={responseDetails}
                        loginUserData={loginUserData}
                        setLoginModelOpen={setLoginModelOpen}
                        selectedCity={selectedCity}
                        label={t("General.Chat me")}
                      />
                    )}

                    {contactType === contactTypesEnum.PHONE && (
                      <ContactButton
                        Icon={<LocalPhoneIcon style={{ color: "#1FB141" }} className="font-20" />}
                        item={responseDetails}
                        loginUserData={loginUserData}
                        setLoginModelOpen={setLoginModelOpen}
                        selectedCity={selectedCity}
                        onDialerOpen={() => onDialerOpen(responseDetails, responseDetails?.mobileno)}
                        label={t("General.Call me")}
                      />
                    )}

                    {contactType === contactTypesEnum.HIDEME && (
                      <ContactButton
                        Icon={<HideSourceSharpIcon className="font-20" style={{ color: "#CD201F" }} />}
                        item={responseDetails}
                        loginUserData={loginUserData}
                        setLoginModelOpen={setLoginModelOpen}
                        selectedCity={selectedCity}
                        label={t("General.Notify me")}
                        onDialerOpen={() => onDialerOpen(responseDetails, responseDetails?.mobileno)}
                        onClick={() => {
                          setHideMeDialogShow(true);
                        }}
                      />
                    )}

                    {contactType === contactTypesEnum.PHONEWHATSAPP && (
                      <>
                        <ContactButton
                          Icon={<LocalPhoneIcon style={{ color: "#1FB141" }} className="font-20" />}
                          item={responseDetails}
                          loginUserData={loginUserData}
                          setLoginModelOpen={setLoginModelOpen}
                          selectedCity={selectedCity}
                          onDialerOpen={() => onDialerOpen(responseDetails, responseDetails?.mobileno)}
                          label={t("General.Call me")}
                          forcedContactType="Call"
                        />
                        <ContactButton
                          Icon={<WhatsAppIcon className="font-20" style={{ color: "#25D366" }} />}
                          link={`https://api.whatsapp.com/send?phone=${formatMobileNumber(responseDetails.mobileno)}&text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${responseDetails.shareposturl}`))}`}
                          item={responseDetails}
                          loginUserData={loginUserData}
                          setLoginModelOpen={setLoginModelOpen}
                          selectedCity={selectedCity}
                          label={t("General.Chat me")}
                          forcedContactType="Whatsapp"
                        />
                      </>
                    )}
                   
                    <div className='d-block text-center'>
                                   <div className="d-block text-center" onClick={(e) => {
                                      onChatClick(e, responseDetails);
                                   }}>
                                     <SmsOutlinedIcon style={{ height: "20px", width: "20px", fontSize: "20px" }} className={responseDetails?.issold == 1 ? 'disabled text-blue' : 'text-blue'} />
                                   </div>
                                   {responseDetails?.chats !== 0 && responseDetails?.chats != null && (
                                     <p
                                       className="font-10 font-500 mt-0 mb-0 count-data"
                                       style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}
                                     >
                                       {responseDetails.chats}
                                     </p>
                                   )}
                                 </div>
           
                  
                    
                    <div className={`d-block text-center ${responseDetails?.issold == 1 ? 'disabled' : ''}`}>
                    <div className={`d-block text-center `}> 
                    {favoriteCount[responseDetails.id] ? (
                        favoriteCount[responseDetails.id].fav ? (
                          <HeartFilled
                            onClick={(e) => handleFavoriteClick(e, responseDetails)}
                            className=" like-icon-bg cursor-pointer pb-3"
                            style={{ color: "red", fontSize: "20px" }}
                          />
                        ) : (
                          <HeartOutlined
                            onClick={(e) => handleFavoriteClick(e, responseDetails)}
                            className=" like-icon-bg cursor-pointer pb-3"
                            style={{ color: "red", fontSize: "20px" }}
                          />
                        )
                      ) : responseDetails.userfavorite ? (
                        <HeartFilled
                          onClick={(e) => handleFavoriteClick(e, responseDetails)}
                          className=" like-icon-bg cursor-pointer pb-3"
                          style={{ color: "red", fontSize: "20px" }}
                        />
                      ) : (
                        <HeartOutlined
                          onClick={(e) => handleFavoriteClick(e, responseDetails)}
                          className=" like-icon-bg cursor-pointer pb-3"
                          style={{ color: "red", fontSize: "20px" }}
                        />
                      )}
                      {formatCount(interactionCounts?.favorites?.[responseDetails?.id] ?? responseDetails?.favorites) && (
                        <p className="font-10 font-500 ml-1 mt-0 mb-0 count-data"
                          style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                          {Number(interactionCounts?.favorites?.[responseDetails?.id] ?? responseDetails?.favorites)}
                        </p>
                      )}
                    </div>
                     
                    </div>

                    <div className="d-flex flex-column align-items-center">
                      <ShareOutlined
                        className="cursor-pointer"
                        style={{ fontSize: "19px", paddingBottom: "5px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(e, "share", responseDetails);
                        }}
                      />
                      {formatCount(interactionCounts?.shares?.[responseDetails?.id] ?? responseDetails?.sharepost) && (
                        <p className="font-10 font-500 ml-0 mt-0 mb-0"
                          style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                          {Number(interactionCounts?.shares?.[responseDetails?.id] ?? responseDetails?.sharepost)}
                        </p>
                      )}
                    </div>

                    {loginUserData && loginUserData?.data && (
                      <div className="d-flex flex-column align-items-center -mt-3" >
                        <CommonPopover
                          item={responseDetails}
                          loginUserData={loginUserData}
                          setEditPostData={setEditPostData}
                          setIsReportConfirmation={setIsReportConfirmation}
                          filterValue={filterValue}
                          handleMarkAsSold={handleMarkAsSold}
                          t={t}
                          handleClick={handleClick}
                          handleEditClick={handleEditClick}
                          handleRepost={handleRepost}
                          handleDeletePopupClose={handleDeletePopupClose}
                          isDetailPopup={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {hideMeDialogShow && (
                  <HideMeDialog
                    deleteMessage={`${t(
                      "General.Do you want to share your contact information with the owner?"
                    )}`}
                    open={hideMeDialogShow}
                    handleClose={() => setHideMeDialogShow(false)}
                    handleDeleteClick={handleSendNotify}
                  />
                )}
              </div>
            </Col>
          </Row>
         
        </div>
         {/* {
            relatedAdsData.length > 0 && */}
          <RelatedAdsList ads={relatedAdsData} loginUserData={loginUserData}
            isSmallScreen={isSmallScreen}
            isDarkMode={isDarkMode}
            handlePostDetailClick={handlePostDetailClick}
            handleNormalImageClick={handleNormalImageClick}
            handleFavorite={handleFavorite}
            handleShareCount={handleShareCount}
            handleClick={handleClick}
            handleEditClick={handleEditClick}
            handleRepost={handleRepost}
            handleDeletePopupClose={handleDeletePopupClose}
            handleMarkAsSold={handleMarkAsSold}
            setIsReportConfirmation={setIsReportConfirmation}
            setEditPostData={setEditPostData}
            handleClose={handleClose}
            favoriteCount={favoriteCount}
            interactionCounts={interactionCounts}
            formatCount={formatCount}
            whatsappMessage={whatsappMessage}
            formatMobileNumber={formatMobileNumber}
            onDialerOpen={onDialerOpen}
            setHideMeDialogShow={setHideMeDialogShow}
            setPostDetails={setPostDetails}
            setIsMarkAsRead={setIsMarkAsRead}
            t={t}
            selectedGridOption={selectedGridOption}
            colorMapping={colorMapping}
            filterValue={filterValue}
            selectedCity={selectedCity}
            setLoginModelOpen={setLoginModelOpen}
            handleShareApp={handleShareApp}
            loading={relatedAdsLoading} onAdClick={(selectedAd, parsedPictures) => {
              setRelatedAdsLoading(true);
              setResponseDetails(selectedAd);
              setImages(parsedPictures)
              if (dialogContentRef.current) {
                dialogContentRef.current.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }

            }} />
          {/* } */}
      </div>
    </SmoothPopup>
  );
};

export default ImageSliderDialog;