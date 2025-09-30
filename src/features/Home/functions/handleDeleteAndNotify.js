import { message } from 'antd';
import { deletePremiumAdApi } from "../../../redux/services/premiumad";
import { sendNotifyOwner } from "../../../redux/services/post.api";
import { logEffect, logEvents } from "../../../utils/logger";

export const deletePremiumAd = async ({
  premiumAdDataForDelete,
  setIsLoading,
  setIsPostClear,
  setFilterValue,
  filterValue,
  setIsDeleteDialogPremium,
  LOGEVENTCALL,
  setIsRefetch,
  onSucess
}) => {
  try {
    const response = await deletePremiumAdApi(premiumAdDataForDelete.id);
    setIsLoading(true);
    if (response.success) {
      message.success(response.message);
      setIsLoading(false);
      setIsDeleteDialogPremium(false);
      if (LOGEVENTCALL) {
        logEffect(logEvents.Delete_PremiumAd);
      }
      onSucess()
    }
  } catch (error) {
    console.error("Error deleting premium ad:", error);
  }
};

export const handleSendNotify = async ({
  loginUserData,
  postDetails,
  setHideMeDialogShow,
  message
}) => {
  try {
    const payload = {
      UserId: loginUserData?.data[0]?.id,
      postId: postDetails,
    };
    const response = await sendNotifyOwner(payload);
    if (response.success) {
      message.success(response.message);
      setHideMeDialogShow(false);
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}; 