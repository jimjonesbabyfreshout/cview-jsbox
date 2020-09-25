const monitor = require(".");

let num = 0

class Controller {
  constructor() {
    this.id = "id_" + num
    num++;
  }
}

monitor.addRoot(new Controller())