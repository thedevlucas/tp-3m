const mysql = require('mysql2');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/logistica/pedidos', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'logistica') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, s.name, o.order, o.date, o.status FROM orders o JOIN stores s ON s.id = o.store WHERE o.status = 1');

            res.render('user/home', { content: "logistic/pedidos", orders: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}