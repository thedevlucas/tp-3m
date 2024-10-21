const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/logistica/pedidos/view/:id', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'logistica') return res.status(404);

        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, s.name, s.address, o.order, o.status FROM orders o JOIN stores s ON s.id = o.store WHERE o.id = ?', [params.id]);
            const [results2] = await con.promise().query('SELECT * FROM vehicles');
            const [results3] = await con.promise().query('SELECT comments FROM orders_logs WHERE `order` = ? AND newStatus = 1', params.id);

            let order = results[0];
            order.comments = results3[0].comments ? results3[0].comments : 'N/A';

            let comments;
            if (results[0].status >= 2)
            {
                const [results3] = await con.promise().query('SELECT comments FROM orders_logs WHERE `order` = ? AND newStatus = 2', params.id);
                comments = results3[0].comments;
            }

            req.session.token = uuidv4();
            res.render('user/home', { content: "logistic/pedidos-view", order: order, comments: comments, vehicles: results2 });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/logistica/pedidos/check/:id', async (req, res) => {
        const params = req.params;
        if (!req.session.token || usedTokens.has(req.session.token) || params.id == undefined) {
            return res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/logistica/pedidos'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body

        try {
            const [results_delete] = await con.promise().query('DELETE t FROM trips t JOIN orders o ON o.id = t.order WHERE o.status = 4');
            const [results_update] = await con.promise().query('UPDATE orders SET status = 2 WHERE id = ?', [params.id]);
            const [results_insert] = await con.promise().query('INSERT INTO trips SET ?', {order: params.id, vehicle: body.vehicle});
            const [results_insert2] = await con.promise().query('INSERT INTO orders_logs SET ?', {order: params.id, user: user.id, newStatus: 2, comments: body.comments});

            res.render('user/home', { 
                alert: {
                    title: 'Success',
                    message: 'Pedido confirmado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'user/logistica/pedidos/'
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
                    ruta: 'user/logistica/pedidos'
                }
            });
        } finally {
            con.end();
        }
    });
}