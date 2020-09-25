const textDialog = require(".");

textDialog({
  title: "textDialog",
  placeholder: "测试"
}).then(n => console.log(n))
.catch(e => console.log("error: ", e))