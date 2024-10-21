const config = require('../config.json');

const fs = require('fs');

const express = require('express');

const router = express.Router();
const routerUser = express.Router();
const routerDriver = express.Router();
const routerPallete = express.Router();
const routerLogistic = express.Router();
const routerAdmin = express.Router();
const routerAPI = express.Router();

const functions = require('./functions/functions');
const auth = require('./functions/auth');

const isAuthenticated = async (req, res, next) => {
    let isAuthenticated = auth.isAuthenticated(functions.getCookie(req, 'token'));
    if (isAuthenticated) return next();

    res.redirect(`/`);
};

routerUser.use(isAuthenticated);

const isAllowed = async (req, res, next) => {
    let userData = auth.getUser(functions.getCookie(req, 'token'));
    let isAllowed = auth.isAllowed(userData.group, 'admin');
    if (isAllowed) return next();

    res.redirect(`/`);
};

routerAdmin.use(isAuthenticated, isAllowed);

//Database Info
const database = {
    host: config.db.host, 
    user: config.db.user, 
    password: config.db.pass,
    database: config.db.db
}

//Pages loader
let files = fs.readdirSync('./server/pages/api').filter(file => file.endsWith('.js'));
for (let x of files) 
{
    const Event = require(`./pages/api/${x}`);
    Event(routerAPI, database)
}

files = fs.readdirSync('./server/pages/user/global').filter(file => file.endsWith('.js'));
for (let x of files) 
{
    const Event = require(`./pages/user/global/${x}`);
    Event(router, database)
}

files = fs.readdirSync('./server/pages/user/user')
for (let x of files) 
{
    if (x.endsWith('.js'))
    {
        const Event = require(`./pages/user/user/${x}`);
        Event(routerUser, database) 
    }
    else
    {
        files = fs.readdirSync('./server/pages/user/user/' + x).filter(file => file.endsWith('.js'));
        for (let x2 of files) 
        {
            const Event = require(`./pages/user/user/${x}/${x2}`);
            Event(routerUser, database) 
        }
    }
}


files = fs.readdirSync('./server/pages/user/admin')
for (let x of files) 
{
    if (x.endsWith('.js'))
    {
        const Event = require(`./pages/user/admin/${x}`);
        Event(routerAdmin, database) 
    }
    else
    {
        files = fs.readdirSync('./server/pages/user/admin/' + x).filter(file => file.endsWith('.js'));
        for (let x2 of files) 
        {
            const Event = require(`./pages/user/admin/${x}/${x2}`);
            Event(routerAdmin, database) 
        }
    }
}

//on Exit
process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options, exitCode) {
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log('exitCode', exitCode);
    if (options.exit) console.log('exit'), process.exit();

}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = {router, routerUser, routerDriver, routerPallete, routerLogistic, routerAdmin, routerAPI};