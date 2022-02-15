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

  // => CORS
  app.use(
    cors({
      origin: "*",
      "Access-Control-Allow-Origin": true,
      "X-Requested-With": true, //возможно это поможет
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    })
  );
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
