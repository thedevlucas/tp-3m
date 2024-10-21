const auth = require('../../functions/auth');
const functions = require('../../functions/functions');
 
module.exports = (router) => 
{
    router.get('/logout', async (req, res) => {
        await auth.logout(functions.getCookie(req, 'token'));
        res.redirect("/");
    });

    router.get('/logout/session', async (req, res) => {
        let query = req.query;
        res.send(await auth.logoutSession(req, query.id));
    });

    router.get('/logout/all', async (req, res) => {
        await auth.logout(functions.getCookie(req, 'token'), true);
        res.redirect("/");
    });
}