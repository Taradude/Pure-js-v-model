// let allMax = document.querySelectorAll('[max]');
let timer;
let inputTextAll = document.querySelectorAll('.bottom input[type="text"]');
let buttonTotal = document.querySelector("#setTotal");
let buttons = document.querySelectorAll(".bottom button");
let buttonBoxAdd = document.querySelector("#add");
let buttonStopDemo = document.querySelector("#stop");
buttonTotal.onclick = onClickTotalHandler;
buttonBoxAdd.onclick = onClickGenerateShifter;
buttonStopDemo.onclick = stopInterval;

function onClickTotalHandler() {
  let totalUsd = readInputTotal();
  rangeData.setTotal(totalUsd);
  renderValues();
  renderMaximums();

  if (readInputTotal() > 1) {
    timer = setInterval(function () {
      const ranKey = randomKey();
      const randomValue = randomNum(ranKey);
      rangeData.setValue(ranKey, randomValue);
      renderValues();
      renderMaximums();
    }, 1000);
  }
}

function stopInterval() {
  clearInterval(timer);
}

function readInputTotal() {
  let inputTotal = document.querySelector("#total_balance");
  return +inputTotal.value;
}

function renderMaximums() {
  let ranges = document.querySelectorAll('.bottom input[type="range"]');
  let progresses = document.querySelectorAll("progress");
  progresses.forEach((progress) => {
    const currentCtrl = progress.getAttribute("ctrl");
    progress.max = rangeData.maximums[currentCtrl];
  });
  ranges.forEach((range) => {
    const currentCtrl = range.getAttribute("ctrl");
    range.max = rangeData.maximums[currentCtrl];
  });
}

function renderValues() {
  let ranges = document.querySelectorAll('.bottom input[type="range"]');
  let progresses = document.querySelectorAll("progress");
  let texts = document.querySelectorAll('.bottom input[type="text"]');

  texts.forEach((input) => {
    const currentCtrl = input.getAttribute("ctrl");
    input.value = rangeData.values[currentCtrl];
  });
  progresses.forEach((progress) => {
    const currentCtrl = progress.getAttribute("ctrl");
    progress.value = rangeData.values[currentCtrl];
  });
  ranges.forEach((range) => {
    const currentCtrl = range.getAttribute("ctrl");
    range.value = rangeData.values[currentCtrl];
  });
}

function addInputRangeListeners() {
  let inputRangeAll = document.querySelectorAll('input[type="range"]');
  inputRangeAll.forEach(function (element) {
    element.addEventListener("input", onRangeInputHandler);
  });
}

addInputRangeListeners();

function onRangeInputHandler(e) {
  const element = e.target;
  const elementCtrl = element.getAttribute("ctrl");
  const rangeValue = +element.value;

  rangeData.setValue(elementCtrl, rangeValue);
  renderValues();
  renderMaximums();
}

buttons.forEach((button) => {
  button.onclick = onClickButtonHandler;
});

function onClickButtonHandler(e) {
  const currentButton = e.target;
  const ctrlAtr = currentButton.getAttribute("ctrl");
  const actionAtr = currentButton.getAttribute("action");

  if (actionAtr === "plus") {
    rangeData.plusOne(ctrlAtr);
  }
  if (actionAtr === "minus") {
    rangeData.minusOne(ctrlAtr);
  }
  renderValues();
  renderMaximums();
}

inputTextAll.forEach((input) => {
  input.oninput = onInputChangeHandler;
});

function onInputChangeHandler(e) {
  const currentInput = e.target;
  const currValue = e.target.value;
  const ctrlAtr = currentInput.getAttribute("ctrl");
  rangeData.setValue(ctrlAtr, currValue);
  renderValues();
  renderMaximums();
}

function randomNum(key) {
  const max = rangeData.maximums[key];
  return Math.trunc(Math.random() * max + 1);
}

function randomKey() {
  const valueProperties = Object.keys(rangeData.values);
  const mathTrunc = Math.trunc(Math.random() * valueProperties.length);
  const randomKey = valueProperties[mathTrunc];
  return randomKey;
}

function checkShiftersName(ctrl) {
  let shifters = document.querySelectorAll('input[type="range"]');
  for (let key of shifters) {
    let shifterName = key.getAttribute("name");
    if (shifterName === ctrl) {
      return false;
    }
  }
  createShifterBlock(ctrl);
}

function onClickGenerateShifter() {
  checkShiftersName(readInputBox());
}

function readInputBox() {
  let inputBox = document.querySelector(".box input");
  return inputBox.value;
}

function createShifterBlock(ctrl) {
  const shifterDiv = document.createElement("div");
  shifterDiv.classList.add("shifter");

  const label = document.createElement("label");
  label.setAttribute("for", `edit-${ctrl}`);
  label.textContent = `USD to ${ctrl.toUpperCase()}`;

  const progress1 = document.createElement("progress");
  progress1.setAttribute("ctrl", ctrl);
  progress1.setAttribute("max", "1000");
  progress1.setAttribute("value", "0");

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  const minusBtn = document.createElement("button");
  minusBtn.setAttribute("ctrl", ctrl);
  minusBtn.setAttribute("action", "minus");
  minusBtn.textContent = "<";

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("ctrl", ctrl);
  input.setAttribute("name", `edit-${ctrl}`);
  input.setAttribute("id", `edit-${ctrl}`);

  const plusBtn = document.createElement("button");
  plusBtn.setAttribute("ctrl", ctrl);
  plusBtn.setAttribute("action", "plus");
  plusBtn.textContent = ">";

  const progress2 = document.createElement("progress");
  progress2.setAttribute("ctrl", ctrl);
  progress2.setAttribute("max", "1000");
  progress2.setAttribute("value", "0");

  const rangeInput = document.createElement("input");
  rangeInput.setAttribute("type", "range");
  rangeInput.setAttribute("ctrl", ctrl);
  rangeInput.setAttribute("name", ctrl);
  rangeInput.setAttribute("min", "0");
  rangeInput.setAttribute("max", "1000");
  rangeInput.setAttribute("value", "0");
  rangeInput.setAttribute("step", "1");

  rowDiv.appendChild(minusBtn);
  rowDiv.appendChild(input);
  rowDiv.appendChild(plusBtn);

  shifterDiv.appendChild(label);
  shifterDiv.appendChild(progress1);
  shifterDiv.appendChild(rowDiv);
  shifterDiv.appendChild(progress2);
  shifterDiv.appendChild(rangeInput);

  rangeInput.oninput = onRangeInputHandler;
  plusBtn.onclick = onClickButtonHandler;
  minusBtn.onclick = onClickButtonHandler;
  input.oninput = onInputChangeHandler;

  let bottom = document.querySelector(".bottom");
  bottom.appendChild(shifterDiv);

  rangeData.values[ctrl] = 0;
  rangeData.maximums[ctrl] = 0;
}

async function getData(coin) {
  coin = coin.toUpperCase();
  let url = `https://min-api.cryptocompare.com/data/price?fsym=${coin}&tsyms=USD`;
  const response = await fetch(url);
  const json = await response.json();
  const value = json.USD;

  return +value;
}

async function renderCoinQuantity() {
  let spans = document.querySelectorAll("span");
  for (const span of spans) {
    const currentCtrl = span.getAttribute("ctrl");
    span.innerHTML = await rangeData.calcCoinQuantity(currentCtrl);
  }
}
