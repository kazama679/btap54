import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Lấy danh sách sản phẩm
export const getAllProduct = createAsyncThunk("product/getAllProduct", async () => {
    const response = await axios.get("http://localhost:8080/products");
    return response.data;
});

// Thêm sản phẩm vào giỏ hàng
export const addToCart = createAsyncThunk("product/addToCart", async (product) => {
    await axios.patch(`http://localhost:8080/products/${product.id}`, { stock: product.stock - product.quantity });
    const response = await axios.post("http://localhost:8080/cart", product);
    return response.data;
});

// Lấy giỏ hàng
export const getCart = createAsyncThunk("product/getCart", async () => {
    const response = await axios.get("http://localhost:8080/cart");
    return response.data;
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartQuantity = createAsyncThunk("product/updateCartQuantity", async ({ id, quantity }) => {
    const response = await axios.patch(`http://localhost:8080/cart/${id}`, { quantity });
    const productResponse = await axios.get(`http://localhost:8080/products/${id}`);
    await axios.patch(`http://localhost:8080/products/${id}`, { stock: productResponse.data.stock - quantity });
    return response.data;
});

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk("product/removeFromCart", async (id) => {
    const cartItem = await axios.get(`http://localhost:8080/cart/${id}`);
    const product = await axios.get(`http://localhost:8080/products/${id}`);
    await axios.patch(`http://localhost:8080/products/${id}`, { stock: product.data.stock + cartItem.data.quantity });
    await axios.delete(`http://localhost:8080/cart/${id}`);
    return id;
});

const productReducer = createSlice({
    name: "product",
    initialState: {
        products: [],
        cart: [],
        total: 0
    },
    reducers: {
        addToCartLocal: (state, action) => {
            const existingProduct = state.cart.find(item => item.id === action.payload.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCartLocal: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        updateCartLocal: (state, action) => {
            const { id, quantity } = action.payload;
            const product = state.cart.find(item => item.id === id);
            if (product) {
                product.quantity = quantity;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProduct.fulfilled, (state, action) => {
                state.products = action.payload;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.cart = action.payload;
                state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const existingProduct = state.cart.find(item => item.id === action.payload.id);
                if (existingProduct) {
                    existingProduct.quantity += action.payload.quantity;
                } else {
                    state.cart.push(action.payload);
                }
                const product = state.products.find(item => item.id === action.payload.id);
                if (product) {
                    product.stock -= action.payload.quantity;
                }
                state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                const { id, quantity } = action.payload;
                const cartItem = state.cart.find(item => item.id === id);
                const product = state.products.find(item => item.id === id);
                if (cartItem && product) {
                    state.total -= cartItem.price * cartItem.quantity;
                    cartItem.quantity = quantity;
                    state.total += cartItem.price * cartItem.quantity;
                    product.stock -= quantity;
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const cartItem = state.cart.find(item => item.id === action.payload);
                if (cartItem) {
                    state.total -= cartItem.price * cartItem.quantity;
                    state.cart = state.cart.filter(item => item.id !== action.payload);
                }
            });
    }
});

export const { addToCartLocal, removeFromCartLocal, updateCartLocal } = productReducer.actions;
export default productReducer.reducer;
