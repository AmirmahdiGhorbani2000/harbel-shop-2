import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload
      state.loading = false
      state.error = null
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
      state.loading = false
      state.error = null
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload)
      state.currentOrder = action.payload
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
  setOrders,
  setCurrentOrder,
  addOrder,
  setLoading,
  setError,
} = orderSlice.actions
export default orderSlice.reducer
