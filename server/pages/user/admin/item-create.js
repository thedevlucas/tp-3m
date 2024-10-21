const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../functions/functions');
const auth = require('../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/item/create', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'admin') return res.status(404);

        req.session.token = uuidv4();
        res.render('admin/home', { content: "item-create" });
    });
    router.post('/item/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/item/create'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body

        try {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const [results_select] = await con.promise().query('SELECT id FROM stores WHERE user = ?', [user.id]);
            const [results_insert] = await con.promise().query('INSERT INTO orders SET ?', {store: results_select[0].id, order: body.order, code: code});

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Pedido creado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/item/' + results_insert.insertId 
                }
            });
        } catch (error) {
            console.error(error);

            res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/item/create'
                }
            });
        } finally {
            con.end();
        }
    });
}