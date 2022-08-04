import React, {
  useContext,
  useState,
  useEffect,
  MouseEventHandler,
} from 'react';
import {
  IconButton,
  Link as MaterialLink,
  makeStyles,
  Menu as MaterialMenu,
  MenuItem,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import routes from '../../routes';
import AuthContext from '../../contexts/AuthContext';

const routesList = ['home', 'ranking'];

const useStyles = makeStyles((theme: Theme) => ({
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    '& > a': {
      color: 'white',
    },
  },
}));

const Menu: React.FC = () => {
  const handleOpen: MouseEventHandler<HTMLButtonElement> = (event): void =>
    setAnchorEL(event.currentTarget);
  const handleClose = (): void => setAnchorEL(null);
  const authContext = useContext(AuthContext);

  const [anchorEl, setAnchorEL] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const classes = useStyles();
  const hasSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const isOpen = Boolean(anchorEl);

  const menuRoutes = routes.filter((route) =>
    [
      ...routesList,
      ...(authContext.loggedIn ? ['logout'] : ['signup', 'login']),
    ].includes(route.name)
  );
  const validRoutes = menuRoutes.map((menuRoute) => menuRoute.name);

  // Closes the menu to prevent it from resetting its position on
  // resizing back to larger screens:
  useEffect(() => {
    if (!hasSmallScreen) {
      handleClose();
    }
  });

  return hasSmallScreen ? (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-controls="short-mainmenu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MenuIcon />
      </IconButton>

      <MaterialMenu
        id="short-mainmenu"
        open={isOpen || !hasSmallScreen}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
        onClose={handleClose}
        keepMounted
      >
        {validRoutes.map((routeName: string, key: number) => {
          const route = menuRoutes.find(
            (menuRoute) => menuRoute.name === routeName
          );

          return (
            <MenuItem
              key={key}
              component={Link}
              to={route?.path as string}
              onClick={handleClose}
            >
              {route?.label}
            </MenuItem>
          );
        })}
      </MaterialMenu>
    </>
  ) : (
    <Typography className={classes.links}>
      {validRoutes.map((routeName: string, key: number) => {
        const route = menuRoutes.find(
          (menuRoute) => menuRoute.name === routeName
        );

        return (
          <MaterialLink key={key} component={Link} to={route?.path as string}>
            {route?.label}
          </MaterialLink>
        );
      })}
    </Typography>
  );
};

export default Menu;
