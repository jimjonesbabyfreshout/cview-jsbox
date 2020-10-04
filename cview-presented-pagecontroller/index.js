const BaseController = require("cview-basecontroller");
const Sheet = require("cview-sheet");

class PresentedViewController extends BaseController {
  constructor({ props, events } = {}) {
    props = {type: 1 << 2, props}
    super({ props, events });
  }

  _create() {
    super._create();
    this._props.cview = this.rootView;
    this._props.dismissalHandler = () => this.remove();
    this._sheet = new Sheet(this._props);
  }

  present() {
    this._sheet.present()
    this.load()
    this.appear()
  }

  dismiss() {
    this._sheet.dismiss()
  }
}

module.exports = PresentedViewController;
