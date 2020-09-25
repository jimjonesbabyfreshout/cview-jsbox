const BaseController = require(".");

const bc = new BaseController({
  props: {
    bgcolor: $color("red")
  },
  layout: $layout.fill
})

bc.uirender()