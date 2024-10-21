const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const functions = require('../../../../functions/functions');
const auth = require('../../../../functions/auth');

module.exports = (router, database) => 
{
    const usedTokens = new Set();

    router.get('/conductor/vehiculos/view/:id', async (req, res) => {
        const user = auth.getUser(functions.getCookie(req, 'token'));
        if (user.group != 'conductor') return res.status(404);

        const params = req.params;
        if (params.id == undefined) return res.status(404);
        
        const con = mysql.createConnection(database);
        
        try {
            const [results2] = await con.promise().query('SELECT o.id, o.order, s.address, o.status FROM trips t JOIN orders o ON o.id = t.order JOIN stores s ON s.id = o.store WHERE t.vehicle = ? ORDER BY o.status DESC', [params.id]);
            const [results3] = await con.promise().query('SELECT `order`, comments FROM orders_logs WHERE newStatus = 2');
            
            const trips = results2.map(result => {
                const comment = results3.find(c => c.order === result.id);
                return {
                    ...result,
                    comments: comment ? comment.comments.replace(/[\r\n]+/g, '') : "N/A"
                };
            });

            req.session.token = uuidv4();
            res.render('user/home', { content: "driver/trips", trips: trips });
        } catch (error) {
            console.error(error);
        } finally {
            con.end();
        }
    });
    router.post('/conductor/vehiculos/check/:vehicle/:id', async (req, res) => {
        const params = req.params;
        if (!req.session.token || usedTokens.has(req.session.token) || params.id == undefined) {
            return res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Invalid session token',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/conductor/vehiculos'
                }
            });
        } else { usedTokens.add(req.session.token); }

        const user = auth.getUser(functions.getCookie(req, 'token'));
        const con = mysql.createConnection(database);
        const body = req.body;

        try {
            if (body.code == 'start')
            {
                const [results_select] = await con.promise().query('SELECT o.id FROM trips t JOIN orders o ON o.id = t.order WHERE t.vehicle = ? ORDER BY o.status DESC', [params.vehicle]);
                
                if (results_select.length == 0)
                {
                    res.render('user/home', { 
                        alert: {
                            title: 'Error',
                            message: 'No hay viajes disponibles',
                            icon: 'error',
                            time: 3000,
                            ruta: 'user/conductor/vehiculos/view/' + params.vehicle
                        }
                    }); 
                    return;
                }
                
                const [results_update] = await con.promise().query('UPDATE orders SET status = 3 WHERE id = ?', [results_select[0].id]);
                const [results_insert2] = await con.promise().query('INSERT INTO orders_logs SET ?', {order: results_select[0].id, user: user.id, newStatus: 3});
            }
            else
            {
                const [results_select] = await con.promise().query('SELECT o.code FROM orders o JOIN trips t ON t.order = o.id WHERE t.order = ? AND o.code = ?', [params.id, body.code])
                
                if (results_select.length == 0)
                {
                    res.render('user/home', { 
                        alert: {
                            title: 'Error',
                            message: 'Codigo incorrecto',
                            icon: 'error',
                            time: 3000,
                            ruta: 'user/conductor/vehiculos/view/' + params.vehicle
                        }
                    }); 
                    return;
                }

                const [results_update] = await con.promise().query('UPDATE orders SET status = 4 WHERE id = ?', [params.id]);
                const [results_insert2] = await con.promise().query('INSERT INTO orders_logs SET ?', {order: params.id, user: user.id, newStatus: 4});
                const [results_select2] = await con.promise().query('SELECT o.id FROM trips t JOIN orders o ON o.id = t.order WHERE t.vehicle = ? AND o.status = 2 ORDER BY o.status DESC', [params.vehicle]);
                if (results_select2.length > 0)
                {
                    const [results_update2] = await con.promise().query('UPDATE orders SET status = 3 WHERE id = ?', [results_select2[0].id]);
                }
            }

            res.render('user/home', { 
                alert: {
                    title: 'Success',
                    message: 'Pedido confirmado exitosamente',
                    icon: 'success',
                    time: 2000,
                    ruta: 'user/conductor/vehiculos/view/' + params.vehicle
                }
            });
        } catch (error) {
            console.error(error);

            res.render('user/home', { 
                alert: {
                    title: 'Error',
                    message: 'Server error',
                    icon: 'error',
                    time: 5000,
                    ruta: 'user/conductor/vehiculos'
                }
            });
        } finally {
            con.end();
        }
    });
}