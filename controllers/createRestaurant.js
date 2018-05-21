var db = require('../db')
var crypto = require('crypto')
// Create restaurant account.
var createRestaurant = function(req, res, next) {
    // Valid the form data.
    if (req.body.number === undefined 
        || req.body.number === ''
        || req.body.password === undefined 
        || req.body.password === ''
        || req.body.restaurant_name === undefined
        || req.body.restaurant_name === '') {
        console.log('Error: wrong post format.')
        res.status(400).send('Error: wrong post format.')
        return
    }

    // Get md5(password)
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('hex')

    var sql = 'INSERT INTO restaurant (manager_number, manager_password, restaurant_name) VALUES (?, ?, ?)',
        value = [req.body.number, password, req.body.restaurant_name]

    // Database operation.
    var inserter = db.inserter(sql, value, function(err, result) {
        if (err) {
            console.log('Error: Duplicate number.')
            return res.status(403).send('Error: Duplicate number.')
        }
        res.status(201).send('OK')
    })
    req.getConnection(inserter)
}
module.exports = createRestaurant