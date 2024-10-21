const mysql = require('mysql2');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/paletizador/pedidos', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'paletizador') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, s.name, o.order, o.date, o.status FROM orders o JOIN stores s ON s.id = o.store WHERE o.status = 0');

            res.render('user/home', { content: "pallete/pedidos", orders: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}