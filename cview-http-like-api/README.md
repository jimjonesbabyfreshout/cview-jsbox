# CView Http-like API

仿 http 方法的 api。这并不直接访问网络，而是借用 http 方法对 Model 层进行封装。

只借用 4 个 Http 方法：GET、POST、PUT、DELETE，分别对应查、增、改、删

使用方法统一为`api.METHOD(PATH, params)`，通过 PATH 参数定位要调用哪一个具体的 api，params 是传递给具体方法的参数。

## Usage

此模块只有一个基本的类，需要为其添加路由。

```js
const api = new HttpLikeApi();

// 假设有一个叫做config的模块需要封装
const config = new Config();

// 填入对应的METHOD和PATH，以及CALLBACK，通过回调指定此时对应的config操作
api.add("GET", "username", (method, path, params) => {
  return config.username.get(id);
});

// 然后通过下面的方法调用

const result = await api.get("username", { id: "id1" });

// 或者

const result = await api.get("username?id=id1");

```

或者可以继承此类，在新的类中进行封装

```js
class CustomApi extends HttpLikeApi {
  constructor() {
    this.add("GET", "username", (method, path, params) => {
      return config.username.get(id);
    });
  }
}

const result = await new CustomApi().get("username", { id: "id1" });
```

如果正确执行，则会返回`{data: any, code: 200}`。

如果发生错误，则会返回`{error: string, code: number, message: string}`。
其中error、code、message是从抛出的错误中获取，默认name为Error，code为400。



