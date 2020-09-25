# CView BaseView

CView 框架中的视图基类。

## Overview

视图是 CView 框架的重点，也是其名称的由来，即“组件化视图”。CView 力求构建独立、高内聚低耦合、可重用、可测试、非侵入式的组件化视图。每一个都是可以分离使用的，可以单独的开发、测试、安装、使用，拥有单独的文档。它可以完全融入 JSBox 原本的使用方式。换言之，你可以全部使用 CView 开发，也可以只使用你喜欢的某一个组件或方法。

JSBox 创建 view 的方式，是先写一个形如 `{type, props, layout, events, views}` 的定义，然后通过 `view.add()` 添加，或者包含在 superView 的 views 属性中。这造成被创建的 UIView 和其定义是分离的，需要为每个 view 都起一个 id，通过 id 查找进行操作，如果只有几个简单的视图还可行，如果想创造复杂视图，这很不方便。

因此 CView 的目标是这样的：可以将一个控件的定义和实际创建的 UIView 绑定在一起，将这个控件所需要的属性、事件、方法、动画绑定在一起，同时这些绑定好的东西还可以通过继承和组合创造新的东西。如此一来，只需要有限的输入，就可以创建复杂的控件，只需要简单的指令，就可以进行复杂的计算，或者执行复杂的动画效果。让每个控件做到自己管理自己，极大的降低使用者心智负担。

为了让创建 View 不需要额外的学习成本，绝大多数 View 都是传入形如`{props, layout, events, views}`的参数，和 JSBox 原生一致。

### 属性和方法

CView 框架中最核心的 View 就是 `BaseView`，其他 View 都继承于此。拥有 5 个基本功能：

- 属性 `id`：自动创建唯一 id，免除了 id 可能重复的问题。如果需要也可以重新指定。
- 属性 `definition`：通过 definition 属性就可以获得某个 View 的定义，从而用 `view.add()` 添加，或者包含在 superView 的 views 属性中，如此一来就可以和 JSBox 原本的调用方式结合
- 属性 `view`：通过自动创建的唯一 id 进行查找，获得对应的 UIView 对象。如此一来就可以将控件的定义和 UIView 绑定在一起
- 属性 `created`：如果 UIView 已经被创建，则返回 UIView，否则执行 `$ui.create()`
- 方法 `add(view)`：添加子 view。其中 `view` 参数可以是 View，或 UIView，或 view 的定义
