import { useState } from "react";
import { message } from "antd";
import { createPost } from "../../../redux/services/post.api";

export const useMarkPostAsRead = () => {
  const [loading, setLoading] = useState(false);

  const markPostAsRead = async (editPostData, onSuccess) => {
    if (!editPostData?.id) return;

    setLoading(true);
    try {
      const mobileNo = editPostData?.mobileno?.replace(/^\+91/, '');
      const payload = {
        Id: editPostData?.id,
        Title: editPostData?.title,
        ShortDescription: editPostData?.shortdescription,
        Price: editPostData?.price,
        PriceTypeId: editPostData?.pricetypeid || null,
        PurposeTypeId: editPostData?.purposeTypeId,
        MobileNo: mobileNo,
        LocationId: editPostData?.locationid,
        CategoryId: editPostData?.categoryid,
        Latitude: null,
        Longitude: null,
        SubCategoryId: editPostData?.subcategoryid,
        PostTypeId: 1,
        ContactTypeId: editPostData?.contacttypeid,
        Email: editPostData?.email,
        IsSold: true,
        Properties: editPostData?.properties,
      };

      const response = await createPost(payload);

      if (response.success) {
        message.success(response.message);
        if (response.success) onSuccess(); 
      }
    } catch (error) {
      console.error("Failed to mark post as read:", error);
      message.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { markPostAsRead, loading };
};
