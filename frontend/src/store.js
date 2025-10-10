import { configureStore } from "@reduxjs/toolkit";
import  counterReducer from '../src/features/counterSlice.js'
import  tokenReducer from '../src/features/tokenSlice.js'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        token: tokenReducer,
    },
})