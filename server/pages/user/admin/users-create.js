const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/users/create', async (req, res) => {
        req.session.token = uuidv4();
        res.render('admin/home', { content: "users-create" });
    });
    router.post('/users/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/users/create'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const body = req.body;
        const con = mysql.createConnection(database);
        
        try {
            const passwordHashed = bcrypt.hashSync(body.password, 10);
            const [results_insert] = await con.promise().query('INSERT INTO users SET ?', {username: body.username, password: passwordHashed});
            const [results_insert2] = await con.promise().query('INSERT INTO stores SET ?', {user: results_insert.insertId, address: body.address}); 

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Usuario creado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/users/create'
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
                    ruta: 'admin/users/create'
                }
            });
        } finally {
            con.end();
        }
    });
}