import { API_ENDPOINT_PROFILE, colorMap, colorMapping, contactTypesEnum } from '../../../libs/constant';
import HashMap from '../../../common/datastructures/hashmap';


interface FetchAndSetFileResult {
    file: File;
    url: string;
}

const fetchAndSetFile = async (url) => {
	try {
			const response = await fetch(url);
			const blob = await response.blob();
			const fileName = url?.substring(url.lastIndexOf("/") + 1);
			const fileExtension = fileName?.split('.').pop().toLowerCase();
			const mimeTypes = {
					jpg: 'image/jpeg',
					jpeg: 'image/jpeg',
					png: 'image/png',
					gif: 'image/gif',
					webp: 'image/webp',
					avif: 'image/avif',
			};
			const mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
			const file = new File([blob], fileName, { type: mimeType }); // Adjust filename and type as needed
			return { url, file };
	} catch (error) {
			console.error('Error fetching file:', error);
			return null;
	}
};

interface RepostData {
    title: string;
    shortdescription: string;
    price: string;
    properties: string;
    contacttypeid: number;
    mobileno?: string;
    email?: string;
    categoryid: number;
    subcategoryid?: number;
    contacttype: number;
    location: string;
    pictures?: string;
}

interface CategoryData {
    id: number;
    displayname: string;
    icon: string;
    subcategory?: string;
}

interface UpdatedCategory {
    id: number;
    displayname: string;
    icon: string;
}

interface SubCategory {
    SubCategoryId: number;
    Name: string;
    Icon: string;
}

interface SetValueFunction {
    (field: string, value: any): void;
}

interface SetStateFunction<T> {
    (value: T | ((prev: T) => T)): void;
}


export const fetchRepostData = async (
    isRepost: RepostData | null,
    isDarkMode: boolean,
    updatedCategoryList: UpdatedCategory[],
    categoryList: { data: CategoryData[] },
    setValue: SetValueFunction,
    setPriceValue: any,
    setDisplayPrice: any,
    setSelectedColor: any,
    setSelectedOptionId: any,
    setPreviousMobileNumber: any,
    setPreviousMobileno: any,
    setPrevWhatsapp: any,
    setPrevTelegram: any,
    setPrevEmail: any,
    setSelectedCategory: any,
    setSubCategoryId: any,
    setCategoryId: any,
    setSelectedSubcategory: any,
    setCategoryClick: any,
    setSelectedOption: any,
    setSelectedLoction: any,
    setSelectedFileUpload: any,
    setImageDeque: any,
    selectedPurpose: string
) => {
    if (isRepost && Object.keys(isRepost)?.length > 0) {
        setValue("Title", isRepost?.title);
        setValue("Advertise_details", isRepost?.shortdescription);
        setValue("price", isRepost?.price);
        setPriceValue(isRepost?.price);
        setDisplayPrice(isRepost?.price);
        setValue("Purpose", selectedPurpose);
        const jsonArray = JSON.parse(isRepost?.properties);

        const colorObject = jsonArray?.find(item => item.Name === "BackgroundColor");
        const colorValue = colorObject ? colorObject.Value : null;

        const mode = isDarkMode ? "dark" : "light";

        let selectedColor;

        if (isDarkMode) {
            if (!colorValue || colorValue === colorMap.white) {
                selectedColor = colorMap.darkgray;
            } else if (colorMapping.dark[colorValue]) {
                selectedColor = colorMapping.dark[colorValue];
            } else {
                const lightModeKey = Object.keys(colorMapping.light).find(
                    key => colorMapping.light[key] === colorValue
                );
                selectedColor = lightModeKey ? colorMapping.dark[lightModeKey] : colorValue;
            }
        } else {
            if(!colorValue){
            selectedColor = colorMap.white;
            }else{
            selectedColor = colorMapping.light[colorValue] || colorValue;

            }
        }

        

        setSelectedColor(selectedColor);

        if (isRepost?.contacttypeid === contactTypesEnum.PHONE) {
            const mobileNo = isRepost?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo);
            setSelectedOptionId(contactTypesEnum.PHONE);
            setPreviousMobileNumber(mobileNo);
            setPreviousMobileno(mobileNo);
        } else if (isRepost?.contacttypeid === contactTypesEnum.WHATSAPP) {
            const mobileNo = isRepost?.mobileno?.replace(/^\+91/, '');
            setValue("WhatsappNo", mobileNo);
            setSelectedOptionId(contactTypesEnum.WHATSAPP);
            setPrevWhatsapp(mobileNo);
        } else if (isRepost?.contacttypeid === contactTypesEnum.TELEGRAM) {
            const mobileNo = isRepost?.mobileno?.replace(/^\+91/, '');
            setValue("TelegramNo", mobileNo);
            setSelectedOptionId(contactTypesEnum.TELEGRAM);
            setPrevTelegram(mobileNo);
        } else if (isRepost?.contacttypeid === contactTypesEnum.EMAIL) {
            setValue("Email", isRepost?.email);
            setSelectedOptionId(contactTypesEnum.EMAIL);
            setPrevEmail(isRepost?.email);
        } else if (isRepost?.contacttypeid === contactTypesEnum.HIDEME) {
            setSelectedOptionId(contactTypesEnum.HIDEME);
        } else if (isRepost?.contacttypeid === contactTypesEnum.PHONEWHATSAPP) {
            const mobileNo = isRepost?.mobileno?.replace(/^\+91/, '');
            setValue("MobileNo", mobileNo);
            setSelectedOptionId(contactTypesEnum.PHONEWHATSAPP);
            setPreviousMobileNumber(mobileNo);
        }

        const category = updatedCategoryList.find((elm) => elm.id === isRepost?.categoryid);
        setValue("categoryName", category);
        setSelectedCategory(category);
        const categoryData = categoryList?.data?.find((elm) => elm.id === isRepost?.categoryid);

        const transformCategoryData = (categoryData: CategoryData) => {
            return {
                Name: categoryData?.displayname,
                Icon: categoryData?.icon,
            };
        };

        let subcategory;
        if (categoryData?.subcategory && isRepost?.subcategoryid) {
            subcategory = JSON.parse(categoryData?.subcategory)?.find(
                (elm: SubCategory) => elm.SubCategoryId === isRepost.subcategoryid
            );
            setSubCategoryId(subcategory.SubCategoryId);
        }

        setCategoryId(categoryData?.id);
        if (categoryData?.subcategory && isRepost?.subcategoryid) {
            setSelectedSubcategory(subcategory);
        } else {
            const transformedData = transformCategoryData(categoryData);
            setSelectedSubcategory(transformedData);
            setCategoryClick(true);
        }

        setValue("SubCategoryId", isRepost?.subcategoryid);
        if (isRepost?.contacttype === contactTypesEnum.HIDEME) {
            setSelectedOption(5);
        } else {
            setSelectedOption(isRepost?.contacttypeid);
        }
        setSelectedLoction(isRepost?.location);

        const slideData = isRepost?.pictures
            ? await Promise.all(
                JSON?.parse(isRepost?.pictures)?.map(async (elm: any) => {
                    const imagePath = elm?.LargeImage ? elm.LargeImage.replace(/^~/, '').replace(/\/M\//, '/Original/') : '';
                    const imageUrl = `${API_ENDPOINT_PROFILE}/${imagePath}`;
                    const result = await fetchAndSetFile(imageUrl);
                    if (result) {
                        setSelectedFileUpload((prevMap: HashMap) => {
                            const newMap = new HashMap();
                            (prevMap as any).map.forEach((value: any, key: string) => {
                                newMap.add(key, value);
                            });
                            newMap.add(result?.file?.name, result?.file);
                            return newMap;
                        });
                        return { key: elm?.id, id: elm?.id, image: result?.url, name: result?.file?.name };
                    }
                    return null;
                })
            )
            : [];

        if (slideData[0]?.key !== undefined) {
            setImageDeque((prevDeque: HashMap) => {
                const newHashMap = new HashMap();
                slideData.forEach((elm) => {
                    newHashMap.add(elm?.name, elm.image);
                    (prevDeque as any).map.forEach((value: any, key: string) => {
                        newHashMap.add(elm?.name, value);
                    });
                });
                return newHashMap;
            });
        }
    }
}; 