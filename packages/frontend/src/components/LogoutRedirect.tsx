import React, { useContext } from 'react';
import { useKeycloak } from '@react-keycloak/web';

import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import AuthContext from '../contexts/AuthContext';

export const KeycloakLogoutRedirect: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  const authContext = useContext(AuthContext);

  if (authContext.loggedIn && initialized) {
    keycloak.logout();
  } else {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Typography variant="body1" color="textSecondary" component="p">
        You are being logged out!
      </Typography>
      <Typography variant="body1" color="textSecondary" component="p">
        You will be redirected to the home page.
      </Typography>
    </div>
  );
};

export default KeycloakLogoutRedirect;
