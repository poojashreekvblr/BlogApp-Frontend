import { useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import '../css/CreatePost.css';
import {useSelector } from "react-redux";

const CreatePost = () => {
  const username = useSelector((state)=>state.user.username);

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    }
  });

  const [input, setInput] = useState({
    title: "",
    content: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { title, content } = input;

    if (!title || !content) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "http://localhost:8080/posts",
        {
          title,
          content,
          username: username, 
        });

      if (response.status === 200) {
        alert("Post created successfully");
        setInput({
          title:"",
          content:""
        })
      } else {
        console.log(response.data);
        alert(response.data || "Could not create a post");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response);
        const msg = error.response.data || "Error occurred while creating a post";
        alert(msg);
      } else {
        alert("Network error occurred");
      }
    }
  };

  return (
    <>
      <Header />
      <div>
        <form onSubmit={handleSubmit} id="create-container">
          <label className="label">
            Title:
            <input
              type="text"
              name="title"
              id="title"
              maxLength={50}
              value={input.title}
              onChange={handleInputChange}
            />
          </label>
          <label className="label">
            Content:
            <textarea
              name="content"
              id="content"
              value={input.content}
              minLength={20}
              maxLength={200}
              onChange={handleInputChange}
              rows="10"
              cols="50"
            />
          </label>
          <button type="submit" id="post-submit">
            Create
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
