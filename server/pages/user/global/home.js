const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        const token = functions.getCookie(req, "token")
        if (auth.isAuthenticated(token)) return res.redirect(auth.isAllowed(auth.getUser(token).group, 'admin') ? '/admin' : '/user');
        const result = await auth.login(req, res, {token: token});
        if (result.status) return res.redirect(auth.isAllowed(result.data.group, 'admin') ? '/admin' : '/user');

        res.render('global/home', {});
    });
}