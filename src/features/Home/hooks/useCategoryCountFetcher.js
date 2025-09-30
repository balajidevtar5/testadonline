import { useContext, useEffect, useState } from "react";
import { GetCategoryWisePostCount } from "../../../redux/services/post.api";
import { LayoutContext } from "../../../components/layout/LayoutContext";

const useCategoryCountFetcher = (loginUserData = null, setIsFeatchCategoryCount) => {
  const [categoryCountList, setCategoryCountList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isFeatchCategoryCount } = useContext(LayoutContext);

  useEffect(() => {
    // ✅ Only run if flag is true AND loginUserData is ready
    if (!isFeatchCategoryCount || !loginUserData?.data?.length) return;

    const fetchCategoryCount = async () => {
      setLoading(true);
      try {
        const response = await GetCategoryWisePostCount();
        if (response.success) {
          setCategoryCountList(response.data);
        } else {
          setError("Fetch failed");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setIsFeatchCategoryCount(false); // ✅ Reset flag after fetch
      }
    };

    fetchCategoryCount();
  }, [isFeatchCategoryCount, loginUserData]); // ✅ depend only on flag + loginUserData

  return { categoryCountList, loading, error };
};

export default useCategoryCountFetcher;
