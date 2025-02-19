import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  username: "",
  password: "",
  isLoggedIn: false,
};

const initialPostState = {
  posts:[],
}

export const userSlice = createSlice({
  name: "user",
  initialState:initialUserState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setLogIn: (state, action) => {
        state.username = action.payload.username;
        state.password = action.payload.password;
        state.isLoggedIn = action.payload.isLoggedIn;
    },
    setLogOut:(state)=>{
      state.username="";
      state.password="";
      state.isLoggedIn=false;
    }
  },
});

export const postSlice = createSlice({
  name:"post",
  initialState:initialPostState,
  reducers:{
    addPost: (state, action) => {
      const newPosts = action.payload.filter(post => 
        !state.posts.some(existingPost => existingPost.postId === post.postId)
      );
      state.posts.push(...newPosts);  
    },    
    deletePost:(state,action) => {
      state.posts = state.posts.filter((post)=>post.postId !== action.payload);
    },
    updatePost:(state,action) => {
      const {postId,title,content}=action.payload;
      const index = state.posts.findIndex((post) => post.postId===postId);
      if(index !== -1){
        state.posts[index] = {...state.posts[index],title,content}
      }
    },
    clearPost:(state)=>{
      state.posts=[];
    }
  }
})

export const { setUsername, setPassword, setLogIn, setLogOut } = userSlice.actions;
export const { addPost,deletePost,updatePost,clearPost} = postSlice.actions;

export const userReducer = userSlice.reducer;
export const postReducer = postSlice.reducer;