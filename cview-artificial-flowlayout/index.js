const { Matrix } = require("cview-singleviews");
const BaseView = require("cview-baseview");
const cvid = require("cview-util-cvid");

/**
 * 仿制的flowlayout
 * 通过在右侧插入空白的item，从而作出假象的左对齐。
 * 
 * 已知问题：
 *  - 当某一行中所占用的总宽度恰好使得右侧的剩余宽度在1 * spacing 到 2 * spacing之间，此时无法插入空白item，这一行的spacing将会被拉宽
 *  - 不可以依赖indexPath，请将原数据和此CView的数据分离，通过data中加入标记的方法来定位的原数据
 *
 * !!! layout当中必须有关于height的约束 ！！！
 *
 *  - columns不定，item宽度不相等但高度固定，spacing固定，左对齐，自动换行
 *  - 不可滚动，会自动调整自身的高度，因而拥有方法 heightToWidth(width: number): number 用于事前确定其应有的高度
 *    事件heightChanged: (cview, height) => void 用于高度变更时回调
 *  - 此控件不能直接指定props.data，而是需要指定sections，并且每个item都需要改为{data: any, width: number} 其中data代表原item的内容，width代表其应有的宽度
 *  - 如果item.width > frame.width - 2 * spacing, 那么生成的对应item将单独占用一行，其宽度为frame.width - 2 * spacing
 *  - 
 *
 * 特别参数
 *  - sections: {title: string, items: {data: any, width: number}[]}[]  即使只有单个section也必须用多sections的写法
 *    此参数可以在cview.view生成后重新写入
 *
 * props:
 *  - itemHeight 默认为40
 *  - spacing 默认为5
 *  - scrollEnabled 固定为false
 *
 * 除了props: data 和events: itemSize 不可用，其他均和matrix一致
 *
 * methods
 *  - heightToWidth(width: number): number
 *  - getSectionHeights(width: number): number[]
 *  - reload()
 */
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
