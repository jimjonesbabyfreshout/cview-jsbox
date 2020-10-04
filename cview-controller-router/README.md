# CView Controller Router

Router 通过将 Controller 记录在多叉树上，以记录 controller 的状态，并实现导航和查找。  
全局只有一个 Router。  

## 功能

- Controller 导航，即当前在哪里，如何去往另一个 Controller。
- 查找某个或某些 Controller。

## 属性

- 读写 slientModeEnabled?: boolean = true 静默模式。若开启不报错，若关闭，运行错误（类型错误，节点不存在，父节点不存在等）时会报错
- 只读 controllerTree 参见下面详解
- 读写 focus 目前处于激活状态的 Controller

### controllerTree

多叉树，每个节点记录父节点、子节点、controller。

其中 controller 需要包括以下属性：

- type: number 类型
- status: number 状态
- id: string 唯一 id，以供查找
- tags: string[] 标签

## 方法

- get(id: string): controller
- getByTag(tag: string): controller[]
- add(controller: controller, superController?: controller | string) 如果没有 superController，则自动添加到当前激活的 controller
- remove(controller: controller | string) 删除某个 controller，以及全部子节点
