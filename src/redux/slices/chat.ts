import { createSlice } from "@reduxjs/toolkit";
import { deepClone } from "../../libs/helper";
import { GetChatList } from "../services/chat.api";
 
export interface chatListState {
  data?: any;
  error?: string | null;
  isLoading?: boolean;
  isReadLastMessage?: boolean;     
  lastMessageId?: string | null;   
}

const chatListInitialState: chatListState = {
  data: {},
  error: null,
  isLoading: false,
  isReadLastMessage: false,
  lastMessageId: null,
};

export interface chatListDataResponse {
  data: any;
  success: boolean;
  message: string;
};

export const chatListSlice = createSlice({
  name: "chatListSlice",
  initialState: deepClone(chatListInitialState),
  reducers: {
    chatListStarted: (state) => {
      return {
        ...state,
        isLoading: true
      }
    },
    chatListSuccess: (state, action) => {
      return {
        ...state,
        data: action.payload,
        error: null,
        isLoading: false,
      }
    },
    updateChatPreview: (state, action) => {
      const { chatIdValue, lastmessage, isseen, lastmessagetime } = action.payload;
      const chatList = state.data?.data;
      const existing = chatList?.find((chat) => chat.chatid === chatIdValue);

      if (existing) {
        existing.lastmessage = lastmessage;
        existing.isseen = isseen;
        existing.lastmessagetime = lastmessagetime;
      }
    },
    chatListFail: (state, action) => {
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    },
    chatListReset: () => {
      return deepClone(chatListInitialState);
    },
    clearChatList: (state) => {
      return {
        ...state,
        data: {},   // ✅ only clears chat data
        error: null
      }
    }
  }
});

export const { 
  chatListStarted, 
  chatListSuccess, 
  chatListFail, 
  chatListReset, 
  updateChatPreview, 
  clearChatList        // ✅ export it
} = chatListSlice.actions;
 
export const fetchchatList = () => async (dispatch: any) => {
  dispatch(chatListStarted());
  try {
    const res: chatListDataResponse = await GetChatList();
    if (res) {
      dispatch(chatListSuccess(res));
    }
  } catch (e: any) {
    dispatch(chatListFail(e.message));
  }
};
