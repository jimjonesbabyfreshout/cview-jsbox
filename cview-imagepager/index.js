const BaseView = require("cview-baseview");
const { Matrix } = require("cview-singleviews");

/**
 * props:
 *  - srcs: 图片的src数组
 */
class ImagePager extends BaseView {
  constructor({ props, layout, events = {} } = {}) {
    super();
    this._props = {
      srcs: [],
      page: 0,
      ...props
    };
    this._layout = layout;
    this._events = events;
    this._pageLoadRecorder = {};
  }

  _defineView() {
    this.matrix = new Matrix({
      props: {
        direction: $scrollDirection.horizontal,
        pagingEnabled: true,
        alwaysBounceVertical: false,
        showsVerticalIndicator: false,
        showsHorizontalIndicator: false,
        template: {
          views: [
            {
              type: "scroll",
              props: {
                id: "scroll",
                zoomEnabled: true,
                maxZoomScale: 3,
                doubleTapToZoom: true
              },
              layout: $layout.fill,
              views: [
                {
                  type: "image",
                  props: {
                    id: "image",
                    contentMode: $contentMode.scaleAspectFit
                  }
                }
              ]
            }
          ]
        },
        data: this._props.srcs.map(n => {
          return { image: { src: n } };
        })
      },
      layout: $layout.fill,
      events: {
        ready: sender => {
          // 如果没有此处的relayout，则会出现莫名其妙的bug
          sender.relayout();
          this.page = this.page;
          this.loadsrc(this.page);
        },
        itemSize: (sender, indexPath) => {
          return $size(sender.frame.width, sender.frame.height);
        },
        forEachItem: (view, indexPath) => {
          view.get("scroll").zoomScale = 0;
          //$delay(0.01, () => {});
        },
        willEndDragging: (sender, velocity, target) => {
          const oldPage = this.page;
          this._props.page = Math.round(target.x / sender.frame.width);
          //this.loadsrc(this.page, true);
          if (oldPage !== this.page && this._events.changed)
            this._events.changed(this.page);
        },
        didScroll: sender => {
          this.loadsrc(this.page + 1, true);
          this.loadsrc(this.page - 1, true);
        }
      }
    });
    return {
      type: "view",
      props: {
        id: this.id,
        userInteractionEnabled: true
      },
      layout: this._layout,
      views: [this.matrix.definition],
      events: {
        layoutSubviews: sender => {
          this._pageLoadRecorder = {};
          sender.relayout();
          this.matrix.view.reload();
          this.page = this.page;
          $delay(0.1, () => this.loadsrc(this.page, true));
          $delay(0.3, () => this.loadsrc(this.page, true));
        },
        tapped: sender => {
          const cell = this.matrix.view.cell($indexPath(0, this.page));
          if (!cell) return;
          const scroll = cell.get("scroll");
          const zoomScale = scroll.zoomScale;
          $delay(0.3, () => {
            const zoomScale1 = scroll.zoomScale;
            if (zoomScale === zoomScale1 && this._events.tapped)
              this._events.tapped(this);
          });
        }
      }
    };
  }

  loadsrc(page, forced = false) {
    if (page < 0 || page >= this._props.srcs.length) return;
    const cell = this.matrix.view.cell($indexPath(0, page));

    if (
      cell &&
      (forced || !cell.get("image").image || !this._pageLoadRecorder[page])
    ) {
      cell.get("scroll").zoomScale = 0;
      this._pageLoadRecorder[page] = true;
    }
  }

  get page() {
    return this._props.page;
  }

  get currentImage() {
    const cell = this.matrix.view.cell($indexPath(0, this.page));
    return cell && cell.get("image").image;
  }

  set page(page) {
    this.matrix.view.scrollTo({
      indexPath: $indexPath(0, page),
      animated: false
    });
    this._props.page = page;
  }

  scrollToPage(page) {
    this.matrix.view.scrollTo({
      indexPath: $indexPath(0, page),
      animated: true
    });
    this._props.page = page;
  }
}

module.exports = ImagePager;
