import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  product: null,
  categories: [],
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products
      state.page = action.payload.page
      state.pages = action.payload.pages
      state.total = action.payload.total
      state.loading = false
      state.error = null
    },
    setProduct: (state, action) => {
      state.product = action.payload
      state.loading = false
      state.error = null
    },
    setCategories: (state, action) => {
      state.categories = action.payload
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
  setProducts,
  setProduct,
  setCategories,
  setLoading,
  setError,
} = productSlice.actions
export default productSlice.reducer
