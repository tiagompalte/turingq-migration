import { RouteProps } from 'react-router-dom';

import Home from '../pages/Home';
import SignUp from '../pages/SignUp';
import Login from '../pages/Login';
import Logout from '../pages/Logout';
import Question from '../pages/Question';
import NewQuestion from '../pages/NewQuestion';
import Ranking from '../pages/Ranking';

export interface MyRouteProps extends RouteProps {
  name: string;
  label: string;
}

const routes: MyRouteProps[] = [
  {
    name: 'home',
    label: 'Home',
    path: '/',
    component: Home,
    exact: true,
  },
  {
    name: 'askQuestion',
    label: 'Ask Question',
    path: '/questions/new',
    component: NewQuestion,
    exact: true,
  },
  {
    name: 'questions',
    label: 'Question Details',
    path: '/questions/:id',
    component: Question,
    exact: true,
  },
  {
    name: 'ranking',
    label: 'Ranking',
    path: '/ranking',
    component: Ranking,
    exact: true,
  },
  {
    name: 'signup',
    label: 'Sign up',
    path: '/signup',
    component: SignUp,
    exact: true,
  },
  {
    name: 'login',
    label: 'Login',
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    name: 'logout',
    label: 'Logout',
    path: '/logout',
    component: Logout,
    exact: true,
  },
];

export default routes;
