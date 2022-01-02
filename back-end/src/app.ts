import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import serveIndex from 'serve-index';
let port = 5927; // 填写端口号

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', serveIndex('static', {icons: true}));
app.use('/static', express.static('static'));

app.post("/api/composition", async (request, response) => {
  const { content, block, column, row, lineStr } = request.body;
  const now = new Date();
  try {
    JSON.parse(lineStr);
  } catch {
    response.status(400);
    return;
  }

  fs.writeFileSync(path.resolve(__dirname, '../static', 'html', 'config.js'), 
  `const block = ${block};const column = ${column};const row = ${row};const text = "${content.replace(/\n/g, "\\n")}";const line = ${lineStr}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1230,
      height: 627
    }
  });
  const page = await browser.newPage();
  await page.goto(path.resolve(__dirname, '../static', 'html', 'com.html'));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.resolve(__dirname, "../static", "img", `${now.getTime()}.png`) });
  browser.close();

  console.log(`在 ${now.constructor()}，一篇新作文已生成`);
  response.send(`https://server.pyusr.com/static/img/${now.getTime()}.png`);
});

app.listen(port, () => {
  console.log(`Application has started on Port ${port}`);
});
