import { Popover } from "antd";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { debounce, IconButton } from "@mui/material";
import HomeStyles from "../../container/home/HomeStyle.module.scss";
import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../layout/LayoutContext";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';


const MyPopoverComponent = ({
  item,
  loginUserData,
  handleEditClick,
  handleDeletePopupClose,
  handleRepost,
  filterValue,
  setIsReportConfirmation,
  setEditPostData,
  t,
  handleClick,
  isDetailPopup,
  handleShareApp = null, 
  handleMarkAsSold = null,
   isRelatedAd = false,

}) => {
  const { isDarkMode } = useContext(LayoutContext);
  const [copiedId, setCopiedId] = useState(null);
  const isMobile = window.innerWidth <= 768;
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [isPhone, setIsPhone] = useState(window.innerWidth <= 360);

  const handleMenuItemClick = (e, action, item) => {
    e.stopPropagation();
    setPopoverVisible(false); 
    
    
    setTimeout(() => {
      switch(action) {
        case 'edit':
          handleEditClick(item);
          break;
        case 'delete':
          handleDeletePopupClose();
          break;
        case 'repost':
          handleRepost(item);
          break;
        case 'markAsSold':
          handleMarkAsSold();
          break;
        case 'report':
          setIsReportConfirmation(true);
          setEditPostData(item);
          break;
        case 'copy':
          handleClick(e, "copy", item);
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
          break;
        default:
          break;
      }
    }, 100);
  };

  useEffect(() => {
  const handleResize = debounce(() => {
    setIsPhone(window.innerWidth <= 360);
  }, 200);
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const renderContent = () => (
    <div className="cursor-pointer">
      <div
        className="d-flex cursor-pointer align-items-center pb-5 pt-8 mb-7"
        onClick={(e) => {
          e.stopPropagation();
          handleMenuItemClick(e, "copy", item);
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
        }}
      >
        {copiedId === item.id ? (
          <CheckIcon className="mr-10 text-green" sx={{ fontSize: "20px" }} />
        ) : (
          <ContentCopyIcon className="mr-10 text-green" sx={{ fontSize: "20px" }} />
        )}
        <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
          {copiedId === item.id ? t("General.copied") : t("General.copy")}
        </span>
      </div>
      {(
        (loginUserData.data[0]?.roleid === 3 && loginUserData.data[0]?.id === item.userid) ||
        item?.isowner === 1 ||
        loginUserData.data[0]?.roleid === 1
      ) && (
          <>
            <div
              className={`d-flex cursor-pointer align-items-center pb-5 ${item.issold && "disabled"}`}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuItemClick(e, "edit",item);
              }}
            >
              <ModeEditOutlinedIcon
                className="mr-10 text-green"
                sx={{ fontSize: "20px" }}
              />
              <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
                {t("General.Edit")}
              </span>
            </div>

            {(item?.isowner === 1 || loginUserData.data[0]?.roleid === 1) && (
              <div
                className="d-flex cursor-pointer align-items-center pt-5 pb-5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuItemClick(e, 'repost', item)
                }}
              >
                <AutorenewOutlinedIcon
                  className="mr-10 text-green"
                  sx={{ fontSize: "20px" }}
                />
                <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
                  {t("General.Repost")}
                </span>
              </div>
            )}
          </>
        )}

      {(
        item?.isowner === 1 && item?.issold == 0
      ) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleMenuItemClick(e, 'markAsSold', item)
            }}
            className="pt-5 pb-5 d-flex cursor-pointer align-items-center"
          >
            <LibraryAddCheckIcon
              className="mr-10 text-green"
              sx={{ fontSize: "20px" }}
            />
            <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
              {t("General.MarkAsSold")}
            </span>
          </div>
        )}

      {(
        (loginUserData.data[0]?.roleid === 3 && loginUserData.data[0]?.id === item.userid) ||
        item?.isowner === 1 ||
        loginUserData.data[0]?.roleid === 1
      ) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleMenuItemClick(e, 'delete', item);
            }}
            className="pt-5 pb-5 d-flex cursor-pointer align-items-center"
          >
            <DeleteOutlineIcon
              className="mr-10 text-danger"
              sx={{ fontSize: "20px" }}
            />
            <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
              {t("General.Delete")}
            </span>
          </div>
        )}



      {filterValue?.UserId === 0 && (
        <div
          className="d-flex cursor-pointer align-items-center pt-5 pb-5"
          onClick={(e) => {
            e.stopPropagation();
           handleMenuItemClick(e, 'report', item)
          }}
        >
          <ReportGmailerrorredOutlinedIcon
            className="mr-10 text-red"
            sx={{ fontSize: "20px" }}
          />
          <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
            {t("Report Ad")}
          </span>
        </div>
      )}


    </div>
  );


  return (
      <Popover
        content={renderContent()}
        trigger="click"
        placement={isPhone ? "topRight" : "right"}
        // onOpenChange={handleClose}
        getPopupContainer={(triggerNode) =>
         (isDetailPopup || isRelatedAd)
          ? triggerNode.parentNode as HTMLElement : document.body
        }
        overlayClassName="popover-padding"
        open={popoverVisible}
        onOpenChange={(visible) => setPopoverVisible(visible)}
      >
        <IconButton
          className="pt-0"
          onClick={(e) => {
            e.stopPropagation();
             handleClick(e, "more", item);
          }}
          sx={{
            fontSize: "18px",
            color: "#252525",
            justifyContent: "space-between",
            p: "0px",
            pt: "6px",
          }}
        >
          <div className={HomeStyles.moreSvg}>
            <MoreVertOutlinedIcon className="text-black-500" />
          </div>
        </IconButton>
      </Popover>
  );
};

export default MyPopoverComponent;
