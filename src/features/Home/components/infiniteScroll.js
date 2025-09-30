import React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { motion } from "framer-motion";
import { Button } from "@mui/base";
import { Skeleton, Space, Tabs } from "antd";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import NoDataFoundComponent from "../../../components/noDataFound/NoDataFoundComponent";
import { PremiumAdContainer } from "./premiumAdContainer";
import { Card } from "./cardAd";
import freeAdImg from "../../../assets/images/free.png";
import rocketBg from "../../../assets/images/rocketBg.png";
import facebookImage from "../../../assets/images/facebook.png";
import instagramImage from "../../../assets/images/instagram.png";
import { message } from "antd";
import { IceSkatingSharp } from '@mui/icons-material';
import CardSkeleton from './cardSkeleton';

const InfiniteScrollComponent = ({
  // Data props
  postData,
  totalRecords,
  hasMore,
  isLoading,
  isDataLoaded,
  // Filter and state props
  filterValue,
  loginUserData,
  selectedGridOption,
  isDarkMode,
  isPremiumAd,
  slotData,

  // Handler functions
  handleNextLoad,
  onTabChange,
  handlePremiumClick,
  handlePremiumAdEditClick,
  handlePremiumAdRepostClick,
  setIsDeleteDialogPremium,
  setPremiumAdDataForDelete,
  setIsReportConfirmation,
  setEditPostData,
  handleClose,
  handlePostDetailClick,
  handleNormalImageClick,
  handleFavorite,
  handleShareCount,
  handleClick,
  handleEditClick,
  handleRepost,
  handleDeletePopupClose,
  handleMarkAsSold,
  setHideMeDialogShow,
  setPostDetails,
  setLoginModelOpen,
  handleShareApp,
  handleTrackActivity,

  // UI state functions
  setAdOptionModalOpen,
  setIsPutAdModalOpen,
  setIsPremiumAdModalOpen,
  setIsRespost,
  setPremiumAdData,
  setIsEditPost,
  setIsMarkAsRead,

  // Other props
  favoriteCount,
  interactionCounts,
  formatCount,
  whatsappMessage,
  formatMobileNumber,
  onDialerOpen,
  t,
  colorMapping,
  selectedCity,
  myPostChecked,
  HomeStyles,
  COLUMNS_BREAK_POINT,
  isSmallScreen,
  setShouldHideBottomNavigation,
  setIsRefetch
}) => {
  const addpostbg = {
    backgroundImage: `url(${rocketBg})`,
    backgroundSize: selectedGridOption === 2 ? "cover" : "contain",
    backgroundPosition: "center",
    width: "100%",
    backgroundRepeat: "no-repeat",
  };
  const TabItems = [
    {
      key: "1",
      label: <span style={{ color: "#FF8000" }}>
        {t("General.Ads")}
      </span>,
      icon: "📝",
    },
    {
      key: "2",
      label: (<span style={{ color: "#FF8000" }}>{t("General.Premium Ads")}</span>),
      icon: <WorkspacePremiumIcon style={{ marginBottom: "-6px" }} />,
    },
  ];

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="position-relative infinterscroll">
      <InfiniteScroll
        dataLength={postData?.length}
        next={handleNextLoad}
        hasMore={hasMore}
        style={{ marginBottom: "100px" }}
        className="overflow-y-hidden "
        scrollableTarget="HistoryScrollableDiv"
        endMessage={
          postData?.length >= totalRecords && (
            <>
              <p className={HomeStyles.endMessage}>
                <b>{t("General.Yay! You have seen it all")}</b>
              </p>
            </>
          )
        }
        loader={
          postData?.length >= totalRecords && !isLoading && postData?.length != 0 ? (
            <p className={HomeStyles.endMessage}>
              <b>{t("General.Yay! You have seen it all")}</b>
            </p>
          ) : (
            postData?.length != 0 && (
              <div className=" masonary-grid">
                <ResponsiveMasonry
                  columnsCountBreakPoints={{
                    ...COLUMNS_BREAK_POINT[selectedGridOption - 1],
                  }}
                >
                  <Masonry
                    className={
                      selectedGridOption === 2 ? "gap-8" : "gap-8 masonary-grid"
                    }
                  >
                    {CardSkeleton({ number: 5 })}
                  </Masonry>
                </ResponsiveMasonry>
              </div>
            )
          )
        }
      >
        <div className="px-12 masonary-grid mt-10">
          {loginUserData?.data?.length > 0 &&
            loginUserData?.data[0]?.roleid === 1 &&
            (filterValue && filterValue?.UserId != 0 ? (
              <div
                className={`d-flex mb-10 ${HomeStyles.premiumAd}  align-items-center`}
              >
                <Tabs
                  defaultActiveKey="1"
                  items={TabItems}
                  onChange={onTabChange}
                  className={isDarkMode ? "dark-mode" : ""}
                />
              </div>
            ) : filterValue.UserId != 0 ? (
              <div
                className={`d-flex  ${HomeStyles.premiumAd}  align-items-center`}
              >
                <Tabs
                  defaultActiveKey="1"
                  items={TabItems}
                  onChange={onTabChange}
                />
              </div>
            ) : null)}

          <ResponsiveMasonry
            columnsCountBreakPoints={{
              ...COLUMNS_BREAK_POINT[selectedGridOption - 1],
            }}
          >
            <Masonry
              className={
                selectedGridOption === 2 ? "gap-8" : "gap-8 masonary-grid"
              }
            >
              <div
                style={addpostbg}
                className="card py-12 text-center addPost-bg-svg d-xs-none d-flex align-items-center flex-col justify-content-around"
              >
                <p className="font-14 mt-0">
                  જાહેરાત આપવા સંપર્ક કરો
                </p>
                <Button
                  className={
                    selectedGridOption === 2 ? "ad-btn" : "ad-btn mb-15"
                  }
                  onClick={() => {
                    if (loginUserData?.data) {
                      if (loginUserData.data[0]?.roleid === 1) {
                        setAdOptionModalOpen(true);
                        setIsEditPost(false)
                      } else {
                        setIsPutAdModalOpen(true);
                        setIsEditPost(false)
                      }
                      setIsRespost([]);
                      setPremiumAdData(null);
                    } else {
                      setLoginModelOpen(true);
                      message.error(
                        t(
                          "toastMessage.Please login/register with your mobile number to view contact details of advertisement."
                        )
                      );
                    }
                  }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  {t("General.PUT YOUR AD")}
                </Button>
                {slotData[0]?.isadfree === 1 && (
                  <img src={freeAdImg} alt="freeAdImg" />
                )}
                <div>
                  <div className="font-14 mt-5">તમારી એડ અહીં મૂકો!</div>
                  <a
                    className="d-flex mt-5 font-bold text-black"
                    href="https://wa.me/8160845612"
                  >
                    <WhatsAppIcon className="text-green mr-5" />
                    <span>+91 81608 45612</span>
                  </a>
                  <div className="mt-5">
                    <a
                      href="https://www.instagram.com/adonline.in/"
                      target="_blank"
                      className="mr-10"
                    >
                      <img src={instagramImage} width="24" />
                    </a>
                    <a
                      href="https://www.facebook.com/people/AdOnline-Weekly-Ads/61578654893096/"
                      target="_blank"
                    >
                      <img src={facebookImage} width="24" />
                    </a>
                  </div>
                </div>
              </div>
              {isLoading && CardSkeleton({ number: 70 })}
              {postData.map((item, index) => {
                return (
                  <div key={`post-${index}-${item?.id}`}>
                    {/* <motion.li
                      key={`category-${index}`}
                      className="d-flex flex-column align-items-center"
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.1 }}
                      variants={cardVariants}
                    > */}
                    {item.isPremium ? (
                      <PremiumAdContainer
                        item={item}
                        index={index}
                        loginUserData={loginUserData}
                        filterValue={filterValue}
                        handlePremiumClick={handlePremiumClick}
                        handlePremiumAdEditClick={handlePremiumAdEditClick}
                        handlePremiumAdRepostClick={handlePremiumAdRepostClick}
                        setIsDeleteDialogPremium={setIsDeleteDialogPremium}
                        setPremiumAdDataForDelete={setPremiumAdDataForDelete}
                        setIsReportConfirmation={setIsReportConfirmation}
                        setEditPostData={setEditPostData}
                        handleClose={handleClose}
                        isDarkMode={isDarkMode}
                        handleTrackActivity={handleTrackActivity}
                        t={t}
                        myPostChecked={myPostChecked}
                        isPremiumAd={isPremiumAd}
                        isLoading={isLoading}
                      />
                    ) : (
                      <Card
                        item={item}
                        index={index}
                        selectedGridOption={selectedGridOption}
                        isSmallScreen={isSmallScreen}
                        isDarkMode={isDarkMode}
                        loginUserData={loginUserData}
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
                        colorMapping={colorMapping}
                        filterValue={filterValue}
                        selectedCity={selectedCity}
                        setLoginModelOpen={setLoginModelOpen}
                        handleShareApp={handleShareApp}
                        isLoading={isLoading}
                        setShouldHideBottomNavigation={setShouldHideBottomNavigation}
                        setIsRefetch={setIsRefetch}
                      />
                    )}
                    {/* </motion.li> */}
                  </div>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
          {/*<div style={{ height: 50 }} /> */}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default InfiniteScrollComponent;