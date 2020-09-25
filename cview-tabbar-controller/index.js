const TabBar = require("cview-tabbar");
const BaseController = require("cview-basecontroller");
const { ContentView } = require("cview-singleviews");

class TabBarController extends BaseController {
  constructor({ props, layout, events = {} } = {}) {
    super({
      props: {
        ...props,
        type: 1
      },
      layout,
      events
    });
  }

  _createCviews() {
    this.cviews.tabbar = new TabBar({
      props: {
        items: this._props.items
      },
      events: {
        changed: index => (this.index = index)
      }
    })
    this.cviews.pageContentView = new ContentView({
      props: {
        bgcolor: $color("clear")
      },
      layout: $layout.fill
    });
    this.cviews.pages = this._props.items.map(n => {
      return new ContentView({
        props: {
          bgcolor: n.bgcolor || this._props.bgcolor
        },
        layout: $layout.fill,
        views: [
          n.controller.rootView
        ]
      });
    });
  }


}


module.exports = TabBarController;