const DynamicItemSizeMatrix = require(".");

const matrix = new DynamicItemSizeMatrix({
  props: {
    template: {
      views: [
        {
          type: "label",
          props: {
            id: "label",
            bgcolor: $color("red")
          },
          layout: $layout.fill
        }
      ]
    },
    data: [1,2,3,4,5,6,7,8,9,10].map(n => ({label: {text: n}}))
  },
  layout: $layout.fill
})

$ui.render({
  views: [matrix.definition]
})