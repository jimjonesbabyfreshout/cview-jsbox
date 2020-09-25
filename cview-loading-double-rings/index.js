const BaseView = require("cview-baseview");

class Canvas extends BaseView {
  constructor({ tintColor, startAngle, radiusReduction }) {
    super();
    this._tintColor = tintColor;
    this.startAngle = startAngle;
    this._radiusReduction = radiusReduction;
  }

  _defineView() {
    return {
      type: "canvas",
      props: {
        id: this.id
      },
      layout: $layout.fill,
      events: {
        draw: (view, ctx) => {
          ctx.strokeColor = this._tintColor;
          const radius = Math.min(view.frame.width, view.frame.height);
          ctx.setLineWidth(20);
          ctx.setLineCap(1);
          ctx.setLineJoin(1);
          ctx.addArc(
            radius / 2,
            radius / 2,
            radius / 2 - 20 - this._radiusReduction,
            this.startAngle,
            this.startAngle + (Math.PI * 2 * 1) / 4
          );
          ctx.strokePath();
        }
      }
    };
  }

  redraw() {
    this.view.runtimeValue().invoke("setNeedsDisplay");
  }
}

class DoubleRings extends BaseView {
  constructor({ colors = [$color("#f5542e"), $color("#f2c327")], layout }) {
    super();
    this._colors = colors;
    this._layout = layout;
    this.interval = 1 / 60;
  }

  _defineView() {
    const canvas1 = new Canvas({
      tintColor: this._colors[0],
      radiusReduction: 0,
      startAngle: (-Math.PI * 3) / 4
    });
    const canvas2 = new Canvas({
      tintColor: this._colors[0],
      radiusReduction: 0,
      startAngle: Math.PI / 4
    });
    const canvas3 = new Canvas({
      tintColor: this._colors[1],
      radiusReduction: 25,
      startAngle: -Math.PI / 4
    });
    const canvas4 = new Canvas({
      tintColor: this._colors[1],
      radiusReduction: 25,
      startAngle: (Math.PI * 3) / 4
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
            canvas1.startAngle += Math.PI * this.interval * -2;
            canvas1.redraw();
            canvas2.startAngle += Math.PI * this.interval * -2;
            canvas2.redraw();
            canvas3.startAngle += Math.PI * this.interval * 2;
            canvas3.redraw();
            canvas4.startAngle += Math.PI * this.interval * 2;
            canvas4.redraw();
            await $wait(this.interval);
          }
        }
      }
    };
  }
}

module.exports = DoubleRings;
