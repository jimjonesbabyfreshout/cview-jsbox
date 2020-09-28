const TabBarController = require(".");
const BaseController = require("cview-basecontroller");

const a = new BaseController({
  events: {
    didLoad: () => {
      a.rootView.add({
        type: "view",
        props: {
          bgcolor: $color("insetGroupedBackground")
        },
        layout: $layout.fill
      });
    }
  }
});
const b = new BaseController({
  events: {
    didLoad: () => {
      b.rootView.add({
        type: "view",
        props: {
          bgcolor: $color("groupedBackground")
        },
        layout: $layout.fill
      });
    }
  }
});
const c = new BaseController({
  events: {
    didLoad: () => {
      c.rootView.add({
        type: "view",
        props: {
          bgcolor: $color("backgroundColor")
        },
        layout: $layout.fill
      });
    }
  }
});

const tbc = new TabBarController({
  props: {
    index: 1,
    type: (1 << 3) | (1 << 0),
    items: [
      {
        symbol: "house",
        title: "home",
        controller: a
      },
      {
        symbol: "star",
        title: "Favorited",
        controller: b
      },
      {
        symbol: "gear",
        title: "Settings",
        controller: c
      }
    ]
  },
  events: {}
});

tbc.uirender();
