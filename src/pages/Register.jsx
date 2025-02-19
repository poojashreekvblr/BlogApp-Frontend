import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogIn, setPassword, setUsername } from "../redux-mgmt/CreateSlice";
import '../css/Register.css';
import axios from "axios";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strenth,setStrenth] = useState(null);

  const formData = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      dispatch(setUsername(value));
    } else if (name === "password") {
      dispatch(setPassword(value));
    }
  };

  const setPasswordStrenth = (password) => {
    let score = 0;

    if(!password)
      return '';
    if(password.lenth> 8) score+=1;

    if(/[a-z]/.test(password)) score+=1;

    if(/[A-Z]/.test(password)) score+=1;

    if(/\d/.test(password)) score+=1;

    if(/[^A-Za-z0-9]/.test(password)) score+=1;

    switch(score){
      case 0:
      case 1:
      case 2:
        return "Weak";
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
    }
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value); 
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, password } = formData;

    if (!username || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        dispatch(setLogIn({username,password,isLoggedIn:true}));
        window.location.href="/login";
      } else {
        const errorMessage =
          response.data || "Registration failed, please try again";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error response from backend:", error.response ? error.response.data : error.message);

      if (error.response) {
        const errorMessage =
          error.response.data || "Network error, please try again";
        alert(errorMessage);
      } else {
        alert("Network error, please try again");
      }
    }
  };
  return (
    <div id="main-container">
      <h1>User Registration</h1>
      <form id="form" onSubmit={handleSubmit}>
        <label className="label">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
          />
        </label>
        <label className="label">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={(e)=>{
              handleInputChange(e);
              setStrenth(setPasswordStrenth(e.target.value));
            }}
          />
        </label>
        <label className="label">
          Confirm Password:
          <input
            type="password"
            name="confirmpassword"
            value={confirmPassword || ""}
            onChange={handleConfirmPasswordChange} 
          />
        </label>
        { strenth &&
          <small id="msg" style={strenth === 'Weak' ? {color:"red"} :strenth === 'Medium' ? {color:"orange"} :{color:"green"}}>Password is :{strenth}</small>}
        <button type="submit">Submit</button>
      </form>
      <div className="redirection">
        <p>
          Already have an account?
          <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
