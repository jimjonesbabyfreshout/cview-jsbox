const cvid = require("cview-util-cvid");

class BaseView {
  constructor() {
    this.id = cvid.newId;
  }

  _defineView() {
    return {};
  }

  get definition() {
    return this._defineView();
  }

  get created() {
    if (this._view) {
      return this._view;
    } else {
      this._view = $ui.create(this.definition);
      return this._view;
    }
  }

  get view() {
    if (this._view) {
      return this._view;
    } else {
      this._view = $(this.id);
      return this._view;
    }
  }

  add(view) {
    if (view instanceof BaseView) {
      this.view.add(view.definition);
    } else {
      this.view.add(view);
    }
  }
}

module.exports = BaseView;
