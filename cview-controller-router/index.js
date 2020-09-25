const TreeModel = require("tree-model");

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
  constructor({
    slientModeEnabled = true
  }) {
    this.slientModeEnabled = slientModeEnabled
    this._tree = new TreeModel();
  }

  _addRoot(controller) {
    this._rootNode = this._tree.parse({ controller });
  }

  _getNode(id) {
    if (!this._rootNode) return;
    return this._rootNode.first(n => n.model.controller.id === id)
  }

  /**
   * 以 id 查找 controller，若没有返回 undefined
   * @param {string} id
   * @returns {Controller}
   */
  get(id) {
    const node = this._rootNode.first(n => n.model.controller.id === id)
    if (node) return node.model.controller;
    return
  }

  add(controller, superController) {
    if (controller.type & controllerTypes.rootController) {
      this._addRoot(controller);
      return;
    }
    const node = superController
      ? this._tree.first(n => n.model.controller.id === superController.id)
      : this.focusNode;
    if (!node) throw new Error("Cannot find super node");
    node.add({ controller });
  }

  remove(controller) {
    const node = this._tree.first(n => n.model.controller.id === controller.id)
    if (node) node.drop();
  }

  /**
   *
   * @param {string} tag
   * @returns {Controller[]}
   */
  getByTag(tag) {
    const nodes = this._rootNode.all(n => n.model.controller.tags.includes(tag))
    if (nodes && nodes.length) return nodes.map(n => n.model.controller);
    return
  }

  /**
   * @returns {Node}
   */
  get focusNode() {
    if (!this._focusNode) return this._rootNode;
    else return this._focusNode;
  }

  /**
   * @returns {Node}
   */
  set focusNode(controller) {
    this._focusNode = this._rootNode.first(n => n.model.controller.id === controller.id)
  }

  get focus() {
    return this.focusNode.model.controller;
  }

  /**
   * @param {Controller | string} argv controller or its id
   */
  set focus(argv) {
    this.focusNode = (typeof argv === "string") ? this.get(argv) : argv
  }

  get controllerTree() {
    return this._tree;
  }
}

module.exports = new Router();
