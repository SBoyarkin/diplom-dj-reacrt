import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    value: undefined,
  },
  reducers: {
    setToken: (state, action) => {
      state.value = action.payload
    },
    removeToken: (state) => {
      state.value = ''
    },
  },
})

export const { setToken, removeToken  } = tokenSlice.actions

export default tokenSlice.reducer