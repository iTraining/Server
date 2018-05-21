var db = require('../db')
module.exports = {
    get: (req, openid) => {
        // Get an user with openid(wxid) and make token in redis
        var sql = 'SELECT * FROM member WHERE wx_id=?',
        value = [openid]
        // Database operation.
        var selector = db.operator(sql, value, function(err, result) {
            if (err) {
                console.log('[Error] ', err)
            }
            return value
        })
        return req.getConnection(selector)
    },
    create: (req, openid) => {
        // create an user with openid(wxid) and make token in redis
        var sql = 'INSERT INTO member (wx_id) VALUES (?)',
        value = [openid]
        // Database operation.
        var inserter = db.operator(sql, value, function(err, result) {
            if (err) {
                console.log('[Warning] Duplicate number.')
            }
            return value
        })
        return req.getConnection(inserter)
    } 
}