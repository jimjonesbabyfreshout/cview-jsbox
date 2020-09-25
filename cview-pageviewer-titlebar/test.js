$app.theme = "auto";

const PageViewerTitleBar = require(".");
const PageViewer = require("cview-pageviewer");
const { ContentView } = require("cview-singleviews");
const titlebar = new PageViewerTitleBar({
  props: {
    index: 1,
    items: ["红色", "绿色", "蓝色"]
  },
  layout: (make, view) => {
    make.left.right.inset(0);
    make.top.equalTo(view.super.safeAreaTop);
    make.height.equalTo(50);
  },
  events: {
    changed: (cview, index) => pageviewer.scrollToPage(index)
  }
});
const pageviewer = new PageViewer({
  props: {
    page: 1,
    cviews: [
      new ContentView({ props: { bgcolor: $color("red") } }),
      new ContentView({ props: { bgcolor: $color("green") } }),
      new ContentView({ props: { bgcolor: $color("blue") } })
    ]
  },
  layout: (make, view) => {
    make.top.equalTo(view.prev.bottom);
    make.left.right.bottom.inset(0);
  },
  events: {
    changed: (cview, page) => console.info("changed", page),
    floatPageChanged: (cview, floatPage) => (titlebar.floatedIndex = floatPage)
  }
});

$ui.render({
  props: {
    navBarHidden: true,
    statusBarStyle: 0
  },
  views: [titlebar.definition, pageviewer.definition]
});
