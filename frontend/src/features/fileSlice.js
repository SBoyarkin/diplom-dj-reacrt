import { createSlice } from '@reduxjs/toolkit'

export const fileSlice = createSlice({
  name: 'file',
  initialState: {
    value: null
  },
  reducers: {
    setFile: (state, action) => {
      state.value = action.payload
    },
    removeFile: (state) => {
      state.value = null
    },
  },
})

export const { setFile, removeFile  } = fileSlice.actions

export default fileSlice.reducer