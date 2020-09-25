const formDialog = require(".");

const sections = [
  {
    title: "Section 1",
    rows: [
      {
        type: "string",
        title: "string",
        key: "string",
        value: "测试一号测试二号测试三号测试四号测试五号测试六号"
      },
      {
        type: "number",
        title: "number",
        key: "number",
        value: 1111.1
      },
      {
        type: "integer",
        title: "integer",
        key: "integer",
        value: 1111
      },
      {
        type: "stepper",
        title: "stepper",
        key: "stepper",
        value: 2,
        min: 2,
        max: 5
      }
    ]
  },
  {
    title: "Section 2",
    rows: [
      {
        type: "boolean",
        title: "boolean",
        key: "boolean",
        value: true
      },
      {
        type: "slider",
        title: "slider",
        key: "slider",
        value: 1,
        decimal: 0,
        min: 0,
        max: 100
      },
      {
        type: "list",
        title: "list",
        key: "list",
        items: ["测试一号", "测试bbb"],
        value: 0
      },
      {
        type: "tab",
        title: "tab",
        key: "tab",
        items: ["测试aaa", "测试bbb"],
        value: 0
      }
    ]
  },
  {
    title: "Section 3",
    rows: [
      {
        type: "info",
        title: "info",
        key: "info",
        value: "this is info"
      },
      {
        type: "link",
        title: "link",
        key: "link",
        value: "https://apple.com"
      },
      {
        type: "action",
        title: "action",
        value: () => console.info(0)
      }
    ]
  }
]

formDialog({
  title: "formDialog",
  sections
}).then(n => console.log(n))
.catch(e => console.log("error: ", e))