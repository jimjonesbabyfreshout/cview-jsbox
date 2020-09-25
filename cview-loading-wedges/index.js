const BaseView = require("cview-baseview");

class Canvas extends BaseView {
  constructor({ tintColor, startAngle}) {
    super();
    this._tintColor = tintColor;
    this.startAngle = startAngle;
  }

  _defineView() {
    return {
      type: "canvas",
      props: {
        id: this.id,
        alpha: 0.8
      },
      layout: $layout.fill,
      events: {
        draw: (view, ctx) => {
          ctx.fillColor = this._tintColor;
          const radius = Math.min(view.frame.width, view.frame.height);
          ctx.addArc(
            radius / 2,
            radius / 2,
            radius / 2,
            this.startAngle,
            this.startAngle + (Math.PI * 2 * 1) / 4
          );
          ctx.addLineToPoint(radius / 2, radius / 2);
          ctx.closePath();
          ctx.fillPath();
        }
      }
    };
  }

  redraw() {
    this.view.runtimeValue().invoke("setNeedsDisplay");
  }
}

class Wedges extends BaseView {
  constructor({
    colors = [
      $color("#f5542e"),
      $color("#f2c327"),
      $color("#008b6e"),
      $color("#00aede")
    ],
    layout
  }) {
    super();
    this._colors = colors;
    this._layout = layout;
    this.interval = 1 / 60;
  }

  _defineView() {
    const canvas1 = new Canvas({
      tintColor: this._colors[0],
      startAngle: -Math.PI / 2
    });
    const canvas2 = new Canvas({
      tintColor: this._colors[1],
      startAngle: 0
    });
    const canvas3 = new Canvas({
      tintColor: this._colors[2],
      startAngle: Math.PI / 2
    });
    const canvas4 = new Canvas({
      tintColor: this._colors[3],
      startAngle: Math.PI
    });
    return {
      type: "view",
      props: {
        id: this.id
      },
      views: [
        canvas1.definition,
        canvas2.definition,
        canvas3.definition,
        canvas4.definition
      ],
      layout: this._layout,
      events: {
        ready: async sender => {
          while (sender.super) {
            canvas1.startAngle += Math.PI * this.interval * 4;
            canvas1.redraw();
            canvas2.startAngle += Math.PI * this.interval * 3;
            canvas2.redraw();
            canvas3.startAngle += Math.PI * this.interval * 2;
            canvas3.redraw();
            canvas4.startAngle += Math.PI * this.interval * 1;
            canvas4.redraw();
            await $wait(this.interval);
          }
        }
      }
    };
  }
}

module.exports = Wedges;
