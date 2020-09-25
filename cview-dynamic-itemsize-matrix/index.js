const BaseView = require("cview-baseview");
const { Matrix } = require("cview-singleviews");

class DynamicItemSizeMatrix extends BaseView {
  constructor({ props, layout, events = {} } = {}) {
    super();
    this._props = {
      fixedItemHeight: 40,
      minItemWidth: 96,
      maxColumns: 5,
      spacing: 6,
      //maxTotalWidth: 600,
      ...props
    };
    this._layout = layout;
    this._events = events;
    const { itemHeight, heightChanged, ...rest } = this._events;
    this._matrixEvents = rest;
    this._itemSizeWidth = 0;
    this._itemSizeHeight = 0;
  }

  _defineView() {
    this.matrix = new Matrix({
      props: {
        ...this._props,
        scrollEnabled: !this._props.dynamicHeightEnabled
      },
      layout: this._props.maxTotalWidth
        ? (make, view) => {
            make.center.equalTo(view.super);
            make.width.lessThanOrEqualTo(this._props.maxTotalWidth);
            make.width.equalTo(view.super).priority(999);
            make.height.equalTo(view.super);
          }
        : $layout.fill,
      events: {
        ...this._matrixEvents,
        itemSize: sender => $size(this._itemSizeWidth, this._itemSizeHeight)
      }
    });
    return {
      type: "view",
      props: {
        bgcolor: this._props.bgcolor,
        id: this.id
      },
      layout: this._layout,
      events: {
        layoutSubviews: sender => {
          sender.relayout();
          const { itemSizeWidth } = this._getColumnsAndItemSizeWidth(
            sender.frame.width,
            this._props.maxTotalWidth,
            this._props.minItemWidth,
            this._props.maxColumns,
            this._props.spacing
          );

          this._itemSizeWidth = itemSizeWidth;
          this._itemSizeHeight = this._events.itemHeight
            ? this._events.itemHeight(this._itemSizeWidth)
            : this._props.fixedItemHeight;
          this.matrix.view.reload();
          if (this._props.dynamicHeightEnabled) {
            const height = this.heightToWidth(sender.frame.width);
            sender.updateLayout(make => make.height.equalTo(height));
            if (this._events.heightChanged)
              this._events.heightChanged(this, height);
          }
        }
      },
      views: [this.matrix.definition]
    };
  }
  
  // 此为纯函数
  _getColumnsAndItemSizeWidth(
    containerWidth,
    maxTotalWidth,
    minItemWidth,
    maxColumns,
    spacing
  ) {
    const totalWidth = maxTotalWidth
      ? Math.min(maxTotalWidth, containerWidth)
      : containerWidth;
    const columns = Math.max(
      Math.min(
        Math.floor((totalWidth - spacing) / (minItemWidth + spacing)),
        maxColumns
      ),
      1
    );
    return {
      columns,
      itemSizeWidth: Math.floor(
        (totalWidth - spacing * (columns + 1)) / columns
      )
    };
  }

  heightToWidth(width) {
    const { columns, itemSizeWidth } = this._getColumnsAndItemSizeWidth(
      width,
      this._props.maxTotalWidth,
      this._props.minItemWidth,
      this._props.maxColumns,
      this._props.spacing
    );
    const rows = Math.ceil(this._props.data.length / columns);
    const itemSizeHeight = this._events.itemHeight
      ? this._events.itemHeight(itemSizeWidth)
      : this._props.fixedItemHeight;
    return rows * itemSizeHeight + (rows + 1) * this._props.spacing;
  }
}

module.exports = DynamicItemSizeMatrix;
