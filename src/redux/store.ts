import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";

const reducer = (state, action) => {
    if (action.type === "HYDRATE") {
        const nextState = {
            ...state,
            ...action.payload
        };
        return nextState;
    } else {
        return rootReducer(state, action);
    }
}

export const store = configureStore({ reducer })
export type AppDispatch = typeof store.dispatch;