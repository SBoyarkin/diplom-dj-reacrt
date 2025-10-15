import { configureStore } from "@reduxjs/toolkit";
import  counterReducer from '../src/features/counterSlice.js'
import  tokenReducer from '../src/features/tokenSlice.js'
import userReducer from '../src/features/userSlice.js'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        token: tokenReducer,
        user: userReducer
    },
})