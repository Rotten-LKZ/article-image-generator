
block = 16;
column = 3;
row = 22;
text = "";
line = [[1, 6, 9, 17], [6, 9, 17], [6, 8, 13]];

if (window.localStorage) {
  let config = window.localStorage.getItem("config");
  if (config !== null && config !== undefined) {
    config = JSON.parse(config);
    block = config.block;
    column = config.column;
    row = config.row;
    line = config.line;
  }
}

// init HTML values
document.getElementById("blockInput").value = block;
document.getElementById("columnInput").value = column;
document.getElementById("rowInput").value = row;

/**
 * @returns 如果为 false 则不符合规范，将自动弹出提示框
 */
function getInput() {
  const blockInput = document.getElementById("blockInput").value;
  const columnInput = document.getElementById("columnInput").value;
  const rowInput = document.getElementById("rowInput").value;
  const textInput = document.getElementById("content").value;
  if (isNaN(parseInt(blockInput)) || isNaN(parseInt(columnInput)) || isNaN(parseInt(rowInput))) {
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

let generatePNG = document.getElementById("generatePNG");
let generatePDF = document.getElementById("generatePDF");
let preview = document.getElementById("preview");
let addLine = document.getElementById("addLine");
let viewLine = document.getElementById("viewLine");
let saveConfig = document.getElementById("saveConfig");
let deleteConfig = document.getElementById("deleteConfig");
let optimization = document.getElementById("optimization");

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

  let details = {};

  if (isPdf) {
    details = {
      block: input.blockInput,
      column: input.columnInput,
      row: input.rowInput,
      content: input.textInput,
      lineStr: JSON.stringify(line),
      pdf: true
    };
    generatePDF.className = "btn btn-default disabled";
  } else {
    details = {
      block: input.blockInput,
      column: input.columnInput,
      row: input.rowInput,
      content: input.textInput,
      lineStr: JSON.stringify(line),
    };
    generatePNG.className = "btn btn-default disabled";
  }

  let formBody = [];
  for (let property in details) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const req = new Request("https://server.pyusr.com/api/composition", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  });
  fetch(req).then(function (response) {
    if (response.status < 200 && response.status >= 300) {
      console.log(response.status);
      if (response.status === 403) {
        swal("错误", "请求人数过多，请稍后重试", "error");
      } else if (response.status === 400) {
        swal("错误", "请求格式错误", "error");
      } else {
        swal("错误", "生成图片失败", "error");
      }
      return;
    }
    return response.text();
  })
  .then(function (data) {
    const link = document.createElement('a');
    swal("成功", `生成 ${isPdf ? "PDF" : "PNG"} 成功\n地址：${data}`, "success");
    window.setTimeout(function () {
      link.href = data;
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, 1000);
  })
  .finally(function() {
    if (isPdf) {
      generatePDF.className = "btn btn-default";
    } else {
      generatePNG.className = "btn btn-default";
    }
  });
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
  const previewPage = document.getElementById("previewPage");
  previewPage.contentWindow.location.reload();
  previewPage.setAttribute("style", `height: ${31 * parseInt(row) + 7}px`);

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
  for (let i = 0;i < line.length;i++) {
    for (let j = 0;j < line[i].length;j++) {
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
}

viewLine.onclick = function (e) {
  e.preventDefault();
  let nowLines = "";
  for (let i = 0;i < line.length;i++) {
    for (let j = 0;j < line[i].length;j++) {
      nowLines += `${i + 1} ${line[i][j]}\n`;
    }
    nowLines += "\n";
  }
  swal(`已添加以下横线：\n${nowLines}`);
}

deleteAllLines.onclick = function (e) {
  e.preventDefault();
  line = [];
  swal("成功", "已删除全部横线", "success");
}

saveConfig.onclick = function(e) {
  e.preventDefault();
  if (window.localStorage) {
    const input = getInput();
    if (input === false) {
      return;
    }
    window.localStorage.setItem("config", JSON.stringify({
      block: input.blockInput,
      column: input.columnInput,
      row: input.rowInput,
      line: line,
    }));
    swal("成功", "已保存配置", "success");
  } else {
    swal("错误", "您使用的浏览器不支持本地存储", "error");
  }
}

deleteConfig.onclick = function(e) {
  e.preventDefault();
  if (window.localStorage) {
    window.localStorage.clear();
    swal("成功", "已删除配置", "success");
  } else {
    swal("错误", "您使用的浏览器不支持本地存储", "error");
  }
}

optimization.onclick = function(e) {
  e.preventDefault();
  let textInput = document.getElementById("content").value;
  textInput = textInput.replace(/ /g, "");
  textInput = textInput.replace(/\.\.\./g, "…");
  document.getElementById("content").value = textInput;
}
