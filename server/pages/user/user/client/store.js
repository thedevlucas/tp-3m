const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/store', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'cliente') return res.status(404);

        const con = mysql.createConnection(database);

        try {
            const [results_insert] = await con.promise().query('SELECT name, address FROM stores WHERE user = ?', [user.id]);

            req.session.token = uuidv4();

            res.render('user/home', { content: "client/store", store: results_insert[0] });
        } catch (error) {
            console.error(error);

            res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/store'
                }
            });
        } finally {
            con.end();
        }
    });
    router.post('/store', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/store'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body

        try {
            const [results_insert] = await con.promise().query('UPDATE stores SET ? WHERE user = ?', [{name: body.name, address: body.address}, user.id]);

            res.render('user/home', { 
                alert: {
                    title: 'Success',
                    message: 'Usuario creado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'user/store'
                }
            });
        } catch (error) {
            console.error(error);

            res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/store'
                }
            });
        } finally {
            con.end();
        }
    });
}