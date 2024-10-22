const auth = require('../../../functions/auth');
const functions = require('../../../functions/functions');

module.exports = (router, database) => 
{
    router.post('/login', async (req, res) => {
        const body = req.body;
        const result = await auth.login(req, res, {username: body.username, password: body.password})
        if (!result.status) return res.render('global/home', {  includes: 'login', error: result.info });

        if (auth.isAllowed(result, 'admin')) return res.redirect(`/admin`);
        res.redirect(`/user`);
    });
}