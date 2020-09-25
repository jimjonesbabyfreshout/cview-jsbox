# CView TabBar

本组件是为了仿制 UITabBar  
本组件不能指定布局而是应该指定 height（如果需要的话）  
典型的使用方式是添加在布局为$layout.fill的视图中，并指定 items

props:

- 只写 height: number = 50
- 只写 items: {symbol?: string, image?: JSBoxImage, title?: string}[]
- 只写 bgcolor?: JSBoxColor 如果不指定则背景使用blur（style 10），若指定则使用纯色视图
- 读写 index: number = 0
- 只写 selectedSegmentTintColor = \$color("tintColor")
- 只写 defaultSegmentTintColor = colors.footBarDefaultSegmentColor

events:

- changed: (cview, index) => void
- doubleTapped: (cview, index) => void

methods:

- hide(animated=true) 隐藏
- show(animated=true) 显示
