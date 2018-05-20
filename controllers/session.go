package controllers

import (
	"github.com/astaxie/beego"
	"fmt"
)


// Session controller 嵌入 beego.Controller，
// 相当于继承 beego.Controller 的方法和变量
type SessionController struct {
	beego.Controller
}

// 重载 Get() 方法
// 获取微信用户认证code
// 请求微信服务器 openId和session_key，返回自己设计存储的 session
// @router /session/:key [get]
func (c *SessionController) Get() {
	var code = c.GetString("code")
	fmt.Println("Get code: ", code)
	c.SetSession("sess", int(12345))
	c.StopRun()
}