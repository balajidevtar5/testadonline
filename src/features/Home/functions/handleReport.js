// utils/handleReport.js
import { message } from "antd";
import { logEffect } from "../../../utils/logger"; // adjust paths
import { ReportofPost, ReportofPremiumAds } from "../../../redux/services/post.api";
import { logEvents } from "../../../libs/constant";

export const handleReportCommon = async ({
  note,
  editPostData,
  loginUserData,
  t,
  setIsLoading,
  setIsReportConfirmation,
  LOGEVENTCALL = false
}) => {
  try {
    if (!note || note.length < 10) {
      message.error(t("toastMessage.NoteValidation"));
      return;
    }

    const payload = {
      AdId: editPostData?.isPremium ? editPostData?.id : undefined,
      PostId: editPostData?.isPremium ? undefined : editPostData?.id,
      UserId: loginUserData?.data[0]?.id,
      Note: note
    };

    setIsLoading(true);

    const response = await (editPostData?.isPremium
      ? ReportofPremiumAds
      : ReportofPost)(payload);

    if (response?.success) {
      message.success(response.message);
      setIsReportConfirmation(false);
      if (LOGEVENTCALL) {
        logEffect(logEvents.Reported_Post);
      }
    } else {
      message.error(response.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("Error in report:", error);
    message.error("Unexpected error occurred.");
  } finally {
    setIsLoading(false);
  }
};
