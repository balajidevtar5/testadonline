import React, { useState } from 'react';
import { Popover, Skeleton } from 'antd';
import { MoreVertOutlined as MoreVertOutlinedIcon } from '@mui/icons-material';
import {
  ModeEditOutlined as ModeEditOutlinedIcon,
  AutorenewOutlined as AutorenewOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  ReportGmailerrorredOutlined as ReportGmailerrorredOutlinedIcon
} from '@mui/icons-material';
import {
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { EyeIcon } from '../../../assets/icons/eyeIcon';
import { API_ENDPOINT_PROFILE } from '../../../libs/constant';
import LaunchIcon from '@mui/icons-material/Launch';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import cardAdStyle from './cardAdStyle.module.scss';
import TimelapseTwoToneIcon from '@mui/icons-material/TimelapseTwoTone';

export const PremiumAdContainer = ({
  item,
  index,
  loginUserData,
  filterValue,
  handlePremiumClick,
  handlePremiumAdEditClick,
  handlePremiumAdRepostClick,
  setIsDeleteDialogPremium,
  setPremiumAdDataForDelete,
  setIsReportConfirmation,
  setEditPostData,
  handleClose,
  isDarkMode,
  t,
  myPostChecked,
  isPremiumAd,
  handleTrackActivity,
  isLoading
}) => {
  return (
    <>
      <div className="relativeshadow-md overflow-hidden  primiumcontainer my-box">
        <div className="position-relative my-box w-100" key={index}>
          {isLoading ? (
            <Skeleton.Image
              active
              className="w-100"
              style={{ height: "100%" }}
            />
          ) : (
            <>
              <img
                src={`${API_ENDPOINT_PROFILE}/${
                  item?.smallimage
                    ? item.smallimage.replace(/^~/, "").replace("/S/", "/M/")
                    : ""
                }`}
                onClick={() => {
                  handlePremiumClick(item);
                  handleTrackActivity(item?.id);
                }}
                className="premium-ad-img my-box"
              />
              {item?.buttontext && (
                <div
                  className={`d-flex align-items-center ${cardAdStyle.premAdLink}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item?.url) {
                      window.open(item.url, "_blank");
                    }
                  }}
                >
                  <span>{item.buttontext}</span>
                  <ChevronRightIcon sx={{ color: "#ff780c", fontSize: 25, marginRight: "12px" }} />
                </div>
              )}
            </>
          )}
          {loginUserData && loginUserData?.data && (
            <Popover
              overlayClassName="popover-padding"
              content={
                <div className="">
                  {(item?.isowner === 1 ||
                    loginUserData.data[0]?.roleid === 1) && (
                    <>
                      <div
                        className="d-flex cursor-pointer align-items-center pb-5 pt-5"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePremiumAdEditClick(item);
                        }}
                      >
                        <ModeEditOutlinedIcon
                          className="mr-10 text-green"
                          sx={{ fontSize: "20px" }}
                        />
                        <span
                          className={`${
                            isDarkMode ? "text-white" : "text-grey"
                          }`}
                        >
                          {t("General.Edit")}
                        </span>
                      </div>

                      {(item?.isowner === 1 ||
                        loginUserData.data[0]?.roleid === 1) && (
                        <div
                          className="d-flex cursor-pointer align-items-center pt-5 pb-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePremiumAdRepostClick(item);
                          }}
                        >
                          <AutorenewOutlinedIcon
                            className="mr-10 text-green"
                            sx={{ fontSize: "20px" }}
                          />
                          <span
                            className={`${
                              isDarkMode ? "text-white" : "text-grey"
                            }`}
                          >
                            {t("General.Repost")}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {(item?.isowner === 1 ||
                    loginUserData.data[0]?.roleid === 1) && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteDialogPremium(true);
                        setPremiumAdDataForDelete(item);
                      }}
                      className="pt-5 pb-5 d-flex cursor-pointer align-items-center"
                    >
                      <DeleteOutlineIcon
                        className="mr-10 text-danger"
                        sx={{ fontSize: "20px" }}
                      />
                      <span
                        className={`${isDarkMode ? "text-white" : "text-grey"}`}
                      >
                        {t("General.Delete")}
                      </span>
                    </div>
                  )}

                  {filterValue?.UserId === 0 && (
                    <div
                      className="d-flex cursor-pointer align-items-center pt-5 pb-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsReportConfirmation(true);
                        setEditPostData(item);
                      }}
                    >
                      <ReportGmailerrorredOutlinedIcon
                        className="mr-10 text-red"
                        sx={{ fontSize: "20px" }}
                      />
                      <span
                        className={`${isDarkMode ? "text-white" : "text-grey"}`}
                      >
                        {t("Report Ad")}
                      </span>
                    </div>
                  )}
                </div>
              }
              trigger="click"
              placement="right"
              onOpenChange={handleClose}
            >
              <div className="icons-position">
                <div className="moreiconClassContainer">
                  <MoreVertOutlinedIcon className="moreiconClass text-black-500" />
                </div>
              </div>
            </Popover>
          )}
        </div>
        {filterValue.UserId != 0 ? (
          <>
            <div className="w-100">
              <div
                className="d-flex align-items-center"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "95%",
                  padding: "0px 10px",
                }}
              >
                <div className='d-flex align-items-center'>
                  <LocationOnIcon
                    style={{ color: "#e73c2e" }}
                    className="d-flex align-items-center font-17  mr-5 ml-minus-2"
                  />
                  <span className="font-13"> {item?.locationname}</span>
                </div>
                
              </div>
             
        
              <div
                className="d-flex justify-content-between align-items-center"
                style={{
                  width: "91%",
                  padding: "5px 10px",
                }}
              >
                <div className="d-flex ">
                  <div className="eyeSvg">
                    <p className="d-flex align-items-center mt-0 mb-0 font-12">
                      <TimelapseTwoToneIcon className="font-16  mr-5" />
                      <span className="ml-2">{`${item?.currentdays}/${item?.targetdays}`}</span>
                    </p>
                  </div>
                </div>
                { item?.currentviews !== null && (
                <div className="d-flex ">
                <div className="eyeSvg">
                  <p className="d-flex align-items-center mt-0 mb-0 font-12">
                    <EyeIcon   className="font-16  mr-5" />
                    <span className="ml-2">{item?.currentviews}</span>
                  </p>
                </div>
              </div>
              )
              }
                <div className="d-flex ">
                  <p className="d-flex align-items-center mt-0 mb-0 font-12">
                    <AccessTimeIcon
                      style={{ color: "#f45962" }}
                      className="font-16  mr-5"
                    />
                    <span className="ml-2">{item.datestamp}</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {/* PremAds url btn  */}
        {item && item?.url != null && item?.buttontext == null && (
          <div
            className="premium-fab"
            style={{
              bottom: filterValue?.UserId !== 0 ? 30 : 16,
            }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(item?.url, "_blank");
            }}
          >
            <LaunchIcon sx={{ fontSize: 22, color: "#ff780c" }} />
          </div>
        )}
      </div>
    </>
  );
};

