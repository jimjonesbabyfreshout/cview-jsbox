const SplitViewController = require(".")

const BaseController = require("cview-basecontroller");

function init() {
  const primaryController = new BaseController()
  const secondaryContrller = new BaseController()

  const svc = new SplitViewController({
    props: {
      type: 1 | 1 << 3,
      items: [
        {
          controller: primaryController
        },
        {
          controller: secondaryContrller
        }
      ]
    }
  })
  svc.uirender()
}

init()