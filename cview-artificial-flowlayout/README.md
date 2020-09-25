# cview ArtificialFlowlayout

仿制的 flowlayout  
通过在右侧插入空白的 item，从而作出假象的左对齐。

已知问题：

- 当某一行中所占用的总宽度恰好使得右侧的剩余宽度在 1 spacing 到 2 spacing 之间，此时无法插入空白 item，这一行的 spacing 将会被拉宽
- 不可以依赖 indexPath，请将原数据和此 CView 的数据分离，通过 data 中加入标记的方法来定位的原数据

!!! layout 当中必须有关于 height 的约束 ！！！

- columns 不定，item 宽度不相等但高度固定，spacing 固定，左对齐，自动换行
- 不可滚动，会自动调整自身的高度，因而拥有方法 heightToWidth(width: number): number 用于事前确定其应有的高度
  事件 heightChanged: (cview, height) => void 用于高度变更时回调
- 此控件不能直接指定 props.data，而是需要指定 sections，并且每个 item 都需要改为{data: any, width: number} 其中 data 代表原 item 的内容，width 代表其应有的宽度
- 如果 item.width > frame.width - 2 spacing, 那么生成的对应 item 将单独占用一行，其宽度为 frame.width - 2 spacing
-

特别参数

- sections: {title: string, items: {data: any, width: number}[]}[] 即使只有单个 section 也必须用多 sections 的写法
  此参数可以在 cview.view 生成后重新写入

props:

- itemHeight 默认为 40
- spacing 默认为 5
- scrollEnabled 固定为 false

除了 props: data 和 events: itemSize 不可用，其他均和 matrix 一致

methods

- heightToWidth(width: number): number
- getSectionHeights(width: number): number[]
- reload()
