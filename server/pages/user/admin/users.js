const mysql = require('mysql2');

module.exports = (router, database) => 
{
    router.get('/users', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT u.id AS userId, s.id AS storeId, u.username, s.address FROM users u JOIN stores s ON s.user = u.id');

            res.render('admin/home', { content: "users", users: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.get('/users/delete/:id', async (req, res) => {
        const params = req.params;
        if (params.id == undefined) return res.status(404);

        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('DELETE FROM users WHERE id = ?', [params.id]);

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Usuario eliminado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/users'
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
                    ruta: 'admin/users'
                }
            });
        } finally {
            con.end();
        }
    });
}