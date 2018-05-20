package controllers

import (
	"fmt"
	"github.com/astaxie/beego"
)

type MainController struct {
	beego.Controller
}

func (c *MainController) Get() {
	v := c.GetSession("sess")
	if v == nil {
		fmt.Println("no session")
	} else {
		fmt.Println(v)
	}
	c.StopRun()
	// c.Data["Website"] = "beego.me"
	// c.Data["Email"] = "astaxie@gmail.com"
	//c.TplName = "index.tpl"
}
