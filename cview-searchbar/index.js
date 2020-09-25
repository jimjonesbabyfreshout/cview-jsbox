const BaseView = require("cview-baseview");
const { Input, Label, ContentView } = require("cview-singleviews");

const colors = require("cview-util-colors");
const { l10n } = require("cview-util-localization");
const { getTextWidth } = require("cview-util-ui");

class SearchBar extends BaseView {
  constructor({ props, layout, events = {} } = {}) {
    super();
    this._props = {
      placeholder: l10n("SEARCH"),
      cancelText: l10n("CANCEL"),
      tintColor: $color("systemLink"),
      bgcolor: colors.searchBarBgcolor,
      style: 0,
      ...props
    };
    this._layout = layout;
    this._events = events;
    this._cancelButtonWidth = getTextWidth(this._props.cancelText, {
      inset: 20
    });
    this._placeholderWidth = getTextWidth(this._props.cancelText, {
      inset: 20
    });
    this._focused = false;
  }

  _defineView() {
    this._layouts = this._defineLayouts();
    this.cviews = {};

    this.cviews.input = new Input({
      props: {
        type: $kbType.search,
        placeholder: this._props.placeholder,
        bgcolor: $color("clear"),
        radius: 0,
        accessoryView:
          this._props.accessoryCview && this._props.accessoryCview.definition
      },
      layout: (make, view) => {
        make.left.equalTo(view.prev.right);
        make.top.bottom.right.inset(0);
      },
      events: {
        changed: sender => {
          if (this._events.changed) this._events.changed(this);
        },
        didBeginEditing: sender => {
          this._onFocused();
          if (this._events.didBeginEditing) this._events.didBeginEditing(this);
        },
        didEndEditing: sender => {
          if (this._events.didEndEditing) this._events.didEndEditing(this);
        },
        returned: sender => {
          this.blur();
          if (this._events.returned) this._events.returned(this);
        }
      }
    });

    this.cviews.iconInput = new ContentView({
      props: {
        bgcolor: undefined
      },
      layout: this._layouts.iconInput.normal,
      views: [
        {
          type: "view",
          props: {},
          views: [
            {
              type: "image",
              props: {
                //tintColor: colors.searchBarSymbolColor,
                tintColor: $color("systemPlaceholderText"),
                symbol: "magnifyingglass"
              },
              layout: (make, view) => {
                make.size.equalTo($size(20, 20));
                make.center.equalTo(view.super);
              }
            }
          ],
          layout: (make, view) => {
            make.top.bottom.inset(0);
            make.width.equalTo(20);
            make.left.inset(6);
          }
        },
        this.cviews.input.definition
      ]
    });

    this.cviews.cancelButton = new Label({
      props: {
        text: this._props.cancelText,
        textColor: this._props.tintColor,
        font: $font(17),
        align: $align.center,
        userInteractionEnabled: true,
        alpha: 0
      },
      layout: this._layouts.cancelButton.normal,
      events: {
        tapped: sender => this.blur()
      }
    });

    this.cviews.bgview = new ContentView({
      props: {
        bgcolor: this._props.bgcolor,
        radius: 8,
        userInteractionEnabled: true
      },
      layout: this._layouts.bgview.normal,
      events: {
        tapped: sender => {
          if (!this._focused) this.focus();
        }
      }
    });
    return {
      type: "view",
      props: {
        id: this.id,
        clipsToBounds: true
      },
      layout: this._layout,
      views: [
        this.cviews.bgview.definition,
        this.cviews.iconInput.definition,
        this.cviews.cancelButton.definition
      ]
    };
  }

  _defineLayouts() {
    switch (this._props.style) {
      case 0: {
        const IconInputLayout = $layout.fill;
        const cancelButtonLayout = (make, view) => {
          make.right.top.bottom.inset(0);
          make.width.equalTo(this._cancelButtonWidth);
        };
        const bgviewLayout = $layout.fill;
        return {
          iconInput: { normal: IconInputLayout },
          cancelButton: { normal: cancelButtonLayout },
          bgview: { normal: bgviewLayout }
        };
      }
      case 1: {
        const IconInputLayout = (make, view) => {
          make.left.top.bottom.inset(0);
          make.right.inset(this._cancelButtonWidth);
        };
        const cancelButtonLayout = (make, view) => {
          make.top.bottom.inset(0);
          make.left.equalTo(view.prev.prev.right);
          make.width.equalTo(this._cancelButtonWidth);
        };
        const bgviewLayoutNormal = $layout.fill;
        const bgviewLayoutFocused = (make, view) => {
          make.left.top.bottom.inset(0);
          make.right.inset(this._cancelButtonWidth);
        };
        return {
          iconInput: { normal: IconInputLayout },
          cancelButton: { normal: cancelButtonLayout },
          bgview: { normal: bgviewLayoutNormal, focused: bgviewLayoutFocused }
        };
      }
      case 2: {
        const IconInputLayoutNormal = (make, view) => {
          make.center.equalTo(view.super);
          make.top.bottom.inset(0);
          make.width.equalTo(this._placeholderWidth + 50);
        };
        const IconInputLayoutFocused = (make, view) => {
          make.left.top.bottom.inset(0);
          make.right.inset(this._cancelButtonWidth);
        };
        const cancelButtonLayout = (make, view) => {
          make.right.top.bottom.inset(0);
          make.left.equalTo(view.prev.prev.right);
          make.width.equalTo(this._cancelButtonWidth);
        };
        const bgviewLayoutNormal = $layout.fill;
        const bgviewLayoutFocused = (make, view) => {
          make.left.top.bottom.inset(0);
          make.right.inset(this._cancelButtonWidth);
        };
        return {
          iconInput: {
            normal: IconInputLayoutNormal,
            focused: IconInputLayoutFocused
          },
          cancelButton: { normal: cancelButtonLayout },
          bgview: { normal: bgviewLayoutNormal, focused: bgviewLayoutFocused }
        };
      }
      default:
        break;
    }
  }

  _onFocused() {
    this._focused = true;
    switch (this._props.style) {
      case 0: {
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.cancelButton.view.alpha = 1;
          }
        });
        break;
      }
      case 1: {
        this.cviews.bgview.view.remakeLayout(this._layouts.bgview.focused);
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.bgview.view.relayout();
            this.cviews.cancelButton.view.alpha = 1;
          }
        });
        break;
      }
      case 2: {
        this.cviews.iconInput.view.remakeLayout(
          this._layouts.iconInput.focused
        );
        this.cviews.bgview.view.remakeLayout(this._layouts.bgview.focused);
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.iconInput.view.relayout();
            this.cviews.bgview.view.relayout();
            this.cviews.cancelButton.view.alpha = 1;
          }
        });
        break;
      }
      default:
        break;
    }
  }

  _onBlurred() {
    this._focused = false;
    switch (this._props.style) {
      case 0: {
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.cancelButton.view.alpha = 0;
          }
        });
        break;
      }
      case 1: {
        this.cviews.bgview.view.remakeLayout(this._layouts.bgview.normal);
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.bgview.view.relayout();
            this.cviews.cancelButton.view.alpha = 0;
          }
        });
        break;
      }
      case 2: {
        this.cviews.iconInput.view.remakeLayout(this._layouts.iconInput.normal);
        this.cviews.bgview.view.remakeLayout(this._layouts.bgview.normal);
        $ui.animate({
          duration: 0.2,
          animation: () => {
            this.cviews.iconInput.view.relayout();
            this.cviews.bgview.view.relayout();
            this.cviews.cancelButton.view.alpha = 0;
          }
        });
        break;
      }
      default:
        break;
    }
  }

  focus() {
    this.cviews.input.view.focus();
    this._onFocused();
  }

  blur() {
    this._onBlurred();
    this.cviews.input.view.blur();
  }

  set text(text) {
    this.cviews.input.view.text = text;
  }

  get text() {
    return this.cviews.input.view.text;
  }
}

module.exports = SearchBar;
