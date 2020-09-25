$app.theme = "auto"
const TabBar = require(".");

const tabbar = new TabBar({
  props: {
    items: [
      {
        symbol: "person.crop.circle.fill",
        title: "联系人"
      },
      {
        symbol: "phone.fill",
        title: "最近通话"
      },
      {
        symbol: "bubble.left.and.bubble.right.fill",
        title: "消息"
      },
      {
        symbol: "gear",
        title: "设置"
      }
    ],
    index: 2,
    //bgcolor: $color("gray")
  },
  events: {
    changed: (cview, index) => {
      console.log("changed", index)
    },
    doubleTapped: (cview, index) => {
      console.log("doubleTapped", index)
    }
  }
})

$ui.render({
  props: {
    navButtons: [
      {
        symbol: "minus",
        handler: () => tabbar.hide()
      },
      {
        symbol: "plus",
        handler: () => tabbar.show()
      }
    ]
  },
  views: [
    tabbar.definition
  ]
})