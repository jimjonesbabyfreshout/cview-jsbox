const UrlParse = require("url-parse");
const isPromise = require("is-promise");

const methods = {
  get: 0,
  post: 1,
  put: 2,
  delete: 3
};

class HttpLikeApi {
  constructor() {
    this._routers = [];
  }

  add(methodName, path, handler) {
    const method = methods[methodName.toLowerCase()];
    const request = {
      method,
      path,
      handler
    };
    this._routers.unshift(request);
  }

  async _request(method, url, params) {
    let path = url
    if (!params) {
      const r = new UrlParse(url, true);
      const query = r.query;
      path = r.pathname;
      if (Object.keys(query).length) params = query;
    }
    const router = this._routers.find(
      n => n.method === method && n.path === path
    );
    if (!router || !router.handler) {
      return {
        code: 404,
        error: "UnavailableRouterError",
        message: "Router Not Found Or Unavailable"
      };
    }
    try {
      let result = router.handler(params);
      if (isPromise(result)) result = await result;
      return {
        data: result,
        code: 200
      };
    } catch (e) {
      return {
        code: e.code || 400,
        error: e.name || "Error",
        message: n.message
      };
    }
  }

  async get(url, params) {
    return await this._request(0, url, params);
  }

  async post(url, params) {
    return await this._request(1, url, params);
  }

  async put(url, params) {
    return await this._request(2, url, params);
  }

  async delete(url, params) {
    return await this._request(3, url, params);
  }
}

module.exports = HttpLikeApi;
