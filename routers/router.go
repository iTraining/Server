package routers

import (
	"itraining/controllers"
	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/session", &controllers.SessionController{})
	beego.Router("/", &controllers.MainController{})
}
