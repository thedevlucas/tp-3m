const moment = require('moment');
const { JSONCookies } = require('cookie-parser');

module.exports.getIp = (req) => {
    let ip = req.ip;

    if (ip == "::1")
    {
        return "127.0.0.1"
    }

    return ip && ip.indexOf('::ffff:') > -1 ? ip.substring(7) : ip;
}

module.exports.getCookie = (req, name) =>
{
    if (!req.headers.cookie) return undefined;

    const Cookies = JSONCookies(req.headers.cookie).split('; ')

    for (var x in Cookies)
    {
        const CookieSplit = Cookies[x].split("=")

        if (CookieSplit[0] == name) return CookieSplit[1];
    }

    return undefined
}

module.exports.getTime = () => {
    const date = new Date();
    const UTC = -3

    return moment(new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (3600000 * UTC))).format('DD/MM/YYYY HH:mm:ss');
}

module.exports.getTimeDB = () => {
    const date = new Date();
    const UTC = -3

    return moment(new Date(date.getTime() + (date.getTimezoneOffset() * 60000) + (3600000 * UTC))).format('YYYY-MM-DD HH:mm:ss');
}