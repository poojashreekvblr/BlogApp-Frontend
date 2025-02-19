import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/create-post' element={<CreatePost/>}/>
      <Route path='/view-posts' element={<ViewPost/>}/>
    </Routes>
    </BrowserRouter>
 
  );
}

export default App;
