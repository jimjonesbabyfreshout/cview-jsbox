$app.theme = "auto";

const SearchBar = require(".");

const searchbar = new SearchBar({
  props: {
    style: 2
  },
  layout: (make, view) => {
    make.size.equalTo($size(300, 38))
    make.top.inset(50)
    make.centerX.equalTo(view.super)
  }
})

$ui.render({
  views: [searchbar.definition]
})