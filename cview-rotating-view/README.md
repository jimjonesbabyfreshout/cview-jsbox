# CView RotatingView

创建一个可以旋转的视图。

理论上来说，这个视图的布局必须是方形的。


props: 

- image 图片
- tintColor
- contentMode = 1
- cview 使用自定义的cview，上面两项将失效
- rps = 0.5 每秒转多少圈
- clockwise = true 是否顺时针旋转

events:
- ready: cview => void 可以在ready事件中启动旋转

methods:
- startRotating() 开始旋转
- stopRotating() 结束旋转，请注意旋转是不能立即结束的，必须等到动画归位