# article-image-generator

## English
## Brief introduction

As the title shows, this project can convert articles into the form of answer sheet.

[Example](https://ch.lkzstudio.com/composition/)

## ✔Features (No bugs)

- It can be simply to deploy in your server
- Rendered by JavaScript + css. Theoretically, the image quality can be very good
- Let me think about more...

## 💔TODO

- [ ] Punctuation marks such as quotation marks, book names and brackets shall be avoided from the beginning and end
- [ ] Support other languages

## 👓Introduction of folders

static This folder is the font(Alibaba Puhuiti) this project is using. It needs to be referenced in the `generator` folder and the `front-end/com` folder

generator This project is made of html、css、JavaScript. This folder can convert articles into the form of answer sheet.

front-end The code of front-end([Example](https://ch.lkzstudio.com/composition/))

back-end The code of back-end(Images are generated from back-end. Previews in front-end is using `iframe`.)

## 🥽How to use

#### 👓Explanation of the generator

In file `generator/script.js`, the first five variables are

- block: How many blocks in a line
- column: How many columns
- row: How many rows in a column
- line: Where should lines shows
- text: The article(Splited by `\n`. The first line is the title of an article.)

![Example of setting variables](https://s4.ax1x.com/2022/01/02/TTp4G8.png)

## Examples

![Example of a generated image](https://s4.ax1x.com/2022/01/02/TTSFX9.png)

## Updated log

The last updated time：2021-01-27

file `README.md`

## License

This project is using [MIT](https://choosealicense.com/licenses/mit/) license.

If you are using the project, I hope you can mark the link of this repo and the original author's name.

## 简体中文
## 简介

如标题所见，这个项目可以将电子稿的作文转换成答题卡方格纸一样的形式

[在线示例](https://ch.lkzstudio.com/composition/)

## ✔特性（不是bug）

- 部署简单方便（不）
- JavaScript + css 渲染。理论上无限放大的画质
- 容我再想想……

## 💔TODO

- [ ] 引号、书名号、括号等标点符号避头尾处理
- [ ] 支持其他语言

## 👓目录介绍

static 目录下是对应使用的字体（阿里巴巴普惠体），本来在 `generator` 文件夹和 `front-end/com` 文件夹需要引用

generator 此项目使用前端三件套（html、css、JavaScript）制作。此目录仅为生成 html 文件的文件夹

front-end 生成器前端代码（[在线示例](https://ch.lkzstudio.com/composition/)）

back-end 生成器后端代码（图片生成在后端生成，前端预览就是用 iframe 显示出 html）

## 🥽使用说明

#### 👓部署

后端部署到后端，前端部署到前端即可。

#### 👓生成器说明

在 `generator/script.js` 中前五个变量分别对应为：

- block：一行有多少格
- column：有多少栏
- row：一纵列有多少行
- line：横线标记位置（二维数组，第0位即第一纵列里进行标注，第1位即第二纵列里进行标注，以此类推。每位里面也是数组，每一位数字即在第几行下面标注横线）
- text：文章原文（\n（即换行）分割。第一行自动使用标题格式。标题不可超过 block 设定值（没有判断是否超过，超过我也不知道会怎么样哈哈哈））

![变量设置样例](https://s4.ax1x.com/2022/01/02/TTp4G8.png)

## 样例

![图片样例](https://s4.ax1x.com/2022/01/02/TTSFX9.png)

注：虽然有日文示例，但本程序暂且主要为中文作文所制作并优化，故日文生成可能在标点符号等排版上不符合规范。

## 更新日志

最近更新：2021-01-27

本项目 `updates.md` 文件

## 协议

本代码使用 [MIT](https://choosealicense.com/licenses/mit/) 开源协议

若在您的产品中使用本代码，请在可见页面标注原作者、源代码链接及源代码协议。
