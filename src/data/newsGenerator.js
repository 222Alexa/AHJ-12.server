const { v4: uuidv4 } = require("uuid");
const { faker } = require("@faker-js/faker");
const fs = require("fs");
const imgGen = require("js-image-generator");

class NewsGenerator {
  constructor() {
    this.newsList = [];
    this.album = [];
    this.timer = null;
  }

  start() {
    this.timer = setTimeout(() => {
      this.getNews();
    }, 1000);
  }

  getNews() {
    this.generatePicture();

    const news = {
      id: uuidv4(),
      title: faker.hacker.phrase(),
      author: faker.name.findName(),
      subject: faker.lorem.words(),
      body: faker.lorem.paragraph(),
      //другие картинки не грузятся
      //пытаю другую библиотеку
      image: faker.image.avatar(),
      received: Date.now(),
    };

    this.newsList.push(news);
    this.start();
    if (this.newsList.length > 5) {
      clearTimeout(this.timer);
    }
  }

  filteredNews(arr, i) {
    if (arr.length > i) arr.splice(0, arr.length - i);
    console.log(arr, "result");
    return arr;
  }

  generatePicture() {
    for (let i = 1; i <= 10; i++) {
      //генерирует одну и ту же каритнку и вставляет ее в корень
      //как назначить путь?
      imgGen.generateImage(50, 50, 80, function (err, image) {
        console.log("Generating image #" + i);
        fs.writeFileSync("dummy-" + i + ".jpg", image.data);
       
        console.log(image, "pic");
      });
    }
  }
}

module.exports = NewsGenerator;
