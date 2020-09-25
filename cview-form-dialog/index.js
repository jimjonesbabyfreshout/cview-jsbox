const PreferenceListView = require("cview-preferencelistview-static");
const DialogSheet = require("cview-dialog-sheet");

class View extends PreferenceListView {
  constructor(options) {
    super(options);
  }

  result() {
    return this.values;
  }
}

function formDialog({ sections, title }) {
  const sheet = new DialogSheet({
    props: {
      title,
      bgcolor: $color("insetGroupedBackground"),
      cview: new View({sections})
    }
  });
  return new Promise((resolve, reject) => {
    sheet.promisify(resolve, reject);
    sheet.present();
  });
}

module.exports = formDialog;
