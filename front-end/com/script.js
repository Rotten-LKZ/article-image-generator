const block = window.parent.block;
const column = window.parent.column;
const row = window.parent.row;
const text = window.parent.text;
const line = window.parent.line;

var root = document.querySelector("#root");
var renderParas = [];
const paras = text.split("\n");
var titleSpaceNum = parseInt((block - paras[0].length) / 2);
var title = "";
for (let i = 0;i < titleSpaceNum;i++) {
  title += " ";
}
title += paras[0];
renderParas.push({"extra": getExtraText(), "text": title});
for (let i = 1;i < paras.length;i++) {
  let characters = paras[i].split("");
  characters.unshift(" ", " ");
  for (let j = 0;j < characters.length;j++) {
    if (characters[j] === "“" && isLeftPunctuation(characters[j - 1])) {
      characters[j - 1] += "“";
      characters.splice(j, 1);
      j--;
      continue;
    } else if (characters[j] === "”" && isRightPunctuation(characters[j - 1])) {
      characters[j - 1] += "”";
      characters.splice(j, 1);
      j--;
      continue;
    }
    if ((j + 1) % block === 1 && isPunctuation(characters[j])) {
      characters[j - 1] += characters[j];
      characters.splice(j, 1);
      j--;
    }
  }
  var extraText = {};
  var rowText = "";
  for (let j = 0;j < characters.length;j++) {
    if (characters[j].length === 2) {
      extraText[j % block] = getPunctuationName(characters[j].substr(1, 1));
      characters[j] = characters[j].substr(0, 1);
    } else {
      extraText[j % block] = "";
    }
    rowText += characters[j];
    if ((j + 1) % block === 0) {
      renderParas.push({"extra": extraText, "text": rowText});
      extraText = {};
      rowText = "";
    }
  }
  renderParas.push({"extra": extraText, "text": rowText});
}
var _renderParas = [];
for (let i = 0;i < renderParas.length;i++) {
  if (renderParas[i].text.replace(" ", "") !== "") {
    _renderParas.push(renderParas[i]);
  }
}
renderParas = _renderParas;
function isLeftPunctuation(str) {
  var punctuations = {
    "，": "comma",
    "：": "colon",
  }
  return punctuations[str] === undefined ? false : true;
}
function isRightPunctuation(str) {
  var punctuations = {
    "……":"ellipsis",
    "。": "period",
    "！": "exmark",
    "？": "qumark",
  }
  return punctuations[str] === undefined ? false : true;
}
function getPunctuationName(str) {
  var punctuations = {
    "、": "stopSign",
    "……":"ellipsis",
    "，": "comma",
    "。": "period",
    "！": "exMark",
    "？": "quMark",
    "：": "colon",
    "；": "seMark",
    "“": "quoLeftMark",
    "”": "quoRightMark",
    "“": "quoLeftMark",
    "’": "siQuoRightMark",
  }
  return punctuations[str] === undefined ? "" : punctuations[str];
}
function isPunctuation(str) {
  console.log(str)
  var punctuations = ["、", "……", "，", "。", "！", "？", "：", "；", "’", "”"];
  for (let i = 0;i < punctuations.length;i++) {
    if (str.includes(punctuations[i])) {
      return true;
    }
  }
}
function getExtraText(...con) {
  var extra = {};
  for (let i = 0;i < con.length;i++) {
    extra[con[i][0]] = con[i][1];
  }
  for (let i = 0;i < block;i++) {
    if (extra[i] === undefined) {
      extra[i] = "";
    }
  }
  return extra;
}
var columnIns = "";
var blocksRendered = 0;
var columnsRendered = 0;
for (let i = 0;i < column;i++) {
  columnsRendered++;
  columnIns += `<div class="column" id="column${columnsRendered}">${rowInsRender(i)}</div>`;
}
function rowInsRender(column) {
  var rowIns = "";
  for (let i = 0;i < row;i++) {
    rowIns += `<div class="row">${blocksInsRender(i + column * row)}</div>`;
  }
  return rowIns;
}
function blocksInsRender(para) {
  var blockIns = "";
  for (let i = 0;i < block;i++) {
    blocksRendered += 1;
    var con = renderParas[para];
    if (con === undefined) {
      if (blocksRendered % 100 === 0) {
        blockIns += `<div class="block arrived" id="arrived${blocksRendered / 100}"> </div>`
      } else {
        blockIns += `<div class="block"> </div>`
      }
    } else {
      if (blocksRendered % 100 === 0) {
        blockIns += `<div class="block ${con.extra[i]} arrived" id="arrived${blocksRendered / 100}">${con.text[i] === undefined ? " " : con.text[i]}</div>`
      } else {
        blockIns += `<div class="block ${con.extra[i]}">${con.text[i] === undefined ? " " : con.text[i]}</div>`
      }
    }
  }
  return blockIns;
}
root.innerHTML += columnIns;
for (let i = 1;i <= blocksRendered / 100;i++) {
  var arrived = document.getElementById(`arrived${i}`);
  arrived.setAttribute("data-number", `${i * 100}字`);
}
for (let i = 0;i < line.length;i++) {
  for (let j = 0;j < line[i].length;j++) {
    var currentColumn = document.getElementById(`column${i + 1}`);
    currentColumn.innerHTML += `<span class="lines" style="width: ${block * 26 + 10}px;top: ${31 * line[i][j]}px;"></span>`;
  }
}
root.innerHTML += `<span id="renderedComplete" style="display: none;"></span>`