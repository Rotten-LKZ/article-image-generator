
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

interface Order {
  request: Request;
  response: Response;
  timer: Timeout
}

const MAX_WSE = 4;
let WSE_LIST: string[] = [];
let ORDERS: Order[] = [];
let HANDLING_NUMBER = 0;

handle();
init();
export function queueUp(request: Request, response: Response) {
  ORDERS.push({
    request: request,
    response: response,
    timer: new Timeout(fail(response, "请求人数过多，请稍后重试", 403), 20000)
  });
}

function fail(response: Response, text: string, code: number) {
  return () => {
    response.status(code).send(text);
  }
}

function handle() {
  if (ORDERS.length > 0 && HANDLING_NUMBER < 6) {
    if (!ORDERS[0].timer.cleared) {
      HANDLING_NUMBER++;
      ORDERS[0].timer.clear();
      generator(ORDERS[0].request, ORDERS[0].response);
    }
    ORDERS.splice(0, 1);
  }
  setTimeout(handle, 100);
}

async function generator(request: Request, response: Response) {
  const { content, block, column, row, lineStr, pdf, test } = request.body;
  const now = new Date();
  try {
    JSON.parse(lineStr);
  } catch {
    fail(response, "请求格式错误", 400)();
    HANDLING_NUMBER--;
    return;
  }

  if (isNaN(parseInt(block)) || isNaN(parseInt(column)) || isNaN(parseInt(row))) {
    fail(response, "请求格式错误", 400)();
    HANDLING_NUMBER--;
    return;
  }

  fs.writeFileSync(path.resolve(__dirname, '../static', 'html', 'config.js'), 
  `const block = ${block};const column = ${column};const row = ${row};const text = "${content.replace(/\n/g, "\\n")}";const line = ${lineStr};`);
  if (test === undefined) {
    fs.writeFileSync(path.resolve(__dirname, "../static", "txt", `${now.getTime()}.txt`), content);
  }

  let tmp = Math.floor(Math.random() * MAX_WSE);
  const browser = await puppeteer.connect({ browserWSEndpoint: WSE_LIST[tmp] });
  const page = await browser.newPage();
  await page.goto(path.resolve(__dirname, '../static', 'html', 'com.html'));

  if (pdf !== undefined) {
    // 输出为 pdf
    await page.setViewport({
      width: (26 * parseInt(block) + 17) * parseInt(column) + 5,
      height: 31 * parseInt(row) + 7
    });
    await page.waitForSelector("#renderedComplete");
    await page.pdf({ path: path.resolve(__dirname, "../static", "pdf", `${now.getTime()}.pdf`), 
      format: 'a4', 
      printBackground: true, 
      preferCSSPageSize: false,
      margin: {top: '22mm', left: '10mm', right: '10mm', bottom: '10mm'},
      landscape: true
    });
    await page.close();
    response.send(`https://server.pyusr.com/static/pdf/${now.getTime()}.pdf`);
  } else {
    // 输出为 png 图片
    await page.setViewport({
      width: (26 * parseInt(block) + 17) * parseInt(column) + 5,
      height: 31 * parseInt(row) + 7  
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.resolve(__dirname, "../static", "img", `${now.getTime()}.png`) });
    await page.close();
    response.send(`https://server.pyusr.com/static/img/${now.getTime()}.png`);
  }

  HANDLING_NUMBER--;
  console.log(`在 ${now.constructor()}，一篇新作文已存储`);
}

function init() {
  (async () => {
    for (let i = 0;i < MAX_WSE;i++) {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-setuid-sandbox',
          '--no-first-run',
          '--no-sandbox',
          '--no-zygote',
          '--single-process'
        ],
      });
      WSE_LIST[i] = await browser.wsEndpoint();
    }
  })();
}

class Timeout {
  interval: number;
  cleared: boolean = false;
  timeoutId: NodeJS.Timeout;

  constructor(fn: Function, interval: number) {
    this.interval = interval;
    this.timeoutId = setTimeout(async () => {
      await fn();
      this.cleared = true;
    }, interval);
  }

  clear() {
    this.cleared = true;
    clearTimeout(this.timeoutId);
  }
}
