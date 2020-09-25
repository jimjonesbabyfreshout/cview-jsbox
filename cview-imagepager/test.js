const ImagePager = require(".");

const pager = new ImagePager({
  props: {
    srcs: [
      "https://images.apple.com/v/iphone/home/v/images/home/limited_edition/iphone_7_product_red_large_2x.jpg",
      "https://images.apple.com/v/iphone/home/v/images/home/airpods_large_2x.jpg",
      "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg",
      "https://images.apple.com/v/iphone/home/v/images/home/apple_pay_large_2x.jpg"
    ],
    page: 2
  },
  layout: $layout.fillSafeArea,
  events: {
    changed: page => $ui.toast(page)
  }
});

$ui.render({
  props: {
    statusBarStyle: 0,
    navBarHidden: true,
    homeIndicatorHidden: true
  },
  views: [pager.definition]
})