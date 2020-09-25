const cvid = require("cview-util-cvid");

const UIModalPresentationStyle = {
  automatic: -2,
  pageSheet: 1,
  formSheet: 2,
  fullScreen: 0,
  currentContext: 3,
  custom: 4,
  overFullScreen: 5,
  overCurrentContext: 6,
  popover: 7,
  none: -1
};

class Sheet {
  constructor({
    presentMode = UIModalPresentationStyle.pageSheet,
    animated = true,
    interactiveDismissalDisabled = false,
    bgcolor = $color("secondarySurface"),
    view,
    dismissalHandler
  } = {}) {
    this._animated = animated;
    this._presentMode = presentMode;
    this._interactiveDismissalDisabled = interactiveDismissalDisabled;
    this._bgcolor = bgcolor;
    this._view = view;
    this._dismissalHandler = dismissalHandler;
    this.id = cvid.newId;
    
  }

  _create() {
    this._define();
    this._PSViewController = $objc(this.id).invoke("alloc.init");
    this._PSViewControllerView = this._PSViewController.$view();
    this._PSViewControllerView.$setBackgroundColor(this._bgcolor);
    this._PSViewController.$setModalPresentationStyle(this._presentMode);
    if (this._interactiveDismissalDisabled)
      this._PSViewController.$setModalInPresentation(true);
    if (this._view) this._add(this._view);
  }

  _define() {
    $define({
      type: this.id + ": UIViewController",
      events: {
        "viewDidDisappear:": () => {
          if (this._dismissalHandler) this._dismissalHandler();
        }
      }
    });
  }

  _add(view) {
    view.layout = $layout.fill
    this._PSViewControllerView.jsValue().add(view);
  }

  present() {
    this._create()
    $ui.vc
      .ocValue()
      .invoke(
        "presentModalViewController:animated",
        this._PSViewController,
        this._animated
      );
  }

  dismiss() {
    this._PSViewController.invoke("dismissModalViewControllerAnimated", true);
  }
}

module.exports = Sheet;
