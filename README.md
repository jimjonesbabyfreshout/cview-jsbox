# CView-JSBox

为 JSBox 量身定做的微型框架。使用 MVC 架构，分为 Model、View、Controller 三部分。

## View

视图是 CView 框架的重点，也是其名称的由来，即“组件化视图”。CView 力求构建独立、高内聚低耦合、可重用、可测试、非侵入式的组件化视图。每一个都是可以分离使用的，可以单独的开发、测试、安装、使用，拥有单独的文档。

它可以完全融入 JSBox 原本的使用方式。换言之，你可以全部使用 CView 开发，也可以只使用你喜欢的某一个组件或方法。

参见 [BaseView](./cview-baseview/README.md)

## Controller

View 是独立、被动、收敛的，但这并不意味着程序逻辑中相互关联的、主动更新的、功能需要对外扩展的部分就消失了，必须由另外的层级来承担。另外，对视图树的操作是必须的，但对较大的项目来说，直接从顶层开始操作底层的某一个 View，太琐碎也太复杂。

因此，CView 这样设计：将数据交给 Controller，Controller 自行决定如何用数据更新其管理的 View。Controller 让数据和视图的逻辑解耦，起到连接两者的作用。

当然，如果应用功能简单，页数很少，那么可能并不需要 Controller 层，直接让 View 操作 API 获取数据即可。

参见 [BaseController](./cview-basecontroller/README.md)

## Model

Model 层定义数据结构，并获取、处理、缓存数据。Model 层应该根据实际业务而定制。

在 CView 中，为 JSBox 定制了几种可复用的模块：

- HttpLikeApi 可以在其中添加各种不同的 API，然后通过类似于 HTTP 方法访问，整体类似于 RESTful API
- quickSetting 快速读写设置
- cachedHttp 带有缓存功能 http 并发访问模块，此模块是为了防止同时间重复访问，以及短时间内再次访问的话，可以直接使用缓存
- imageDownloader 图片并发下载到本地

## 索引

### Views

- BaseView

  参见 [cview-baseview](./cview-baseview/README.md)

- ArtificialFlowlayout

  参见 [cview-artificial-flowlayout](./cview-artificial-flowlayout/README.md)

- CustomNavigationBar

  参见 [cview-custom-navigationbar](./cview-custom-navigationbar/README.md)

- DialogSheet

  参见 [cview-dialog-sheet](./cview-dialog-sheet/README.md)

- DynamicItemSizeMatrix

  参见 [cview-dynamic-itemsize-matrix](./cview-dynamic-itemsize-matrix/README.md)

- DynamicRowHeightList

  参见 [cview-dynamic-rowheight-list](./cview-dynamic-rowheight-list/README.md)

- EnhancedImageView

  参见 [cview-enhanced-imageview](./cview-enhanced-imageview/README.md)

- ImagePager

  参见 [cview-imagepager](./cview-imagepager/README.md)

- LoadingDoubleRings

  参见 [cview-loading-double-rings](./cview-loading-double-rings/README.md)

- LoadingDualRing

  参见 [cview-loading-dual-ring](./cview-loading-dual-ring/README.md)

- LoadingWedges

  参见 [cview-loading-wedges](./cview-loading-wedges/README.md)

- PageControl

  参见 [cview-pagecontrol](./cview-pagecontrol/README.md)

- PageViewer

  参见 [cview-pageviewer](./cview-pageviewer/README.md)

- PageViewerTitleBar

  参见 [cview-pageviewer-titlebar](./cview-pageviewer-titlebar/README.md)

- PreferenceListViewDynamic

  参见 [cview-preferencelistview-dynamic](./cview-preferencelistview-dynamic/README.md)

- PreferenceListViewStatic

  参见 [cview-preferencelistview-static](./cview-preferencelistview-static/README.md)

- RotatingView

  参见 [cview-rotating-view](./cview-rotating-view/README.md)

- SearchBar

  参见 [cview-searchbar](./cview-searchbar/README.md)

- Sheet

  参见 [cview-sheet](./cview-sheet/README.md)

- SpinnerAndroidstyle

  参见 [cview-spinner-androidstyle](./cview-spinner-androidstyle/README.md)

- SymbolButton

  参见 [cview-symbol-button](./cview-symbol-button/README.md)

- TabBar

  参见 [cview-tabbar](./cview-tabbar/README.md)

### SingleViews

JSBox 原本的控件

### Controllers

- BaseController

  参见 [cview-basecontroller](./cview-basecontroller/README.md)

- PageViewerController

  参见 [cview-pageviewer-controller](./cview-pageviewer-controller/README.md)

- SplitViewController

  参见 [cview-splitview-controller](./cview-splitview-controller/README.md)

- TabBarController

  参见 [cview-tabbar-controller](./cview-tabbar-controller/README.md)

- controllerRouter

  参见 [cview-controller-router](./cview-controller-router/README.md)

### Model

- HttpLikeApi

  参见 [cview-http-like-api](./cview-http-like-api/README.md)

### Methods

- uialert

  参见 [cview-uialert](./cview-uialert/README.md)

- plainAlert

  参见 [cview-plainalert](./cview-plainalert/README.md)

- inputAlert

  参见 [cview-inputalert](./cview-inputalert/README.md)

- loginAlert

  参见 [cview-loginalert](./cview-loginalert/README.md)

- textDialog

  参见 [cview-text-dialog](./cview-text-dialog/README.md)

- listDialog

  参见 [cview-list-dialog](./cview-list-dialog/README.md)

- formDialog

  参见 [cview-form-dialog](./cview-form-dialog/README.md)

### Utils

- cvid

  参见 [cview-util-cvid](./cview-util-cvid/README.md)

- path

  参见 [cview-util-path](./cview-util-path/README.md)

- rect

  参见 [cview-util-rect](./cview-util-rect/README.md)

- ui

  参见 [cview-util-ui](./cview-util-ui/README.md)
