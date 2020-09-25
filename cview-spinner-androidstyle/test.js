const AndroidStyleSpinner = require(".");

const v = new AndroidStyleSpinner()

$ui.render({
  views: [
    {
      type: "list",
      props: {
        template: {
          views: [v.definition]
        },
        data: [{}, {}, {}]
      },
      layout: $layout.fill
    }
  ]
})