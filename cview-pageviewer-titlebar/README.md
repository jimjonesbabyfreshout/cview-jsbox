# CView PageViewer TitleBar

props:

- 只写 items: string[]
- 读写 index: number
- 只写 selectedItemColor
- 只写 defaultItemColor

events:

- changed: (cview, index) => void 在点击变更 index 的时候回调
