import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload
      state.loading = false
      state.error = null
    },
    addItem: (state, action) => {
      const existingItem = state.items.find(
        item => item.product._id === action.payload.product._id
      )
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.loading = false
      state.error = null
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        item => item._id !== action.payload
      )
      state.loading = false
      state.error = null
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(
        item => item._id === action.payload.id
      )
      if (item) {
        item.quantity = action.payload.quantity
      }
      state.loading = false
      state.error = null
    },
    clearCart: (state) => {
      state.items = []
      state.loading = false
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions
export default cartSlice.reducer
