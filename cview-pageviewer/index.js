const BaseView = require("cview-baseview");
const { ContentView, Scroll } = require("cview-singleviews");

class PageViewer extends BaseView {
  constructor({ props, layout, events = {} } = {}) {
    super();
    this._props = {
      page: 0,
      cviews: [],
      ...props
    };
    this._layout = layout;
    this._events = events;
    this._length = this._props.cviews.length;
    this._pageWidth = 0;
    this._floatPage = this._props.page;
  }

  _defineView() {
    const contentViews = this._props.cviews.map(n => {
      n._layout = $layout.fill;
      return new ContentView({
        views: [n.definition],
        layout: (make, view) => {
          make.height.width.equalTo(view.super);
          make.left.equalTo(view.prev ? view.prev.right : view.super);
          make.top.equalTo(view.super);
        }
      });
    });
    this.scroll = new Scroll({
      props: {
        alwaysBounceVertical: false,
        alwaysBounceHorizontal: true,
        showsHorizontalIndicator: false,
        pagingEnabled: true
      },
      events: {
        layoutSubviews: sender => {
          this._pageWidth = sender.frame.width;
          if (this._pageWidth)
            sender.contentSize = $size(this._pageWidth * this._length, 0);
        },
        willEndDragging: (sender, velocity, target) => {
          const oldPage = this.page;
          this._props.page = Math.round(target.x / this._pageWidth);
          if (oldPage !== this.page && this._events.changed)
            this._events.changed(this, this.page);
        },
        didScroll: sender => {
          const rawPage = sender.contentOffset.x / this._pageWidth;
          this._floatPage = Math.min(Math.max(0, rawPage), this._length - 1);
          if (this._events.floatPageChanged)
            this._events.floatPageChanged(this, this._floatPage);
        }
      },
      layout: $layout.fill,
      views: [...contentViews.map(n => n.definition)]
    });
    return {
      type: "view",
      props: { id: this.id },
      layout: this._layout,
      views: [this.scroll.definition],
      events: {
        layoutSubviews: sender => {
          sender.relayout();
          this.page = this.page
          $delay(0.2, () => (this.page = this.page))
          
        }
      }
    };
  }

  get page() {
    return this._props.page;
  }

  set page(page) {
    this._props.page = page;
    if (this.scroll.view.contentOffset.x !== page * this._pageWidth)
      this.scroll.view.contentOffset = $point(page * this._pageWidth, 0);
  }

  scrollToPage(page) {
    this.scroll.view.scrollToOffset($point(page * this._pageWidth, 0));
    this._props.page = page;
  }
}

module.exports = PageViewer;
