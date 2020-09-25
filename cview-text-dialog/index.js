const { Text } = require("cview-singleviews");
const DialogSheet = require("cview-dialog-sheet");

class View extends Text {
  constructor(options) {
    super(options);
  }

  result() {
    return this.view.text;
  }
}

function textDialog({ title, text, placeholder }) {
  const textView = new View({
    props: {
      text,
      placeholder
    },
    events: {
      ready: sender => sender.focus()
    }
  });

  const sheet = new DialogSheet({
    props: {
      title,
      cview: textView
    }
  });
  return new Promise((resolve, reject) => {
    sheet.promisify(resolve, reject);
    sheet.present();
  });
}

module.exports = textDialog;
