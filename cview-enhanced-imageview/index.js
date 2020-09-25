const BaseView = require("cview-baseview");
const { Scroll } = require("cview-singleviews");
const cvid = require("cview-util-cvid");

class EnhancedImageView extends BaseView {
  constructor({ props, layout, events = {} }) {
    super();
    this._props = { maxZoomScale: 2, ...props };
    this._layout = layout;
    this._events = events;
  }

  _defineView() {
    this.scroll = new Scroll({
      props: {
        zoomEnabled: true,
        doubleTapToZoom: false,
        maxZoomScale: this._props.maxZoomScale
      },
      layout: $layout.fill,
      views: [
        {
          type: "image",
          props: {
            id: "image",
            src: this._props.src,
            contentMode: 1
          },
          layout: $layout.fill
        }
      ],
      events: {
        ready: view => {
          $delay(0.1, () =>
            this._addGesture(view, gesture => {
              const location = gesture.$locationInView(view.ocValue());
              const realLocation = $point(location.x - view.bounds.x, location.y - view.bounds.y)
              const frame = this.view.frame
              if (realLocation.y <= frame.height / 2) {
                if (this._events.upperLocationTouched) this._events.upperLocationTouched(this)
              } else {
                if (this._events.lowerLocationTouched) this._events.lowerLocationTouched(this)
              }
            })
          );
        }
      }
    });
    return {
      type: "view",
      props: {
        id: this.id
      },
      views: [this.scroll.definition],
      layout: this._layout,
      events: {
        layoutSubviews: sender => {
          $delay(0.1, () => (this.src = this.src));
          $delay(0.3, () => (this.src = this.src));
        }
      }
    };
  }

  _addGesture(view, event) {
    const objectId = cvid.newId;
    $define({
      type: objectId + ": NSObject",
      events: {
        tapped: event
      }
    });
    const object = $objc(objectId).$new();
    $objc_retain(object); // 此步骤是必须的，否则将很快被系统释放掉，但是必须在关闭时手动释放掉，否则再次启动可能会有问题
    this._gestureObject = object;
    const tapGestureRecognizer = $objc("UITapGestureRecognizer")
      .$alloc()
      .$initWithTarget_action(this._gestureObject, "tapped:");
    view.ocValue().$addGestureRecognizer(tapGestureRecognizer);
  }

  releaseGestureObject() {
    if (this._gestureObject) $objc_release(this._gestureObject);
  }

  get src() {
    return this._props.src;
  }

  set src(src) {
    this._props.src = src;
    //this.scroll.view.zoomScale = 0;
    this.scroll.view.get("image").src = src;
  }

  get image() {
    return this.scroll.view.get("image").image;
  }
}

module.exports = EnhancedImageView;
