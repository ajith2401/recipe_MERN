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
        },
        updateUserStart : (state) =>{
            state.loading = true
        },
        updateUserSuccess : (state,action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error =null;
        },
        updateUserFailure : (state,action) =>{
            state.loading = false;
            state.error = action.payload
        },
        deleteUserStart : (state) =>{
            state.loading = true
        },
        deleteUserSuccess : (state,action) =>{
            state.currentUser = null;
            state.loading = false;
            state.error =null;
        },
        deleteUserFailure : (state,action) =>{
            state.loading = false;
            state.error = action.payload
        },
        signOutStart: (state, action) => {
            state.loading = true;
          },
        signOutFailure : (state,action) =>{
            state.loading = false;
            state.error =action.payload;
        },
        signOutSuccess : (state,action) =>{
            state.currentUser = null;
            state.loading = false;
            state.error =null;
        }

     }
})


export const {signStart, 
    signInSuccess,
    signInFailure,signUpSuccess,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure ,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure ,
    signOutStart,
    signOutSuccess,
    signOutFailure 
} = userSlice.actions

export default userSlice.reducer; 