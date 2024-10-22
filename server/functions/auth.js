const config = require('../../config.json');
const functions = require('./functions');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcrypt = require("bcryptjs");

//Database Info
const database = {
    host: config.db.host, 
    user: config.db.user, 
    password: config.db.pass,
    database: config.db.db
};

//Groups
const groups = [
    'admin',
    'user'
];

module.exports.clientData = [];
let sequence = 1;

module.exports.login = async (req, res, loginInfo) => 
{
    if (!loginInfo) return {status: false, err: 10, info: "Empty data"};
    if (!(loginInfo.username && loginInfo.password) && !loginInfo.token) return {status: false, err: 11, info: "Empty data"};

    const con = mysql.createConnection(database);
        
    try {
        let token;
        let sessionId;
        let query = `SELECT * FROM users WHERE username = ${con.escape(loginInfo.username)}`;

        if (loginInfo.token)
        {
            
            let decodedToken = jwt.verify(loginInfo.token, config.auth.secret);

            if (!decodedToken.id && !decodedToken.sessionId)
            {
                return {status: false, err: 1, info: "Bad token"};
            }

            token = loginInfo.token;
            sessionId = decodedToken.sessionId;

            query = `SELECT *, u.id, s.id AS sessionId FROM users u JOIN sessions s on u.id = s.userId WHERE s.id = ${decodedToken.sessionId}`;
        }

        const [results, fields] = await con.promise().query(query);
        let result = results[0];

        if (!result) return {status: false, err: 1, info: "User not found"};
        if (loginInfo.password)
        {
            if (!await bcrypt.compare(loginInfo.password, result.password)) return {status: false, err: 4, info: "Incorrect password"};
        } 

        if (!token) {
            //Check active sessions
            // const [sessions_results] = await con.promise().query(`SELECT id FROM sessions WHERE userId = ${result.id}`);
            
            // if (sessions_results.length >= 3) 
            // {
            //     await con.promise().query(`DELETE FROM sessions WHERE userId = ${result.id}`);
            //     this.clientData = this.clientData.filter(user => user.id !== result.id);
            // }

            //Create new session
            const [sessions_insert_results] = await con.promise().query(`INSERT INTO sessions SET ?`, {userId: result.id, device: req.useragent.platform, application: req.useragent.browser, ip: functions.getIp(req)});
            
            //Create token
            token = jwt.sign({id: result.id, username: result.username, sessionId: sessions_insert_results.insertId}, config.auth.secret, {})
            sessionId = sessions_insert_results.insertId;

            res.cookie("token", token, {
                expires: new Date("01-01-5000")
            })
        }

        this.clientData.push({
            res,
            group: result.group,
            id: result.id,
            sessionId: sessionId,
            token: token,
            clientNo: sequence++
        });

        return {status: true, err: 0, info: "Logged successfully", data: {id: result.id, token: token, group: result.group}};
    } catch (error) {
        console.error(error);
        return {status: false, err: 500, info: "Server error"};
    } finally {
        con.end();
    }
}

module.exports.logout = async (token, all) => 
{
    const con = mysql.createConnection(database);

    try {
        let decodedToken = jwt.verify(token, config.auth.secret);
      
        if (!decodedToken.id && !decodedToken.sessionId) return false;

        if (all)
        {
            const [results] = await con.promise().query(`SELECT u.id FROM users u JOIN sessions s on u.id = s.userId WHERE s.id = ${decodedToken.sessionId}`);
            let result = results[0];
            if (result) return false;

            this.clientData = this.clientData.filter(user => user.id !== result.id);
            const [results2, fields2] = await con.promise().query(`DELETE FROM sessions WHERE userId = ${result.id}`);
            if (results2.affectedRows == 0) return false;
        }
        else 
        {
            this.clientData = this.clientData.filter(user => user.token !== token);
            const [results] = await con.promise().query(`DELETE FROM sessions WHERE id = ${decodedToken.sessionId}`);
            if (results.affectedRows == 0) return false;
        }
        
        return true;
    } catch (error) {
        console.error(error)
        return false;
    } finally {
        con.end();
    }
}

module.exports.logoutData = async (data) =>
{
    if (data == undefined) return false;

    for (let user of this.clientData)
    {
        try {
            let decodedToken = jwt.verify(user.token, config.auth.secret);

            if (decodedToken.cuil == data || decodedToken.id == data)
            {
                return await this.logout(user.token);
            }
        }
        catch (error) 
        { 
            console.error(error);
            return await this.logout(user.token);
        }
    }

    return false;
}

module.exports.logoutSession = async (req, id) =>
{
    if (id == undefined) return false;

    const con = mysql.createConnection(database);
    try {
        let token = functions.getCookie(req, "token");
        let decodedToken = jwt.verify(token, config.auth.secret);

        const [results] = await con.promise().query(`DELETE FROM sessions WHERE id = ${con.escape(id)} AND userId = '${decodedToken.id}'`);
        
        if (results.affectedRows == 0) return false;

        this.clientData = this.clientData.filter(x => x.sessionId != id);

        return true;
    } catch (error) {
        console.error(error);
    } finally {
        con.end();
    }

    return false;
}

module.exports.getUser = (token) => {
    if (token === undefined) return false;

    let user = this.clientData.find(user => user.token === token);
    if (user === undefined) return true;
    
    return user;
}

module.exports.isAuthenticated = (token) =>
{
    if (token == undefined) return false;

    let user = this.clientData.find(user => user.token === token);
    return user !== undefined;
}

module.exports.isAllowed = (userGroup, requireRole) => {
    if (!userGroup || !requireRole) return false;
    return groups.indexOf(userGroup) <= groups.indexOf(requireRole)
}