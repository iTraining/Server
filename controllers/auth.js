var crypto = require('crypto')
var request = require('request')
var User = require('../models/user')


// 创建Session，当第一次登陆或者重新登陆
var createSession = function(req, res, next) {
    // 验证是否有请求code
    console.log(req.query.code)
    if (!req.query.code
        || !req.query.nickname ) {
        console.log(req.file)
        if (req.file) fs.unlinkSync('../'+req.file.path)
        return res.status(400).json({
            errcode: 400,
            errmsg: '[Error] Wrong query formal.'
        })
    }
    var image_url = ''
    if (req.file) {
        image_url = 'img/'+req.file.filename
    }
    var code = req.query.code;

    // 测试用： 后门
    if (code === 'TEST_CODE') {
        var openid = 'oEvgD5p2WFnAXlrqrxd4GDlOgdx4'  
        // 创建用户，如果用户不在数据库中
        User.create(openid).then(function(result){
            console.log('New user record')
        }).catch(function(err) {
            if (err) {
                console.log('Duplicate error') 
            }
        })

        // 创建session存储到redis中
        req.session.regenerate(function (err) {
            if (err) {
                return res.status(500).json({
                    errcode: 500,
                    errmsg: '[Error] Create session error',
                    errdata: err
                })
            }
            req.session.openid = openid
            req.session.session_key = 'session_key'
            return res.status(200).json({
                code: 200,
                msg: '[Success] Create session success',
                data: {
                    sessionid: req.session.id
                }
            })
        })  
        return
    }

    // 使用code向微信服务器请求 openid 和 session_key
    request.get({
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        json: true,
        qs: {
          grant_type: 'authorization_code',
          appid: 'wxd3dae784d91bedf3',
          secret: '74f8a0b038820663efbca24da8242b9e',
          js_code: code
        },
        timeout: 1000 // ms
    }, (err, response, data) => {
        if (data != undefined && data.openid !== undefined) {
            console.log('[openid] ', data.openid)
            console.log('[session_key] ', data.session_key)

            // 查询用户
            User.get(data.openid).then(function(result){
                if (result[0]) {
                    // 存在用户，删除旧头像，更新   
                    if (image_url) fs.unlinkSync('../uploads/'+image_url)
                    return User.update(data.openid, req.query.nickname, image_url)
                }
                else {
                    // 不存在用户， 创建
                    return User.create(data.openid, req.query.nickname, image_url)
                }
            }).then(function(result) {
                // 创建session存储到redis中
                req.session.regenerate(function (err) {
                    if (err) {
                        if (image_url) fs.unlinkSync('../uploads/'+image_url)
                        return res.status(500).json({
                            errcode: 500,
                            errmsg: '[Error] Create session error',
                            errdata: err
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
            })
            .catch(function(err) {
                if (image_url) fs.unlinkSync('../uploads/'+image_url)
                return res.status(500).json({
                    code: 500,
                    errmsg: '[Error] Internal err',
                    errdata: err
                })
            })

            
        }
        else if (data === undefined) {
            if (image_url) fs.unlinkSync('../uploads/'+image_url)
            console.log('[Error] ', data)
            return res.status(500).json({
                code: 500,
                errmsg: '[Error] Internal server error or timeout',
                errdata: err
            })
        }
        else {
            // 请求错误
            if (image_url) fs.unlinkSync('../uploads/'+image_url)
            console.log('[Error] ', data)
            return res.status(403).json({
                code: 403,
                errmsg: '[Error] Bad code',
                errdata: data
            })
        }
    })
}


// 检查合法性
var checkSession = function(req, res, next) {
    // return next()
    // console.log('get request')
    if (req.path === '/session' || req.session.openid) {
      next();
    }
    else return res.status(403).json({
      errcode: 403,
      errmsg: '[Error] You have not sign in'
    })
}


module.exports = {
    createSession: createSession,
    checkSession: checkSession
}
