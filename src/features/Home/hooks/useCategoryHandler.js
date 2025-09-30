import { useState , useEffect, useContext } from "react";
import { UpdateCategoryWisePostData } from "../../../redux/services/post.api";
import { LayoutContext } from "../../../components/layout/LayoutContext";


const useCategoryHandler = ({
  filterValue,
  setFilterValue,
  setIsPostClear,
  setIsLoading,
  setSubCategoryDialogOpen,
  setSubAllCategoList,
  setIsFeatchCategoryCount,
  setSelectedSubcategory,
}) => {
  const [clickedCategories, setClickedCategories] = useState([]);
  const { setIsRefetch } = useContext(LayoutContext)
  useEffect(() => {
  if (!filterValue?.CategoryId && !filterValue?.SubCategoryId) {
    setClickedCategories([]);
  }else{
    setClickedCategories([filterValue?.CategoryId]);
  }
}, [filterValue?.CategoryId, filterValue?.SubCategoryId]);

  const handleCategoryClick = async (elm) => {
    if (!clickedCategories.includes(elm.id)) {
      setFilterValue({
        ...filterValue,
        PageNumber: 1,
        CategoryId: elm.id,
        SubCategoryId: "",
      });
      setIsPostClear(true);
      setIsLoading(true);
      setClickedCategories([elm.id]);
      setSelectedSubcategory(JSON.parse(elm.subcategory));
      setSubCategoryDialogOpen(true);
      setIsRefetch(true)
      window.scrollTo(0, 0);

      const payload = { categoryId: elm.id };
      const response = await UpdateCategoryWisePostData(payload);

      if (response.success) {
        setIsFeatchCategoryCount(true);
      }
    } else {
      if (filterValue.CategoryId === elm.id) {
        setIsPostClear(true);
        setFilterValue({
          ...filterValue,
          PageNumber: 1,
          CategoryId: "",
          SubCategoryId: "",
        });
        setIsLoading(true);
        setClickedCategories(
          clickedCategories.filter((catId) => catId !== elm.id)
        );
            setIsRefetch(true)
        setSubCategoryDialogOpen(false);
        setSubAllCategoList({ Name: "", Icon: "" });
        window.scrollTo(0, 0);
      } else {
        setIsPostClear(true);
      }
    }
  };

  return {
    handleCategoryClick,clickedCategories
  };
};

export default useCategoryHandler;
