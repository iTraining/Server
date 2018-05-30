var team = require('../model/team')
var create = function (req, res, next) {
    var value = [req.body.name, req.body.bio, req.session.openid]

    req.getConnection(function(err, connection) {
        if (err) {
            res.status(500).json({
                code: 500,
                msg: '[Error] Database erro.'
            })
        }
        else {
            connection.query(team.insert_sql, value, function(err, result) {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        code: 401,
                        msg: '[Error] Insert data must be wrong.'
                    })
                }
                console.log(result)
                res.status(201).json({
                    cond: 201,
                    msg: '[Sucess] Create team sucessfully',
                    data: result
                })
            })
        }
    })
}

module.exports={
    create: create
}