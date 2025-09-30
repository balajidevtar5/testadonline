import React, { useContext, useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { Dialog, Grid, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "@mui/base";
import textAd from "../assets/images/textAd.jpeg";
import { useTranslation } from "react-i18next";
import carIcon from "../../assets/images/category/car.png";
import activaIcon from "../../assets/images/sub-category/activa.png";
import riskshaIcon from "../../assets/images/sub-category/auto-riksha.png";
import bikeIcon from "../../assets/images/sub-category/bike.png";
import busIcon from "../../assets/images/sub-category/bus.png";
import cycleIcon from "../../assets/images/sub-category/cycle.png";
import suvCarIcon from "../../assets/images/sub-category/suv-car.png";
import truckIcon from "../../assets/images/sub-category/truck.png";
import vanIcon from "../../assets/images/sub-category/van.png";
import { getSubCategory } from "../../redux/services/post.api";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { API_ENDPOINT, API_ENDPOINT_PROFILE } from "../../libs/constant";
interface SubCategory {
  SubCategoryId: string; // or number, depending on your actual data type
  // Add other properties as needed
}
const SubCategoryDialog = (props: any) => {
  const { open, handleClose, clickedCategories, handleOk, changeSubCategory, subCategoryData, selectedSubCategory, subCategoryDialogOpen } = props;
  const { t } = useTranslation();
  const { selectedLanguage, categoryList, setFilterValue, filterValue } = useContext(LayoutContext);
  const [subCategoryList, setSubCategoryList] = useState([])
  const [Category, setCategory] = useState(null)
  const [selectedItems, setSelectedItems] = useState([]);



  const handleItemClick = (item) => {
    handleOk([item])
    // handleClose()
  };

  const handleCountinueClick = () => {
    setFilterValue((prevFilterValue) => ({
      ...prevFilterValue,
      SubCategoryId: selectedItems.map((elm) => elm.id).join(','),
    }));
    handleOk(selectedItems)
  }

  // useEffect(() => {
  //   if (clickedCategories.length > 0) {
  //     // featchSubCategory()
  //     const categoryDetail = categoryList.find((elm) => elm.id === clickedCategories[0])
  //     setCategory(categoryDetail)
  //   }
  // }, [clickedCategories])

  useEffect(() => {
    const selectedCategories = subCategoryList?.filter((category) =>
      Object.values(subCategoryData).some((subCategory: SubCategory) =>
        subCategory.SubCategoryId === category.SubCategoryId
      )
    );

    setSelectedItems(selectedCategories)
  }, [changeSubCategory, selectedSubCategory, subCategoryList])


  // useEffect(()=>{
  //   const allOption = { SubCategoryId: 'all', Name: 'All',Icon:"sdffd" };
  //   const othersOption = { SubCategoryId: 'others', Name: 'Others',Icon:"sdffd" };

  //   // Ensure "All" and "Others" options are added to selectedSubCategory if not already present
  //   if(selectedSubCategory){
  //     const updatedSelectedSubCategory = [
  //       allOption,
  //       ...selectedSubCategory?.filter((category) => 
  //         category.SubCategoryId !== 'all' && category.SubCategoryId !== 'others'
  //       ),
  //       othersOption,
  //     ];
  //     console.log("updatedSelectedSubCategory",updatedSelectedSubCategory);
  //     setSubCategoryList(updatedSelectedSubCategory)
  //   }


  // },[selectedSubCategory])
  // selectedLanguage
  return (
    <>
      {
        selectedSubCategory?.length > 0 && (
          <div className="list-style-none subcategory-box adOptionDialog subcategory-dialog show fade-slide-up">
            <ul className="mt-0 mb-0 px-12 list-style-none grid-container subcategory-box slide-in-bottom">
              {
                selectedSubCategory?.map((elm, index) => (
                  <li
                    key={elm?.id}
                    onClick={() => handleItemClick(elm)}
                    className={`img-shadow cursor-pointer ${subCategoryData?.includes(elm) ? 'active' : ''}`}
                    style={{ '--animation-order': index } as React.CSSProperties} // Casting style
                  >
                    <div className={`img-height`}>
                      <img src={`${API_ENDPOINT_PROFILE}/SubCategoryIcon/${elm?.Icon}`} alt="icons" />
                    </div>
                    <p className="cursor-pointer mt-5 mb-0 sub-cat-text">{elm?.Name}</p>
                  </li>
                ))
              }
            </ul>
          </div>

        )
      }
    </>



  );
};

export default SubCategoryDialog;
