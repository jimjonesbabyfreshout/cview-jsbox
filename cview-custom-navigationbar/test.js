$app.theme = "auto";

const CustomNavigationBar = require(".");
const SymbolButton = require("cview-symbol-button");
const { Input } = require("cview-singleviews");

const t = new SymbolButton({
  props: {
    symbol: "plus"
  },
  events: {
    tapped: sender => {
      navbar.hide();
    }
  }
});

const navbar = new CustomNavigationBar({
  props: {
    title: "标题",
    popButtonEnabled: true,
    popButtonTitle: "评论",
    popToRootEnabled: true,
    tintColor: $color("red"),
    //bgcolor: $color("red"),
    style: 1,
    leftBarButtonItems: [{symbol: "minus"}, {symbol: "phone"}],
    rightBarButtonItems: [t, {title: "完成"}],
    toolView: new Input({
      props: {
        placeholder: "搜索"
      },
      layout: (make, view) => {
        make.edges.insets($insets(5,5,5,5))
      }
    })
  }
});

$ui.render({
  props: {
    statusBarStyle: 0,
    navBarHidden: true
  },
  views: [
    navbar.definition,
    {
      type: "tab",
      props: {
        items: ["0", "1", " 2", "3"]
      },
      layout: $layout.center,
      events: {
        changed: sender => {
          navbar.style = sender.index
        }
      }
    }
  ]
});
