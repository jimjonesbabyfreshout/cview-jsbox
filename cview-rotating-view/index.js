const BaseView = require("cview-baseview");
const { Image } = require("cview-singleviews");

class RotatingView extends BaseView {
  constructor({ props, layout, events = {} } = {}) {
    super();
    this._props = {
      contentMode: 1,
      rps: 0.5,
      clockwise: true,
      ...props
    };
    this._layout = layout;
    this._events = events;
  }

  _defineView() {
    if (this._props.cview) {
      this._innerView = this._props.cview;
    } else {
      this._innerView = new Image({
        props: {
          image: this._props.tintColor
            ? this._props.image.alwaysTemplate
            : this._props.image,
          tintColor: this._props.tintColor,
          contentMode: this._props.contentMode
        },
        layout: $layout.fill
      });
    }
    return {
      type: "type",
      props: {
        ...this._props,
        id: this.id
      },
      layout: this._layout,
      events: {
        ready:
          this._events.ready &&
          (sender => {
            this._events.ready(this);
          })
      },
      views: [this._innerView.definition]
    };
  }

  startRotating() {
    this._rotatingFlag = true;
    this._rotateView(this._innerView.view);
  }

  stopRotating() {
    this._rotatingFlag = false;
  }

  _rotateView(view) {
    const clockwiseMultiplier = this._props.clockwise ? 1 : -1
    $ui.animate({
      duration: 1/3 / this._props.rps,
      options: 3 << 16,
      animation: () => {
        view.rotate(Math.PI * 2 / 3 * clockwiseMultiplier);
      },
      completion: () => {
        $ui.animate({
          duration: 1/3 / this._props.rps,
          options: 3 << 16,
          animation: () => {
            view.rotate(Math.PI * 4 / 3 * clockwiseMultiplier);
          },
          completion: () => {
            $ui.animate({
              duration: 1/3 / this._props.rps,
              options: 3 << 16,
              animation: () => {
                view.rotate(Math.PI * 2 * clockwiseMultiplier);
              },
              completion: () => {
                if (this._rotatingFlag) this._rotateView(view);
              }
            })
          }
        });
      }
    });
  }
}

module.exports = RotatingView;
