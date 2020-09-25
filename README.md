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
