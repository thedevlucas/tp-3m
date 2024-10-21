const mysql = require('mysql2');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    router.get('/conductor/vehiculos', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'conductor') return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT * FROM vehicles');

            res.render('user/home', { content: "driver/vehicles", vehicles: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
}