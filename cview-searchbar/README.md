# CView SearchBar

props

- 读写 text: string
- style: number 搜索框的样式
  - 0: 取消按钮在输入框内，聚焦时显示取消按钮
  - 1: 取消按钮在输入框右侧，聚焦时会有左右移动的动画
  - 2: 取消按钮布局同 1，但是 placeholder 平时显示在中间，聚焦时才会移动到左边。
    如果使用此样式，建议每次 blur 的时候都清除 text
- accessoryCview: cview 请通过下面的事件来和 SearchBar 互相操作
- placeholder: string
- cancelText: string
- tintColor: \$color("systemLink")
- bgcolor: colors.searchBarBgcolor

events

- didBeginEditing: cview => void
- didEndEditing: cview => void
- changed: cview => void
- returned: cview => void
