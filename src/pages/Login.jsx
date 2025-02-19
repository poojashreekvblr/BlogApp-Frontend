import { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import '../css/Login.css';
import axios from "axios";
import { setLogIn, setPassword, setUsername } from "../redux-mgmt/CreateSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setUsername(""));
    dispatch(setPassword(""));
  }, [dispatch]);

  const formData = useSelector((state) => state.user || { username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') dispatch(setUsername(value));
    else if (name === 'password') dispatch(setPassword(value)); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      alert('All fields required');
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/users/login", {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        dispatch(setLogIn({ username, password,isLoggedIn:true }));
        const token = response.data.accessToken; 
        localStorage.setItem('token', token);
        navigate("/"); 
      } else {
        const errorMessage = response.data.message || 'Login failed. Please try again.';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);

      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="main-container">
      <h1>User Login</h1>
      <form id="form" onSubmit={handleSubmit}>
        <label className="label">Username:
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
        </label>
        <label className="label">Password:
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div className="redirection">
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
};

export default Login;
