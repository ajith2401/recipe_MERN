import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error : null
}

const userSlice = createSlice({
     name: "user",
     initialState,
     reducers: {
        signStart : (state) =>{
            state.loading = true
        },
        signInSuccess : (state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error =null;
        },
        signUpSuccess : (state,action) =>{
            state.loading = false;
            state.error =null;
        },
        signInFailure :(state,action) =>{
            state.loading = false;
            state.error = action.payload
        }

     }
})


export const {signStart, signInSuccess,signInFailure,signUpSuccess } = userSlice.actions

export default userSlice.reducer; 