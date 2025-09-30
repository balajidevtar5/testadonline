import React, { useEffect, useState } from 'react';
import { Carousel, message } from 'antd';
import { motion } from 'framer-motion';
import { EnvironmentOutlined, HeartOutlined, HeartFilled  } from '@ant-design/icons';
import {
  AccessTime as AccessTimeIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Favorite as FavoriteIcon,
  ShareOutlined as ShareOutlinedIcon,
  LocalPhone as LocalPhoneIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  HideSourceSharp as HideSourceSharpIcon
} from '@mui/icons-material';
import { EyeIcon } from '../../../assets/icons/eyeIcon';
import { GmailIcon } from '../../../assets/icons/GmailIcon';
import { formatIndianPrice } from '../utils/formatters';
import { contactTypesEnum } from '../../../libs/constant';
import ContactButton from '../../../components/contactButton/ContactButton';
import CommonPopover from '../../../components/menuspopupover/menuspopover';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import ChatDetail from '../../Chat/ChatDetail';
import { Navigate, useNavigate } from 'react-router-dom';
import cardAdStyle from './cardAdStyle.module.scss';
export const Card = ({
  item,
  index,
  selectedGridOption,
  isSmallScreen,
  isDarkMode,
  loginUserData,
  handlePostDetailClick,
  handleNormalImageClick,
  handleFavorite,
  handleShareCount,
  handleClick,
  handleEditClick,
  handleRepost,
  handleDeletePopupClose,
  handleMarkAsSold,
  setIsReportConfirmation,
  setEditPostData,
  handleClose,
  favoriteCount,
  interactionCounts,
  formatCount,
  whatsappMessage,
  formatMobileNumber,
  onDialerOpen,
  setHideMeDialogShow,
  setPostDetails,
  t,
  colorMapping,
  filterValue,
  selectedCity,
  setLoginModelOpen,
  handleShareApp,
  setShouldHideBottomNavigation,
  setIsMarkAsRead,
  setIsRefetch,
}) => {
  const imageVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 1 }
    },
    visible: (index) => ({
      opacity: 1,
      transition: {
        delay: index * 0.5,
        duration: 1,
        ease: "easeOut"
      }
    })
  };
  const navigate = useNavigate();

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
    <div className="card">
      <div
        style={{
          backgroundColor: (() => {
            const parsedValue = JSON?.parse(item.properties)?.[0]?.Value?.replace(/"/g, "");
            const mode = isDarkMode ? "dark" : "light";
            if (!parsedValue) {
              return colorMapping[mode].white;
            }
            const lowerCaseValue = parsedValue.toLowerCase();
            for (const key in colorMapping.light) {
              if (colorMapping.light[key].toLowerCase() === lowerCaseValue) {
                return colorMapping[mode][key] || lowerCaseValue;
              }
            }
            return parsedValue;
          })(),
          borderRadius: window.innerWidth >= 768 ? '10px' : '0px',
          overflow: 'hidden'
        }}
        className={`card-content ${item.image?.length > 0 && selectedGridOption === 1 ? "d-flex justify-content-between" : ""}`}
      >
        <div
          onClick={(e) => handlePostDetailClick(item)}
          className={`p-10 position-relative ${item.image?.length > 0 && selectedGridOption === 1 ? "wd-calc-150" : ""}`}
        >
          <div className='d-flex justify-content-between w-100'>
            <div className={`${item.issold == 1&& "disabled"} w-100`}>
              <div className=' d-flex align-items-center justify-content-between'>
                <h4 className="mt-0 mb-5 word-break two-line-ellipsis">
                  {item?.title}
                </h4>
                <div className='d-xl-none d-xs-block'>
                  <div className={cardAdStyle.favIcon}>
                    {favoriteCount[item.id] ? (
                      favoriteCount[item.id].fav ? (
                        <FavoriteIcon
                          onClick={(e) => handleFavorite(e, item)}
                          className="font-20 like-icon-bg cursor-pointer"
                          style={{ color: "red" }}
                        />
                      ) : (
                        <HeartOutlined
                          onClick={(e) => handleFavorite(e, item)}
                          className="font-20 like-icon-bg cursor-pointer mb-2"
                          style={{ color: "red" }}
                        />
                      )
                    ) : item.userfavorite ? (
                      <FavoriteIcon
                        onClick={(e) => handleFavorite(e, item)}
                        className="font-20 like-icon-bg cursor-pointer"
                        style={{ color: "red" }}
                      />
                    ) : (
                      <HeartOutlined
                        onClick={(e) => handleFavorite(e, item)}
                        className="font-20 like-icon-bg cursor-pointer mb-2"
                        style={{ color: "red" }}
                      />
                    )}
                    {formatCount(interactionCounts.favorites[item.id] ?? item?.favorites) && (
                      <p className="font-10 font-500 mt-0 mb-0 ml-1 count-data"
                        style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                        {Number(interactionCounts.favorites[item.id] ?? item?.favorites)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-0 mb-10 word-break five-line-ellipsis">
                {item?.shortdescription}
              </p>
            </div>
            <div>
              {item.issold == 1 &&
                <div className="sold-tag"><span>{t("General.SoldOut")}</span></div>
              }
            </div>
          </div>

          {/* Hidden Share Template */}
<div 
  id="share-template" 
  style={{ 
    width: "300px", 
    padding: "16px", 
    border: "1px solid #ddd", 
    borderRadius: "10px", 
    fontFamily: "Arial", 
    display: "none", // keep hidden
    background: "#fff"
  }}
>
  <img 
    src={item?.images?.[0]} 
    alt="post" 
    style={{ width: "100%", borderRadius: "8px" }} 
  />
  <h3>{item?.title}</h3>
  <p>{item?.shortdescription}</p>
  <p><strong>Price:</strong> {item?.price}</p>
  <p><strong>Location:</strong> {item?.location}</p>
</div>


          {selectedGridOption === 2 && (
            <ul className="list-style-none image-list-view mt-0 mb-0">
              {item?.image?.slice(0, isSmallScreen ? 2 : 3).map((elm, index) => (
                <li key={index} className="relative mb-5">
                  <img
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNormalImageClick(item);
                    }}
                    src={elm?.adsimage}
                    alt={`Image ${index + 1}`}
                  />
                  {index === (isSmallScreen ? 1 : 2) && item.image?.length > (isSmallScreen ? 2 : 3) && (
                    <div className="overlay">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNormalImageClick(item);
                        }}
                        className="remaining-count"
                      >
                        +{item.image?.length - (isSmallScreen ? 2 : 3)}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className={`d-flex align-items-cente gap flex-wrap flex-wrap ${item.issold == 1 && "disabled"}`} >
            <p className={`d-flex ${selectedGridOption === 2 ? "mt-0 mb-5" : "mt-0 mb-10"}`}>
              <EnvironmentOutlined style={{ color: "#f45962" }} />
              <span className="ml-5 mt-0">{item?.location}</span>
            </p>
            {item?.price !== "" && item?.price !== 0 && (
              <div className="d-flex align-items-center gap mb-12">
                <p className="d-flex align-items-center mt-0 mb-0">
                  <CurrencyRupeeIcon
                    style={{ color: "#008000" }}
                    className="font-15"
                  />
                  <span className={`${isDarkMode ? '#C7C7C7' : '#000000'}`}>
                    {formatIndianPrice(item?.price)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className={`d-flex align-items-center gap mb-3 ${item.issold == 1 && "disabled"}`}>
            <p className="d-flex align-items-center mt-0 mb-0">
              <EyeIcon
                className="mr-5 eye-icon"
                style={{ color: "#f45962" }}
              />
              <span className="ml-2">{item?.views}</span>
            </p>
            <p className="d-flex align-items-center mt-0 mb-0">
              <AccessTimeIcon
                style={{ color: "#f45962" }}
                className="font-15 mr-5"
              />
              <span className="ml-2">{item.datestamp}</span>
            </p>
          </div>

          <div className="posticons">
            <div className="d-flex flex-wrap d-xs-space-between align-items-start gap-x-20 mt-10 small-gap">
              {/* Contact Type: EMAIL */}
              {item.contacttypeid === contactTypesEnum.EMAIL && (
                <ContactButton
                  Icon={<GmailIcon width={20} height={20} />}
                  link={`mailto:${item.email}`}
                  item={item}
                  loginUserData={loginUserData}
                  setLoginModelOpen={setLoginModelOpen}
                  setPostDetails={setPostDetails}
                  selectedCity={selectedCity}
                  label={t("General.Email me")}
                />
              )}

              {/* Contact Type: TELEGRAM */}
              {item.contacttypeid === contactTypesEnum.TELEGRAM && (
                <ContactButton
                  Icon={<TelegramIcon
                    width={24}
                    height={24}
                    style={{ color: "#0099FF" }}
                    className="font-20 text-[1DA1F2] mr-5"
                  />}
                  link={`https://t.me/${item.mobileno}?text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${item.shareposturl}`))}`}
                  item={item}
                  loginUserData={loginUserData}
                  setLoginModelOpen={setLoginModelOpen}
                  setPostDetails={setPostDetails}
                  selectedCity={selectedCity}
                  label={t("General.Chat me")}
                />
              )}

              {/* Contact Type: WHATSAPP */}
              {item.contacttypeid === contactTypesEnum.WHATSAPP && (
                <ContactButton
                  Icon={<WhatsAppIcon
                    className="font-20"
                    style={{ color: "#25d366" }}
                  />}
                  link={`https://api.whatsapp.com/send?phone=${formatMobileNumber(item.mobileno)}&text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${item.shareposturl}`))}`}
                  item={item}
                  loginUserData={loginUserData}
                  setLoginModelOpen={setLoginModelOpen}
                  setPostDetails={setPostDetails}
                  selectedCity={selectedCity}
                  label={t("General.Chat me")}
                />
              )}

              {/* Contact Type: HIDEME */}
              {item.contacttypeid === contactTypesEnum.HIDEME && (
                <ContactButton
                  Icon={<HideSourceSharpIcon
                    className="font-20"
                    style={{ color: "#cd201f" }}
                  />}
                  item={item}
                  loginUserData={loginUserData}
                  setLoginModelOpen={setLoginModelOpen}
                  setPostDetails={setPostDetails}
                  selectedCity={selectedCity}
                  label={t("General.Notify me")}
                  onDialerOpen={() => onDialerOpen(item, item?.mobileno)}
                  onClick={() => {
                    setHideMeDialogShow(true);
                    setPostDetails(item?.id);
                  }}
                />
              )}

              {/* Contact Type: PHONE */}
              {item.contacttypeid === contactTypesEnum.PHONE && (
                <ContactButton
                  Icon={<LocalPhoneIcon
                    style={{ color: "#1fb141" }}
                    className="font-20"
                  />}
                  item={item}
                  loginUserData={loginUserData}
                  setLoginModelOpen={setLoginModelOpen}
                  setPostDetails={setPostDetails}
                  selectedCity={selectedCity}
                  onDialerOpen={() => onDialerOpen(item, item?.mobileno)}
                  label={t("General.Call me")}
                />
              )}

              {/* Contact Type: PHONEWHATSAPP */}
              {item.contacttypeid === contactTypesEnum.PHONEWHATSAPP && (
                <>
                  <div className={`d-flex align-items-center`}>
                    <ContactButton
                      Icon={<LocalPhoneIcon
                        style={{ color: "#1fb141" }}
                        className="font-20"
                      />}
                      item={item}
                      loginUserData={loginUserData}
                      setLoginModelOpen={setLoginModelOpen}
                      setPostDetails={setPostDetails}
                      selectedCity={selectedCity}
                      onDialerOpen={() => onDialerOpen(item, item?.mobileno)}
                      label={t("General.Call me")}
                      forcedContactType="Call"
                    />
                  </div>

                  <div className={`d-flex align-items-center`}>
                    <ContactButton
                      Icon={<WhatsAppIcon
                        className="font-20"
                        style={{ color: "#25d366" }}
                      />}
                      link={`https://api.whatsapp.com/send?phone=${formatMobileNumber(item.mobileno)}&text=${encodeURIComponent(whatsappMessage.replace("\\n{PostUrl}", `\n${item.shareposturl}`))}`}
                      item={item}
                      loginUserData={loginUserData}
                      setLoginModelOpen={setLoginModelOpen}
                      setPostDetails={setPostDetails}
                      selectedCity={selectedCity}
                      label={t("General.Chat me")}
                      forcedContactType="Whatsapp"
                    />
                  </div>
                </>
              )}
              <div className='d-block text-center'>
                <div className={`d-block text-center `} onClick={(e) => {
                  !item?.issold &&
                    onChatClick(e, item);
                  setIsRefetch(true);
                }}>
                  <SmsOutlinedIcon  style={{ height: "20px", width: "20px", fontSize: "20px" }} className={`${item?.issold == 1 ? 'disabled text-blue' : 'text-blue'}`} />
                </div>
                {item?.chats !== 0 && item?.chats != null && (
                  <p className="font-10 font-500 mt-0 mb-0  count-data"
                   style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                    {item.chats}
                  </p>
                )}
              </div>
              {/* Favorite Button */}
              <div className={`d-xs-none text-center ${item?.issold == 1? 'disabled' : ''}`}>
                <div className={`d-xs-none text-center ${cardAdStyle.favIcon}`}>     
                  {favoriteCount[item.id] ? (
                    favoriteCount[item.id].fav ? (
                      <HeartFilled
                        onClick={(e) => handleFavorite(e, item)}
                        className="font-20 like-icon-bg cursor-pointer pb-3"
                        style={{ color: "red" }}
                      />
                    ) : (
                      <HeartOutlined
                        onClick={(e) => handleFavorite(e, item)}
                        className="font-20 like-icon-bg cursor-pointer pb-3"
                        style={{ color: "red" }}
                      />
                    )
                  ) : item.userfavorite ? (
                    <HeartFilled
                      onClick={(e) => handleFavorite(e, item)}
                      className="font-20 like-icon-bg cursor-pointer pb-3"
                      style={{ color: "red" }}
                    />
                  ) : (
                    <HeartOutlined
                      onClick={(e) => handleFavorite(e, item)}
                      className="font-20 like-icon-bg cursor-pointer pb-3"
                      style={{ color: "red" }}
                    />
                  )}
                  {formatCount(interactionCounts.favorites[item.id] ?? item?.favorites) && (
                    <p className="font-10 font-500 mt-0 mb-0 ml-1 count-data"
                      style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                      {Number(interactionCounts.favorites[item.id] ?? item?.favorites)}
                    </p>
                  )}
                </div>
              </div>
              {/* Share Button */}
              <div className="d-block text-center">
                <ShareOutlinedIcon
                  className="font-20 cursor-pointer"
                  onClick={(e) => handleShareCount(e, item)}
                />
                {formatCount(interactionCounts.shares[item.id] ?? item?.sharepost) && (
                  <p className="font-10 font-500 ml-1 mt-0 mb-0"
                    style={{ color: isDarkMode ? "#767676" : "#7e7e7e" }}>
                    {Number(interactionCounts.shares[item.id] ?? item?.sharepost)}
                  </p>
                )}
              </div>

              {/* More Options Menu */}
              {loginUserData && loginUserData?.data && (
                <div className="-mt-3">
                  <CommonPopover
                    item={item}
                    loginUserData={loginUserData}
                    setEditPostData={setEditPostData}
                    setIsReportConfirmation={setIsReportConfirmation}
                    filterValue={filterValue}
                    t={t}
                    handleClick={handleClick}
                    handleEditClick={handleEditClick}
                    handleRepost={handleRepost}
                    handleDeletePopupClose={handleDeletePopupClose}
                    handleMarkAsSold={handleMarkAsSold}
                    isDetailPopup={false}
                    handleShareApp={handleShareApp}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel for Grid Option 1 */}
        {selectedGridOption === 1 && item?.image?.length > 0 && (
          <div className="ads-carousel">
            <Carousel className="w-10" autoplay>
              {item?.image?.map((elm, index) => (
                <div key={`image-${index}`} className="position-relative">
                  <motion.img
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNormalImageClick(item);
                    }}
                    src={elm?.adsimage}
                    className="w-100"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={imageVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};