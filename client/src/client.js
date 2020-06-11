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
    button.addEventListener("click", () => {
      sock.emit("turn", id);
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
