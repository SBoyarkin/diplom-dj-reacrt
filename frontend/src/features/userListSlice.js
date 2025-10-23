import {createSlice} from "@reduxjs/toolkit";


export const userListSlice = createSlice(
    {
        name: 'UserList',
        initialState: {
            value: []
        },
        reducers: {
            setUserList: (state, action) => {
                state.value = action.payload
            },
            removeUserList(state) {
                state.value = null
            }
        }
    }
)
 export const {setUserList, removeUserList} = userListSlice.actions
export default userListSlice.reducer