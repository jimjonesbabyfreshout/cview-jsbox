# cview Sheet

创建新的 UIViewController，主要用于 formSheet 和 pageSheet

参数：

| argv                         | type     | default                     | description                |
| ---------------------------- | -------- | --------------------------- | -------------------------- |
| presentMode                  | number   | 1                           | pageSheet: 1, formSheet: 2 |
| animated                     | boolean  | true                        | 是否启用动画效果           |
| interactiveDismissalDisabled | boolean  | false                       | 是否禁用下拉退出           |
| bgcolor                      | \$color  | \$color("secondarySurface") | 背景色                     |
| cview                        | Cview    |                             | Cview                      |
| dismissalHandler             | function |                             | 退出时的回调               |

方法：

- present()
- dismiss()
