import { createSlice } from '@reduxjs/toolkit'

export const fileListSlice = createSlice({
  name: 'fileList',
  initialState: {
    value: []
  },
  reducers: {
    setListFile: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setListFile  } = fileListSlice.actions

export default fileListSlice.reducer