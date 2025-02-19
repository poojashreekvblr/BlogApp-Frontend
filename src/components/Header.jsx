import { useNavigate, Link } from 'react-router-dom'; 
import '../css/Header.css'; 
import { useDispatch, useSelector } from 'react-redux';
import { clearPost, setLogOut } from '../redux-mgmt/CreateSlice';

const Header = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSignout = () => {
    dispatch(setLogOut());
    dispatch(clearPost());
    navigate('/login'); 
  };

  return (
    <div className='home-container'>
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Blog App</h1>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {isLoggedIn ? (
            <>
              <Link to="/create-post" className="nav-link">Create Post</Link>
              <Link to="/view-posts" className="nav-link">View Posts</Link>
              <Link to="/" className="nav-link" onClick={handleSignout}>Sign Out</Link>
            </>
          ) : (
            <Link to="/login" className="nav-link">Sign In</Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
