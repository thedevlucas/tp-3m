const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../functions/functions');
const auth = require('../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/products', async (req, res) => {
        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('SELECT p.id, p.name, p.quantity, p.min, p.max, p.description, p.img FROM products p JOIN stores s ON s.id = p.store');

            req.session.token = uuidv4();
            res.render('admin/home', { content: "products", products: results });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/products/update', async (req, res) => {
        if (!req.session.token || usedTokens.has(req.session.token)) {
            return res.render('admin/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'admin/products'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const con = mysql.createConnection(database);
        const body = req.body
   
        try {
            const [results_update] = await con.promise().query(`UPDATE products SET quantity = CASE ? END WHERE id IN (?)`, [body.id.map((id, index) => `WHEN id = ${con.escape(id)} THEN ${con.escape(body.quantity[index])}`).join(' '), body.id.map(id => con.escape(id)).join(',')]);

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Productos actualizados exitosamente',
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
                    ruta: 'admin/products'
                }
            });
        } finally {
            con.end();
        }
    });
    router.get('/products/delete/:id', async (req, res) => {
        const params = req.params;
        if (params.id == undefined) return res.status(404);

        const con = mysql.createConnection(database);
        
        try {
            const [results] = await con.promise().query('DELETE FROM products WHERE id = ?', [params.id]);

            res.render('admin/home', { 
                alert: {
                    title: 'Success',
                    message: 'Producto eliminado exitosamente',
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
                    ruta: 'admin/products'
                }
            });
        } finally {
            con.end();
        }
    });
}