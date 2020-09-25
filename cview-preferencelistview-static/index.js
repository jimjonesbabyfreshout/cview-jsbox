const BaseView = require("cview-baseview");

// 计算特定字号的文字长度
// 此函数不应该用于处理超长文本
function getTextSize(text, { font = $font(17) } = {}) {
  return $text.sizeThatFits({
    text,
    width: 10000,
    font,
    align: $align.center,
    lineSpacing: 0
  });
}

const selectableTypes = [
  "string",
  "number",
  "integer",
  "stepper",
  "list",
  "link",
  "action"
];

class Cell extends BaseView {
  constructor(
    {
      type,
      key,
      title,
      value,
      titleColor = $color("primaryText"),
      changedEvent
    } = { type }
  ) {
    super();
    this._type = type;
    this._key = key;
    this._title = title;
    this._value = value;
    this._titleColor = titleColor;
    this._changedEvent = changedEvent;
  }

  _defineView() {
    return {
      type: "view",
      props: {
        selectable: selectableTypes.includes(this._type),
        id: this.id
      },
      layout: $layout.fill,
      views: [this._defineTitleView(), this._defineValueView()]
    };
  }

  _defineTitleView() {
    return {
      type: "label",
      props: {
        id: "title",
        text: this._title,
        textColor: this._titleColor,
        font: $font(17)
      },
      layout: (make, view) => {
        make.centerY.equalTo(view.super);
        make.width.equalTo(Math.ceil(getTextSize(this._title).width) + 3);
        make.left.inset(15);
      }
    };
  }

  set value(value) {
    if (this._handleValue) value = this._handleValue(value);
    if (this._key) this._values[this._key] = value;
    this._value = value;
  }

  get value() {
    return this._value;
  }

  get type() {
    return this._type;
  }

  get key() {
    return this._key;
  }
}

class BaseStringCell extends Cell {
  constructor(props, values) {
    super(props);
    const { placeholder, textColor } = props;
    this._placeholder = placeholder;
    this._textColor = textColor;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "view",
      props: {},
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right).inset(10);
        make.right.inset(15);
      },
      views: [
        {
          type: "image",
          props: {
            symbol: "chevron.right",
            tintColor: $color("lightGray", "darkGray"),
            contentMode: 1
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.size.equalTo($size(17, 17));
            make.right.inset(0);
          }
        },
        {
          type: "label",
          props: {
            id: "label",
            text: this._handleText(this._value),
            align: $align.right,
            font: $font(17),
            textColor: this._textColor,
            bgcolor: $color("clear"),
            userInteractionEnabled: false
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.left.inset(0);
            make.right.equalTo(view.prev.left).inset(5);
          }
        }
      ]
    };
  }

  _handleValue(text) {
    const result = this._handleText(text);
    if (result === undefined) this.view.get("label").text = "";
    else this.view.get("label").text = result;
    return result;
  }
}

class StringCell extends BaseStringCell {
  constructor(props, values) {
    super(props, values);
  }

  _handleText(text) {
    return text;
  }
}

class NumberCell extends BaseStringCell {
  constructor(props, values) {
    super(props, values);
    const { min, max } = props;
    this._min = min;
    this._max = max;
    this._kbType = $kbType.number;
  }

  _handleText(text) {
    if (!text) return;
    const result = parseFloat(text);
    if (isNaN(result)) return;
    if (this._min !== undefined && result < this._min) return;
    if (this._max !== undefined && result > this._max) return;
    return result;
  }
}

class IntegerCell extends BaseStringCell {
  constructor(props, values) {
    super(props, values);
    const { min, max } = props;
    this._min = min;
    this._max = max;
    this._kbType = $kbType.number;
  }

  _handleText(text) {
    if (!text) return;
    const result = parseInt(text);
    if (isNaN(result)) return;
    if (this._min !== undefined && result < this._min) return;
    if (this._max !== undefined && result > this._max) return;
    return result;
  }
}

class StepperCell extends Cell {
  constructor(props, values) {
    super(props);
    const { max, min, placeholder } = props;
    this._max = max;
    this._min = min;
    this._placeholder = placeholder;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "view",
      props: {},
      views: [
        {
          type: "stepper",
          props: {
            id: "stepper",
            value: this._value || this._min,
            max: this._max,
            min: this._min
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.right.inset(0);
          },
          events: {
            changed: sender => {
              this.value = sender.value;
              if (this._changedEvent) this._changedEvent();
            }
          }
        },
        {
          type: "label",
          props: {
            id: "label",
            text: this._value || this._min,
            align: $align.right
          },
          layout: (make, view) => {
            make.top.bottom.inset(0);
            make.right.equalTo(view.prev.left).inset(10);
            make.width.equalTo(30);
          }
        }
      ],
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right).inset(10);
        make.right.inset(15);
      }
    };
  }

  _handleValue(num) {
    if (isNaN(num)) num = this._min;
    if (this._min !== undefined && num < this._min) num = this._min;
    if (this._max !== undefined && num > this._max) num = this._max;
    this.view.get("label").text = num;
    this.view.get("stepper").value = num;
    return num;
  }
}

class BooleanCell extends Cell {
  constructor(props, values) {
    super(props);
    const { onColor = $color("#34C85A"), thumbColor } = props;
    this._onColor = onColor;
    this._thumbColor = thumbColor;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "switch",
      props: {
        id: "switch",
        on: this._value,
        onColor: this._onColor,
        thumbColor: this._thumbColor
      },
      layout: (make, view) => {
        make.size.equalTo($size(51, 31));
        make.centerY.equalTo(view.super);
        make.right.inset(15);
      },
      events: {
        changed: sender => {
          this.value = sender.on;
          if (this._changedEvent) this._changedEvent();
        }
      }
    };
  }

  _handleValue(bool) {
    this.view.get("switch").on = bool;
    return bool;
  }
}

class SliderCell extends Cell {
  constructor(props, values) {
    super(props);
    const {
      decimal = 1,
      min = 0,
      max = 1,
      minColor = $color("systemLink"),
      maxColor,
      thumbColor
    } = props;
    this._decimal = decimal;
    this._min = min;
    this._max = max;
    this._minColor = minColor;
    this._maxColor = maxColor;
    this._thumbColor = thumbColor;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "view",
      props: {},
      views: [
        {
          type: "label",
          props: {
            id: "label",
            text: this._value.toFixed(this._decimal),
            align: $align.center
          },
          layout: (make, view) => {
            make.top.right.bottom.inset(0);
            make.width.equalTo(44);
          }
        },
        {
          type: "slider",
          props: {
            id: "slider",
            value: this._value,
            max: this._max,
            min: this._min,
            minColor: this._minColor,
            maxColor: this._maxColor,
            thumbColor: this._thumbColor,
            continuous: true
          },
          layout: (make, view) => {
            make.top.left.bottom.inset(0);
            make.right.equalTo(view.prev.left);
          },
          events: {
            changed: sender => {
              const adjustedValue = parseFloat(
                sender.value.toFixed(this._decimal)
              );
              sender.prev.text = adjustedValue;
              if (this._key) {
                this._values[this._key] = adjustedValue;
                this._value = adjustedValue;
              }
            },
            touchesEnded: sender => {
              const adjustedValue = parseFloat(
                sender.value.toFixed(this._decimal)
              );
              this.value = adjustedValue;
              if (this._changedEvent) this._changedEvent();
            }
          }
        }
      ],
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.lessThanOrEqualTo(view.prev.right).inset(10).priority(999);
        make.width.lessThanOrEqualTo(250);
        make.right.inset(15);
      }
    };
  }

  _handleValue(num) {
    if (isNaN(num)) num = this._min;
    if (this._min !== undefined && num < this._min) num = this._min;
    if (this._max !== undefined && num > this._max) num = this._max;
    const adjustedValue = parseFloat(num.toFixed(this._decimal));
    this.view.get("label").text = adjustedValue;
    this.view.get("slider").value = adjustedValue;
    return adjustedValue;
  }
}

class ListCell extends Cell {
  constructor(props, values) {
    super(props);
    const { items } = props;
    this._items = items;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "view",
      props: {},
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right).inset(10);
        make.right.inset(15);
      },
      views: [
        {
          type: "image",
          props: {
            symbol: "chevron.right",
            tintColor: $color("lightGray", "darkGray"),
            contentMode: 1
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.size.equalTo($size(17, 17));
            make.right.inset(0);
          }
        },
        {
          type: "label",
          props: {
            id: "label",
            text: this._items[this._value],
            textColor: $color("secondaryText"),
            align: $align.right
          },
          layout: (make, view) => {
            make.centerY.equalTo(view.super);
            make.left.inset(0);
            make.right.equalTo(view.prev.left).inset(5);
          }
        }
      ]
    };
  }

  _handleValue(num) {
    this.view.get("label").text = this._items[num];
    return num;
  }
}

class TabCell extends Cell {
  constructor(props, values) {
    super(props);
    const { items, index = -1 } = props;
    this._items = items;
    this._index = index;
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "tab",
      props: {
        id: "tab",
        items: this._items,
        index: this._value
      },
      layout: (make, view) => {
        make.centerY.equalTo(view.super);
        make.height.equalTo(34);
        make.left.lessThanOrEqualTo(view.prev.right).inset(10).priority(999);
        make.width.lessThanOrEqualTo(250);
        make.right.inset(15);
      },
      events: {
        changed: sender => {
          this.value = sender.index;
          if (this._changedEvent) this._changedEvent();
        }
      }
    };
  }

  _handleValue(num) {
    this.view.get("tab").index = num;
    return num;
  }
}

class InfoCell extends Cell {
  constructor(props, values) {
    super(props);
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "label",
      props: {
        id: "label",
        text: this._value,
        textColor: $color("secondaryText"),
        align: $align.right
      },
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right).inset(10);
        make.right.inset(15);
      }
    };
  }

  _handleValue(text) {
    this.view.get("label").text = text;
    return text;
  }
}

class LinkCell extends Cell {
  constructor(props, values) {
    super(props);
    this._values = values;
  }

  _defineValueView() {
    return {
      type: "label",
      props: {
        id: "label",
        styledText: {
          text: this._value,
          font: $font(17),
          styles: [
            {
              range: $range(0, this._value.length),
              link: this._value
            }
          ]
        },
        align: $align.right
      },
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.right).inset(10);
        make.right.inset(15);
      }
    };
  }

  _handleValue(text) {
    this.view.get("label").styledText = {
      text,
      font: $font(17),
      userInteractionEnabled: true,
      styles: [
        {
          range: $range(0, text.length),
          link: text
        }
      ]
    };
    return text;
  }
}

class ActionCell extends Cell {
  constructor(props, values) {
    super(props);
    const { destructive = false } = props;
    this._destructive = destructive;
    this._values = values;
  }

  _defineTitleView() {
    return {
      type: "view",
      layout: make => make.width.equalTo(0)
    };
  }

  _defineValueView() {
    return {
      type: "label",
      props: {
        text: this._title,
        textColor: this._destructive ? $color("red") : $color("systemLink")
      },
      layout: (make, view) => {
        make.top.bottom.inset(0);
        make.left.equalTo(view.prev.left);
        make.left.right.inset(15);
      }
    };
  }
}

class PreferenceListView extends BaseView {
  constructor({ sections, props, layout, events = {} }) {
    super();
    this._sections = sections;
    this._values = {};
    const excludedTypes = ["action", "info", "link"];
    sections.forEach(section => {
      section.rows.forEach(row => {
        if (row.key && !excludedTypes.includes(row.type)) {
          this._values[row.key] = row.value;
        }
      });
    });
    this._props = props;
    this._layout = layout;
    this._events = events;
  }

  _defineView() {
    this._cells = this._sections.map(section => ({
      title: section.title,
      rows: section.rows.map(props => {
        if (this._events.changed)
          props.changedEvent = () => {
            this._events.changed(this.values);
          };
        return this._createCell(props);
      })
    }));
    return {
      type: "list",
      props: {
        style: 2,
        ...this._props,
        id: this.id,
        data: this._cells.map(section => ({
          title: section.title,
          rows: section.rows.map(cell => cell.definition)
        }))
      },
      layout: this._layout,
      events: {
        ...this._events,
        didSelect: (sender, indexPath, data) => {
          const cell = this._cells[indexPath.section].rows[indexPath.row];
          if (!selectableTypes.includes(cell.type)) return;
          switch (cell.type) {
            case "string": {
              $input.text({
                type: $kbType.default,
                placeholder: cell._placeholder,
                text: cell.value,
                handler: text => {
                  cell.value = text;
                  if (cell._changedEvent) cell._changedEvent();
                }
              });
              break;
            }
            case "number": {
              $input.text({
                type: $kbType.decimal,
                placeholder: cell._placeholder,
                text: cell.value,
                handler: text => {
                  cell.value = parseFloat(text);
                  if (cell._changedEvent) cell._changedEvent();
                }
              });
              break;
            }
            case "integer": {
              $input.text({
                type: $kbType.number,
                placeholder: cell._placeholder,
                text: cell.value,
                handler: text => {
                  cell.value = parseInt(text);
                  if (cell._changedEvent) cell._changedEvent();
                }
              });
              break;
            }
            case "stepper": {
              $input.text({
                type: $kbType.number,
                placeholder: cell._placeholder,
                text: cell.value,
                handler: text => {
                  cell.value = parseInt(text);
                  if (cell._changedEvent) cell._changedEvent();
                }
              });
              break;
            }
            case "list": {
              $ui.menu({
                items: cell._items,
                handler: (title, index) => {
                  cell.value = index;
                  if (cell._changedEvent) cell._changedEvent();
                }
              });
              break;
            }
            case "link": {
              console.info(cell.value);
              $safari.open({ url: cell.value });
              break;
            }
            case "action": {
              cell.value();
              break;
            }
            default:
              break;
          }
        }
      }
    };
  }

  _createCell(props) {
    const map = {
      string: StringCell,
      number: NumberCell,
      integer: IntegerCell,
      boolean: BooleanCell,
      stepper: StepperCell,
      slider: SliderCell,
      list: ListCell,
      tab: TabCell,
      info: InfoCell,
      link: LinkCell,
      action: ActionCell
    };
    const type = props.type;
    const Cell = map[type];
    return new Cell(props, this._values);
  }

  get values() {
    return this._values;
  }

  set(key, value) {
    this._cells.forEach(section => {
      section.rows.forEach(row => {
        if (row.key === key) row.value = value;
      });
    });
  }
}

module.exports = PreferenceListView;
