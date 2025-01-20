import React from 'react';
import Form from '../components/Form';
import AdminDashboard from '../components/AdminDashboard';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Interview Scheduler</h1>
      <Form />
      <AdminDashboard />
    </div>
  );
};

export default Home;
