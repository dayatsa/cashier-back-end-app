const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const { route } = require('./user.route');


const routes = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    }
]

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
})

// Add routes

// routes.post('/', SessionController.store);
// routes.put('/', SessionController.store);
// routes.delete('/', SessionController.store);

module.exports = routes;
