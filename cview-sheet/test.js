const Sheet = require(".");

const sheet = new Sheet({
  presentMode: 3,
  animated: true,
  view: {
    type: "view",
    props: {},
    views: [
      {
        type: "button",
        props: { title: "dismiss" },
        layout: $layout.center,
        events: {
          tapped: sender => {
            $ui.push({
              views: [
                {
                  type: "button",
                  props: { title: "dismiss" },
                  layout: $layout.center,
                  events: {
                    tapped: sender => sheet.dismiss()
                  }
                }
              ]
            });
          }
        }
      }
    ]
  }
});

sheet.present();
