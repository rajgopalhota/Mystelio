import React from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Sidebar from './Components/Sidebar';
import './Styles/App.css';
import './Styles/Sidebar.css';
import './Styles/UiVerse.css';

const App = () => {
  return (
    <div className='theme-dark'>
      <Sidebar />
      <section className="content">
        <h1>Mystelio App</h1>
        <Login />
        <Signup />
      </section>
    </div>
  );
};

export default App;
