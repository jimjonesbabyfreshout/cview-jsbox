const { List } = require("cview-singleviews");

class DynamicRowHeightList extends List {
  constructor({ sections, props, layout, events }) {
    super({ props, layout, events });
    this._sections = sections;
  }

  _defineView() {
    this._props.data = this._sections.map(n => ({
      title: n.title,
      rows: n.rows.map(r => r.definition)
    }));
    this._events.rowHeight = (sender, indexPath) => {
      const cview = this._sections[indexPath.section].rows[indexPath.row];
      if (
        cview.heightToWidth &&
        typeof cview.heightToWidth === "function"
      )
        return cview.heightToWidth(sender.frame.width);
      else return 44;
    };
    return super._defineView();
  }
}

module.exports = DynamicRowHeightList;
