# cview PreferenceListView_dynamic

便捷的设置列表实现. 样式以及功能均以 PreferenceListView_static 为准.

优势在于:

- 可以实现 sections 重新写入.

劣势在于:

- 由于每个 cell 不能单独布局, 因此标题和内容的长度无法动态调整, 在两者都比较短的情况下没有问题, 长了布局可能会重叠.
- 不能真正实现 selectable 为 false, 分割线仍然会闪动

为了缓解上面的问题, 让修改布局无需调整源代码, 增加下列 props:

- stringLeftInset?: number = 120 将同时作用于 string, number, integer, list, 但是由于后三者内容可控, 可视为只作用于 string
- infoAndLinkLeftInset?: number = 120 作用于 info, link
- sliderWidth?: number = 200 作用于 slider
- tabWidth?: number = 200 作用于 tab
  注意以上的修改是应用于 template, 而不是应用于单个 cell 的

独特方法:

- cview.sections = sections 可以写入新的 sections
