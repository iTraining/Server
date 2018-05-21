var db = require('../db')
// Get restaurant account.
var getRestaurant = function(req, res, next) {
    // Valid the form data.
    if (req.query.number === undefined || req.query.number === '') {
        res.status(400).send('Error: wrong get format. Find no \'number\'.')
        return
    }

    var sql = 'SELECT manager_number, restaurant_name, description,\
     image_id, restaurant_number FROM restaurant WHERE manager_number=?',
        value = [req.query.number]
    
    // Select the restaurant by number
    var selector = db.selector(sql, value, function(err, result) {
        if (err) {
            if (result !== undefined) console.log(result)
            console.log(err)
            return res.status(500).send('Internal Server Error. Database error.')
        }
        else if (result[0] === undefined) {
            res.status(500).send('Internal Server Error. The restaurant is not exist.')
        }
        else {
            res.status(200).send(result[0])
        }
    })
    req.getConnection(selector)

}
module.exports = getRestaurant