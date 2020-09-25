const PageViewer = require(".");
const { ContentView } = require("cview-singleviews");

const v = new PageViewer({
  props: {
    page: 1,
    cviews: [
      new ContentView({props: {bgcolor: $color("red")}}),
      new ContentView({props: {bgcolor: $color("green")}}),
      new ContentView({props: {bgcolor: $color("blue")}})
    ]
  },
  layout: $layout.fillSafeArea,
  events: {
    changed: (cview, page) => console.info("changed", page)
  }
})

$ui.render({
  views: [v.definition]
})