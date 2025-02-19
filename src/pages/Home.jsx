import { useEffect, useState } from 'react';
import '../css/Home.css'; 
import axios from 'axios';
import Header from '../components/Header';

const Home = () => {
  const [posts,setPosts]=useState([]);
  useEffect(()=>{
    const getPosts =async()=>{
        try{
             const response = await axios.get("http://localhost:8080/posts");

             const dateResponse=response.data.map(post=>({
              ...post,
              createdAt:new Date(post.createdAt)
             }));
             setPosts(dateResponse);
        }catch(error){
            console.log(error);
        }
  };
  getPosts();
  }
    ,[]);

 
  return (
    <>
    <Header/>
      <div className="home-content">
        <h2>Welcome to the Blog App</h2>
        {posts.length>0 && 
        <div className='post-list'>
            {posts.sort((a,b)=>{
              if(new Date(b.createdAt) > new Date(a.createdAt)) {
                return 1;
               }
               return -1;
            }).
            map((post)=>{
              return(
                <div key={post.id || post.title} className='post-item'>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <h5>Author:{post.username}</h5>
                    <h6>Created On:{post.createdAt.toDateString()}</h6>
                </div>
              )
            })}
        </div>
        }
      </div>
    </>
  );
};

export default Home;
