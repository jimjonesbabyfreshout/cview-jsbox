const { Runtime } = require("cview-singleviews");

class PageControl extends Runtime {
  constructor({ props = {}, layout, events = {} } = {}) {
    const {
      numberOfPages = 3,
      currentPage = 0,
      pageIndicatorTintColor,
      currentPageIndicatorTintColor,
      ...restProps
    } = props;
    const { changed, ...restEvents } = events;
    super({ props: restProps, layout, events: restEvents });
    this._numberOfPages = numberOfPages;
    this._currentPage = currentPage;
    this._pageIndicatorTintColor = pageIndicatorTintColor;
    this._currentPageIndicatorTintColor = currentPageIndicatorTintColor;
    this._changed = changed;
    this._pageControl = this._createPageControl();
    this._props.view = this._pageControl;
  }

  _createPageControl() {
    const pageControl = $objc("UIPageControl").$new();
    pageControl.$setNumberOfPages(this._numberOfPages);
    pageControl.$setCurrentPage(this._currentPage);
    if (this._pageIndicatorTintColor)
      pageControl.$setPageIndicatorTintColor(
        this._pageIndicatorTintColor.ocValue()
      );
    if (this._currentPageIndicatorTintColor)
      pageControl.$setCurrentPageIndicatorTintColor(
        this._currentPageIndicatorTintColor.ocValue()
      );

    pageControl.$addEventHandler({
      events: $UIEvent.valueChanged,
      handler: $block("void", () => {
        const currentPage = pageControl.$currentPage();
        this._currentPage = currentPage
        if (this._changed) this._changed(this, currentPage);
      })
    });
    return pageControl;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(num) {
    this._currentPage = num
    if (this._pageControl) this._pageControl.$setCurrentPage(num);
  }
}

module.exports = PageControl;