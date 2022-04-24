import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext';
import KeycloakLogin from './KeycloakLogin';

const LoginForm: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (authContext.loggedIn) {
    return <Redirect to="/" />;
  }

  return <KeycloakLogin />;
};

export default LoginForm;
