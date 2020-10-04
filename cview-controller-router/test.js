const router = require(".");

let num = 0;

class Controller {
  constructor() {
    this.id = "id_" + num;
    this.type = 1;
    num++;
  }
}

router.add(new Controller());
