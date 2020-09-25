const RotatingView = require(".");
const {Image, Canvas} = require("cview-singleviews")


const v = new RotatingView({
  props: {
    cview: new Canvas({
      layout: $layout.fill,
      events: {
        draw: function(view, ctx) {
          var centerX = 100 * 0.5
          var centerY = 100 * 0.5
          var radius = 50.0
          ctx.fillColor = $color("red")
          ctx.moveToPoint(centerX, centerY - radius)
          for (var i=1; i<5; ++i) {
            var x = radius * Math.sin(i * Math.PI * 0.8)
            var y = radius * Math.cos(i * Math.PI * 0.8)
            ctx.addLineToPoint(x + centerX, centerY - y)
          }
          ctx.fillPath()
        }
      }
    }),
    tintColor: $color("red"),
    rps: 0.3,
    clockwise: false
  },
  layout: (make, view) => {
    make.size.equalTo($size(100, 100))
    make.center.equalTo(0)
  },
  events: {
    ready: cview => {
      cview.startRotating()
    }
  }
})

$ui.render({
  props: {

    navButtons: [
      {
        symbol: "plus",
        handler: () => {
          v.stopRotating()
        }
      }
    ]
  },
  views: [v.definition]
})