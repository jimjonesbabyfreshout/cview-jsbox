# CView PageControl

基于 Runtime 构建 PageControl

请注意本视图如果没有足够的横向宽度，会显示不全

## Props

- 只写 numberOfPages: numnber
- 读写 currentPage: number
- 只写 pageIndicatorTintColor?: JSBoxColor
- 只写 currentPageIndicatorTintColor?: JSBoxColor
- 其他通用属性

## Events

changed: (cview: Cview, currentPage: number) => void