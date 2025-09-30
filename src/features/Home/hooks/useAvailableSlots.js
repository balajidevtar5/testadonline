import { useState, useEffect, useRef } from "react";
import { message } from "antd";
import { fetchAvailablePostSlot } from "../../../redux/services/post.api";
import { useSelector } from "react-redux";

const useAvailableSlots = (shouldFetch = true, loginUserData) => {
  const [slotData, setSlotData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false); // ✅ prevent multiple API calls

  const fetchAvailableSlot = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAvailablePostSlot();
      if (response.success) {
        setSlotData(response.data);
      } else {
        message.error("Oops, an error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      message.error("Oops, an error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      shouldFetch &&
      loginUserData?.data?.length > 0 &&
      !hasFetched.current
    ) {
      hasFetched.current = true; // ✅ set flag before calling
      fetchAvailableSlot();
    }
  }, [shouldFetch, loginUserData]); // ✅ loginUserData added to dependencies

  return { slotData, isLoading, refetch: fetchAvailableSlot };
};

export default useAvailableSlots;
