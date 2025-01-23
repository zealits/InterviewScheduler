import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './components/AdminDashboard';
import LoginUser from './pages/UserLogin/Login';
import RegisterUser from './pages/UserLogin/Register';
import Form from './components/Form';

import SlotDetail from './components/SlotDetails';
import InterviwerDetails from './components/InterviewerDetails';


function App() {
  return (
    //Routing stuff
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/login" element={ < LoginUser/> } />
        <Route path="/user/register" element={ <RegisterUser/> } />
        <Route path="/form" element={<Form />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/form" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/" element={<AdminDashboard />} /> */}
        <Route path="/slot" element={<SlotDetail/>}></Route>
        <Route path="/detail" element={<InterviwerDetails/>}></Route>
        
         
      </Routes>
    </Router>
  );
}

export default App;