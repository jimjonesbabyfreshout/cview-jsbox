const BaseView = require("cview-baseview");
const DialogSheet = require("cview-dialog-sheet");

class ListView extends BaseView {
  constructor({ items = [], multiSelectEnabled = false, values }) {
    super();
    this._items = items;
    this._multiSelectEnabled = multiSelectEnabled;
    this._values = values;
  }

  _defineView() {
    return {
      type: "list",
      props: {
        id: this.id,
        style: 2,
        data: this._items.map((n, i) => {
          if (typeof n === "string") {
            return {
              label: { text: n },
              image: { hidden: !this._values.includes(i) }
            };
          } else {
            return {
              label: n,
              image: { hidden: !this._values.includes(i) }
            };
          }
        }),
        template: {
          views: [
            {
              type: "label",
              props: {
                id: "label"
              },
              layout: (make, view) => {
                make.top.bottom.inset(0);
                make.left.inset(20);
                make.right.inset(50);
              }
            },
            {
              type: "image",
              props: {
                id: "image",
                symbol: "checkmark",
                contentMode: 1,
                tintColor: $color("systemLink")
              },
              layout: (make, view) => {
                make.top.bottom.right.inset(10);
                make.width.equalTo(30);
              }
            }
          ]
        }
      },
      layout: this._layout,
      events: {
        didSelect: (sender, indexPath) => {
          const data = sender.data;
          if (this._multiSelectEnabled) {
            data[indexPath.item].image.hidden = !data[indexPath.item].image
              .hidden;
          } else {
            data.forEach((n, i) => {
              n.image.hidden = i !== indexPath.item;
            });
          }
          sender.data = data;
        }
      }
    };
  }

  get values() {
    const filtered = this.view.data
      .map((n, i) => (n.image.hidden ? -1 : i))
      .filter(n => n !== -1);
    if (this._multiSelectEnabled) return filtered;
    else return filtered[0];
  }

  result() {
    return this.values
  }
}

function listDialog({ items, multiSelectEnabled, value, values = [], title }) {
  if (value) values = [value]
  const sheet = new DialogSheet({
    props: {
      title,
      bgcolor: $color("insetGroupedBackground"),
      cview: new ListView({items, multiSelectEnabled, values})
    }
  });
  return new Promise((resolve, reject) => {
    sheet.promisify(resolve, reject);
    sheet.present();
  });
}

module.exports = listDialog;
