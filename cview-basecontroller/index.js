const BaseView = require("cview-baseview");
const { ContentView } = require("cview-singleviews");
const cvid = require("cview-util-cvid");
const router = require("cview-controller-router");

const controllerTypes = {
  defaultController: 0,
  // 无特异性
  rootController: 1 << 0,
  // 根控制器，如果要使用 uirender 调用，则必须为此类型
  pushedPageController: 1 << 1,
  // push页面，如果要使用 uipush 调用，则必须为此类型，和 rootController 不能并存
  presentedPageController: 1 << 2,
  // presented页面，和 pushedPageController 不能并存
  pagingController: 1 << 3
  // 同一原生页面下的分页控制器。特性为必须有 index 属性，并指向其当前的显示的子控制器
};

/**
 * status
 *   - created = 0 被创建，未被加载
 *   - loaded = 1 被加载，显示状态未知
 *   - appeared= 2 处于可显示状态
 *   - disappeared = 3 处于不显示状态
 *   - removed = 4 根视图被移除
 * 其中只有 2 和 3 可以相互转化，其他不可以
 */
const controllerStatus = {
  created: 0,
  loaded: 1,
  appeared: 2,
  disappeared: 3,
  removed: 4
};

class RootView extends ContentView {
  constructor(option) {
    super(option);
    this.views = this.views;
  }

  get views() {
    return this._views;
  }

  set views(argv) {
    if (!this._views) this._views = [];
    if (!Array.isArray(argv)) return;
    argv.forEach(n => {
      if (n instanceof BaseView) this._views.push(n.definition);
      else this._views.push(n);
    });
  }
}

class BaseController {
  constructor({ props, layout = $layout.fill, events = {} } = {}) {
    this._props = { type: 0, bgcolor: $color("primarySurface"), ...props };
    this._events = events;
    // 4个读写属性
    // TO-DO 读写属性如果要修改, 必须在load之前进行, 但是如果要防止此种错误操作又比较复杂, 此处暂时只作为约定处理
    this.type = this._props.type; // 为防止设置错误，type有单独的setter、getter
    this.id = this._props.id || cvid.newId;
    this.superController = this._props.superController;
    if (typeof this._props.tags === "string") this._props.tags = [this._props.tags] // tags为字符串，则自动转化为Array
    this.tags = this._props.tags || [];
    
    // 3个只读属性
    this._status = controllerStatus.created; // 防止意外, status使用额外的get来使其只读
    this.cviews = {};
    this.cviews.rootView = new RootView({
      props: {
        bgcolor: this._props.bgcolor
      },
      layout,
      events: {
        ready: sender => this.load()
      }
    });
    this.rootView = this.cviews.rootView;
    this._create();
  }

  _create() {
    if (this._status !== controllerStatus.created) return;
    if (this._events.didCreate) this._events.didCreate(this);
  }

  load() {
    // 只有status为created才可以运行
    if (this._status !== controllerStatus.created) return;
    this._status = controllerStatus.loaded;
    if (this._events.didLoad) this._events.didLoad(this);
    router.add(this)
  }

  appear() {
    // 只有status为loaded或者disappeared，才可以运行
    if (
      this._status !== controllerStatus.loaded &&
      this._status !== controllerStatus.disappeared
    )
      return;
    if (this._events.didAppear) this._events.didAppear(this);
    router.focus = this;
    this._status = controllerStatus.appeared;
  }

  disappear() {
    // 只有status为loaded或者appeared，才可以运行
    if (
      this._status !== controllerStatus.loaded &&
      this._status !== controllerStatus.appeared
    )
      return;
    if (this._events.didDisappear) this._events.didDisappear(this);
    this._status = controllerStatus.disappeared;
  }

  // 此方法不能用于移除rootView，其作用是将控制器从Router中移除，并触发didRemove事件
  remove() {
    // 如果已经移除，不可以再次运行
    if (this._status === controllerStatus.removed) return;
    if (this._events.didRemove) this._events.didRemove(this);
    router.delete(this)
    this._status = controllerStatus.removed;
  }

  uirender(props) {
    if (!(this.type & controllerTypes.rootController))
      throw new Error(
        "Invalid controller type: uirender only supports rootController"
      );
    $ui.render({
      props,
      views: [this.rootView.definition],
      events: {
        appeared: () => this.appear(),
        disappeared: () => this.disappear(),
        dealloc: () => this.remove()
      }
    });
  }

  uipush(props) {
    if (!(this.type & controllerTypes.pushedPageController))
      throw new Error(
        "Invalid controller type: uipush only supports pushedPageController"
      );
    $ui.push({
      props,
      views: [this.rootView.definition],
      events: {
        appeared: () => this.appear(),
        disappeared: () => this.disappear(),
        dealloc: () => this.remove()
      }
    });
  }

  set type(num) {
  // 检测不合法的type
  if (
    num & controllerTypes.rootController &&
    num & controllerTypes.pushedPageController
  )
    throw new Error(
      "Invalid controller type: a controller cannot be both rootController and pushedPageController"
    );
  if (
    num & controllerTypes.presentedPageController &&
    num & controllerTypes.pushedPageController
  )
    throw new Error(
      "Invalid controller type: a controller cannot be both presentedPageController and pushedPageController"
    );
  this._type = num
  }

  get type() {
    return this._type
  }

  get status() {
    return this._status;
  }
}

module.exports = BaseController;
