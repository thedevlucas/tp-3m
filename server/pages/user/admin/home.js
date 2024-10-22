module.exports = (router, database) => 
{
    router.get('/', async (req, res) => {
        res.render('admin/home', {content: "panel" });
    });
}