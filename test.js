const {singleviews} = require(".")

const a = new singleviews.ContentView({
  props: {
    bgcolor: $color("red")
  }
})
$ui.render({
  views: [a.definition]
})