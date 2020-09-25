const Sheet = require("cview-sheet");
const CustomNavigationBar = require("cview-custom-navigationbar");
const { l10n } = require("cview-util-localization");

class DialogSheet extends Sheet {
  constructor({ props }) {
    super({
      presentMode: props.presentMode || $device.isIpad ? 2 : 1,
      bgcolor: props.bgcolor
    });
    this._props = props;
    this._done = false;
  }

  promisify(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }

  present() {
    this._dismissalHandler = () => {
      if (!this._done && this.reject) this.reject("cancel");
    };
    this._navbar = this._defineNavBar();
    this._props.cview._layout = (make, view) => {
      make.bottom.equalTo(view.super);
      make.left.right.equalTo(view.super.safeArea);
      make.top.equalTo(view.prev.bottom);
    };
    this._view = {
      type: "view",
      props: {},
      views: [this._navbar.definition, this._props.cview.definition]
    };
    super.present();
  }

  done() {
    this._done = true;
    if (this.resolve && this._props.cview.result)
      this.resolve(this._props.cview.result());
    this.dismiss();
  }

  _defineNavBar() {
    return new CustomNavigationBar({
      props: {
        title: this._props.title,
        leftBarButtonItems: [
          { symbol: "xmark", handler: () => this.dismiss() }
        ],
        rightBarButtonItems: [
          { title: l10n("DONE"), handler: () => this.done() }
        ]
      }
    });
  }
}

module.exports = DialogSheet;
