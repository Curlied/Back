const router = require('express').Router();
const authRoute = require('./authentication.route');
const roleRoute = require('./role.route');
const eventRoute = require('./event.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/categories',
    route: categoryRoute,
  },
  {
    path: '/events',
    route: eventRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;