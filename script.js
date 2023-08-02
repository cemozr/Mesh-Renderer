var fileContent;
var parser, xmlDoc;
const slider = document.getElementById("slider");

function loadXMLDoc(input) {
  if (!fileValidation()) {
    alert(".xml Uzantılı Bir Dosya Seçiniz!");
    inputBtn.value = "";
    return;
  }
  fileName = event.target;
  readFile();
}

function readFile(input) {
  var inputBtn = document.getElementById("file-selector");
  var parseOutput = document.getElementById("parseOutput");
  let [file] = document.querySelector("input[type=file]").files;

  let reader = new FileReader();

  let drawFunc = () => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 800, 600);

    var txt = fileContent,
      parser,
      xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(txt, "text/xml");

    const vertex = xmlDoc.getElementsByTagName("Vertex");
    const line = xmlDoc.getElementsByTagName("Line");

    var newStr = "";

    for (let i = 0; i < vertex.length; ++i) {
      var x = vertex[i].getAttribute("x");
      var y = vertex[i].getAttribute("y");
      var z = vertex[i].getAttribute("z");
    }
    for (let i = 0; i < line.length; i++) {
      let vertexId = line[i].getAttribute("from");
      let vertexId1 = line[i].getAttribute("to");

      let x1 = vertex[vertexId].getAttribute("x") / 100;
      let y1 = vertex[vertexId].getAttribute("y") / 100;
      let z1 = vertex[vertexId].getAttribute("z") / 100;
      let x2 = vertex[vertexId1].getAttribute("x") / 100;
      let y2 = vertex[vertexId1].getAttribute("y") / 100;
      let z2 = vertex[vertexId1].getAttribute("z") / 100;

      let f = 10;
      let n = 1;
      let fov = 90;
      let S = 1 / Math.tan(((fov / 2) * Math.PI) / 180);

      let angle = (slider.value * Math.PI) / 180;
      let rotatedX1 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
      let rotatedX2 = x2 * Math.cos(angle) - y2 * Math.sin(angle);
      let rotatedY1 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
      let rotatedY2 = x2 * Math.sin(angle) + y2 * Math.cos(angle);
      let rotatedZ1 = z1;
      let rotatedZ2 = z2;

      angle = (90 * Math.PI) / 180;

      let newX1 = rotatedX1;
      let newX2 = rotatedX2;
      let newY1 = rotatedY1 * Math.cos(angle) - rotatedZ1 * Math.sin(angle);
      let newY2 = rotatedY2 * Math.cos(angle) - rotatedZ2 * Math.sin(angle);
      let newZ1 = rotatedY1 * Math.sin(angle) + rotatedZ1 * Math.cos(angle);
      let newZ2 = rotatedY2 * Math.sin(angle) + rotatedZ2 * Math.cos(angle);

      let _z1 = (-f / (f - n)) * newZ1 - 1;
      let _z2 = (-f / (f - n)) * newZ2 - 1;

      let _x1 = newX1 / (newZ1 + 1);
      let _y1 = newY1 / (newZ1 + 1);

      let _x2 = newX2 / (newZ2 + 1);
      let _y2 = newY2 / (newZ2 + 1);

      draw(ctx, _x1 * 250, _y1 * 250, _x2 * 250, _y2 * 250);
    }
  };

  reader.addEventListener(
    "load",
    () => {
      fileContent = event.target.result;
      drawFunc();
    },
    false
  );
  slider.addEventListener("input", drawFunc);
  slider.addEventListener("change", drawFunc);

  if (file) {
    reader.readAsText(file);
  }
  reader.onload = function () {};

  reader.onerror = function () {
    console.log(reader.error);
  };
}

function fileValidation() {
  var inputBtn = document.getElementById("file-selector");
  var fileExtension = inputBtn.value;

  var allowedExtensions = /(\.xml)$/i;
  if (!allowedExtensions.exec(fileExtension)) {
    return false;
  } else {
    return true;
  }
}

function draw(ctx, _x1, _y1, _x2, _y2) {
  ctx.beginPath();
  ctx.moveTo(_x1 + 400, _y1 + 300);
  ctx.lineTo(_x2 + 400, _y2 + 300);
  ctx.stroke();
  ctx.closePath();
}
