const EnhancedImageView = require(".");

const iv = new EnhancedImageView({
  props: {
    src: "https://images.apple.com/v/ios/what-is/b/images/performance_large.jpg"
  },
  layout: $layout.fill
})

$ui.render({
  views: [iv.definition]
})