const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../functions/functions');
const auth = require('../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/pedidos/create', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT p.id, p.name, p.quantity, p.description, p.img FROM products p JOIN stores s ON s.id = p.store');

            req.session.token = uuidv4();
            res.render('admin/home', { content: "pedidos-create", products: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/pedidos/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/pedidos/create'
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
                    ruta: 'admin/pedidos/' + results_insert.insertId 
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
                    ruta: 'admin/pedidos/create'
                }
            });
        } finally {
            con.end();
        }
    });
}