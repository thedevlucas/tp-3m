const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../functions/functions');
const auth = require('../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/pedidos/view/:id', async (req, res) => {
        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, p.name, o.quantity, p.description, p.img, o.status FROM orders o JOIN stores s ON s.id = o.store JOIN products p ON p.id = o.product WHERE o.id = ?', [params.id]);

            req.session.token = uuidv4();
            res.render('user/home', { content: "pedidos-view", order: results[0] });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/pedidos/check/:id', async (req, res) => {
        const params = req.params;
        if (!req.session.token || usedTokens.has(req.session.token) || params.id == undefined) {
            return res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/paletizador/pedidos'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const con = mysql.createConnection(database);

        try {
            const [results_update] = await con.promise().query('UPDATE orders SET status = 1 WHERE id = ?', [params.id]);

            res.render('user/home', { 
                alert: {
                    title: 'Success',
                    message: 'Pedido confirmado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'user/pedidos/'
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
                    ruta: 'user/pedidos'
                }
            });
        } finally {
            con.end();
        }
    });
}