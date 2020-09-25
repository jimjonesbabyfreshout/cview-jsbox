# CView Base Controller

CView 框架中的控制器基类。

Controller 最核心的内容是：

- 7 个核心属性：4 个读写属性（id, type, tags, superController），3 个只读属性(cviews, rootView, status)
- 5 个生命周期节点：创建、加载、显示、隐藏、销毁。均有对应的生命周期事件。

## Overview

Controller 是为了解决这些问题：

1. CView 框架中，View 层是独立的、被动的、收敛的，但这并不意味着程序逻辑中相互关联的、主动更新的、功能需要对外扩展的部分就消失了，Controller 层就是为了承载这一部分逻辑。
2. 对视图树的操作是必须的，但对一个比较大的项目来说，直接从顶层开始操作底层的某一个 View，太琐碎也太复杂。CView 的设计是数据交给 Controller，Controller 自行决定如何用数据更新 View，这是 Controller 的主要职责。
3. iOS 上的 App 绝大多数是分页的，因此每个 Controller 的控制范围就是某一页全部的 View。Controller 有根视图 rootView，Controller 所管理的视图应该被加载到 rootView 中。
4. Controller 有生命周期，通过生命周期事件可以进行自动化的管理。
5. 通过自动创建监视器 Router，用多叉树来记录 Controller，从而实现 Controller 的追踪和查找。

## Controller 的属性、事件和方法

Controller 依旧采用 `{ props，layout，events }` 的参数结构。

其中 layout 用于 rootView，默认为 `$layout.fill`

### 属性

7 个核心属性: 4 个读写属性 + 3 个只读属性

其中读写属性只能在 Controller 加载之前重新写入

- id?: string 可以指定 id，如不指定，会自动赋值全局唯一 id
- superController?: Controller | string 上级 Controller 或者上级 Controller 的 id，如不指定，默认为当前焦点的 Controller
- tags?: string[] 可以设置标签，方便在 Router 中查找
- type?: number = 0 类型，可以并存
  - defaultController: 0 无特异性
  - rootController: 1 << 0 根控制器，如果要使用 uirender 调用，则必须为此类型
  - pushedPageController: 1 << 1 push 页面，如果要使用 uipush 调用，则必须为此类型，和 rootController 不能并存
  - presentedPageController: 1 << 2 presented 页面，和 pushedPageController 不能并存
  - pagingController: 1 << 3 同一原生页面下的分页控制器。特性为必须有 index 属性，并指向其当前的显示的子控制器
- 只读 cviews: {}
- 只读 rootView: BaseView
- 只读 status
  - created = 0 被创建，未被加载
  - loaded = 1 被加载，显示状态未知
  - appearing = 2 处于可显示状态
  - disappearing = 3 处于不显示状态
  - removed = 4 根视图被移除

其他可选属性:

- 只写 bgcolor?: JSBoxColor = \$color("primarySurface") rootView 的 bgcolor

### 事件

生命周期事件：

1. didCreate: controller => void 在 Controller 被创建后时候执行
   - 适合为 rootView 添加子 view
   - 注意这个节点只能添加定义，不能涉及对 UIView 的任何操作
1. didLoad: controller => void 在 rootView 被加载之后执行
   - 可以在 rootView 的 ready 事件中自动执行，也可以手动执行加快速度
   - 也可以在这个节点为 rootView 添加子 view
   - 这个节点可以对 UIView 进行操作了
   - 可以向 Model 层请求初始数据
1. didAppear: controller => void 在 rootView 显现的时候执行
   - 向 Model 层请求刷新数据
1. didDisappear: controller => void 在 rootView 不可见的时候执行
   - 如果是持续执行的刷新行为，可以在此处转为暂停
1. didRemove: controller => void 在 rootView 被移除的时候执行
   - 应该在此节点释放自定义的 objc
   - 数据持久化

### 方法

加载方法：

1. uirender(props) 此方法只能使用一次，对应的 Controller 将成为顶级 Controller
1. uipush(props)
1. 直接让 rootView.definition 包含在其他 View 的 views 参数中

生命周期管理：

1. load() 会在 rootView 的 ready 事件中自动调用，也可以手动调用，以加速运行
1. appear()
1. disappear()
1. remove() 用来移除 Router 中的当前 Controller，**请注意此方法和 rootView 的移除无关**，如果通过 uirender 和 uipush，可以在销毁时自动执行 remove()

## 其他

- rootView 可以直接通过 rootView.views 设置其\_views 属性，其中元素可以为 view 定义也可以为 cview
