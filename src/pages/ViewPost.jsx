import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../css/ViewPost.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addPost, deletePost, updatePost } from "../redux-mgmt/CreateSlice";

const ViewPost = () => {
  const posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const [editingPost, setEditingPost] = useState(null);
  const username = useSelector((state) => state.user.username);
  const [editData, setEditData] = useState({ title: "", content: "", username });

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
    }
  });

  useEffect(() => {
    const fetchPosts = async (username) => {
      try {
        const response = await axiosInstance.get(`http://localhost:8080/posts/${username}`);
        const dateResponse = response.data.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt).toISOString(),
        }));
        dispatch(addPost(dateResponse));
      } catch (error) {
        console.log("Error fetching posts:", error);
      }
    };

    fetchPosts(username);
  }, [username, dispatch,axiosInstance]);


  const handleEdit = (postId, title, content) => {
    setEditingPost(postId);
    setEditData({ title, content, username });
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    const { title, content, username } = editData;

    if (!title || !content) {
      alert("All fields are required.");
      return;
    }

    try {

      const res = await axiosInstance.put(`http://localhost:8080/posts/update/${editingPost}`, { title, content, username });

      dispatch(updatePost({ postId: editingPost, title, content }));

      setEditingPost(null);
      setEditData({ title: "", content: "", username });

      alert(`${res.data}`);
    } catch (error) {
      console.log("Error editing post:", error);
      alert(error.response?.data || "Failed to update post");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`http://localhost:8080/posts/delete/${id}`,{ withCredentials: true });
      dispatch(deletePost(id));

      if (res.status === 200) {
        alert("Deleted successfully");
      } else {
        alert(`${res.data}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`Error details: ${error.response.data}`);
        alert(`${error.response.data}`);
      }else{
        alert("Network error!!!");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="home-content">
        <h2>Your posts</h2>
        {editingPost ? (
          <div className="edit-form">
            <h3>Edit Post</h3>
            <form onSubmit={handleSubmitEdit}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Content:
                <textarea
                  name="content"
                  value={editData.content}
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Update Post</button>
              <button type="button" onClick={() => setEditingPost(null)}>
                Cancel
              </button>
            </form>
          </div>
        ) : (
          <div className="post-list">
            {posts.length === 0 ? (
              <p id="no-data">No posts available</p>
            ) : (
              posts.map((post) => (
                <div key={post.postId} className="post-item">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <h6>{new Date(post.createdAt).toDateString()}</h6>
                  <div id="button">
                  <button onClick={() => handleEdit(post.postId, post.title, post.content)} id="edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.postId)} id="delete">
                    Delete
                  </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewPost;
