const PresentedViewController = require(".");
const pvc = new PresentedViewController({
  props: {},
  events: {
    didLoad: () => console.log(1),
    didRemove: () => console.log(4)
  }
});

pvc.rootView.views = [
  {
    type: "view",
    props: { bgcolor: $color("red") },
    layout: (make, view) => {
      make.center.equalTo(view.super);
      make.size.equalTo($size(100, 100));
    }
  }
];

pvc.present();
