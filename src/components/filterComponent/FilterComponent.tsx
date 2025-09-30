import { Button, FormControl, FormControlLabel, Grid, InputAdornment, Switch, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { CloseDialogComponent } from "../CloseDialogComponent";
import { LayoutContext } from "../layout/LayoutContext";
import { SearchInputComponent } from '../searchInput/searchInputComponent';
import { useTranslation } from "react-i18next";
import  { getDecryptedCookie } from "../../utils/useEncryptedCookies";
import { decryptData } from "../../utils/cookieUtils";
const FilterComponent = (props: any) => {
  const { postFrequency, setPostFrequency, setSearchValue, setTags, searchValue, tags, onClose, favChecked, myPostChecked,
    setMyPostChecked, setFavChecked} = props;
  const { filterValue, setFilterValue, setPostData,setIsLoading ,setIsPostClear,prevFilterData,selectedCity,  setIsPremiumAd,} = useContext(LayoutContext)
  const { data: tagsData } = useSelector((state: RootState) => state.tags);
  const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
  const dispatch: any = useDispatch();
  const { handleSubmit, setValue } = useForm();
  const [{ adminAuth }]: any = useCookies(["adminAuth"]);
  const encryptedAdminAuth = getDecryptedCookie(adminAuth)
  const [disableValue, setDisableValue] = useState(false)
  const [tagValue, setTagValue] = useState([])
  const {t} = useTranslation();

  
  const handleClearInput = () => {
    setSearchValue('');
  };
  const onSubmit = (values) => {
    setIsPremiumAd(false)
    setFilterValue({
      ...filterValue, Favorites: favChecked,CityId:selectedCity,PageNumber: 1, Search: searchValue,IsPremiumAd:false,
      TagIds: values.tagId?.map(elm => elm.value).join(', '), UserId: myPostChecked ? loginUserData?.data && loginUserData?.data[0]?.id : 0,
      Frequency: Number(postFrequency)
    });
    
    setIsPostClear(true)
    if(myPostChecked === false){
      setFilterValue({
        ...filterValue, Favorites: favChecked,CityId:selectedCity,PageNumber: 1, Search: searchValue,IsPost:true, IsPremiumAd:true,
        TagIds: values.tagId?.map(elm => elm.value).join(', '), UserId: 0,
        Frequency: Number(postFrequency)
      });
      
    }

    if(favChecked){
      setFilterValue({
        ...filterValue, Favorites: favChecked,CityId:selectedCity,PageNumber: 1, Search: searchValue,IsPremiumAd:false,
        TagIds: values.tagId?.map(elm => elm.value).join(', '), UserId: myPostChecked ? loginUserData?.data && loginUserData?.data[0]?.id : 0,
        Frequency: Number(postFrequency)
      });
      
    }
      
    
    setIsLoading(true)
    onClose();
  }
  const handlePostFrequency = (e: any) => {
    setPostFrequency(e.target.value);
  };
  const handleFavSwitchChange = (event) => {
    setFavChecked(event.target.checked)
  }
  const handleMyAdswitchChange = (event) => {
    setMyPostChecked(event.target.checked)
  }
  useEffect(() => {
    if (tagsData?.data?.length > 0) {
      const convertibleArray = tagsData.data.map((elm) => ({
        label: elm?.tagname,
        value: elm?.id
      }));
      setTags(convertibleArray)
    }
  }, [tagsData])
  // useEffect(() => {
  //   // dispatch(fetchCityData())
  //   dispatch(fetchTagsData())
  // }, [])
  useEffect(() => {
    const tagIds = tagValue.map(tag => tag.value);
    const tagIdsString = tagIds.join(',');
    if (favChecked || myPostChecked || filterValue.TagIds !== tagIdsString || postFrequency > 0 || searchValue?.trim() !== "") {
      setDisableValue(true)  
    } else {
      setDisableValue(false)
    }
  }, [filterValue, favChecked, tagValue, postFrequency, myPostChecked, searchValue])
  useEffect(() => {
    const tagIds = filterValue?.TagIds?.split(',')?.map(tagId => Number(tagId.trim()));
    const selectedTags = tagIds?.map(tagId => tags?.find(tag => tag?.value === tagId)).filter(Boolean);
    setValue("tagId", selectedTags)
    setPostFrequency(filterValue.Frequency)
    setFavChecked(filterValue?.Favorites)
    setMyPostChecked(filterValue.UserId ? true : false)
    setSearchValue(filterValue.Search);
  }, [filterValue])
  const clearFilter = () => {
    setFilterValue({ ...filterValue,IsPost:true,IsPremiumAd:true, Search: "", UserId: 0, Favorites: false, TagIds: "", Frequency: "" });
    onClose();
    setPostData([])
    setIsLoading(true)
    setIsPremiumAd(false)
  }

  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center filter-padding">
        <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>{t("General.Filters")}</Typography>
        <CloseDialogComponent className="closeIcon" handleClose={onClose} />
      </div>
      <form id="filterSubmit" onSubmit={handleSubmit(onSubmit)}>
        <Grid sx={{ p: "10px 16px" }}>
          <Grid
            item
            xs={12}
            className="d-xs-none"
          >
            <div className="mb-8">
              {encryptedAdminAuth?.user?.token ?
                <FormControlLabel className="ml-0" label={t("Menus.Favourites")} labelPlacement="start" control={<Switch checked={favChecked} onChange={handleFavSwitchChange} inputProps={{ 'aria-label': 'controlled' }} />} /> : null
              }
            </div>
            {encryptedAdminAuth?.user?.token ? <FormControlLabel className="ml-0" label={t("Menus.My Ads")} labelPlacement="start" control={<Switch checked={myPostChecked} onChange={handleMyAdswitchChange} inputProps={{ 'aria-label': 'controlled' }} />} /> : null
            }
          </Grid>
          {/* <div className='wd-175px d-xs-block d-none'>
            <SearchInputComponent {...{
              handleSearch: (e) => setSearchValue(e.target.value),
              handleClearInput: handleClearInput,
              inputValue: searchValue,
              value: searchValue,
              placeholder: "Search text..."
            }} />
          </div> */}
          <Grid alignItems="center" justifyContent="space-between" sx={{ mb: "10px",mt:"10px" }}>
            {encryptedAdminAuth?.user?.token &&
              <>
                <Grid justifyContent="flex-start" >
                  <Typography variant="body2">{t("Menus.Post per week:")}
                    {postFrequency > 0 && <span> {t("General.less than")} <b>{postFrequency}</b> </span>}
                  </Typography>
                </Grid>
                <Grid justifyContent="flex-end" sx={{ mb: "10px", mt: "10px" }} className="inputPrefixField">
                  <FormControl sx={{ p: "0px" }}>
                    <TextField
                      variant="outlined"
                      type="number"
                      className="customInputField"
                      placeholder={t("General.Enter number")}
                      value={postFrequency}
                      onChange={handlePostFrequency}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"
                          sx={{ backgroundColor: "#bdb8b845", pl: "8px", height: "auto", maxHeight: "none", pr: "8px" }}>{t("General.less than")}</InputAdornment>,
                      }}
                      style={{ color: "#252525" }}
                    />
                  </FormControl>
                </Grid>
              </>
            }
          </Grid>
          {/* <Grid sx={{ mb: "10px", mt: "20px" }} className={sidebarStyle.border}>
            <SelectField
              {...{
                register,
                formState,
                control,
                // watchField,
                id: "CityId",
                name: "CityId",
                options: cities,
                label: "Select city*",
                placeholder: "Select City*",
                isMulti: false,
                isClearable: false,
                className: "custom-select-field",
                // menuIsOpen: true
              }}
            />
          </Grid> */}
          <Grid sx={{ mb: "10px", mt: "20px" }}>
            {/* <SelectField
              {...{
                register,
                formState,
                control,
                // watchField,
                id: "tagId",
                name: "tagId",
                onSelectChange(d) {
                  setTagValue(d)
                },
                options: tags,
                label: "Select city*",
                placeholder: "Select Tags*",
                isMulti: true,
                isClearable: false,
                className: "custom-select-field"
              }}
            /> */}
          </Grid>
          <div className="d-flex cursor-pointer gap align-items-center justify-content-end">
            <Button form="filterSubmit" type="submit" variant="contained" className="text-center">
              {t("General.Apply Filter")}</Button>
            <Button onClick={() => clearFilter()} style={!disableValue ? { opacity: "0.5" } : { opacity: "1" }} type="reset" variant="outlined" color="error" className='close-btn' disabled={!disableValue}>
              {t("General.Clear Filter")}</Button>
          </div>
        </Grid>
      </form>
    </div>
  )
}
export default FilterComponent;