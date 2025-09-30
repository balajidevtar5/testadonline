import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, ClickAwayListener, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RoomIcon from '@mui/icons-material/Room';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import ExpandLessIcon from '@mui/icons/ExpandLess';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowDownRight from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { getLocationById, getLocationBySearch, getLocationChild, getLocations, getNearestLocation, SaveLocationHistory } from '../../redux/services/locations.api';
import { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '../layout/LayoutContext';
import { message, Skeleton } from 'antd';
import { locationTypesEnum, LOGEVENTCALL, logEvents } from '../../libs/constant';
import { set } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocationData, locationHistoryAppend } from '../../redux/slices/location';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/reducer';
import { getData } from '../../utils/localstorage';
import { logEffect } from '../../utils/logger';

interface Village {
    name: string;
    id: number;
    mastercode: string;
}

interface District {
    name: string;
    id: number;
    mastercode: string;
    villages: Village[];
}

interface LocationData {
    name: string;
    id: number;
    mastercode: string;
    districts: District[];
    distance: string
}

interface LocationResultType {
    LocationResult?: {
        data: LocationData[];
    };
    StateDataResult?: {
        data: LocationData[];
    },
    LocationHistoryResult?: {
        data: LocationData[];
    }


}
const LocationPicker = (props) => {
    const { lattitude, longitude, languageId, setIsLocationPicker, isSeprateLocation, setLocationObject,setIsStateSelect } = props
    const {
        setPosition,
        setSelectedCity,
        setFilterValue,
        filterValue,
        setSelectedCityName,
        position,
        selectedLanguage,
        selectedCity,
        setIsLocationApiCall,
        setIsPostClear,
        setIsLoading,
        setIsFeatchCategoryCount,
        setIsRefetch
    } = useContext(LayoutContext);
    const [locationResult, setLocationResult] = useState<LocationResultType | null>(null);
    const { data: loginUserData } = useSelector(
        (state: RootState) => state.loginUser
    );
    const { data: locationData } = useSelector((state: RootState) => state.locationData);
    const [searchValue, setSearchValue] = useState("");
    const [expandedDistricts, setExpandedDistricts] = useState({});
    const [villagesByDistrict, setVillagesByDistrict] = useState({});
    const [isStateExpanded, setIsStateExpanded] = useState(true);
    const [isNearByLocationExpand, setNearByLocationExpand] = useState(false);
    const [searchResult, setSearchResults] = useState([])
    const [isLocationSuggetionVisible, setIsLocationSuggetionVisible] = useState(false)
    const [nearByLocationData, setNearByLocationData] = useState([])
    const [expandedTalukas, setExpandedTalukas] = useState({});
    const [villagesByTaluka, setVillagesByTaluka] = useState({});
    const [expandedVillages, setExpandedVillages] = useState({});
    const [areasByVillage, setAreasByVillage] = useState({});
    const [selectedValue, setSelectedValue] = useState("");
    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [useCurrentIsLoading, setUseCurrentIsLoading] = useState(false);
    const [isNearestExpandingLoader, setIsNearestExpandingLoader] = useState(false);
    const { t } = useTranslation()
    const dispatch = useDispatch<AppDispatch>();
    const [loadingState, setLoadingState] = useState({});
    const [searchLoader, setSearchLoader] = useState(false);


    const toggleList = async (id, type) => {
        const isCurrentlyExpanded =
            (type === locationTypesEnum.STATE && isStateExpanded) ||
            (type === locationTypesEnum.DISTRICT && expandedDistricts[id]) ||
            (type === locationTypesEnum.TALUKA && expandedTalukas[id]) ||
            (type === locationTypesEnum.VILLAGE && expandedVillages[id]);

        // If collapsing, simply update the state without calling the API
        if (isCurrentlyExpanded) {
            switch (type) {
                case locationTypesEnum.STATE:
                    setIsStateExpanded(false);
                    setExpandedDistricts({});
                    setExpandedTalukas({});
                    setExpandedVillages({});
                    break;

                case locationTypesEnum.DISTRICT:
                    setExpandedDistricts((prev) => ({
                        ...prev,
                        [id]: false,
                    }));
                    setExpandedTalukas({});
                    setExpandedVillages({});
                    break;

                case locationTypesEnum.TALUKA:
                    setExpandedTalukas((prev) => ({
                        ...prev,
                        [id]: false,
                    }));
                    setExpandedVillages({});
                    break;

                case locationTypesEnum.VILLAGE:
                    setExpandedVillages((prev) => ({
                        ...prev,
                        [id]: false,
                    }));
                    break;

                default:
                    console.error("Unsupported type:", type);
            }
            return; // Exit the function to avoid calling the API
        }

        // If expanding, call the API
        const payload = {
            ParentId: id,
            LanguageId: languageId,
        };

        // Set the loading state to true for the specific type and ID
        setLoadingState((prev) => ({
            ...prev,
            [`${type}-${id}`]: true,
        }));

        try {
            const response = await getLocationChild(payload);

            if (response.success) {
                switch (type) {
                    case locationTypesEnum.STATE:
                        setIsStateExpanded(true);
                        // Reset child states
                        setExpandedDistricts({});
                        setExpandedTalukas({});
                        setExpandedVillages({});
                        break;

                    case locationTypesEnum.DISTRICT:
                        setExpandedDistricts((prev) => ({
                            ...prev,
                            [id]: true,
                        }));
                        setVillagesByDistrict((prev) => ({
                            ...prev,
                            [id]: response.data,
                        }));
                        setExpandedTalukas({});
                        setExpandedVillages({});
                        break;

                    case locationTypesEnum.TALUKA:
                        setExpandedTalukas((prev) => ({
                            ...prev,
                            [id]: true,
                        }));
                        setVillagesByTaluka((prev) => ({
                            ...prev,
                            [id]: response.data,
                        }));
                        setExpandedVillages({});
                        break;

                    case locationTypesEnum.VILLAGE:
                        setExpandedVillages((prev) => ({
                            ...prev,
                            [id]: true,
                        }));
                        setAreasByVillage((prev) => ({
                            ...prev,
                            [id]: response.data,
                        }));
                        break;

                    default:
                        console.error("Unsupported type:", type);
                }
            } else {
                console.error("Failed to fetch data for type:", type, "and ID:", id);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            // Reset the loading state to false for the specific type and ID
            setLoadingState((prev) => ({
                ...prev,
                [`${type}-${id}`]: false,
            }));
        }
    };



    const fetchSelectedCityById = async (cityid?: any) => {
        try {
            if (selectedLanguage && cityid) {
                const payload = {
                    LanguageId: selectedLanguage,
                    LocationId: cityid,
                };
                const response = await getLocationById(payload);

                if (response.success) {
                    setSelectedCityName(response.data[0].name);
                    setSelectedCity(cityid)
                }
            } else {
                setSelectedCityName(t("General.All Cities"));
            }
        } catch (error) { }
    };



    const handleSearch = async (value) => {
        if (!value || value.trim() === "") {
            // Handle empty input, e.g., reset search results
            setSearchResults([]);
            return;
        }

        setSearchLoader(true)

        try {
            // // Call your search API here
            const payload = {
                SearchText: value,
                // languageId: languageId // Pass any required parameters
            };
            const response = await getLocationBySearch(payload); // Replace with your actual API function

            if (response.success) {
                setSearchResults(response.data); // Update your state with the API response
                setIsLocationSuggetionVisible(true)
                setSearchLoader(false)
            } else {
                // Handle API error
                console.error("Search API error:", response.message);
            }
        } catch (error) {
            console.error("Error calling search API:", error);
        }
    };


    const handleClickCurrentLocation = async () => {
        if (lattitude && longitude) {
            if (isSeprateLocation) {
                setLocationObject(locationResult?.LocationResult?.[0])
                setIsLocationPicker(false)
                setIsStateSelect(false)
            } else {
                setSearchValue(locationResult?.LocationResult?.[0]?.name);
                // setSelectedCityName(locationResult?.LocationResult?.[0]?.name)
                setSelectedCity(locationResult?.LocationResult?.[0]?.id)
                setIsLocationPicker(false)
                fetchSelectedCityById(locationResult?.LocationResult?.[0]?.id)
                setIsLocationApiCall(true)
                setIsPostClear(true)
                if (LOGEVENTCALL) {
                    logEffect(logEvents.Update_Location)
                }
                setIsFeatchCategoryCount(true)
                setIsLoading(true)
                // setIsLocationLoading(true)
                const visiteduserData = await getData("visitedUser")

                const payload = {
                    LocationId: locationResult?.LocationResult?.[0]?.id,
                    UnregisteredUserId: visiteduserData?.id || null

                }
                SaveLocationHistory(payload)

            }

        } else {
            setUseCurrentIsLoading(true)
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setIsLocationApiCall(false)
                        //    setUseCurrentIsLoading(true)
                        // fetchLocation(position.coords.latitude, position.coords.longitude)
                    },
                    (error) => {
                        console.error("Error fetching location:", error.message);
                        message.error({
                            key: "error",
                            content:
                                t("toastMessage.Location access is required for this feature. Please enable location permissions."),
                            duration: 2,
                        });
                        setUseCurrentIsLoading(false)

                    },
                    {
                        enableHighAccuracy: true, // Optional: Improves accuracy but may consume more power.
                        timeout: 10000, // Optional: Timeout for fetching location.
                        maximumAge: 0, // Optional: Ensures fresh data.
                    }
                );
            } else {
                message.error("Geolocation is not supported by your browser.");
            }
        }
    };



    const handleLocationSuggetionClick = async (value) => {
        try {
            const visiteduserData = await getData("visitedUser")
            // const convetedVisitedUserData = JSON.parse(visiteduserData);

            const payload = {
                LocationId: value.id,
                UnregisteredUserId: visiteduserData?.id || null
            }
            if (isSeprateLocation) {
                setLocationObject(value)
                setIsLocationPicker(false)
                setIsStateSelect(false)
            } else {
                const response = await SaveLocationHistory(payload)
                if (response.success) {

                    setSelectedCity(value.id)
                    // setSelectedCityName(value.name)
                    fetchSelectedCityById(value.id)
                    setIsLocationApiCall(true)
                    setIsPostClear(true)
                    if (LOGEVENTCALL) {
                        logEffect(logEvents.Update_Location)
                    }
                    setIsFeatchCategoryCount(true)

                    setIsLoading(true)
                    setSearchValue(value.name)
                    setFilterValue({ ...filterValue, PageNumber: 1, LocationId: value.id });

                    setIsLocationPicker(false)

                }
            }
            const newHistory = {
                id: value.id,
                name: value.name,
            };
            dispatch(locationHistoryAppend(newHistory));


            setIsLocationSuggetionVisible(false)
            setIsLocationPicker(false)



        } catch (error) {

        }
    }

    const handleClickAway = () => {
        // setIsSearchOpen(false);
        setIsLocationSuggetionVisible(false);
    };



    const handleClickNearByLocation = async () => {
        try {
            if (longitude && lattitude) {
                const payload = {
                    latitude: lattitude,
                    longitude: longitude,
                    LanguageId: languageId
                }

                if (!isNearByLocationExpand) {
                    setIsNearestExpandingLoader(true)
                    const response = await getNearestLocation(payload)
                    if (response.success) {
                        setNearByLocationExpand((prev) => !prev)
                        setNearByLocationData(response.data)
                        setIsNearestExpandingLoader(false)
                    }
                } else {
                    setNearByLocationExpand((prev) => !prev)
                }
            } else {
                message.error({
                    key: "error",
                    content:
                        t("toastMessage.Location access is required for this feature. Please enable location permissions."),
                    duration: 2,
                });
                setUseCurrentIsLoading(false)
            }


        } catch (error) {

        }
    }

    const handleRecentryUsedClick = (elm) => {
        if (isSeprateLocation) {
            setLocationObject(elm);
            setIsStateSelect(false); 
        } else {
            setIsLoading(true);
            setIsLocationPicker(false);logEffect(logEvents.Update_Location); handleLocationSuggetionClick(elm); setIsRefetch(true)
        }
        setIsLocationPicker(false)

    }

    const fetchLocation = async (lan = null, long = null) => {
        const payload = {
            latitude: "",
            longitude: "",
            LanguageId: languageId
        }
        if (lan && long) {
            payload.latitude = lan
            payload.longitude = long
        } else if (longitude && lattitude) {
            payload.latitude = lattitude
            payload.longitude = longitude
        }
        try {
            dispatch(fetchLocationData(payload))
                .then((res) => {
                    if (res) {
                        if (res.success) {
                            setUseCurrentIsLoading(false)

                        }
                    }
                })
                .catch((err) => {
                    console.error("Error:", err);
                    // Handle the error here
                });

        } catch (error) {

        }

    }

    useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    if (searchValue.length >= 3) {
      handleSearch(searchValue);
    } else {
      setSearchResults([]);
      setIsLocationSuggetionVisible(false);
    }
  }, 300); 

  return () => clearTimeout(delayDebounceFn);
}, [searchValue]);



    useEffect(() => {
        if (!locationData || Object.keys(locationData).length === 0) {
            fetchLocation()
        }
        if (locationData) {
            setLocationResult(locationData);
        }
        if (Object.keys(locationData).length > 0) {
            setIsLocationLoading(false)

        }
        if (Array.isArray(locationData?.LocationResult) && locationData?.LocationResult.length > 0) {
            setUseCurrentIsLoading(false)
        }

    }, [lattitude, longitude, locationData])

   


    return (
        <>
            <div className="d-flex align-items-center justify-content-between gap p-10 border-b-solid">
                <p className='mt-0 mb-0 text-lg font-semibold'>{t("General.Location")}</p>
                <CloseIcon className='cursor-pointer font-24' onClick={() => setIsLocationPicker(false)} />
            </div>

            <div className='p-10 pb-0 locationtextbox'>
                <TextField className='ml-0 mr-0 w-100'
                    placeholder={t('General.Type minimum 3 letters to search')}
                    id="outlined-start-adornment"
                    sx={{ m: 1, width: '25ch', color: "#fff" }}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start"><SearchIcon className='left-8' /></InputAdornment>
                        ),
                        endAdornment: (
                            searchLoader && <CircularProgress />
                        ),
                    }}
                />

            </div>


            {
                isLocationSuggetionVisible && (
                    <ClickAwayListener onClickAway={handleClickAway}>
                        <div className="location-suggetion-dropdown ">
                            <h3 className="mt-5 mb-5">
                                <strong>{t("General.Location Recommendations")}</strong>
                            </h3>
                            {searchResult.length > 0 ? (
                                <ul className="search-history-list pl-0 mb-0 mt-0">
                                    {searchResult.map((item, index) => (
                                        <li key={index} className="search-history-item">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div
                                                    className="d-flex gap cursor-pointer w-100"
                                                    onClick={(e) =>
                                                        handleLocationSuggetionClick(item)
                                                    }
                                                >
                                                    {/* <FieldTimeOutlined className="font-16 text-grey-100" /> */}
                                                    {item?.name &&
                                                        typeof item?.name === "string"
                                                        ? item?.name
                                                        : t("General.No search text")}
                                                </div>
                                                <a href="">
                                                    {/* <CloseOutlined
                        onClick={(e) => {
                          deleteSearchHostory(item, e);
                        }}
                        className="font-20 text-grey-100"
                      /> */}
                                                </a>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-history">{t("General.No location found")}</p>
                            )}
                        </div>
                    </ClickAwayListener>
                )
            }

            <div className='p-10 max-h-135px cursor-pointer'>
                {
                    isLocationLoading ? <Skeleton /> :
                        <>
                            <div className='d-flex gap border-b-solid pb-10' onClick={handleClickCurrentLocation}>
                                <MyLocationIcon />
                                <div>
                                    <h3 className='mt-0 mb-5'>{t("General.Use Current Location")}</h3>
                                    {
                                        useCurrentIsLoading ? <Skeleton paragraph={{ rows: 0 }} active style={{ height: 40 }} /> :
                                            <p className='mt-0 mb-0'>{
                                                Array.isArray(locationResult?.LocationResult) && locationResult?.LocationResult.length > 0
                                                    ? locationResult?.LocationResult[0]?.name
                                                    : t("General.No name available")
                                            }</p>
                                    }

                                </div>
                            </div>
                            {
                                loginUserData?.data && (
                                    <div className='border-b-solid'>
                                        <p className='text-grey font-bold'>{t("General.Recently Used")}</p>
                                        {
                                            Array.isArray(locationResult?.LocationHistoryResult) &&
                                            locationResult?.LocationHistoryResult?.map((elm) => (
                                                <p className='d-flex align-items-center gap' onClick={() => { handleRecentryUsedClick(elm) }}><span>{elm.name}</span></p>
                                            ))
                                        }
                                    </div>
                                )
                            }

                            <div className='border-b-solid' onClick={handleClickNearByLocation}>
                                <div className=' ' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0px" }}>
                                    <div className=''>
                                        <span className='text-grey font-bold ' >{t("General.Near By Locations")}</span>
                                    </div>
                                    <div className='mt-5'>
                                        {
                                            isNearestExpandingLoader ?
                                                <CircularProgress style={{ height: "28px", width: "28px" }} />
                                                :
                                                isNearByLocationExpand ? (
                                                    <KeyboardArrowDownIcon className="text-gray-600  " />
                                                ) : (
                                                    <KeyboardArrowRightIcon className="text-gray-600 " />
                                                )}
                                    </div>
                                </div>


                                {
                                    isNearByLocationExpand && (
                                        <>
                                            {Array.isArray(nearByLocationData) && nearByLocationData?.map((elm) => (
                                                <div
                                                    key={elm.id} // Add a unique key for each child element
                                                    className="d-flex justify-content-between align-items-center mb-10 mt-10"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // setSelectedCityName(elm?.name);
                                                        setIsLocationPicker(false);
                                                        setSelectedCity(elm?.id);
                                                        // setIsPostClear(true);
                                                        if (LOGEVENTCALL) {
                                                            logEffect(logEvents.Update_Location);
                                                        }
                                                        setIsFeatchCategoryCount(true);
                                                        setIsLoading(true)
                                                        // fetchSelectedCityById(elm?.id);
                                                        handleLocationSuggetionClick(elm);
                                                        setIsLocationApiCall(true)
                                                    }}
                                                >
                                                    <span className="d-flex align-items-center mb-8 mt-8">
                                                        <span>{elm.name}</span>
                                                    </span>
                                                    {/* <strong>{elm.distance} km</strong> */}
                                                </div>
                                            ))}
                                            {/* <span className="d-flex justify-content-center text-blue" onClick={() => setNearByLocationExpand(true)}>show more</span> */}
                                        </>
                                    )
                                }


                            </div>

                            <div>
                                <p className='text-grey font-bold'>{t("General.Choose State")}</p>

                                <ul className='pl-0'>

                                    {Array.isArray(locationResult?.StateDataResult) && locationResult?.StateDataResult.map((state) => {
                                        // Safely parse districts
                                        const districtsArray = (() => {
                                            try {
                                                return typeof state?.districts === "string"
                                                    ? JSON.parse(state.districts)
                                                    : state?.districts || [];
                                            } catch (error) {
                                                console.error("Error parsing districts:", error);
                                                return [];
                                            }
                                        })();

                                        const hasDistricts = Array.isArray(districtsArray);

                                        return (
                                            <div key={state.id} className="mb-6">
                                                {/* State Level */}
                                                <div
                                                    className={`d-flex justify-between align-items-center gap-2 p-2 rounded hover:bg-gray-50 ${hasDistricts ? "cursor-pointer" : "cursor-default"
                                                        }`}
                                                    onClick={() => hasDistricts && toggleList(state.id, locationTypesEnum.STATE)}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        {loadingState[`${locationTypesEnum.STATE}-${state.id}`] ? (
                                                            <CircularProgress size={20} />
                                                        ) : isStateExpanded ? (
                                                            <KeyboardArrowDownIcon className="text-gray-600" />
                                                        ) : (
                                                            <KeyboardArrowRightIcon className="text-gray-600" />
                                                        )}
                                                        <span className="font-medium ml-10">{state.name}</span>
                                                    </div>
                                                    <div className="ml-5">
                                                        <span
                                                            className="text-primary"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent parent onClick
                                                                handleLocationSuggetionClick(state);
                                                                setIsPostClear(true);
                                                                if (LOGEVENTCALL) {
                                                                    logEffect(logEvents.Update_Location);
                                                                }
                                                                setIsFeatchCategoryCount(true);
                                                                setIsLocationPicker(false);
                                                                setIsLocationApiCall(true)
                                                            }}
                                                        >
                                                            {t("General.Select")}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* District Level */}
                                                {hasDistricts && isStateExpanded && (
                                                    <ul className="pl-30 mt-10">
                                                        {districtsArray.map((district) => (
                                                            <li key={district.id} className="mb-8">
                                                                <div
                                                                    className="d-flex justify-between align-items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                                                    onClick={() => { toggleList(district.id, locationTypesEnum.DISTRICT) }}
                                                                >
                                                                    <div className="d-flex align-items-center gap-2">
                                                                        {loadingState[`${locationTypesEnum.DISTRICT}-${district.id}`] ? (
                                                                            <CircularProgress size={20} />
                                                                        ) : expandedDistricts[district.id] ? (
                                                                            <KeyboardArrowDownIcon className="text-gray-600" />
                                                                        ) : (
                                                                            <KeyboardArrowRightIcon className="text-gray-600" />
                                                                        )}
                                                                        <span className='ml-10'>{district.name}</span>
                                                                    </div>
                                                                    <span
                                                                        className="text-primary ml-10"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleLocationSuggetionClick(district);
                                                                            setIsLocationPicker(false);
                                                                            setIsFeatchCategoryCount(true);
                                                                            setIsLocationApiCall(true);
                                                                        }}
                                                                    >
                                                                        {t("General.Select")}
                                                                    </span>
                                                                </div>

                                                                {/* Taluka Level */}
                                                                {expandedDistricts[district.id] && (
                                                                    <ul className="pl-30 mt-10">
                                                                        {villagesByDistrict[district.id]?.map((taluka) => (
                                                                            <li key={taluka.id} className="mb-8">
                                                                                <div
                                                                                    className="d-flex justify-between align-items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                                                                    // onClick={() => toggleList(taluka.id, locationTypesEnum.TALUKA)}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        setIsLocationPicker(false);
                                                                                        handleLocationSuggetionClick(taluka);
                                                                                        setIsLocationApiCall(true)
                                                                                          setIsFeatchCategoryCount(true);
                                                                                    }}
                                                                                >
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        {/* {loadingState[`${locationTypesEnum.TALUKA}-${taluka.id}`] ? (
                                                                                            <CircularProgress size={20} />
                                                                                        ) : expandedTalukas[taluka.id] ? (
                                                                                            <KeyboardArrowDownIcon className="text-gray-600" />
                                                                                        ) : (
                                                                                            <KeyboardArrowRightIcon className="text-gray-600" />
                                                                                        )} */}
                                                                                        <span className='ml-10'>{taluka.name}</span>
                                                                                    </div>
                                                                                    {/* <a
                                                                                        className="text-primary ml-10"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleLocationSuggetionClick(taluka);
                                                                                            setIsLocationPicker(false);
                                                                                        }}
                                                                                        href="#"
                                                                                    >
                                                                                        {t("General.Select")}
                                                                                    </a> */}
                                                                                </div>

                                                                                {/* Village Level */}
                                                                                {expandedTalukas[taluka.id] && (
                                                                                    <ul className="pl-8 mb-4 mt-5">
                                                                                        {villagesByTaluka[taluka.id]?.map((village) => (
                                                                                            <li key={village.id} className="mb-14 mt-14">
                                                                                                <div
                                                                                                    className="d-flex justify-between align-items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        setIsLocationPicker(false);
                                                                                                        handleLocationSuggetionClick(village);
                                                                                                          setIsFeatchCategoryCount(true);
                                                                                                    }}
                                                                                                >
                                                                                                    <span>{village.name}</span>
                                                                                                </div>
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                        );
                                    })}



                                </ul>
                            </div>
                        </>
                }



            </div>
        </>
    );
};

export default LocationPicker;
