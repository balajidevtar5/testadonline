import { logEvent } from "firebase/analytics";
import { analytics } from "../firebase";

export const logEvents = {
  Viewed_Post: "Viewed_Post",
  Delete_Post: "Delete_Post",
  Delete_PremiumAd: "Delete_PremiumAd"
};

export const logEffect = (customeText) => {
  
  return logEvent(analytics, customeText, {
    event_category: "",
    event_label: "",
    value: 1,
  });
};
