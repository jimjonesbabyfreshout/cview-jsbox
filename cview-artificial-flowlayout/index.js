const { Matrix } = require("cview-singleviews");
const BaseView = require("cview-baseview");
const cvid = require("cview-util-cvid");

class ArtificialFlowlayout extends BaseView {
  constructor({ sections, props, layout, events }) {
    super();
    this._sections = sections;
    this._props = {
      spacing: 5,
      itemHeight: 40,
      ...props
    };
    this._layout = layout;
    this._events = events;
    this._cellRootViewId = cvid.newId;
  }

  _defineView() {
    this._props.template = this._transpileTemplate(this._props.template);
    this.matrix = new Matrix({
      props: {
        ...this._props,
        itemHeight: undefined,
        scrollEnabled: false
      },
      layout: $layout.fill,
      events: {
        ...this._events,
        itemSize: (sender, indexPath) => {
          const item = this._sectionsWithBlankItems[indexPath.section].items[
            indexPath.item
          ];
          return $size(Math.max(item.width, 0), this._props.itemHeight);
        }
      }
    });
    return {
      type: "view",
      props: {
        id: this.id
      },
      layout: this._layout,
      events: {
        layoutSubviews: sender => {
          sender.relayout();
          this._width = sender.frame.width;
          const height = this.heightToWidth(sender.frame.width);
          this.view.updateLayout((make, view) => make.height.equalTo(height));
          this.reload();
          if (this._props.heightChanged)
            this._props.heightChanged(this, height);
        }
      },
      views: [this.matrix.definition]
    };
  }

  reload() {
    this.sections = this._sections;
  }

  set sections(sections) {
    this._sections = sections;
    this._sectionsWithBlankItems = this._sections.map(n => ({
      title: n.title,
      items: this._addBlankItem(n.items, this._width, this._props.spacing)
    }));
    this._props.data = this._sectionsWithBlankItems.map(n => ({
      title: n.title,
      items: n.items.map(n => n.data)
    }));
    this.matrix.view.data = this._props.data;
  }

  get sections() {
    return this._sections;
  }

  _addBlankItem(items, width, spacing) {
    const newItems = [];
    if (!items || items.length === 0) return newItems;
    // cumulativeWidth 是已经用掉的宽度 + 一个spacing
    let cumulativeWidth = spacing;
    for (const item of items) {
      // 防止itemWidth过宽
      const itemWidth = Math.min(item.width, width - 2 * spacing);
      // 本行放得下
      if (itemWidth + spacing <= width - cumulativeWidth) {
        cumulativeWidth += itemWidth + spacing;
        item.data[this._cellRootViewId] = { hidden: false };
        newItems.push({ data: item.data, width: itemWidth });
      } else {
        // 需放到下一行
        if (cumulativeWidth < width - spacing) {
          // 此处排除等于的情况
          // 补上一个空白占位的item
          const data = {};
          data[this._cellRootViewId] = { hidden: true };
          newItems.push({
            data,
            width: width - spacing - cumulativeWidth
          });
        }
        cumulativeWidth = itemWidth + spacing * 2;
        item.data[this._cellRootViewId] = { hidden: false };
        newItems.push({ data: item.data, width: itemWidth });
      }
    }
    if (cumulativeWidth < width -  spacing) {
      // 最后再补上一个空白占位的item
      const data = {};
      data[this._cellRootViewId] = { hidden: true };
      newItems.push({
        data,
        width: width - spacing - cumulativeWidth
      });
    }
    return newItems;
  }

  heightToWidth(width) {
    let height = 0;
    this.getSectionHeights(width).forEach(n => (height += n));
    return height;
  }

  getSectionHeights(width) {
    const spacing = this._props.spacing;
    const itemHeight = this._props.itemHeight;
    return this._sections.map(n =>
      this._calculateSectionHeight(n.items, width, spacing, itemHeight)
    );
  }

  _calculateSectionHeight(items, width, spacing, itemHeight) {
    if (!items || items.length === 0) return spacing * 2;
    let row = 1;
    let cumulativeWidth = spacing;
    for (const item of items) {
      const itemWidth = Math.min(item.width, width - 2 * spacing);
      if (itemWidth + spacing <= width - cumulativeWidth) {
        cumulativeWidth += itemWidth + spacing;
      } else {
        cumulativeWidth = itemWidth + spacing * 2;
        row += 1;
      }
    }
    return spacing * (row + 1) + itemHeight * row;
  }

  _transpileTemplate(template) {
    if (!template || typeof template !== "object") return;
    if (Array.isArray(template)) {
      return {
        views: [
          {
            type: "view",
            props: {
              id: this._cellRootViewId
            },
            layout: $layout.fill,
            views: template
          }
        ]
      };
    } else {
      const views = template.views;
      const topProps = template.props;
      if (!topProps) {
        return {
          views: [
            {
              type: "view",
              props: {
                id: this._cellRootViewId
              },
              layout: $layout.fill,
              views: views
            }
          ]
        };
      }
      if (topProps.id) delete topProps.id;
      return {
        views: [
          {
            type: "view",
            props: {
              id: this._cellRootViewId
            },
            layout: $layout.fill,
            views: {
              props: { ...topProps },
              layout: $layout.fill,
              views: views
            }
          }
        ]
      };
    }
  }
}

module.exports = ArtificialFlowlayout;
