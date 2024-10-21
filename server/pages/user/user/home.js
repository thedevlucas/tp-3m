module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        res.render('user/home', { content: "panel" });
    });
}