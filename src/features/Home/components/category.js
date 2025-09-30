import React, { useContext } from 'react'
import { LayoutContext } from '../../../components/layout/LayoutContext';
import useCategoryHandler from '../hooks/useCategoryHandler';
import useCategoryCountFetcher from '../hooks/useCategoryCountFetcher';
import { categoryVariants } from '../data/categoryVarients';
import AnimatedNumber from '../../../components/AnimatedNumber/AnimatedNumber';
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import  ganesha  from '../../../assets/icons/ganesha.gif';
import { useTranslation } from 'react-i18next';
import cardAdStyle from './cardAdStyle.module.scss';

const Category = ({
    filterValue,
    setFilterValue,
    setIsPostClear,
    setIsLoading,
    setSubCategoryDialogOpen,
    setSubAllCategoList,
    setIsFeatchCategoryCount,
    setSelectedSubcategory,
    HomeStyles,
    
}) => {
  const { data: categoryList } = useSelector((state) => state.categoryList);
  const { isFeatchCategoryCount } = useContext(LayoutContext)
  const { data: settingData } = useSelector((state) => state.settingList);
  const isFestivalSetting = settingData?.data?.find(elm => elm?.name === "IsFestivalGreetingEnabled");
  const isFestival = isFestivalSetting?.value === "1";
    const shouldFetch = true; 
      const { data: loginUserData } = useSelector(
        (state) => state.loginUser
      );
      const { t } = useTranslation()

     

      const staticCategory = {
        id: "Festival",
        displayname: t("Menus.Festival"),
        icon: ganesha
      };


      const finalCategories = [
        ...(isFestival ? [staticCategory] : []),
        ...(categoryList?.data || []),
      ];

      const onClickCategory = (elm) => {
        if (elm.id === "Festival") {
          window.location.href = "https://adonline.in/post/festival-greetings";
        } else {
          handleCategoryClick(elm);
        }
      };

    const { handleCategoryClick,clickedCategories } = useCategoryHandler({
    filterValue,
    setFilterValue,
    setIsPostClear,
    setIsLoading,
    setSubCategoryDialogOpen,
    setSubAllCategoList,
    setIsFeatchCategoryCount,
    setSelectedSubcategory,
  });
    const {
    categoryCountList,
    loading,
    error
  } = useCategoryCountFetcher( loginUserData,setIsFeatchCategoryCount);
  return (
    <div>
                <ul className="px-12 list-style-none d-flex justify-content-between category-box category-sticky ">
        
          {finalCategories.slice(0).map((elm, index) => {
                    const isClicked = clickedCategories.includes(elm.id);
                    const categoryClass = `${HomeStyles.categoryCard} ${isClicked ? "selectedCategory" : ""}`;
                    const textClass = isClicked ? "highlightedText" : "";
        
                    // Find the matching category in categoryCountList
                    const matchingCategory = categoryCountList?.find(cat => cat.categoryid === elm.id);
                    const postCount = matchingCategory?.postcount || "0";
        
        
                    return (
                      <motion.li
                        key={`category-${index}`}
                        variants={categoryVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index} // Staggered delay
                      >
                        <div
                          onClick={() => onClickCategory(elm)}
                          className={`img-shadow position-relative ${categoryClass}`}
                        >
                          <img src={elm.icon} alt="HouseIcon"  className={elm.id === "Festival" ? cardAdStyle.festivalIcon : ""} />
        
                          {/* Show animated count only if postCount > 0 */}
                          {parseInt(postCount) > 0 && (
                            <motion.p
                              className="category-count"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <AnimatedNumber count={postCount} />
                            </motion.p>
                          )}
                        </div>
                        <span
                          onClick={() => handleCategoryClick(elm)}
                          className={`cursor-pointer ${textClass}`}
                        >
                          {elm.displayname}
                        </span>
                      </motion.li>
                    );
                  })}
                  </ul>
    </div>
  )
}

export default Category
