// insert a record into restaurant table
exports.operator = function(sql, value, callback) {
    return function(err, connection) {
        if (err) return callback(err, "[ERROR] connection error.")
        connection.query(sql, value, callback)
    }
}