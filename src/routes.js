import React from 'react';

const Skills = React.lazy(() => import('./views/Skills/Skills'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Accounts = React.lazy(() => import('./views/Accounts/Accounts'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/skills', exact: true, name: 'Skills', component: Skills },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/accounts', exact: true, name: 'Accounts', component: Accounts }
];

export default routes;
