var crypto = require('crypto')
var db = require('../db')
// Create session, when login
var createSession = function(req, res, next) {
    // Valid the form data.
    if (req.body.number === undefined 
        || req.body.password === undefined) {
        res.status(500).send('Internal Server Error. Wrong post formal.')
        return
    }

    // Get md5(password)
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('hex')

    // Find if password and number right
    var sql = 'SELECT restaurant_number FROM restaurant WHERE manager_number=? AND manager_password=?',
        value = [req.body.number, password]
    
    // Select the restaurant by number and password.
    var selector = db.selector(sql, value, function(err, result) {
        if (err) {
            // password error
            if (result !== undefined) console.log(result)
            console.log(err)
            return res.status(500).send('Internal Server Error. Database error.')
        }
        else if (result[0] === undefined) {
            res.status(500).send('Internal Server Error. Number or Password error.')
        }
        else {
            // password right
            req.session.regenerate(function(err) {
                if (err) {
                    return res.status(500).send('Internal Server Error. Redis error.')
                }
                req.session.manager_number = req.body.number
                res.status(201).send('Session Created.')
            })
        }
    })
    req.getConnection(selector)

}
module.exports = createSession