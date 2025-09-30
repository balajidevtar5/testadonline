import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getListAPI, GetMyPostList, getPostListApi, getPremiumAdListApi } from '../services/post.api';
import { API_ENDPOINT_PROFILE } from '../../libs/constant';
import { getData } from '../../utils/localstorage';

interface PostState {
  postData: any[];
  normalPostData: any[];
  favoriteData: any[];
  mypostData: any[];
  allpostData: any[];
  totalRecords: number;
  isLoading: boolean;
  isDataLoaded: boolean;
  hasMore: boolean;
  isScrollToBottom: boolean;
  error: string | null;
  isRefetch: boolean;
  prevFilterValue?: any;
  isScrolling?: boolean;
  // Removed non-serializable functions from state
  // setIsLoading and setIsPostClear should be passed as parameters, not stored in state
}

const initialState: PostState = {
  postData: [],
  normalPostData: [],
  favoriteData: [],
  mypostData: [],
  allpostData: [],
  totalRecords: 0,
  isLoading: false,
  isDataLoaded: false,
  hasMore: true,
  isScrollToBottom: false,
  error: null,
  isRefetch: false,
  prevFilterValue: null,
  isScrolling: false,
  // Removed function properties from initial state
};

// AsyncThunk
export const fetchCardItems = createAsyncThunk(
  'posts/fetchCardItems',
  async (
    {
      isPremiumAd,
      isPostClear,
      filterValue,
      selectedCity,
      selectedLanguage,
      searchValue,
      encryptedAdminAuth,
      setIsLoading, // Keep as parameter, don't store in state
      prevFilterData,
      isRefetch,
      setIsRefetch, // Keep as parameter, don't store in state
      isScrolling,
      setIsPostClear, // Keep as parameter, don't store in state
      setIsScrooling // Keep as parameter, don't store in state
    }: any,
    { rejectWithValue, getState }
  ) => {
    try {
      if (!(selectedCity || selectedCity === 0)) return;
      const state: any = getState();
      const { favoriteData, mypostData, prevFilterValue, allpostData, prevMyPostFilter } = state.post;

      if (filterValue?.Favorites && favoriteData.length > 0 && prevFilterValue != filterValue && !isRefetch) {
        setIsLoading?.(false); // Safe call with optional chaining
        const filteredPosts = favoriteData.filter(post => !post.isPremium);

        return {
          postData: favoriteData,
          normalPostData: favoriteData,
          prevFilterValue: filterValue,
          prevFilterData: prevFilterData,
          totalRecords: filteredPosts[0]?.totalcount || 0,
          hasMore: false,
          isScrollToBottom: false,
          isPostClear,
        };
      }

      // ✅ RETURN IF MY POSTS ALREADY IN STORE
      if (filterValue?.UserId && mypostData.length > 0 && prevFilterValue != filterValue && !isRefetch && !isScrolling) {
        setIsLoading?.(false);
        const filteredPosts = mypostData.filter(post => !post.isPremium);
        return {
          postData: mypostData,
          normalPostData: mypostData,
          prevFilterValue: filterValue,
          prevFilterData: prevFilterData,
          prevMyPostFilter: filterValue,
          totalRecords: filteredPosts[0]?.totalcount || 0,
          hasMore: false,
          isScrollToBottom: false,
          isPostClear,
        };
      }

      if (allpostData.length > 0 && JSON.stringify(filterValue) === JSON.stringify(prevFilterData) && !isRefetch) {
        setIsLoading?.(false);
        const filteredPosts = allpostData.filter(post => !post.isPremium);
        return {
          postData: allpostData,
          normalPostData: allpostData,
          prevFilterValue: filterValue,
          prevFilterData: prevFilterData,
          totalRecords: filteredPosts[0]?.totalcount || 0,
          hasMore: false,
          isScrollToBottom: false,
          isPostClear,
        };
      }

      if (isPremiumAd) {
        const payload = { PageNumber: filterValue?.PageNumber };
        const response = await getPremiumAdListApi(payload);
        if (response?.success) {
          const updatedData = response?.data?.map((elm: any) => ({
            ...elm,
            isPremium: true,
          }));

          const totalRecords =
            response?.data?.length > 0 ? response?.data?.[0]?.totalcount : 0;
          setIsLoading?.(false);
          setIsRefetch?.(false);
          setIsPostClear(false);
          return {
            postData: updatedData,
            normalPostData: [],
            totalRecords,
            hasMore: true,
            isScrollToBottom: false,
            isPostClear,
            isPremiumAd,
            prevFilterData: prevFilterData,
            isRefetch,
          };
        }
      } else {
        const visitedUser = await getData('visitedUser');
        const mypostPayload = {
          PageSize: filterValue.PageSize,
          PageNumber: filterValue.PageNumber,
          LanguageId: selectedLanguage ,
          CategoryId:filterValue?.CategoryId,
          SubCategoryId:filterValue?.SubCategoryId

        };

        const fetchPostAPI = encryptedAdminAuth?.user?.token
          ? filterValue.UserId
            ? GetMyPostList
            : getListAPI
          : getPostListApi;

        let response;
        if (fetchPostAPI === GetMyPostList) {
          response = await GetMyPostList(mypostPayload);
        } else if (fetchPostAPI === getListAPI) {
          const filteredParams = { ...filterValue };
          delete filteredParams.LocationId;
          response = await fetchPostAPI(filteredParams);
        } else {
          const postlistfilter = {
            ...filterValue,
            UnregisteredUserId: visitedUser?.id,
          };
          response = await fetchPostAPI(postlistfilter);
        }

        if (response.success) {
          // Deep clone so we don’t mutate original
          let updatedPostData = response.data.postList.map(post => ({ ...post }));

          setIsLoading?.(false);
          setIsRefetch?.(false);
          setIsPostClear?.(false);
          setIsScrooling?.(false);

          const pageStartIndex = (filterValue.PageNumber - 1) * filterValue.PageSize;

          if (response.data.premiumAdsList?.length > 0) {
            response.data.premiumAdsList.forEach((premiumAd: any) => {
              const globalIndex = (premiumAd.display_order || 1) - 1;

              // Only insert if this premium ad belongs in this page
              if (globalIndex >= pageStartIndex && globalIndex < pageStartIndex + updatedPostData.length) {
                const localIndex = globalIndex - pageStartIndex;
                updatedPostData.splice(localIndex, 0, { ...premiumAd, isPremium: true });
              }
            });
          }


          const convertedArray = await Promise.all(
            updatedPostData.map(async (d: any) => {
              let imageData = [];
              if (d?.pictures) {
                try {
                  const parsedPictures = JSON.parse(d.pictures);
                  imageData = parsedPictures?.map((elm: any) => {
                    const imagePath = elm?.SmallImage
                      ? elm.SmallImage.replace(/^~/, "")
                      : "";
                    return {
                      key: elm?.id,
                      adsimage: `${API_ENDPOINT_PROFILE}/${imagePath}`,
                    };
                  });
                } catch (e) {
                  console.error("Parsing image error:", e);
                }
              }
              return { ...d, image: imageData };
            })
          );

          // Optional: Reset updatedPostData to avoid carrying changes forward
          updatedPostData = [];

          return {
            postData: convertedArray,
            filterValue,
            normalPostData: response.data.postList,
            prevFilterData,
            totalRecords: response.data.postList?.[0]?.totalcount || 0,
            hasMore: response.data.postList?.length > 0,
            isRefetch,
            isScrollToBottom:
              response.data.postList?.some(
                (d: any) =>
                  d?.rownumber !== d?.totalcount || searchValue !== ""
              ) ?? true,
            isPostClear,
          };
        } else {
          return rejectWithValue(response.message);
        }

      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const postContactUpdateTracker = new Map<string, boolean>();

export const updateContactCount = createAsyncThunk(
  'posts/updateContactCount',
  async (
    {
      post,
      contactType,
      updateValue = 1,
    }: {
      post: any;
      contactType: string;
      updateValue?: number;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: any = getState();
      const { postData } = state.post;

      const postId = post.id;
      const trackerKey = `${postId}_${contactType}`;

      if (postContactUpdateTracker.has(trackerKey)) {
        return { postData };
      }

      postContactUpdateTracker.set(trackerKey, true);

      const updatedPosts = postData.map((item: any) => {
        if (item.id !== postId) return item;

        let updatedItem = { ...item };

        switch (contactType) {
          case 'Call':
            updatedItem.calls = (parseInt(updatedItem.calls || '0') + updateValue).toString();
            break;
          case 'Email':
            updatedItem.emails = (parseInt(updatedItem.emails || '0') + updateValue).toString();
            break;
          case 'Whatsapp':
            updatedItem.whatsapps = (parseInt(updatedItem.whatsapps || '0') + updateValue).toString();
            break;
          case 'Telegram':
            updatedItem.telegrams = (parseInt(updatedItem.telegrams || '0') + updateValue).toString();
            break;
          case 'HideMe':
            updatedItem.hideme = (parseInt(updatedItem.hideme || '0') + updateValue).toString();
            break;
          default:
            break;
        }

        return updatedItem;
      });

      return {
        postData: updatedPosts,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearAllPostData(state) {
      state.postData = [];
      state.favoriteData = [];
      state.allpostData = [];
      state.mypostData = [];
      state.normalPostData = [];
      state.totalRecords = 0;
      state.hasMore = true;
      state.isDataLoaded = false;
      state.isScrollToBottom = false;
    },
    // Add reducer to update isRefetch if needed
    setIsRefetch(state, action: PayloadAction<boolean>) {
      state.isRefetch = action.payload;
    },
    // Add reducer to update isScrolling if needed
    setIsScrolling(state, action: PayloadAction<boolean>) {
      state.isScrolling = action.payload;
    },
    updateChatId(state, action: PayloadAction<any>) {
      state.postData.find((post: any) => post.id === action.payload.postId).chatid = action.payload.chatId;
    },
    updateBlockedStatus(state, action: PayloadAction<any>) {
      state.postData.find((post: any) => post.id === action.payload.postId).isblocked = action.payload.isBlocked;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateContactCount.fulfilled, (state, action) => {
        state.postData = action.payload.postData;
      })
      .addCase(fetchCardItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCardItems.fulfilled, (state, action) => {
        const {
          postData,
          normalPostData,
          totalRecords,
          hasMore,
          isScrollToBottom,
          isPostClear,
          filterValue,
          prevFilterData,
          isRefetch,
          isPremiumAd
        } = action.payload;

        state.isLoading = false;
        state.error = null;
        state.totalRecords = totalRecords;
        state.hasMore = hasMore;
        state.isScrollToBottom = isScrollToBottom;
        state.isDataLoaded = true;
        state.normalPostData = normalPostData;
        state.prevFilterValue = filterValue; // Update prevFilterValue

        if (isRefetch) {
          state.postData = [];
          state.favoriteData = [];
          state.mypostData = [];
          state.allpostData = [];
          state.isRefetch = false; // Reset isRefetch
        }

        if (filterValue?.Favorites) {
          state.favoriteData = postData;
        }
        if (filterValue === prevFilterData) {
          state.allpostData = postData;
        }
        if (filterValue?.UserId) {
          state.mypostData = postData;
        }
        if (isPostClear) {
          state.postData = postData;
        } else {
          state.postData = [...state.postData, ...postData];
        }
      })
      .addCase(fetchCardItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAllPostData, setIsRefetch, setIsScrolling, updateChatId, updateBlockedStatus } = postSlice.actions;
export const selectPostData = (state: any) => state.post.postData;
export const selectNormalPostData = (state: any) => state.post.normalPostData;
export const selectTotalRecords = (state: any) => state.post.totalRecords;
export const selectIsLoading = (state: any) => state.post.isLoading;
export const selectHasMore = (state: any) => state.post.hasMore;
export const selectIsScrollToBottom = (state: any) => state.post.isScrollToBottom;
export const selectFavoriteData = (state: any) => state.post.favoriteData;
export const selectMyPostData = (state: any) => state.post.mypostData;
export const selectError = (state: any) => state.post.error;
export const selectIsRefetch = (state: any) => state.post.isRefetch;
export const selectIsScrolling = (state: any) => state.post.isScrolling;
export default postSlice;