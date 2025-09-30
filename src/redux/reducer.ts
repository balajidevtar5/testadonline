import { combineReducers } from "@reduxjs/toolkit";
import { loginSlice, loginUserSlice } from "./slices/auth";
import { cityDataSlice } from "./slices/city";
import { tagsDataSlice } from "./slices/tags";
import { userListSlice } from "./slices/users";
import { userActivitySlice } from "./slices/userActivity";
import { errorLogSlice } from "./slices/errorlogs";
import { categoryDataSlice } from "./slices/category";
import { settingDataSlice } from "./slices/setting";
import { statisticsDataSlice } from "./slices/Statistics";
import { locationDataSlice } from "./slices/location";
import { phrasesDataSlice } from "./slices/phrases";
import storageSlice from "./slices/storageSlice";
import { regionsSlice } from "./slices/Statistics";
import { activityTypesSlice } from "./slices/Statistics";
import { cityBasedDataSlice } from "./slices/Statistics";
import { citiesSlice } from "./slices/Statistics";
import { notificationDataSlice } from "./slices/notification";

import postSlice from "./slices/postSlice";
import { chatListSlice } from "./slices/chat";
import { chatDetailsSlice } from "./slices/chatDetail";
const rootReducer = combineReducers({
    login: loginSlice.reducer,
    loginUser: loginUserSlice.reducer,
    cities: cityDataSlice.reducer,
    tags: tagsDataSlice.reducer,
    userList: userListSlice.reducer,
    userActivity: userActivitySlice.reducer,
    errorLogList: errorLogSlice.reducer,
    categoryList: categoryDataSlice.reducer,
    settingList: settingDataSlice.reducer,
    statisticsList: statisticsDataSlice.reducer,
    locationData: locationDataSlice.reducer,
    phrasesList: phrasesDataSlice.reducer,
    storage: storageSlice.reducer,
    regions: regionsSlice.reducer,
    activityTypes: activityTypesSlice.reducer,
    cityBasedStatistics: cityBasedDataSlice.reducer,
    allCities: citiesSlice.reducer,
    notificationData: notificationDataSlice.reducer,
    post: postSlice.reducer,
    chat: chatListSlice.reducer,
    chatDetail:chatDetailsSlice.reducer
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;