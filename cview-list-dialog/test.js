const listDialog = require(".");

listDialog({
  title: "listDialog",
  items: [
    "1",
    "2",
    { styledText: "**ssss**" },
    {
      styledText: {
        text: "Background Color",
        styles: [
          {
            range: $range(0, 16),
            color: $color("white"),
            bgcolor: $color("blue")
          }
        ]
      }
    }
  ],
  value: 1,
  multiSelectEnabled: true
})
  .then(n => console.log(n))
  .catch(e => console.log("error: ", e));
