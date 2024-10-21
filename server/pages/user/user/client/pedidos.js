const mysql = require('mysql2');
const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/pedidos', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'cliente') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, o.order, o.date, o.status FROM orders o JOIN stores s ON s.id = o.store WHERE s.user = ? ORDER BY (o.status = 4), o.status DESC', [user.id]);

            res.render('user/home', { content: "client/pedidos", orders: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}