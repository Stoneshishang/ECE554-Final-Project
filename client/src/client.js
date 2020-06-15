let sock;

const writeEvent = (text) => {
  //<ul> element
  const parent = document.querySelector("#events");

  //<li> element
  const el = document.createElement("li");
  el.innerHTML = text;

  parent.appendChild(el);
};

//Chat Window
const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector("#chat");
  const text = input.value;
  input.value = "";

  sock.emit("message", text);
};

//Display the selected betting amount each individual player for themselves
const addPriceButtonListeners = () => {
  ["add50", "add500", "add2000"].forEach((id) => {
    const button = document.getElementById(id);
    const value = button.value;
    button.addEventListener("click", () => {
      console.log(`value is ${value}`);
      // sock.emit("score", value)
      sock.emit("turn", value);
    });
  });
};

const startTimer = () => {
  // window.setTimeout(window.alert, 10000, "Your betting time is up!");
  // window.setTimeout(disableButton, 10000);
};

const disableButton = () => {
  [
    "add50",
    "add500",
    "add2000",
    "confirm-betting-price",
    "confirm-time-selection",
  ].forEach((id) => {
    document.getElementById(id).disabled = true;
  });
};

// Display the inputted price to each individual player for themselves

const bettingPriceFrom = (e) => {
  e.preventDefault();
  const inputVal = document.querySelector("#price");

  sock.emit("message", `Betting price input is ${inputVal.value}`);
  sock.emit("turn", `${inputVal.value}`);
};

// Display the Betting Time each individual player for themselves

const bettingTimeForm = (e) => {
  e.preventDefault();

  const inputVal = document.querySelector("#time");

  sock.emit("message", `Betting time input is ${inputVal.value}`);
  sock.emit("turn", `${inputVal.value}`);
};

const timeout = () => {
  const inputVal = document.querySelector("#time");

  const today = new Date();
  const year = Number(today.getFullYear());
  const month = Number(today.getMonth());
  const date = Number(today.getDate());
  const hour = Number(inputVal.value.substring(0, 2));
  const minute = Number(inputVal.value.substring(3, 5));
  const second = Number(inputVal.value.substring(6, 8));

  const setTime = new Date(year, month, date, hour, minute, second).getTime();
  const currentTime = Date.now();

  const eta_ms = setTime - currentTime;

  window.setTimeout(delayedbitcoinDataHandler, eta_ms);

  console.log(`setTime is ${setTime}`);
  console.log(`currentTime is ${currentTime}`);
  console.log(`eta_ms is ${eta_ms}`);
};

const main = () => {
  writeEvent("Welcome to RT Gambling!");

  sock = io();
  sock.on("message", writeEvent);

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onFormSubmitted);
  document
    .querySelector("#betting-price-form")
    .addEventListener("submit", bettingPriceFrom);
  document
    .querySelector("#time-form")
    .addEventListener("submit", bettingTimeForm);

  addPriceButtonListeners();
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") main();
};
