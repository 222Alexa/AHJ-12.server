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

app.use(
  slow({
    delay: 5000,
  })
);

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

// => CORS
app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": true,
    allowMethods: ["GET"],
  })
);

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
