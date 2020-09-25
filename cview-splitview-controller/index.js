const cvid = require("cview-util-cvid");
const BaseView = require("cview-baseview");
const BaseController = require("cview-basecontroller");
const { ContentView } = require("cview-singleviews");

class SecondaryView extends BaseView {
  constructor({ props, layout, events = {}, views = [] }) {
    super();
    this._props = {
      bgcolor: $color("groupedBackground", "secondarySurface"),
      ...props
    };
    this._layout = layout;
    this._events = events;
    this._views = views;
    this._layouts = {
      hidden: (make, view) => {
        make.top.bottom.inset(0);
        make.right.equalTo(view.super.left);
        make.width.greaterThanOrEqualTo(250);
        make.width.equalTo(view.super).dividedBy(2.5).priority(999);
      },
      shown: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.super.left);
        make.width.greaterThanOrEqualTo(250);
        make.width.equalTo(view.super).dividedBy(2.5).priority(999);
      }
    };
  }

  _defineView() {
    this.line = new ContentView({
      props: {
        bgcolor: $color("separatorColor")
      },
      layout: (make, view) => {
        make.top.bottom.right.inset(0);
        make.width.equalTo(0.5);
      }
    });
    return {
      type: "view",
      props: {
        ...this._props,
        id: this.id
      },
      layout: this._layout,
      views: [...this._views, this.line.definition]
    };
  }

  add(view) {
    super.add(view);
    this.line.view.moveToFront();
  }

  show() {
    this.view.remakeLayout(this._layouts.shown);
    $ui.animate({
      duration: 0.3,
      animation: () => this.view.relayout()
    });
  }

  hide() {
    this.view.remakeLayout(this._layouts.hidden);
    $ui.animate({
      duration: 0.3,
      animation: () => this.view.relayout()
    });
  }
}

class MaskView extends BaseView {
  constructor({ props, layout = $layout.fill, events = {} } = {}) {
    super();
    this._props = { bgcolor: $color("clear"), ...props };
    this._layout = layout;
    this._events = events;
    this._shown = false;
    this._dismissEvent = () => {
      if (!this._shown) return;
      if (this._props.dismissHandler) this._props.dismissHandler();
    };
  }

  _defineView() {
    return {
      type: "view",
      props: {
        ...this._props,
        hidden: true,
        id: this.id
      },
      layout: this._layout,
      events: {
        ...this._events,
        ready: sender => this._addGesture(sender, this._dismissEvent)
      }
    };
  }

  _addGesture(view, event) {
    const objectId = cvid.newId;
    $define({
      type: objectId + ": NSObject",
      events: {
        swipeEvent: event,
        tapEvent: event
      }
    });
    const object = $objc(objectId).$new();
    $objc_retain(object); // 此步骤是必须的，否则将很快被系统释放掉，但是必须在关闭时手动释放掉，否则再次启动可能会有问题
    this._gestureObject = object;
    const swipeGestureRecognizer = $objc("UISwipeGestureRecognizer")
      .$alloc()
      .$initWithTarget_action(object, "swipeEvent");
    swipeGestureRecognizer.$setDirection(1 << 1); // 从右向左划动
    const tapGestureRecognizer = $objc("UITapGestureRecognizer")
      .$alloc()
      .$initWithTarget_action(object, "tapEvent");
    view.ocValue().$addGestureRecognizer(tapGestureRecognizer);
    view.ocValue().$addGestureRecognizer(swipeGestureRecognizer);
  }

  releaseGestureObject() {
    if (this._gestureObject) $objc_release(this._gestureObject);
  }

  show() {
    this._shown = true;
    this.view.moveToFront();
    this.view.hidden = false;
  }

  hide() {
    this._shown = false;
    this.view.hidden = true;
  }
}

class SplitViewController extends BaseController {
  constructor({ props, layout, events } = {}) {
    props = { type: 1 << 3, index: 0, ...props };
    if (!props.items || props.items.length !== 2)
      throw new Error("the length of items must be 2");
    super({ props, layout, events });
  }

  _createCviews() {
    this.cviews.secondaryView = new SecondaryView({
      props: {
        bgcolor:  this._props.items[1].bgcolor || $color("clear")
      },
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.right.equalTo(view.super.left);
        make.width.equalTo(view.super).dividedBy(3);
      },
      views: [
        this._props.items[1].controller.rootView.definition
      ]
    });
    this.cviews.maskView = new MaskView({
      props: {
        dismissHandler: () => (this.index = 0)
      }
    });
    this.cviews.primaryView = new ContentView({
      props: {
        bgcolor:  this._props.items[0].bgcolor || $color("clear")
      },
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right);
        make.width.equalTo(view.super);
      },
      views: [
        this._props.items[0].controller.rootView.definition,
        this.cviews.maskView.definition
      ]
    });
  }

  _create() {
    super._create();
    this._createCviews();
    this._screenEdgePanGestureObject = this._defineGestureObject(() => {
      if (this.index === 0) this.index = 1;
    });
    this.rootView.views = [this.cviews.secondaryView, this.cviews.primaryView];
  }

  load() {
    super.load();
    this._renewScreenEdgePanGesture();
  }

  remove() {
    $objc_release(this._screenEdgePanGestureObject);
    this.cviews.maskView.releaseGestureObject();
    super.remove();
  }

  uirender() {
    const props = {
      navBarHidden: true,
      statusBarStyle: 0
    };
    super.uirender(props);
  }

  uipush() {
    const props = {
      navBarHidden: true,
      statusBarStyle: 0
    };
    super.uipush(props);
  }

  _defineGestureObject(event) {
    const objectId = cvid.newId;
    $define({
      type: objectId + ": NSObject",
      events: {
        screenEdgePanEvent: event
      }
    });
    const object = $objc(objectId).$new();
    $objc_retain(object);
    return object;
  }

  _renewScreenEdgePanGesture() {
    const UIScreenEdgePanGestureRecognizer = $ui.vc.view
      .runtimeValue()
      .$gestureRecognizers()
      .$firstObject();

    UIScreenEdgePanGestureRecognizer.invoke("removeTarget:action:", null, null);
    const NewUIScreenEdgePanGestureRecognizer = $objc(
      "UIScreenEdgePanGestureRecognizer"
    )
      .$alloc()
      .$initWithTarget_action(
        this._screenEdgePanGestureObject,
        "screenEdgePanEvent"
      );
    NewUIScreenEdgePanGestureRecognizer.$setEdges(1 << 1);
    this.rootView.view
      .ocValue()
      .$addGestureRecognizer(NewUIScreenEdgePanGestureRecognizer);
  }

  _showSideBar() {
    this.cviews.secondaryView.show();
    this.cviews.maskView.show();
  }

  _hideSideBar() {
    this.cviews.secondaryView.hide();
    this.cviews.maskView.hide();
  }

  get index() {
    return this._props.index;
  }

  set index(num) {
    if ((num !== 1 && num !== 0) || this._props.index === num) return;
    if (num === 1) {
      this._showSideBar();
    } else {
      this._hideSideBar();
    }
    this._props.index = num;
  }
}

module.exports = SplitViewController;
