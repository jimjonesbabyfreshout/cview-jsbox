const TabBar = require("cview-tabbar");
const BaseController = require("cview-basecontroller");
const { ContentView } = require("cview-singleviews");

class SplitViewController extends BaseController {
  constructor({ props, layout, events = {} } = {}) {
    super({
      props: {
        ...props,
        type: 1
      },
      layout,
      events
    });
  }

  _createCviews() {
    
  }
}


module.exports = SplitViewController;