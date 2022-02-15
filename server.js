const http = require("http");
const Koa = require("koa");
const koaBody = require("koa-body");
const cors = require("@koa/cors");
const Router = require("koa-router");
const router = new Router();

const newsGenerator = require("./src/data/newsGenerator");


const app = new Koa();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app.callback());

app.use(cors());

app.use(
  koaBody({
    text: true,
    urlencoded: true,
    json: true,
    multipart: true,
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  const origin = ctx.request.get("Origin");
  if (!origin) {
    return await next();
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
  }; //сервер может быть вызван из любого источника
  if (ctx.request.method !== "OPTIONS") {
    ctx.response.set({
      ...headers,
    });
    try {
      return await next();
    } catch (e) {
      e.headers = {
        ...e.headers,
        ...headers,
      };
      throw e;
    }
  }
  if (ctx.request.get("Access-Control-Request-Method")) {
    ctx.response.set({
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH",
    });
    if (ctx.request.get("Access-Control-Request-Headers")) {
      ctx.response.set(
        "Access-Control-Allow-Headers",
        ctx.request.get("Access-Control-Allow-Request-Headers")
      );
    }
    ctx.response.status = 204; // No content
  }
});

const fakeData = new newsGenerator();
fakeData.start();

router.get("/news/latest", async (ctx) => {
  fakeData.filteredNews(fakeData.newsList, 4);

  ctx.response.body = JSON.stringify({
    status: "ok",
    data: fakeData.newsList,
  });
  console.log(ctx.response.body, "result");
});

server.listen(PORT, () =>
  console.log(`Koa server has been started on port ${PORT} ...`)
);
