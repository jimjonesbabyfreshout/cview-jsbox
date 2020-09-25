const {Text} = require("cview-singleviews")

class TestText extends Text {
  constructor(options) {
    super(options)
  }

  result() {
    return 1
  }
}

const DialogSheet = require(".");

const dialog = new DialogSheet({
  props: {
    title: "ress",
    cview: new TestText()
  }
})

const p = new Promise((resolve, reject) => {{
  dialog.promisify(resolve, reject)
  dialog.present()
}})

p.then(n => console.info(n)).catch(e => console.info(e))