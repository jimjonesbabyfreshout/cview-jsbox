# CView Dynamic ItemSize Matrix

此组件是为了解决让 Matrix 的 ItemSize 跟随重新布局而动态变化的问题

动态的改变自己的 itemSize，从而使得 spacing 被优先满足。
思路为在 matrix 上层套一个 superView，在旋转的时候 superView 会调用 matrix.relayout() 和 matrix.reload()
从而触发 itemSize 事件

此视图的高度可以自动调整，需要 dynamicHeightEnabled 设为 true，且 layout 中要有关于 height 的约束

其排布逻辑是这样的:

1. 由 minItemWidth，spacing，maxColumns 这三个参数决定 cloumns，并结合 totalWidth 确定 itemSize.width
2. 确定 itemHeight 有两种方法:
   - fixedItemHeight 固定高度，优先级第二
   - event: itemHeight(width) => height 通过 width 动态计算，优先级最高

props:

可以使用 matrix 的全部属性

特殊属性:

- fixedItemHeight 固定 itemSize 高度
- minItemWidth 最小的 itemSize 宽度
- maxColumns 最大列数
- spacing
- dynamicHeightEnabled 此项为 true，那么 scrollEnabled 自动设为 false，且高度可以自动调整
  
events:

可以使用 matrix 除 itemSize 以外的全部事件

其他特殊事件:

- itemHeight: width => height 通过 itemWidth 动态计算 itemHeight


方法:
- heightToWidth(width) 计算特定width时的应有的高度