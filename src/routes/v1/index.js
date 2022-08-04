const express = require('express');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const itemRoute = require('./item.route');


const routes = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/items',
        route: itemRoute
    }
]

defaultRoutes.forEach((route) => {
    routes.use(route.path, route.route);
})


module.exports = routes;
