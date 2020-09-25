# CView PageViewer

props:
- 读写 page: number  
- 只写 cviews: cview[] cview的布局会被自动指定为占用一整页

events: 
- changed: (cview, page) => void 页面改变时回调
- floatPageChanged: (cview, floatPage) => void 滚动时回调（用于绑定其他联合滚动的控件）

methods:
- scrollToPage(page: number) 滚动到某一页（带有动画效果）