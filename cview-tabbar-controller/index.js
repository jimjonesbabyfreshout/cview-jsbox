const TabBar = require("cview-tabbar");
const BaseController = require("cview-basecontroller");
const { ContentView } = require("cview-singleviews");

class TabBarController extends BaseController {
  constructor({ props, layout, events = {} } = {}) {
    props = { type: 1 << 3, index: 0, ...props };
    super({ props, layout, events });
  }

  _create() {
    this.cviews.tabbar = new TabBar({
      props: {
        items: this._props.items,
        index: this._props.index
      },
      events: {
        changed: index => (this.index = index)
      }
    });

    this.cviews.pages = this._props.items.map((n, i) => {
      return new ContentView({
        props: {
          bgcolor: n.bgcolor || this._props.bgcolor,
          hidden: i !== this._props.index
        },
        layout: $layout.fill,
        views: [n.controller.rootView.definition]
      });
    });
    this.cviews.pageContentView = new ContentView({
      props: {
        bgcolor: $color("clear")
      },
      layout: $layout.fill,
      views: this.cviews.pages.map(n => n.definition)
    });
    super._create();
  }

  set index(num) {
    this.cviews.pages.forEach((n, i) => {
      n.view.hidden = i !== num;
    });
    this.cviews.tabbar.index = num;
    this._props.index = num;
  }

  get index() {
    return this._props.index;
  }
}

module.exports = TabBarController;
