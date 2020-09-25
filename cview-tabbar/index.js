const BaseView = require("cview-baseview");
const colors = require("cview-util-colors");

class ImageLabelCell extends BaseView {
  constructor({ props, events = {} }) {
    super();
    this._props = props;
    this._events = events;
    this.layouts = {
      image_tightened: (make, view) => {
        make.centerX.equalTo(view.super);
        make.size.equalTo($size(25, 25));
        make.top.inset(7);
      },
      label_tightened: (make, view) => {
        make.centerX.equalTo(view.super);
        make.top.equalTo(view.prev.bottom);
      },
      image_loosed: (make, view) => {
        make.centerX.equalTo(view.super).offset(-35);
        make.centerY.equalTo(view.super);
        make.size.equalTo($size(25, 25));
      },
      label_loosed: (make, view) => {
        make.left.equalTo(view.prev.right).inset(10);
        make.centerY.equalTo(view.super);
      }
    };
  }

  _defineView() {
    return {
      type: "view",
      props: {
        id: this.id,
        userInteractionEnabled: true
      },
      views: [
        {
          type: "image",
          props: {
            id: "image",
            symbol: this._props.symbol,
            image: this._props.image,
            contentMode: 1
          }
        },
        {
          type: "label",
          props: {
            id: "label",
            text: this._props.text,
            align: $align.center
          }
        }
      ],
      events: {
        tapped: sender => {
          if (this._events.tapped) this._events.tapped(this._props.index);
        }
      }
    };
  }

  set selected(selected) {
    this._props.selected = selected;
    const color = selected
      ? this._props.selectedSegmentTintColor
      : this._props.defaultSegmentTintColor;
    this.view.get("image").tintColor = color;
    this.view.get("label").textColor = color;
  }

  get selected() {
    return this._props.selected;
  }

  _useTightenedLayout() {
    this.view.get("image").remakeLayout(this.layouts.image_tightened);
    this.view.get("label").remakeLayout(this.layouts.label_tightened);
    this.view.get("label").font = $font(10);
  }

  _useLoosedLayout() {
    this.view.get("image").remakeLayout(this.layouts.image_loosed);
    this.view.get("label").remakeLayout(this.layouts.label_loosed);
    this.view.get("label").font = $font(14);
  }
}

class ImageCell extends BaseView {
  constructor({ props, events = {} }) {
    super();
    this._props = props;
    this._events = events;
    this.layouts = {
      image_tightened: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(30, 30));
      },
      image_loosed: (make, view) => {
        make.center.equalTo(view.super);
        make.size.equalTo($size(30, 30));
      }
    };
  }

  _defineView() {
    return {
      type: "view",
      props: {
        id: this.id,
        userInteractionEnabled: true
      },
      views: [
        {
          type: "image",
          props: {
            id: "image",
            symbol: this._props.symbol,
            image: this._props.image,
            contentMode: 1
          }
        }
      ],
      events: {
        tapped: sender => {
          if (this._events.tapped) this._events.tapped(this._props.index);
        }
      }
    };
  }

  set selected(selected) {
    this._props.selected = selected;
    const color = selected
      ? this._props.selectedSegmentTintColor
      : this._props.defaultSegmentTintColor;
    this.view.get("image").tintColor = color;
  }

  get selected() {
    return this._props.selected;
  }

  _useTightenedLayout() {
    this.view.get("image").remakeLayout(this.layouts.image_tightened);
  }

  _useLoosedLayout() {
    this.view.get("image").remakeLayout(this.layouts.image_loosed);
  }
}

class TabBar extends BaseView {
  constructor({ props, events = {} }) {
    super();
    this._props = {
      height: 50,
      items: [],
      index: 0,
      selectedSegmentTintColor: $color("systemLink"),
      defaultSegmentTintColor: colors.footBarDefaultSegmentColor,
      //bgcolor: $color("secondarySurface"),
      ...props
    };
    this._index = this._props.index;
    this._events = events;
  }

  _defineView() {
    this._cells = this._defineCells();
    const stack = {
      type: "stack",
      props: {
        axis: $stackViewAxis.horizontal,
        distribution: $stackViewDistribution.fillEqually,
        spacing: 0,
        stack: {
          views: this._cells.map(n => n.definition)
        }
      },
      layout: (make, view) => {
        make.height.equalTo(this._props.height - 0.5);
        make.left.right.equalTo(view.super.safeArea);
        make.top.equalTo(view.prev.bottom);
      }
    };
    const line = {
      props: {
        bgcolor: $color("separatorColor")
      },
      layout: (make, view) => {
        make.top.left.right.inset(0);
        make.height.equalTo(0.5);
      }
    };

    return {
      type: this._props.bgcolor ? "view" : "blur",
      props: {
        id: this.id,
        style: this._props.bgcolor ? undefined : 10,
        bgcolor: this._props.bgcolor
      },
      layout: (make, view) => {
        make.left.right.bottom.inset(0);
        make.top.equalTo(view.super.safeAreaBottom).inset(-this._props.height);
      },
      views: [line, stack],
      events: {
        ready: sender => (this.index = this._index),
        layoutSubviews: sender => {
          const windowWidth = sender.frame.width;
          if (windowWidth > 600) {
            this._useLoosedLayout();
          } else {
            this._useTightenedLayout();
          }
        }
      }
    };
  }

  _defineCells() {
    return this._props.items.map((n, i) => {
      if (n.title) {
        return new ImageLabelCell({
          props: {
            symbol: n.symbol,
            image: n.image ? n.image.alwaysTemplate : undefined,
            text: n.title,
            index: i,
            selectedSegmentTintColor: this._props.selectedSegmentTintColor,
            defaultSegmentTintColor: this._props.defaultSegmentTintColor
          },
          events: {
            tapped: index => {
              if (index !== this.index) {
                this.index = index;
                if (this._events.changed) this._events.changed(this, index);
              } else {
                if (this._events.doubleTapped)
                  this._events.doubleTapped(this, index);
              }
            }
          }
        });
      } else {
        return new ImageCell({
          props: {
            symbol: n.symbol,
            image: n.image ? n.image.alwaysTemplate : undefined,
            index: i,
            selectedSegmentTintColor: this._props.selectedSegmentTintColor,
            defaultSegmentTintColor: this._props.defaultSegmentTintColor
          },
          events: {
            tapped: index => {
              if (index !== this.index) {
                this.index = index;
                if (this._events.changed) this._events.changed(this, index);
              } else {
                if (this._events.doubleTapped)
                  this._events.doubleTapped(this, index);
              }
            }
          }
        });
      }
    });
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = index;
    this._cells.forEach((n, i) => {
      n.selected = i === this._index;
    });
  }

  hide(animated = true) {
    this.view.remakeLayout((make, view) => {
      make.left.right.bottom.inset(0);
      make.height.equalTo(0);
    });
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => this.view.relayout()
      });
    }
  }

  show(animated = true) {
    this.view.remakeLayout((make, view) => {
      make.left.right.bottom.inset(0);
      make.top.equalTo(view.super.safeAreaBottom).inset(-this._props.height);
    });
    if (animated) {
      $ui.animate({
        duration: 0.3,
        animation: () => this.view.relayout()
      });
    }
  }

  _useTightenedLayout() {
    this._cells.forEach(n => {
      n._useTightenedLayout();
    });
  }

  _useLoosedLayout() {
    this._cells.forEach(n => {
      n._useLoosedLayout();
    });
  }
}

module.exports = TabBar;
