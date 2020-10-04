const BaseView = require("cview-baseview");
const { ContentView, Label, Button } = require("cview-singleviews");
const SymbolButton = require("cview-symbol-button");
const { getTextWidth } = require("cview-util-ui");

const navBarStyles = {
  hidden: 0,
  minimized: 1,
  normal: 2,
  expanded: 3
};

const navBarLayouts = {
  0: (make, view) => {
    make.left.right.top.inset(0);
    make.height.equalTo(0);
  },
  1: (make, view) => {
    make.left.right.top.inset(0);
    make.bottom.equalTo(view.super.safeAreaTop).inset(-25);
  },
  2: (make, view) => {
    make.left.right.top.inset(0);
    make.bottom.equalTo(view.super.safeAreaTop).inset(-50);
  },
  3: (make, view) => {
    make.left.right.top.inset(0);
    make.bottom.equalTo(view.super.safeAreaTop).inset(-100);
  }
};

class CustomNavigationBar extends BaseView {
  constructor({ props, events = {} } = {}) {
    super();
    this._props = {
      leftBarButtonItems: [],
      rightBarButtonItems: [],
      style: navBarStyles.normal,
      tintColor: $color("primaryText"),
      //bgcolor: $color("clear"),
      ...props
    };
    this._events = events;
  }

  _defineView() {
    /*
    设计思路
    一共5个子视图: 
      - contentView  下有3个子视图
          - leftItemView  popButton或者leftButtonItems
          - rightItemView  rightButtonItems
          - titleView  
      - toolView  
    */
    this.cviews = {};

    // leftItemView
    let leftInset = 0;
    if (this._props.popButtonEnabled) {
      const titleWidth = this._props.popButtonTitle
        ? getTextWidth(this._props.popButtonTitle)
        : 0;
      leftInset = titleWidth + 35;
      const views = [];
      views.push({
        type: "view",
        props: {},
        layout: (make, view) => {
          make.left.top.bottom.inset(0);
          make.width.equalTo(35);
        },
        views: [
          {
            type: "image",
            props: {
              symbol: "chevron.left",
              contentMode: 1,
              tintColor: this._props.tintColor
            },
            layout: make => make.edges.insets($insets(12.5, 10, 12.5, 0))
          }
        ]
      });
      if (this._props.popButtonTitle)
        views.push({
          type: "label",
          props: {
            align: $align.left,
            text: this._props.popButtonTitle,
            font: $font(17),
            textColor: this._props.tintColor
          },
          layout: (make, view) => {
            make.top.bottom.right.inset(0);
            make.left.equalTo(view.prev.right);
          }
        });
      this.cviews.leftItemView = new Button({
        props: {
          bgcolor: $color("clear"),
          cornerRadius: 0
        },
        views,
        layout: (make, view) => {
          make.width.equalTo(leftInset);
          make.left.top.bottom.inset(0);
        },
        events: {
          tapped: sender => {
            if (this._events.popHandler) this._events.popHandler(this);
            $ui.pop();
          },
          longPressed: this._props.popToRootEnabled
            ? sender => {
                if (this._events.popToRootHandler)
                  this._events.popToRootHandler(this);
                $ui.popToRoot();
              }
            : undefined
        }
      });
    } else {
      leftInset = this._calculateItemViewWidth(this._props.leftBarButtonItems);
      this.cviews.leftItemView = new ContentView({
        props: {
          bgcolor: undefined
        },
        layout: (make, view) => {
          make.width.equalTo(leftInset);
          make.left.top.bottom.inset(0);
        },
        views: this._createCviewsOnItemView(this._props.leftBarButtonItems).map(
          n => n.definition
        )
      });
    }

    // rightItemView
    const rightInset = this._calculateItemViewWidth(
      this._props.rightBarButtonItems
    );
    this.cviews.rightItemView = new ContentView({
      props: {
        bgcolor: undefined
      },
      layout: (make, view) => {
        make.width.equalTo(rightInset);
        make.right.top.bottom.inset(0);
      },
      views: this._createCviewsOnItemView(this._props.rightBarButtonItems).map(
        n => n.definition
      )
    });

    // titleView
    const titleViewInset = Math.max(leftInset, rightInset);
    if (this._props.title) {
      this.cviews.titleViewWrapper = new Label({
        props: {
          text: this._props.title,
          font: $font("bold", 17),
          align: $align.center,
          textColor: this._props.tintColor,
          userInteractionEnabled: true
        },
        layout: (make, view) => {
          make.left.right.inset(titleViewInset);
          make.top.bottom.inset(0);
        },
        events: {
          tapped: sender => {
            if (this._events.titleTapped) this._events.titleTapped(this);
          }
        }
      });
    } else {
      this.cviews.titleViewWrapper = new ContentView({
        props: {
          bgcolor: undefined
        },
        layout: (make, view) => {
          make.left.right.inset(titleViewInset);
          make.top.bottom.inset(0);
        },
        views: this._props.titleView && [this._props.titleView.definition]
      });
    }

    // contentView
    this.cviews.contentView = new ContentView({
      props: {
        bgcolor: undefined
      },
      layout: (make, view) => {
        make.left.right.top.inset(0);
        make.height.equalTo(50);
      },
      views: [
        this.cviews.titleViewWrapper.definition,
        this.cviews.leftItemView.definition,
        this.cviews.rightItemView.definition
      ]
    });

    // toolView
    this.cviews.toolViewWrapper = new ContentView({
      props: {
        bgcolor: undefined
      },
      layout: (make, view) => {
        make.left.right.bottom.equalTo(view.super);
        make.top.equalTo(view.super).inset(50);
      },
      views: this._props.toolView && [this._props.toolView.definition]
    });
    return {
      type: this._props.bgcolor ? "view" : "blur",
      props: {
        id: this.id,
        style: this._props.bgcolor ? undefined : 10,
        bgcolor: this._props.bgcolor
      },
      layout: navBarLayouts[this._props.style],
      events: {
        ready: sender => (this.style = this.style)
      },
      views: [
        {
          type: "view",
          props: {},
          layout: $layout.fillSafeArea,
          views: [
            this.cviews.contentView.definition,
            this.cviews.toolViewWrapper.definition
          ]
        },
        {
          type: "view",
          props: {
            bgcolor: $color("separatorColor")
          },
          layout: (make, view) => {
            make.bottom.left.right.inset(0);
            make.height.equalTo(0.5);
          }
        }
      ]
    };
  }

  _calculateItemViewWidth(items) {
    if (!items || items.length === 0) return 0;
    let width = 0;
    items.forEach(n => {
      if (n instanceof BaseView) width += n.width || 50;
      else if (n.title) width += getTextWidth(n.title, { inset: 20 });
      else width += 50;
    });
    return width;
  }

  _createCviewsOnItemView(items) {
    return items.map(n => {
      if (n instanceof BaseView) {
        const width = n.width || 50;
        n._layout = (make, view) => {
          make.top.bottom.inset(0);
          make.width.equalTo(width);
          make.left.equalTo((view.prev && view.prev.right) || 0);
        };
        return n;
      } else if (n.title) {
        const width = getTextWidth(n.title, { inset: 20 });
        return new Button({
          props: {
            title: n.title,
            bgcolor: $color("clear"),
            titleColor: n.tintColor || this._props.tintColor,
            cornerRadius: 0
          },
          layout: (make, view) => {
            make.top.bottom.inset(0);
            make.width.equalTo(width);
            make.left.equalTo((view.prev && view.prev.right) || 0);
          },
          events: {
            tapped: n.handler
          }
        });
      } else if (n.symbol || n.image) {
        return new SymbolButton({
          props: {
            symbol: n.symbol,
            image: n.image,
            tintColor: n.tintColor || this._props.tintColor
          },
          layout: (make, view) => {
            make.top.bottom.inset(0);
            make.width.equalTo(50);
            make.left.equalTo((view.prev && view.prev.right) || 0);
          },
          events: {
            tapped: n.handler
          }
        });
      }
    });
  }

  get title() {
    return this._props.title;
  }

  set title(title) {
    if (this._props.title === undefined) return;
    this._props.title = title;
    this.cviews.titleViewWrapper.view.text = title;
  }

  _changeLayout(layout, animated) {
    if (animated) {
      this.view.remakeLayout(layout);
      $ui.animate({
        duration: 0.3,
        animation: () => this.view.relayout()
      });
    } else {
      this.view.remakeLayout(layout);
    }
  }

  hide(animated = true) {
    this.view.hidden = false;
    this.cviews.leftItemView.view.hidden = true;
    this.cviews.rightItemView.view.hidden = true;
    this.cviews.toolViewWrapper.view.hidden = true;
    this.cviews.titleViewWrapper.view.hidden = true;
    this.view.remakeLayout(navBarLayouts[navBarStyles.hidden]);
    this.cviews.contentView.view.updateLayout(make => make.height.equalTo(0));
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => {
          this.view.relayout();
          this.cviews.contentView.view.relayout();
        },
        completion: () => {
          this.view.hidden = true;
          if (this._events.hidden) this._events.hidden(this);
        }
      });
    } else {
      this.view.hidden = true;
      if (this._events.hidden) this._events.hidden(this);
    }
  }

  minimize(animated = true) {
    this.view.hidden = false;
    this.cviews.leftItemView.view.hidden = true;
    this.cviews.rightItemView.view.hidden = true;
    this.cviews.toolViewWrapper.view.hidden = true;
    this.cviews.titleViewWrapper.view.hidden = false;
    this.view.remakeLayout(navBarLayouts[navBarStyles.minimized]);
    this.cviews.contentView.view.updateLayout(make => make.height.equalTo(25));
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => {
          this.view.relayout();
          this.cviews.contentView.view.relayout();
          if (this._props.title)
            this.cviews.titleViewWrapper.view.font = $font("bold", 14);
        },
        completion: () => {
          if (this._events.minimized) this._events.minimized(this);
        }
      });
    } else {
      if (this._props.title)
        this.cviews.titleViewWrapper.view.font = $font("bold", 14);
      if (this._events.minimized) this._events.minimized(this);
    }
  }

  restore(animated = true) {
    this.view.hidden = false;
    this.cviews.titleViewWrapper.view.hidden = false;
    //this.cviews.toolViewWrapper.view.hidden = true;
    this.view.remakeLayout(navBarLayouts[navBarStyles.normal]);
    this.cviews.contentView.view.updateLayout(make => make.height.equalTo(50));
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => {
          this.view.relayout();
          this.cviews.contentView.view.relayout();
          if (this._props.title)
            this.cviews.titleViewWrapper.view.font = $font("bold", 17);
        },
        completion: () => {
          this.cviews.leftItemView.view.hidden = false;
          this.cviews.rightItemView.view.hidden = false;
          if (this._events.restored) this._events.restored(this);
        }
      });
    } else {
      this.cviews.leftItemView.view.hidden = false;
      this.cviews.rightItemView.view.hidden = false;
      if (this._props.title)
        this.cviews.titleViewWrapper.view.font = $font("bold", 17);
      if (this._events.restored) this._events.restored(this);
    }
  }

  expand(animated = true) {
    this.view.hidden = false;
    this.cviews.toolViewWrapper.view.hidden = false;
    this.cviews.titleViewWrapper.view.hidden = false;
    this.view.remakeLayout(navBarLayouts[navBarStyles.expanded]);
    this.cviews.contentView.view.updateLayout(make => make.height.equalTo(50));
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => {
          this.view.relayout();
          this.cviews.contentView.view.relayout();
          if (this._props.title)
            this.cviews.titleViewWrapper.view.font = $font("bold", 17);
        },
        completion: () => {
          this.cviews.leftItemView.view.hidden = false;
          this.cviews.rightItemView.view.hidden = false;
          //this.cviews.toolViewWrapper.view.hidden = false;
          if (this._events.expanded) this._events.expanded(this);
        }
      });
    } else {
      this.cviews.leftItemView.view.hidden = false;
      this.cviews.rightItemView.view.hidden = false;
      //this.cviews.toolViewWrapper.view.hidden = false;
      if (this._props.title)
        this.cviews.titleViewWrapper.view.font = $font("bold", 17);
      if (this._events.expanded) this._events.expanded(this);
    }
  }

  get style() {
    return this._props.style;
  }

  set style(num) {
    this._props.style = num;
    switch (num) {
      case 0: {
        this.hide();
        break;
      }
      case 1: {
        this.minimize();
        break;
      }
      case 2: {
        this.restore();
        break;
      }
      case 3: {
        this.expand();
        break;
      }
      default:
        break;
    }
  }
}

module.exports = CustomNavigationBar;
