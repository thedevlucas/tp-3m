const config = require('./config.json')
const express = require('express');
const session = require('express-session');
const useragent = require('express-useragent')
const morgan = require('morgan');
const path = require('path');
const app = express();

const functions = require('./server/functions/functions');
const auth = require('./server/functions/auth');

const cookieParser = require('cookie-parser');
const bp = require('body-parser');

// settings
app.set('port', config.web.port);
app.set('views', path.join(__dirname, 'client/pages'));
app.set('view engine', 'ejs');

// middlewares
app.use(bp.json({ limit: '10mb' }));
app.use(bp.urlencoded({ extended: true, limit: '10mb' }));
app.use(session({
    secret: config.auth.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(useragent.express());
app.use(cookieParser())
// app.use(morgan('dev'));

app.use((req, res, next) => {
    res.locals.getFile = function(filePath) {
        const depth = req.path.split('/').length - 1;
        const relativePath = '../'.repeat(depth) + filePath;
        return relativePath;
    };
    res.locals.getUser = function() {
        const user = auth.getUser(functions.getCookie(req, "token"));
        let userCopy = Object.assign({}, user);
        if (user == false) return user;
        userCopy.res = undefined;
        userCopy.token = undefined;
        return JSON.stringify(userCopy);
    };
    next();
});

// routes
let routes = require('./server/routes.js')
app.use(routes.router);
app.use('/user', routes.routerUser, express.static(path.join(__dirname, 'client/public/user')));
app.use('/admin', routes.routerAdmin, express.static(path.join(__dirname, 'client/public/admin')));
app.use('/api', routes.routerAPI);

// static files
app.use(express.static(path.join(__dirname, 'client/public/global')));
app.use(function(req, res, next) {
    res.status(404).send('404');
});

// listening the Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});