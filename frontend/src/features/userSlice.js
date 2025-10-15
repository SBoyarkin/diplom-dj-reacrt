import {createSlice} from "@reduxjs/toolkit";


export const userSlice = createSlice(
    {
        name: 'User',
        initialState: {
            id: null,
            email: null,
            username: null,
        },
        reducers: {
            setUser: (state, action) => {
                state.id = action.payload.id
                state.email = action.payload.email
                state.username = action.payload.username
            },
            removeUser(state) {
                state.id = null
                state.email = null
                state.username = null
            }
        }
    }
)
 export const {setUser, removeUser} = userSlice.actions
export default userSlice.reducer