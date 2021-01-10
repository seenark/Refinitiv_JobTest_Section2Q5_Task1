const { dialog } = require("electron");

const ButtonStateEnum = {
  plus: "0",
  minus: "1",
  multiply: "2",
  divide: "3",
  power: "4",
};
Object.freeze(ButtonStateEnum);

/** calulate operation */
let buttonState = "";
const highlighButton = "highlight-btn";
const plusBtn = $("#btn-plus");
const minusBtn = $("#btn-minus");
const multiplyBtn = $("#btn-multiply");
const dividerBtn = $("#btn-divide");
const powBtn = $("#btn-pow");
plusBtn.addEventListener("click", clickedPlus);
plusBtn.name = ButtonStateEnum.plus;
minusBtn.addEventListener("click", clickedMinus);
minusBtn.name = ButtonStateEnum.minus;
multiplyBtn.addEventListener("click", clickedMultiply);
multiplyBtn.name = ButtonStateEnum.multiply;
dividerBtn.addEventListener("click", clickedDivide);
dividerBtn.name = ButtonStateEnum.divide;
powBtn.addEventListener("click", clickedPower);
powBtn.name = ButtonStateEnum.power;

function clickedPlus() {
  if (canCalculate()) setResult(getAValue() + getBValue());
  buttonState = ButtonStateEnum.plus;
  setButtonColor();
}
function clickedMinus() {
  if (canCalculate()) setResult(getAValue() - getBValue());
  buttonState = ButtonStateEnum.minus;
  setButtonColor();
}
function clickedMultiply() {
  if (canCalculate()) setResult(getAValue() * getBValue());
  buttonState = ButtonStateEnum.multiply;
  setButtonColor();
}
function clickedDivide() {
  if (canCalculate()) setResult(getAValue() / getBValue());
  buttonState = ButtonStateEnum.divide;
  setButtonColor();
}
function clickedPower() {
  if (canCalculate()) setResult(Math.pow(getAValue(), getBValue()));
  buttonState = ButtonStateEnum.power;
  setButtonColor();
}
function setButtonColor() {
  const btnArray = [plusBtn, minusBtn, multiplyBtn, dividerBtn, powBtn];
  btnArray.forEach((btn) => {
    if (buttonState === btn.name) {
      btn.classList.add(highlighButton);
    } else {
      btn.classList.remove(highlighButton);
    }
  });
}
/** save Operation */
const saveBtn = $("#save");
saveBtn.addEventListener("click", clickedSave);
async function clickedSave() {
  const data = {
    a: getAValue(),
    b: getBValue(),
    btnState: buttonState,
  };
  const dataStr = JSON.stringify(data);
  const filepath = await saveFileDialog();
  writeFile(filepath, dataStr);
}
async function saveFileDialog() {
  const { dialog } = require("electron").remote;
  const files = await dialog.showSaveDialog({
    properties: ["showOverwriteConfirmation"],
  });
  let filepath = files.filePath;
  console.log("test", /^.+(.json){1,1}$/gi.test(filepath));
  if (/^.+(.json){1,1}$/gi.test(filepath)) {
    console.log("filepath", filepath);
    filepath = filepath.replace(/\.json/gi, "");
    console.log("filepath2", filepath);
  }
  filepath = filepath + ".json";
  return filepath;
}
function writeFile(fullFilePath, data) {
  const fs = require("fs");
  const file = fs.writeFileSync(fullFilePath, data);
}

/** load operation */
const loadBtn = $("#load");
loadBtn.addEventListener("click", clickedLoad);
async function clickedLoad() {
  const filepath = await openFileDialog();
  if (!filepath) {
    alert("no file selected");
    return;
  }
  const data = readFile(filepath);
  if (!verifyData(data)) {
    alert("invalid file");
    return;
  }
  setAValue(data.a);
  setBValue(data.b);
  buttonState = data.btnState + "";
  calculationByButtonState();
}
async function openFileDialog() {
  const { dialog } = require("electron").remote;
  const files = await dialog.showOpenDialog({
    properties: ["openFile"],
  });
  if (!files.canceled && files.filePaths.length <= 0) {
    return null;
  } else {
    return files.filePaths[0];
  }
}
function readFile(filePath) {
  const fs = require("fs");
  let rawdata = fs.readFileSync(filePath);
  let data = JSON.parse(rawdata);
  return data;
}
function verifyData(data) {
  if (
    !Number.parseFloat(data.a) &&
    !Number.parseFloat(data.b) &&
    !Number.parseInt(data.buttonState)
  ) {
    return false;
  }
  return true;
}
/** helper function */
function $(querySelector) {
  const element = document.querySelector(querySelector);
  return element;
}

function canCalculate() {
  return getAValue() && getBValue();
}

function setResult(result) {
  const resultBox = $("#result");
  resultBox.innerText = result;
}

function getAValue() {
  const aValue = $("#a-input").value;
  if (Number.parseFloat(aValue)) {
    return Number.parseFloat(aValue);
  } else {
    return null;
  }
}
function setAValue(value) {
  $("#a-input").value = value;
}
function getBValue() {
  const bValue = $("#b-input").value;
  if (Number.parseFloat(bValue)) {
    return Number.parseFloat(bValue);
  } else {
    return null;
  }
}
function setBValue(value) {
  $("#b-input").value = value;
}
function calculationByButtonState() {
  switch (buttonState) {
    case ButtonStateEnum.plus:
      plusBtn.click();
      break;
    case ButtonStateEnum.minus:
      minusBtn.click();
      break;
    case ButtonStateEnum.multiply:
      multiplyBtn.click();
      break;
    case ButtonStateEnum.divide:
      dividerBtn.click();
      break;
    case ButtonStateEnum.power:
      powBtn.click();
      break;
  }
}
