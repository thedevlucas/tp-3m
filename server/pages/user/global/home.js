const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        if (auth.isAuthenticated(functions.getCookie(req, "token"))) return res.redirect(`/user`);
        const result = await auth.login(req, res, {token: functions.getCookie(req, "token")});
        if (result.status) return res.redirect(auth.isAllowed(result.group, 'admin') ? '/admin' : '/user');

        res.render('global/home', {});
    });
}