# CView SplitView Controller

实现左右分栏布局的控制器, 本身不提供除了分割线以外的视觉效果

此控制器加载后，会禁用原本的ScreenEdgePanGesture，此控制器应该作为根控制器使用

## Props

- 只写 items: { controller: Controller, bgcolor: JSBoxColor }[] 其中第一个放在主视图上, 第二个放在次视图上
- 读写 index: number = 0 为0时侧栏隐藏，为1时侧栏显示

