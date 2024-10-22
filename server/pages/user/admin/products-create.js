const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../functions/functions');
const auth = require('../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/products/create', async (req, res) => {
        req.session.token = uuidv4();
        res.render('admin/home', { content: "products-create" });
    });
    router.post('/products/create', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/products/create'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body

        try {
            const [results_select] = await con.promise().query('SELECT id FROM stores WHERE user = ?', [user.id]);
            const [results_insert] = await con.promise().query('INSERT INTO products SET ?', {store: results_select[0].id, name: body.name, quantity: body.quantity, min: body.min, max: body.max, description: body.description, img: body.img});

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Producto creado exitosamente',
                    icon: 'success',
                    time: 5000,
                    ruta: 'admin/products'
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
                    ruta: 'admin/products/create'
                }
            });
        } finally {
            con.end();
        }
    });
}