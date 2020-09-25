const BaseView = require("cview-baseview");

class SingleView extends BaseView {
  constructor({ type = "view", props, layout, events, views } = {}) {
    super();
    this._type = type;
    this._props = props;
    this._layout = layout;
    this._events = events;
    this._views = views;
  }

  _defineView() {
    return {
      type: this._type,
      props: {
        ...this._props,
        id: this.id
      },
      layout: this._layout,
      events: this._events,
      views: this._views
    };
  }
}

class RootView extends SingleView {
  constructor({ layout = $layout.fill, events, views } = {}) {
    super({ layout, events, views });
    this._props = { bgcolor: $color("clear") };
  }
}

class ContentView extends SingleView {
  constructor({
    props,
    layout = $layout.fillSafeArea,
    events = {},
    views
  } = {}) {
    super({ layout, events, views });
    this._props = { bgcolor: $color("primarySurface"), ...props };
  }
}

/**
 * 遮挡视图，使得下面的view无法操作并且整体变暗。
 * 设计上此视图不单独使用，而是作为一个子视图
 * events:
 *   - tapped 点击事件，通常用于dismiss
 */
class MaskView extends SingleView {
  constructor({ props, layout = $layout.fill, events, views } = {}) {
    super({ layout, events, views });
    this._props = {
      bgcolor: $rgba(0, 0, 0, 0.2),
      ...props,
      userInteractionEnabled: true
    };
  }
}

class Label extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "label",
      props,
      layout,
      events,
      views
    });
  }
}

class Button extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "button",
      props,
      layout,
      events,
      views
    });
  }
}

class Input extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "input",
      props,
      layout,
      events,
      views
    });
  }
}

class Slider extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "slider",
      props,
      layout,
      events,
      views
    });
  }
}

class Switch extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "switch",
      props,
      layout,
      events,
      views
    });
  }
}

class Spinner extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "spinner",
      props,
      layout,
      events,
      views
    });
  }
}

class Progress extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "progress",
      props,
      layout,
      events,
      views
    });
  }
}

class Gallery extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "gallery",
      props,
      layout,
      events,
      views
    });
  }
}

class Stepper extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "stepper",
      props,
      layout,
      events,
      views
    });
  }
}

class Text extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "text",
      props,
      layout,
      events,
      views
    });
  }
}

class Image extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "image",
      props,
      layout,
      events,
      views
    });
  }
}

class Video extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "video",
      props,
      layout,
      events,
      views
    });
  }
}

class Scroll extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "scroll",
      props,
      layout,
      events,
      views
    });
  }
}

class Stack extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "stack",
      props,
      layout,
      events,
      views
    });
  }
}

class Tab extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "tab",
      props,
      layout,
      events,
      views
    });
  }
}

class Menu extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "menu",
      props,
      layout,
      events,
      views
    });
  }
}

class Map extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "map",
      props,
      layout,
      events,
      views
    });
  }
}

class Web extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "web",
      props,
      layout,
      events,
      views
    });
  }
}

class List extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "list",
      props,
      layout,
      events,
      views
    });
  }
}

class Matrix extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "matrix",
      props,
      layout,
      events,
      views
    });
  }
}

class Blur extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "blur",
      props,
      layout,
      events,
      views
    });
  }
}

class Gradient extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "gradient",
      props,
      layout,
      events,
      views
    });
  }
}

class DatePicker extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "datepicker",
      props,
      layout,
      events,
      views
    });
  }
}

class Picker extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "picker",
      props,
      layout,
      events,
      views
    });
  }
}

class Canvas extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "canvas",
      props,
      layout,
      events,
      views
    });
  }
}

class Markdown extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "markdown",
      props,
      layout,
      events,
      views
    });
  }
}

class Lottie extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "lottie",
      props,
      layout,
      events,
      views
    });
  }
}

class Chart extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "chart",
      props,
      layout,
      events,
      views
    });
  }
}

class Code extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "code",
      props,
      layout,
      events,
      views
    });
  }
}

class Runtime extends SingleView {
  constructor({ props, layout, events, views } = {}) {
    super({
      type: "runtime",
      props,
      layout,
      events,
      views
    });
  }
}

module.exports = {
  RootView,
  ContentView,
  MaskView,
  Label,
  Button,
  Input,
  Slider,
  Switch,
  Spinner,
  Progress,
  Gallery,
  Stepper,
  Text,
  Image,
  Video,
  Scroll,
  Stack,
  Tab,
  Menu,
  Map,
  Web,
  List,
  Matrix,
  Blur,
  Gradient,
  DatePicker,
  Picker,
  Canvas,
  Markdown,
  Lottie,
  Chart,
  Code,
  Runtime
};
