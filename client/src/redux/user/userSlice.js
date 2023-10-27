import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode : "light",
    currentUser : null,
    loading : false,
    error : null,
    posts: [],
}

const userSlice = createSlice({
     name: "user",
     initialState,
     reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
          },
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
        },
        setFriends :(state,action) =>{
            if(state.currentUser){
                state.loading = false;
                state.error =null;
                state.currentUser.friends = action.payload.friends 
            }
            else{
                console.log("no user friends")
            }
            
        },
        setPosts :(state,action) =>{
            state.loading = false;
            state.error =null;
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
              if (post._id === action.payload.post._id) return action.payload.post;
              return post;
            });
            state.posts = updatedPosts;
          },
       createPostFailure:(state,action)=>{
        state.loading = false;
        state.error =action.payload;
        state.posts = null;
       }

     }
})


export const {
    setMode,
    signStart, 
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
    signOutFailure,
    setFriends,
    setPosts,
    setPost ,
    createPostFailure
} = userSlice.actions

export default userSlice.reducer; 