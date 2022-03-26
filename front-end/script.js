block = 16;
column = 3;
row = 22;
text = "";
line = [
  [1, 6, 9, 17],
  [6, 9, 17],
  [6, 8, 13],
];

if (window.localStorage) {
  let config = window.localStorage.getItem("config");
  let content = window.localStorage.getItem("content");
  if (config !== null && config !== undefined) {
    config = JSON.parse(config);
    block = config.block;
    column = config.column;
    row = config.row;
    line = config.line;
  }
  if (content !== null && content !== undefined) {
    text = content;
  }
}

// init HTML values
document.getElementById("blockInput").value = block;
document.getElementById("columnInput").value = column;
document.getElementById("rowInput").value = row;
document.getElementById("content").value = text;

/**
 * @returns 如果为 false 则不符合规范，将自动弹出提示框
 */
function getInput() {
  const blockInput = document.getElementById("blockInput").value;
  const columnInput = document.getElementById("columnInput").value;
  const rowInput = document.getElementById("rowInput").value;
  const textInput = document.getElementById("content").value;
  if (
    isNaN(parseInt(blockInput)) ||
    isNaN(parseInt(columnInput)) ||
    isNaN(parseInt(rowInput))
  ) {
    swal("错误", "请输入数字", "error");
    return false;
  }
  return {
    blockInput: parseInt(blockInput),
    columnInput: parseInt(columnInput),
    rowInput: parseInt(rowInput),
    textInput: textInput,
  };
}

function updateIframeHeight(height) {
  document
    .getElementById("previewPage")
    .setAttribute("style", `height: ${height}px`);
}

let generatePNG = document.getElementById("generatePNG");
let generatePDF = document.getElementById("generatePDF");
let preview = document.getElementById("preview");
let addLine = document.getElementById("addLine");
let viewLine = document.getElementById("viewLine");
let saveConfig = document.getElementById("saveConfig");
let deleteConfig = document.getElementById("deleteConfig");
let optimization = document.getElementById("optimization");
let clearCache = document.getElementById("clearCache");

generatePNG.onclick = function (e) {
  e.preventDefault();
  generate(false);
};

generatePDF.onclick = function (e) {
  e.preventDefault();
  generate(true);
};

function generate(isPdf) {
  const input = getInput();
  if (input === false) {
    return;
  }
  block = input.blockInput;
  column = input.columnInput;
  row = input.rowInput;
  text = input.textInput;
  window.open(
    `./com/com.html?block=${block}&column=${column}&row=${row}&text=${text.replace(
      /\n/g,
      "\\n"
    )}&line=${JSON.stringify(line)}&isPdf=${JSON.stringify(isPdf)}`,
    "_blank"
  );
}

preview.onclick = function (e) {
  e.preventDefault();
  const input = getInput();
  if (input === false) {
    return;
  }
  block = input.blockInput;
  column = input.columnInput;
  row = input.rowInput;
  text = input.textInput;
  document.getElementById("previewPage").contentWindow.location.reload();

  swal("成功", "预览窗口已重新渲染", "success");
};

addLine.onclick = function (e) {
  e.preventDefault();
  const lineInput = document.getElementById("lineInput").value;
  const cache = lineInput.split(" ");
  if (cache.length !== 2) {
    swal("错误", "格式错误", "error");
    return;
  }
  const linePlace = [parseInt(cache[0]), parseInt(cache[1])];
  if (isNaN(linePlace[0]) || isNaN(linePlace[1])) {
    swal("错误", "格式错误", "error");
    return;
  }
  for (let i = 0; i < line.length; i++) {
    for (let j = 0; j < line[i].length; j++) {
      if (linePlace[0] === i + 1 && linePlace[1] === line[i][j]) {
        line[i].splice(j, 1);
        swal("成功", "删除成功", "success");
        return;
      }
    }
  }

  if (line[linePlace[0] - 1] === undefined) {
    line[linePlace[0] - 1] = [];
  }
  line[linePlace[0] - 1].push(linePlace[1]);
  swal("成功", "添加成功", "success");
};

viewLine.onclick = function (e) {
  e.preventDefault();
  let nowLines = "";
  for (let i = 0; i < line.length; i++) {
    for (let j = 0; j < line[i].length; j++) {
      nowLines += `${i + 1} ${line[i][j]}\n`;
    }
    nowLines += "\n";
  }
  swal(`已添加以下横线：\n${nowLines}`);
};

deleteAllLines.onclick = function (e) {
  e.preventDefault();
  line = [];
  swal("成功", "已删除全部横线", "success");
};

saveConfig.onclick = function (e) {
  e.preventDefault();
  if (window.localStorage) {
    const input = getInput();
    if (input === false) {
      return;
    }
    window.localStorage.setItem(
      "config",
      JSON.stringify({
        block: input.blockInput,
        column: input.columnInput,
        row: input.rowInput,
        line: line,
      })
    );
    swal("成功", "已保存配置", "success");
  } else {
    swal("错误", "您使用的浏览器不支持本地存储", "error");
  }
};

deleteConfig.onclick = function (e) {
  e.preventDefault();
  if (window.localStorage) {
    window.localStorage.clear();
    swal("成功", "已删除配置", "success");
  } else {
    swal("错误", "您使用的浏览器不支持本地存储", "error");
  }
};

optimization.onclick = function (e) {
  e.preventDefault();
  let textInput = document.getElementById("content").value;
  textInput = textInput.replace(/ /g, "");
  textInput = textInput.replace(/\.\.\./g, "…");
  document.getElementById("content").value = textInput;
};

clearCache.onclick = function (e) {
  e.preventDefault();
  if (window.localStorage) {
    window.localStorage.removeItem("content");
  }
};

document.getElementById("content").onblur = function (e) {
  e.preventDefault();
  if (window.localStorage) {
    window.localStorage.setItem(
      "content",
      document.getElementById("content").value
    );
  }
};

window.onbeforeunload = function () {
  if (window.localStorage) {
    window.localStorage.setItem(
      "content",
      document.getElementById("content").value
    );
  }
};
