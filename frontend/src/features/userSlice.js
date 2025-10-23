import {createSlice} from "@reduxjs/toolkit";


export const userSlice = createSlice(
    {
        name: 'User',
        initialState: {
            id: null,
            email: null,
            username: null,
            is_staff: false,
        },
        reducers: {
            setUser: (state, action) => {
                state.id = action.payload.id
                state.email = action.payload.email
                state.username = action.payload.username
                state.is_staff = action.payload.is_staff
            },
            removeUser(state) {
                state.id = null
                state.email = null
                state.username = null
                state.is_staff = false
            }
        }
    }
)
 export const {setUser, removeUser} = userSlice.actions
export default userSlice.reducer