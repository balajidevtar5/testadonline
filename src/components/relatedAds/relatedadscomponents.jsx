import React, { useContext } from "react";
import "./RelatedAdsList.css";
import { API_ENDPOINT_PROFILE, COLUMNS_BREAK_POINT, RELATEDADS_COLUMNS_BREAK_POINT } from "../../libs/constant";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { EyeIcon } from "../../assets/icons/eyeIcon";
import {
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { EnvironmentOutlined } from '@ant-design/icons';
import { fetchPostById } from "../../redux/services/post.api";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../layout/LayoutContext";
import { Card } from "../../features/Home/components/cardAd";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import CardSkeleton from "../../features/Home/components/cardSkeleton";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";




const RelatedAdsList = (props) => {
  const { ads, loading, loginUserData, onAdClick, selectedGridOption,
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
    setIsMarkAsRead,

    // Other props
    favoriteCount,
    interactionCounts,
    formatCount,
    whatsappMessage,
    formatMobileNumber,
    onDialerOpen,
    colorMapping,
    selectedCity,
    myPostChecked,
    HomeStyles,
    isSmallScreen } = props

  const { isDarkMode, filterValue,setShouldHideBottomNavigation,setIsRefetch  } = useContext(LayoutContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const { t } = useTranslation()

  const onRelatedAdClick = async (item) => {
    try {
      const id = item?.id
      const respose = await fetchPostById(id);

      if (respose.success) {
        let slideDataForImage = [];

        const parsedPictures = JSON.parse(respose.data[0].pictures);
        try {
          slideDataForImage = parsedPictures?.map((pic, index) => {
            const imagePath = pic?.PictureName?.replace(/^~\//, "");
            const fullUrl = imagePath ? `${API_ENDPOINT_PROFILE}/${imagePath}` : "";

            return {
              key: `${pic.id || index}`,
              adsimage: fullUrl
            };
          });

        } catch (err) {
          console.error("Error while mapping slideDataForImage:", err);
        }
        onAdClick(respose.data[0], slideDataForImage)
      }
    } catch (error) {

    }
  }


  return (
    <div className="related-ads-wrapper"  style={isMobile ? {} : { padding: "5px" }} >
      {
        ads.length > 0 &&
        <h3 className="related-ads-heading">{t("General.RelatedAds")}</h3>
      }
      <div className="">

          <div className=" masonary-grid">
            <ResponsiveMasonry
              columnsCountBreakPoints={{
                ...RELATEDADS_COLUMNS_BREAK_POINT?.[selectedGridOption - 1],
              }}
            >
              <Masonry
                className={
                  selectedGridOption === 2 ? "gap-8" : "gap-8 masonary-grid"
                }
              >
            {loading && CardSkeleton({ number: 5 })}
                {ads
                  .filter((ad, index, self) =>
                    index === self.findIndex(a => a.id === ad.id)
                  )
                  .map((ad, index) => {
                    let imageUrl = "";
                    let slideData = [];
                    try {
                      const parsedPictures = JSON.parse(ad.pictures); // JSON string → array
                      slideData = parsedPictures.map((pic, index) => {
                        const imagePath = pic?.SmallImage?.replace(/^~\//, "");
                        const fullUrl = imagePath ? `${API_ENDPOINT_PROFILE}/${imagePath}` : "";
                        return {
                          key: `${ad.id}_${index}`, // Unique key
                          adsimage: fullUrl
                        };
                      });

                      // Set preview image for card (first one)
                      imageUrl = slideData[0]?.adsimage || "";
                    } catch (error) {
                      console.error("Error parsing pictures:", error);
                    }

                    return (
                      <div key={ad.id}  >

                        <Card
                          item={ad}
                          index={index}
                          selectedGridOption={selectedGridOption}
                          isSmallScreen={isSmallScreen}
                          isDarkMode={isDarkMode}
                          loginUserData={loginUserData}
                          handlePostDetailClick={onRelatedAdClick}
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
                          isLoading={loading}
                          isRelatedAd={true}
                          setShouldHideBottomNavigation={setShouldHideBottomNavigation}
                          setIsRefetch ={setIsRefetch}
                        />


                      </div>


                    );
                  })}
              </Masonry>
            </ResponsiveMasonry>
          </div>
      </div>
    </div>
  );
};
export default RelatedAdsList;
