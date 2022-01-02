
block = 15;
column = 3;
row = 20;
text = "";
line = [[1, 6, 9, 17], [6, 9, 17], [6, 8, 13]];

let generate = document.getElementById("generate");
let preview = document.getElementById("preview");
let addLine = document.getElementById("addLine");
let viewLine = document.getElementById("viewLine");

generate.onclick = function (e) {
  e.preventDefault();
  const blockInput = document.getElementById("blockInput").value;
  const columnInput = document.getElementById("columnInput").value;
  const rowInput = document.getElementById("rowInput").value;
  const textInput = document.getElementById("content").value;
  if (isNaN(parseInt(blockInput)) || isNaN(parseInt(columnInput)) || isNaN(parseInt(rowInput))) {
    swal("错误", "所有输入框均不为空", "error");
    return;
  }

  generate.className = "btn btn-primary disabled";

  const details = {
    block: parseInt(blockInput),
    column: parseInt(columnInput),
    row: parseInt(rowInput),
    content: textInput,
    lineStr: JSON.stringify(line)
  };

  
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
      swal("错误", "生成图片失败", "error");
      return;
    }
    return response.text();
  }).then(function (data) {
    const link = document.createElement('a');
    swal("成功", `生成图片成功\n地址：${data}`, "success");
    window.setTimeout(function () {
      link.href = data;
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, 1000);
  }).finally(function() {
    generate.className = "btn btn-primary";
  });
};

preview.onclick = function (e) {
  e.preventDefault();
  const blockInput = document.getElementById("blockInput").value;
  const columnInput = document.getElementById("columnInput").value;
  const rowInput = document.getElementById("rowInput").value;
  const textInput = document.getElementById("content").value;
  if (isNaN(parseInt(blockInput)) || isNaN(parseInt(columnInput)) || isNaN(parseInt(rowInput))) {
    swal("错误", "所有输入框均不为空", "error");
    return;
  }
  block = blockInput;
  column = columnInput;
  row = rowInput;
  text = textInput;
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
  console.log(linePlace)
  for (let i = 0;i < line.length;i++) {
    for (let j = 0;j < line[i].length;j++) {
      console.log(i + 1, line[i][j]);
      console.log(linePlace[0] === i + 1 && linePlace[1] === line[i][j])
      if (linePlace[0] === i + 1 && linePlace[1] === line[i][j]) {
        line[i].splice(j, 1);
        swal("成功", "删除成功", "success");
        return;
      }
    }
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

