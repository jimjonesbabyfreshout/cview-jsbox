const PageControl = require(".");

const a = new PageControl({
  props: {
    bgcolor: $color("black"),
    pageIndicatorTintColor: $color("blue"),
    currentPageIndicatorTintColor: $color("green"),
    borderWidth: 1,
    borderColor: $color("red")
  },
  layout: function (make, view) {
    make.center.equalTo(view.super);
    make.size.equalTo($size(200, 20));
  },
  events: {
    changed: (sender, currentPage) => {
      console.log(currentPage);
    }
  }
});

$ui.render({
  props: {
    navButtons: [
      {
        title: "测试",
        handler: () => {
          a.currentPage = 2
        }
      }
    ]
  },
  views: [a.definition]
});
