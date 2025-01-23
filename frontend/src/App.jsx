import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';
import LoginUser from './pages/UserLogin/Login';
import RegisterUser from './pages/UserLogin/Register';
import Form from './components/Form';



function App() {
  return (
    //Routing stuff
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/user/login" element={ < LoginUser/> } />
        <Route path="/user/register" element={ <RegisterUser/> } />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
