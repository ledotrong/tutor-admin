import React from 'react';

const Skills = React.lazy(() => import('./views/Skills/Skills'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Accounts = React.lazy(() => import('./views/Accounts/Accounts'));
const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Contracts = React.lazy(() => import('./views/Contracts/Contracts'));
const Contract = React.lazy(() => import('./views/Contracts/Contract'));

const routes = [
  { path: '/', exact: true, name: 'Dashboard', component: Dashboard },
  { path: '/skills', exact: true, name: 'Skills', component: Skills },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/accounts', exact: true, name: 'Accounts', component: Accounts },
  { path: '/contracts', exact: true, name: 'Contracts', component: Contracts },
  { path: '/contracts/:id', exact: true, name: 'Contract', component: Contract }
];

export default routes;
