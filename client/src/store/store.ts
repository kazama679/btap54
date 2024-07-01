import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productReducer";

const store=configureStore({
    reducer:{
        productReducer,
    }
})
export default store;