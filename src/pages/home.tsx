import React from 'react';
import { isLoggedInVar } from '../apollo';

const Home = () => {
  const onClick = () => {
    localStorage.removeItem('token');
    isLoggedInVar(false);
  };

  return (
    <div>
      <h1>Logged In</h1>
      <button onClick={onClick}>Click to loginout</button>
    </div>
  );
};

export default Home;
