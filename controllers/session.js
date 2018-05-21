var crypto = require('crypto')
var request = require('request')
var member = require('../model/member')

// 创建Session，当第一次登陆或者重新登陆
var createSession = function(req, res, next) {
    // 验证是否有请求code
    if (req.query.code === undefined 
        || req.query.code === '') {
        res.status(401).json({
            code: 401,
            msg: '[error] Wrong query formal.'
        })
        return
    }
    var code = req.query.code;

    // 使用code向微信服务器请求 openid 和 session_key
    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
          grant_type: 'authorization_code',
          appid: 'wxd3dae784d91bedf3',
          secret: '4b9f4ecc789c1f2cfee1c5efeecf6872',
          js_code: code
        },
        timeout: 1000 // ms
    }, (err, response, data) => {
        if (data != undefined && data.openid !== undefined) {
            console.log('[openid] ', data.openid)
            console.log('[session_key] ', data.session_key)

            // 创建用户，如果用户不在数据库中
            if (!member.get(req, data.openid)) {
                member.create(req, data.openid)
            }

            // 创建session存储到redis中
            req.session.regenerate(function (err) {
                if (err) {
                    return res.status(500).json({
                        code: 500,
                        msg: '[Error] Create session error',
                        data: err
                    })
                }
                req.session.openid = data.openid
                req.session.session_key = data.session_key
                return res.status(200).json({
                    code: 200,
                    msg: '[Success] Create session success',
                    data: {
                        sessionid: req.session.id
                    }
                })
            })
        }
        else if (data === undefined) {
            console.log('[Error] ', data)
            return res.status(500).json({
                code: 500,
                msg: '[Error] Internal server error or timeout',
                err: err
        })
        }
        else {
            // 请求错误
            console.log('[Error] ', data)
            return res.status(401).json({
                code: 401,
                msg: '[Error] Bad code',
                err: data
            })
        }
    })
}
module.exports = {
    create: createSession
}