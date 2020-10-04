const HttpLikeApi = require(".");

class Config {
  constructor() {
    this.username = {
      get: id => "test"
    };
  }
}

const api = new HttpLikeApi();

// 假设有一个叫做config的模块需要封装
const config = new Config();

// 填入对应的METHOD和PATH，以及CALLBACK，通过回调指定此时对应的config操作
api.add("GET", "username", params => {
  const { id } = params;
  return config.username.get(id);
});

// 然后通过下面的方法调用
async function test() {
  const result1 = await api.get("username", { id: "id1" });
  console.log(result1);
  // 或者

  const result2 = await api.get("username?id=id1");
  console.log(result2);
}

test().then();
