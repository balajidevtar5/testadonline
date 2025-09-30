import { fetch } from "../../libs/helper";
import { getData } from "../../utils/localstorage";
export const createPost = async (payload: any): Promise<any> => {
    return fetch({
        url: "/Post/AddUpdatePost",
        method: "POST",
        data: payload,
    });
};
export const updatePost = async (payload: any): Promise<any> => {
    return fetch({
        url: "/Post/AddUpdatePost",
        method: "POST",
        data: payload,
    });
};
export const deletePost = async (postId: any,CityId:any,userId?:any): Promise<any> => {
    return fetch({
        url: `/Post/DeletePost?postid=${postId}&LocationId=${CityId}&LanguageId=${await getData("i18nextLng") || 2}&PostedBy=${userId}`,
        method: "PUT",
    });
};



export const getListAPI = async (payload: any): Promise<any> => {
    return fetch({
        url: "/Post/GetList",
        method: "POST",
        data: payload,
    });
};
export const getPostListApi = async (payload: any): Promise<any> => {
    return fetch({
        url: "/Post/GetPostList",
        method: "POST",
        data: payload,
    });
};
export const likeDislike = async (postId: any): Promise<any> => {
    return fetch({
        url: `/Post/PostLikeUnlike?PostId=${postId}`,
        method: "PUT"
    });
};
export const favUnFavApiFetch = async (postId: any): Promise<any> => {
    return fetch({
        url: `/Post/PostFavoriteUnfavorite?PostId=${postId}`,
        method: "PUT"
    });
};

export const ContactCount = async (postId: any): Promise<any> => {
    return fetch({
        url: `/Post/GetPostCountsByPostId?postId=${postId}`,
        method: "GET"
    });
};

export const getTags = async (search: any): Promise<any> => {
    return fetch({
        url: `/Post/GetTags?search=${search}`,
        method: "GET"
    });
};
export const fetchAvailablePostSlot = async (): Promise<any> => {
    return fetch({
        url: `/Post/AvailablePostSlot`,
        method: "GET"
    });
};
export const fetchViewPost = async (payload: any): Promise<any> => {
    return fetch({
        url: `/Post/AddUpdateView`,
        method: "PUT",
        data: payload
    });
};
export const AddWalletTransaction = async (payload: any): Promise<any> => {
    return fetch({
        url: `/Wallet/AddWalletTransaction`,
        method: "POST",
        data: payload
    });
};
export const fetchPostById = async (postId: any): Promise<any> => {
    return fetch({
        url: `/Post/GetPostDetailsPostId?postId=${postId}`,
        method: "GET"
    });
};
export const SharePostAPI = async (payload: any): Promise<any> => {
    return fetch({
        url: `Post/SharePost?postId=${payload.postId}&langId=${payload.langId}`,
        method: "PUT",
    });
};

export const AddNewMobileNumber = async (payload: any): Promise<any> => {
    return fetch({
        url: `/Post/AddNewMobileNumber?MobileNo=${payload?.MobileNo}&ISWhatsapp=${payload.ISWhatsapp}&IsMobile=${payload.IsMobile}&Email=${payload?.Email}`,
        method: "POST",
    });
};

export const verifyPostOtp = async (payload:any): Promise<any> => {
    return fetch({
        url: `/Post/OtpVerification`,
        method: "POST",
        data: payload
    });
};


export const PostFileUpload = async (payload: any, postId: any, id: any, filePathArray?: any): Promise<any> => {
    const headers: any = {
        PostId: postId,
        Id: id,
    };

    // Convert filePathArray to a string and pass it as a single header
    if (filePathArray && filePathArray?.length > 0) {
        headers['fileName'] = filePathArray.join(","); // Join array into a space-separated string (or use commas, etc.)
    }

    return fetch({
        url: `/Post/FileUpload`,
        method: "POST",
        headers: headers,
        data: payload
    });
};


export const generatePDF = async (payload:any): Promise<any> => {
    return fetch({
        url: `/Admin/GeneratePdfPath`,
        method: "POST",
        data: payload
    });
};

export const DeleteFile  = async (postId:any,id:any): Promise<any> => {
    return fetch({
        url: `/Post/FileDelete?PostId=${postId}&ImageId=${id}`,
        method: "DELETE",
    });
};

export const getCategory = async (payload): Promise<any> => {
    return fetch({
        url: `/Post/GetPostCatgory?LanguageId=${payload.LanguageId}`,
        method: "GET",
    });
};
export const sendNotifyOwner = async (payload): Promise<any> => {
    return fetch({
        url: `Post/ContactMe?UserId=${payload.UserId}&PostId=${payload.postId}`,
        method: "POST",
    });
};

export const getPremiumAdListApi = async (payload): Promise<any> => {
    return fetch({
        url: `Post/GetMyPremiumAdList`,
        method: "POST",
        data:payload
    });
};

export const ReportofPost = async (payload): Promise<any> => {
    return fetch({
        url: `Post/ReportofPost`,
        method: "PUT",
        data:payload
    });
};

export const ReportofPremiumAds = async (payload): Promise<any> => {
    return fetch({
        url: `Post/ReportofPremiumAds`,
        method: "PUT",
        data:payload
    });
};

export const getSubCategory = async (payload): Promise<any> => {
    return fetch({
        url: `/Post/GetAdsubCatgory??search=${payload?.search}&LanguageId=${payload?.LanguageId}&CategoryId=${payload?.CategoryId}`,
        method: "GET",
    });
};

export const GetContactOptions = async (LanguageId): Promise<any> => {
    return fetch({
        url: `/Post/GetContactTypes?LanguageId=${LanguageId}`,
        method: "GET",
    });
};


export const GetMyPostList = async (payload): Promise<any> => {
    return fetch({
        url: `/Post/GetMyPostList`,
        method: "POST",
        data:payload
    });
};

export const UpdateCategoryWisePostData = async (payload): Promise<any> => {
    return fetch({
        url: `/Post/UpdateCategoryWisePostData?categoryId=${payload.categoryId}`,
        method: "GET",
    });
};

export const GetCategoryWisePostCount = async (): Promise<any> => {
    return fetch({
        url: `/Post/GetCategoryWisePostCount`,
        method: "GET",
    });
};

export const GetRelativePost = async (payload): Promise<any> => {
    const baseUrl = `/Post/GetRelativePost?id=${payload.id}`;
    const url = payload.LanguageId ? `${baseUrl}&LanguageId=${payload.LanguageId}` : baseUrl;

    return fetch({
        url: url,
        method: "GET",
    });
};




