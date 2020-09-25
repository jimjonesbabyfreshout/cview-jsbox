# CView Custom NavigationBar

仿制 navBar

## features:

- 拥有隐藏、最小化、普通、扩展四种布局方式
  - 隐藏: 什么都不显示
  - 最小化: safeAreaHeight 为 25, 只显示 titleView, 若用 title, font 为\$font(14)
  - 普通: safeAreaHeight 为 50, 显示 titleView, leftBarButtonItems 或 popButton, rightBarButtonItems, 若用 title, font 为\$font("bold", 17)
  - 扩展: safeAreaHeight 为 100, 除上面的之外, 再显示一个 toolView
- 自动适应全面屏和非全面屏

## Arguments

props:

- 读写 style: number 0, 1, 2, 3，指定布局
- 读写 title: string 但必须使用此种方案才可以在生成后写入，自动创建 Label 作为 titleView
- titleView: cview 自定义的 titleView
- popButtonEnabled: boolean 返回上一级的按钮，若为 true，则 leftBarButtonItems 忽略
- popButtonTitle: string 返回上一级的按钮标题
- popToRootEnabled: boolean popButton 是否可以长按返回到顶级
- leftBarButtonItems: cview[]
  | {symbol: string, handler: () => void, tintColor?: JSBoxColor}[]
  | {title: string, handler: () => void, tintColor?: JSBoxColor}[]
  | {image: JSBoxImage, handler: () => void, tintColor?: JSBoxColor}[]  
  如果用的是 cview，其布局将被重新指定，即不需要（也不能）指定布局。可以通过 cview.width 来指定应有的宽度，如果没有此属性，则宽度为 50  
  建议最多放两个
- rightBarButtonItems 定义同上，建议最多放两个
- toolView: cview 在 expanded 模式下才会显现的
- tintColor: JSBoxColor 这将作用于 title, popButton, 自动创建的 barButton
- bgcolor: JSBoxColor 如不设置，则自动使用 blur(style 10)，如果设置则没有 blur 效果

events:

- hidden: cview => void  hide()时执行
- minimized: cview => void  minimize()时执行
- restored: cview => void  restore()时执行
- expanded: cview => void  expand()时执行
- popHandler: cview => void  返回上一级时执行，需要popButtonEnabled
- popToRootHandler: cview => void  返回顶级时执行，需要popButtonEnabled和popToRootEnabled
- titleTapped: cview => void 点击标题时执行，需要使用title

methods:

- hide() 隐藏布局
- minimize() 最小化布局
- restore() 普通布局
- expand() 扩展布局
