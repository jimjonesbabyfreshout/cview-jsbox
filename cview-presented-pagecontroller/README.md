# CView PresentedPageController

此控制器的 layout 必定为 `$layout.fill`

## Props

- presentMode?: number = 1
- animated?: boolean = true
- interactiveDismissalDisabled?: boolean = false
- bgcolor?: JSBoxColor = \$color("secondarySurface")

## 专用方法

- present() 在 `sheet.present()` 之后会先后执行 `load()` 和 `appear()`
- dismiss()
