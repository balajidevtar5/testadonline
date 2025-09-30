import { logEffect, logEvents } from "../../../utils/logger";

export const handlePostDetailClick = async ({
  data,
  setPostDetails,
  setSlideData,
  setImageSlideOpen,
  API_ENDPOINT_PROFILE,
  LOGEVENTCALL,
  handleTrackActivity
}) => {
  try {
    handleTrackActivity(data?.id)
    setPostDetails(data);
    window.history.pushState({ dialogOpen: true }, "");
    
    if (data.pictures != null) {
      const slideData = JSON?.parse(data.pictures)?.map((elm) => {
        const imagePath = elm?.LargeImage ? elm.LargeImage.replace(/^~/, "") : "";
        const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
        return { key: elm?.id, adsimage: imageUrl };
      });

      if (LOGEVENTCALL) {
        logEffect(logEvents.Viewed_Post);
      }
      setSlideData(slideData);
    } else {
      setSlideData([]);
    }
    setImageSlideOpen(true);
  } catch (error) {
    console.error("Error in handlePostDetailClick:", error);
  }
}; 