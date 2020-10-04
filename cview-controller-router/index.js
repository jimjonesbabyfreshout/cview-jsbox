/**
 * 由于 controller 的加载顺序是无法控制的，因此放弃将 controller 放在多叉树上。
 * 核心改为一个集合，包含两个特殊属性：根视图、激活视图
 * 依据Set自身的方法实现add、delete，查找，包括get、getByTag，依赖forEach实现
 * 此模块只用于查找，不对 controller 发出任何指令
 */

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

class Router {
  constructor() {
    this._set = new Set();
  }

  add(controller) {
    this._set.add(controller);
    if (!this.root && controller.type & controllerTypes.rootController)
      this.root = controller;
  }

  delete(controller) {
    this._set.delete(controller);
  }

  get(id) {
    const result = this._filter(n => n.id === id);
    if (result.length) return result[0];
    else return;
  }

  getByTag(tag) {
    return this._filter(n => n.tags.includes(tag));
  }

  /**
   *
   * @param {Function} handler 过滤条件
   */
  _filter(handler) {
    const result = [];
    this._set.forEach(n => {
      if (handler(n)) result.push(n);
    });
    return result;
  }

  get root() {
    this._root;
  }

  set root(controller) {
    this._root = controller;
  }

  get focus() {
    return this._focus;
  }

  /**
   * @param {Controller | string} param controller or its id
   */
  set focus(param) {
    this._focus = typeof param === "string" ? this.get(param) : param;
  }

  get controllerSet() {
    return this._set;
  }
}

module.exports = new Router();
