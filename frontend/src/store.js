import { configureStore } from "@reduxjs/toolkit";
import  counterReducer from '../src/features/counterSlice.js'
import  tokenReducer from '../src/features/tokenSlice.js'
import userReducer from '../src/features/userSlice.js'
import fileReducer from './features/fileSlice.js'
import fileListReducer from './features/filesListSlice.js/'
export const store = configureStore({
    reducer: {
        counter: counterReducer,
        token: tokenReducer,
        user: userReducer,
        file: fileReducer,
        fileList: fileListReducer,
    },
})