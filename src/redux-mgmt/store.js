import { configureStore } from "@reduxjs/toolkit";
import {postReducer, userReducer} from './CreateSlice';

export const store=configureStore({
    reducer:{
        user:userReducer,
        post:postReducer
    },
})