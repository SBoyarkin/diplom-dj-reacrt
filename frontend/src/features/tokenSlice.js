import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    value: localStorage.getItem('Token') || null,
    isAuth: !!localStorage.getItem('Token'),
  },
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload
      state.isAuth = !!action.payload
      localStorage.setItem('Token', action.payload)
    },
    removeToken: (state) => {
      state.value = null
      state.isAuth = false
      localStorage.removeItem('Token')
    },
  },
})

export const { setToken, removeToken  } = tokenSlice.actions

export default tokenSlice.reducer