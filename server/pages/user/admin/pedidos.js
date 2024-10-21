const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/pedidos', async (req, res) => {        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT o.id, s.name, o.order, o.date, o.status FROM orders o JOIN stores s ON s.id = o.store');

            res.render('admin/home', { content: "pedidos", orders: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}