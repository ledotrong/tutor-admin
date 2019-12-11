import React from "react";

const Projects = React.lazy(() => import("./views/Projects/Projects"));
const Skills = React.lazy(() => import("./views/Skills/Skills"));
const Users = React.lazy(() => import("./views/Users/Users"));
const User = React.lazy(() => import("./views/Users/User"));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/projects", exact: true, name: "Projects", component: Projects },
  { path: "/skills", exact: true, name: "Skills", component: Skills },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/users/:id", exact: true, name: "User Details", component: User }
];

export default routes;
