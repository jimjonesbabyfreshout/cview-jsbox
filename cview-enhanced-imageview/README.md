# CView EnhancedImageView

此视图是为了加强 imageView，实现以下目的：

- 点击实现上下翻页
- 双指放大缩小（不可以双击放大缩小）



props:

- 读写 src
- maxZoomScale

events:

- upperLocationTouched: cview => void 点击上半部分时触发
- lowerLocationTouched: cview => void 点击下半部分时触发


methods:

- releaseGestureObject 释放掉此视图中自定义的NSObject，请在视图将被释放的时候执行