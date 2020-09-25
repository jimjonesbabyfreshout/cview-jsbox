const BaseView = require("cview-baseview");

const selectableTypes = [
  "string",
  "number",
  "integer",
  "stepper",
  "list",
  "link",
  "action"
];

class PreferenceListView extends BaseView {
  constructor({ sections, props, layout, events = {} }) {
    super();
    this._sections = sections.map(n => ({
      title: n.title,
      rows: n.rows.map(r => ({ ...r }))
    }));
    this._props = {
      stringLeftInset: 120,
      infoAndLinkLeftInset: 120,
      sliderWidth: 200,
      tabWidth: 200,
      ...props
    };
    this._layout = layout;
    this._events = events;
  }

  _defineView() {
    return {
      type: "list",
      props: {
        style: 2,
        ...this._props,
        id: this.id,
        template: {
          views: [
            {
              type: "view",
              props: {
                id: "bgview",
                bgcolor: $color("secondarySurface")
              },
              layout: $layout.fill
            },
            {
              type: "label",
              props: {
                id: "title",
                font: $font(17)
              },
              layout: (make, view) => {
                make.top.bottom.inset(0);
                make.left.right.inset(15);
              }
            },
            {
              type: "view",
              props: {},
              layout: (make, view) => {
                make.top.bottom.inset(0);
                make.left.right.inset(15);
              },
              views: [
                {
                  type: "view",
                  props: {
                    id: "label_and_chevron"
                  },
                  layout: $layout.fill,
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
                        id: "label_before_chevron",
                        align: $align.right,
                        font: $font(17)
                      },
                      layout: (make, view) => {
                        make.centerY.equalTo(view.super);
                        make.left.inset(this._props.stringLeftInset - 15);
                        make.right.equalTo(view.prev.left).inset(5);
                      }
                    }
                  ]
                },
                {
                  type: "view",
                  props: {
                    id: "number_and_stepper"
                  },
                  layout: $layout.fill,
                  views: [
                    {
                      type: "stepper",
                      props: {
                        id: "stepper"
                      },
                      layout: (make, view) => {
                        make.centerY.equalTo(view.super);
                        make.right.inset(0);
                      },
                      events: {
                        changed: sender => {
                          const { section, row } = sender.info;
                          this._sections[section].rows[row].value =
                            sender.value;
                          this.view.data = this._map(this._sections);
                          if (this._events.changed)
                            this._events.changed(this.values);
                        }
                      }
                    },
                    {
                      type: "label",
                      props: {
                        id: "label_stepper",
                        align: $align.right
                      },
                      layout: (make, view) => {
                        make.top.bottom.inset(0);
                        make.right.equalTo(view.prev.left).inset(10);
                        make.width.equalTo(100);
                      }
                    }
                  ]
                },
                {
                  type: "view",
                  props: {
                    id: "slider_and_number"
                  },
                  layout: $layout.fill,
                  views: [
                    {
                      type: "slider",
                      props: {
                        id: "slider"
                      },
                      layout: (make, view) => {
                        make.centerY.equalTo(view.super);
                        make.right.inset(40);
                        make.width.equalTo(this._props.sliderWidth - 40);
                      },
                      events: {
                        changed: sender => {
                          const { section, row } = sender.info;
                          const options = this._sections[section].rows[row];
                          sender.next.text = this._handleSliderValue(
                            sender.value,
                            options.decimal,
                            options.min,
                            options.max
                          );
                        },
                        touchesEnded: sender => {
                          const { section, row } = sender.info;
                          const options = this._sections[section].rows[row];
                          this._sections[section].rows[
                            row
                          ].value = this._handleSliderValue(
                            sender.value,
                            options.decimal,
                            options.min,
                            options.max
                          );
                          this.view.data = this._map(this._sections);
                          if (this._events.changed)
                            this._events.changed(this.values);
                        }
                      }
                    },
                    {
                      type: "label",
                      props: {
                        id: "label_slider",
                        text: this._value || this._min,
                        align: $align.center
                      },
                      layout: (make, view) => {
                        make.top.bottom.inset(0);
                        make.right.inset(0);
                        make.width.equalTo(44);
                      }
                    }
                  ]
                },
                {
                  type: "switch",
                  props: {
                    id: "switch"
                  },
                  layout: (make, view) => {
                    make.centerY.equalTo(view.super);
                    make.right.inset(0);
                  },
                  events: {
                    changed: sender => {
                      const { section, row } = sender.info;
                      this._sections[section].rows[row].value = sender.on;
                      $delay(0.2, () => {
                        this.view.data = this._map(this._sections);
                        if (this._events.changed)
                          this._events.changed(this.values);
                      });
                    }
                  }
                },
                {
                  type: "tab",
                  props: {
                    id: "tab"
                  },
                  layout: (make, view) => {
                    make.centerY.equalTo(view.super);
                    make.height.equalTo(32);
                    make.width.equalTo(this._props.tabWidth);
                    make.right.inset(0);
                  },
                  events: {
                    changed: sender => {
                      const { section, row } = sender.info;
                      this._sections[section].rows[row].value = sender.index;
                      $delay(0.3, () => {
                        this.view.data = this._map(this._sections);
                        if (this._events.changed)
                          this._events.changed(this.values);
                      });
                    }
                  }
                },
                {
                  type: "label",
                  props: {
                    id: "label_info_link",
                    align: $align.right
                  },
                  layout: (make, view) => {
                    make.top.bottom.inset(0);
                    make.left.inset(this._props.infoAndLinkLeftInset);
                    make.right.inset(0);
                  }
                }
              ]
            }
          ]
        },
        data: this._map(this._sections)
      },
      layout: this._layout,
      events: {
        didSelect: (sender, indexPath, data) => {
          const row = this._sections[indexPath.section].rows[indexPath.row];
          if (!selectableTypes.includes(row.type)) return;
          switch (row.type) {
            case "string": {
              $input.text({
                type: $kbType.default,
                placeholder: row.placeholder,
                text: row.value,
                handler: text => {
                  row.value = text;
                  sender.data = this._map(this._sections);
                  if (this._events.changed) this._events.changed(this.values);
                }
              });
              break;
            }
            case "number": {
              $input.text({
                type: $kbType.decimal,
                placeholder: row.placeholder,
                text: row.value,
                handler: text => {
                  let num = this._handleText(text, row.type);
                  if (row.min !== undefined && num < row.min) num = this.min;
                  if (row.max !== undefined && num > row.max) num = this.max;
                  row.value = num;
                  sender.data = this._map(this._sections);
                  if (this._events.changed) this._events.changed(this.values);
                }
              });
              break;
            }
            case "integer": {
              $input.text({
                type: $kbType.number,
                placeholder: row.placeholder,
                text: row.value,
                handler: text => {
                  let num = this._handleText(text, row.type);
                  if (row.min !== undefined && num < row.min) num = row.min;
                  if (row.max !== undefined && num > row.max) num = row.max;
                  row.value = num;
                  sender.data = this._map(this._sections);
                  if (this._events.changed) this._events.changed(this.values);
                }
              });
              break;
            }
            case "stepper": {
              $input.text({
                type: $kbType.number,
                placeholder: row.placeholder,
                text: row.value,
                handler: text => {
                  let num = this._handleText(text, row.type);
                  if (num === undefined && row.min !== undefined) num = row.min;
                  if (row.min !== undefined && num < row.min) num = row.min;
                  if (row.max !== undefined && num > row.max) num = row.max;
                  row.value = num;
                  sender.data = this._map(this._sections);
                  if (this._events.changed) this._events.changed(this.values);
                }
              });
              break;
            }
            case "list": {
              $ui.menu({
                items: row.items,
                handler: (title, index) => {
                  row.value = index;
                  sender.data = this._map(this._sections);
                  if (this._events.changed) this._events.changed(this.values);
                }
              });
              break;
            }
            case "link": {
              $safari.open({ url: row.value });
              break;
            }
            case "action": {
              row.value();
              break;
            }
            default:
              break;
          }
        }
      }
    };
  }

  _handleText(text, type) {
    switch (type) {
      case "number": {
        const number = parseFloat(text);
        if (isNaN(number)) return;
        return number;
      }
      case "integer": {
        const number = parseInt(text);
        if (isNaN(number)) return;
        return number;
      }
      case "stepper": {
        const number = parseInt(text);
        if (isNaN(number)) return;
        return number;
      }
      default:
        return text;
    }
  }

  _handleSliderValue(num, decimal, min, max) {
    if (decimal === undefined) decimal = 1;
    if (isNaN(num)) num = min;
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    const adjustedValue = parseFloat(num.toFixed(decimal));
    return adjustedValue;
  }

  _map(sections) {
    function generateDefaultRow(options) {
      return {
        bgview: { hidden: selectableTypes.includes(options.type) }, // bgview其实是用于调整selectable, 显示此视图就没有highlight效果
        title: {
          text: options.title,
          textColor: options.titleColor || $color("primaryText")
        }, // 标题, 同时用于action
        label_and_chevron: { hidden: true }, // 用于string, number, integer, list
        number_and_stepper: { hidden: true }, // 用于stepper
        slider_and_number: { hidden: true }, // 用于slider
        switch: { hidden: true }, // 用于boolean
        tab: { hidden: true }, // 用于tab
        label_info_link: { hidden: true } // 用于info, link
      };
    }
    return sections.map((section, sectionIndex) => ({
      title: section.title,
      rows: section.rows.map((n, rowIndex) => {
        const data = generateDefaultRow(n);
        switch (n.type) {
          case "string": {
            data.label_and_chevron.hidden = false;
            data.label_before_chevron = {
              textColor: n.textColor || $color("primaryText"),
              text: n.value === undefined ? "" : n.value
            };
            break;
          }
          case "number": {
            data.label_and_chevron.hidden = false;
            data.label_before_chevron = {
              textColor: n.textColor || $color("primaryText"),
              text: n.value === undefined ? "" : n.value
            };
            break;
          }
          case "integer": {
            data.label_and_chevron.hidden = false;
            data.label_before_chevron = {
              textColor: n.textColor || $color("primaryText"),
              text: n.value === undefined ? "" : n.value
            };
            break;
          }
          case "stepper": {
            data.number_and_stepper.hidden = false;
            data.label_stepper = {
              textColor: $color("primaryText"),
              text: n.value === undefined ? "" : n.value
            };
            data.stepper = {
              min: n.min,
              max: n.max,
              value: n.value,
              info: { section: sectionIndex, row: rowIndex, key: n.key }
            };
            break;
          }
          case "boolean": {
            data.switch = {
              hidden: false,
              on: n.value,
              onColor: n.onColor || $color("#34C85A"),
              thumbColor: n.thumbColor,
              info: { section: sectionIndex, row: rowIndex, key: n.key }
            };
            break;
          }
          case "slider": {
            data.slider_and_number.hidden = false;
            const adjustedValue = this._handleSliderValue(
              n.value,
              n.decimal,
              n.min,
              n.max
            );
            data.label_slider = {
              textColor: $color("primaryText"),
              text: adjustedValue
            };
            data.slider = {
              value: adjustedValue,
              info: { section: sectionIndex, row: rowIndex, key: n.key },
              min: n.min,
              max: n.max,
              minColor: n.minColor || $color("systemLink"),
              maxColor: n.maxColor,
              thumbColor: n.thumbColor
            };
            break;
          }
          case "list": {
            data.label_and_chevron.hidden = false;
            data.label_before_chevron = {
              textColor: $color("secondaryText"),
              text: n.items[n.value]
            };
            break;
          }
          case "tab": {
            data.tab = {
              hidden: false,
              items: n.items,
              index: n.value,
              info: { section: sectionIndex, row: rowIndex, key: n.key }
            };
            break;
          }
          case "info": {
            data.label_info_link = {
              hidden: false,
              textColor: $color("secondaryText"),
              text: n.value
            };
            break;
          }
          case "link": {
            data.label_info_link = {
              hidden: false,
              styledText: `[${n.value}]()`
            };
            break;
          }
          case "action": {
            data.title.textColor = n.destructive
              ? $color("red")
              : $color("systemLink");
            break;
          }
          default:
            break;
        }
        return data;
      })
    }));
  }

  get sections() {
    return this._sections;
  }

  set sections(sections) {
    this._sections = sections.map(n => ({
      title: n.title,
      rows: n.rows.map(r => ({ ...r }))
    }));
    this.view.data = this._map(this._sections);
  }

  get values() {
    const values = {};
    const excludedTypes = ["action", "info", "link"];
    this._sections.forEach(section => {
      section.rows.forEach(row => {
        if (row.key && !excludedTypes.includes(row.type)) {
          values[row.key] = row.value;
        }
      });
    });
    return values;
  }

  set(key, value) {
    this._sections.forEach(section => {
      section.rows.forEach(row => {
        if (row.key === key) row.value = value;
      });
    });
    this.view.data = this._map(this._sections);
  }
}

module.exports = PreferenceListView;
