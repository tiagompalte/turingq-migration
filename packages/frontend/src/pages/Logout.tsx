import React from 'react';
import { Grid } from '@material-ui/core';

import Page from '../components/Page';
import { KeycloakLogoutRedirect } from '../components/LogoutRedirect';

const Logout: React.FC = () => (
  <Page title="Logging out...">
    <Grid container item xs={12} direction="row" justifyContent="center">
      <KeycloakLogoutRedirect />
    </Grid>
  </Page>
);

export default Logout;
