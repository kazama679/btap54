import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// hàm đi lấy tất cả sản phẩm
export const getAllProduct:any=createAsyncThunk("product/getAllProduct",async ()=>{
    const response:any= await axios.get("http://localhost:8080/products")
    return response.data
})

const productReducer=createSlice({
    name:"product",
    initialState:{
        product:[]
    },
    reducers:{

    },
    extraReducers:(buider)=>{
        buider
        .addCase(getAllProduct.pending,(state,action)=>{
            console.log("trạng thái chờ sử lý");
        })
        .addCase(getAllProduct.fulfilled,(state,action)=>{
            state.product=action.payload
        })
        .addCase(getAllProduct.rejected,(state,action)=>{
            console.log("thất bại");
        })
    }
})
export default productReducer.reducer;