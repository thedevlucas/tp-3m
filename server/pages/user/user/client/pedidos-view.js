const mysql = require('mysql2');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/pedidos/view/:id', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'cliente') return res.status(404);

        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT id, status, code, `order` FROM orders WHERE id = ?', [params.id]);
            const [results2] = await con.promise().query('SELECT date, newStatus, comments FROM orders_logs WHERE `order` = ?', [params.id]);

            let order = results[0];
            order.logs = results2;

            res.render('user/home', { content: "client/pedidos-view", order: order });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}