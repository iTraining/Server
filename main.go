package main

import (
	_ "itraining/routers"
	_ "github.com/astaxie/beego/session/mysql"
	"github.com/astaxie/beego"
)

func main() {
	beego.Run()
}

