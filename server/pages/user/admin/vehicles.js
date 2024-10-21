const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/vehicles', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT id, username, `group`, name, lastname FROM users');

            res.render('admin/home', { content: "vehicles", users: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}