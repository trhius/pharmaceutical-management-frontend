import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    buyNow: {}
  },
  reducers: {
    addProductToCart: (state, action) => {
      const { selectedProduct } = action.payload;
      const { productId, productDetailId, quantity } = selectedProduct;
      const newCartItems = [...state.items];
      let addNew = true;

      newCartItems.forEach(item => {
        if (item.productId === productId && item.productDetailId === productDetailId) {
          addNew = false;
          item.quantity += quantity;
        }
      });

      if (addNew) {
        state.items.push(selectedProduct);
      } else {
        state.items = newCartItems;
      }
    },
    updateCartItemQuantity: (state, action) => {
      const { selectedProduct, newQuantity } = action.payload;
      const { productId, productDetailId } = selectedProduct;
      const newCartItems = [...state.items];

      newCartItems.forEach(item => {
        if (item.productId === productId && item.productDetailId === productDetailId) {
          item.quantity = newQuantity;
        }
      });

      state.items = newCartItems;
    },
    removeCartItem: (state, action) => {
      const { selectedProduct } = action.payload;
      const { productId, productDetailId } = selectedProduct;
      const newCartItems = [...state.items];
      let deleteIndex = -1;

      newCartItems.forEach((item, index) => {
        if (item.productId === productId && item.productDetailId === productDetailId) {
          deleteIndex = index;
        }
      });

      if (deleteIndex !== -1) {
        newCartItems.splice(deleteIndex, 1);
        state.items = newCartItems;
      }
    },
    removeAllCartItems: (state, action) => {
      state.items = [];
    },
    setBuyNowProduct: (state, action) => {
      const { selectedProduct } = action.payload;
      state.buyNow = selectedProduct;
    },
    removeBuyNowProduct: (state, action) => {
      state.buyNow = {};
    },
  },
});

export const {
  addProductToCart,
  updateCartItemQuantity,
  removeCartItem,
  removeAllCartItems,
  setBuyNowProduct,
  removeBuyNowProduct
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;

export const selectBuyNow = (state) => state.cart.buyNow;
