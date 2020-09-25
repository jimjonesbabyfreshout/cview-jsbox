# cview PreferenceListView_static

便捷的设置列表实现. 其所有 cell 均为静态 cell, 可以同时使用 list 控件的 props(除了 template, data)和 events(除了 didSelect), 同时具有独特方法 set(key, value), 以及独特方法 changed

sections 为 Array, 里面的 section 定义:

- title?: string 标题.
- rows: {type: string}[] 内容

row定义: 

- 通用:

    - type: string 类型. 包括'string', 'number', 'integer', 'stepper','boolean', 'slider', 'list', 'tab','info', 'link', 'action'
    - key?: string 键. 如没有则不会返回其值.
    - title?: string 标题
    - value?: any 在下面专项里详解.
    - titleColor?: $color = $color("primaryText") 标题颜色

-  string:

    - value?: string
    - placeholder?: string
    - textColor?: $color = $color("primaryText")

-  number, integer:

    - value?: number
    - placeholder?: string
    - textColor?: $color = $color("primaryText")
    - min?: number 最小值
    - max?: number 最大值

- stepper:

    - value?: number
    - placeholder?: string
    - min?: number 最小值
    - max?: number 最大值

- boolean:

    - value?: boolean
    - onColor?: $color = $color("#34C85A")
    - thumbColor

- slider:

    - value?: number 即 slider.value
    - decimal?: number = 1 精度
    - min?: number
    - max?: number
    - minColor?: $color = $color("systemLink")
    - maxColor?: \$color
    - thumbColor?: \$color

- list:

    - value?: number 即 index, -1 时为不选
    - items?: string[]

- tab:

    - value?: number 即 index, -1 时为不选
    - items?: string[]

- info:

    - value?: string

- link:

    - value?: string url

- action:

    - value?: function 点击后会执行的函数
    - destructive?: boolean = false 是否为危险动作，若是则为红色

Methods:

- set(key, value) 设定 key 对应的 value
- cview.values 获取全部的 values

Events:

- changed: values => {}
