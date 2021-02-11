import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isLoggedInVar, authTokenVar } from '../apollo';

export const Header = () => {
  const history = useHistory();
  const [term, setTerm] = useState('');

  const logout = () => {
    localStorage.removeItem('token');
    isLoggedInVar(false);
    authTokenVar(null);
    history.push('/');
    window.location.reload();
  };

  const onChage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const onKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (term.length > 0) history.push(`/search/${term}`);
      else history.push(`/`);
    }
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-lime-200">
      <div className="flex items-center justify-center">
        <Link
          to="/"
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg mr-10"
        >
          <svg
            className="w-6 h-6 text-lime-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            ></path>
          </svg>
        </Link>
      </div>
      <div>
        <input
          type="text"
          className="input p-2"
          onKeyUp={onKeyup}
          onChange={onChage}
        />
      </div>
      <div className="flex text-xs">
        <a href="/edit-profile" className="mr-2 smBtn">
          Edit Profile
        </a>
        <button className="smBtn" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
};
