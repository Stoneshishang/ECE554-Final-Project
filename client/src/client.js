let sock;

const appendMessage = (message) => {
  //<ul> element
  const parent = document.querySelector("#events");

  //<li> element
  const el = document.createElement("li");
  el.innerText = message;

  parent.append(el);
};

//Chat Window
const onFormSubmitted = (e) => {
  e.preventDefault();

  const input = document.querySelector("#chat");
  const message = input.value;
  appendMessage(`You: ${message}`);
  sock.emit("send-chat-message", message);
  input.value = "";
};

//Display the selected betting amount each individual player for themselves
const addPriceButtonListeners = () => {
  ["add50", "add500", "add2000"].forEach((id) => {
    const button = document.getElementById(id);
    const value = button.value;
    button.addEventListener("click", () => {
      console.log(`value is ${value}`);
      sock.emit("turn", value);
    });
  });
};

function immediateDisable1() {
  ["add50", "add500", "add2000"].forEach((id) => {
    document.getElementById(id).disabled = true;
  });
}

function immediateDisable2() {
  document.getElementById("confirm-betting-price").disabled = true;
}

function immediateDisable3() {
  document.getElementById("confirm-time-selection").disabled = true;
}

function disableButton() {
  [
    "add50",
    "add500",
    "add2000",
    "confirm-betting-price",
    "confirm-time-selection",
  ].forEach((id) => {
    document.getElementById(id).disabled = true;
  });
}

const idleDisable = () => {
  // alert("hello, idleDisable is triggered!");
  const resetTimer = () => {
    // window.alert("resetTimer is triggered!");
    window.clearTimeout(t);
    t = window.setTimeout(disableButton, 10000);
  };

  sock.on("timer", () => {
    window.clearTimeout(t);

    console.log(`t is ${t}`);

    console.log("clear timer is excuted!");
  });

  resetTimer();
  var t;
  document.onkeydown = resetTimer;

  console.log(document.onkeydown);
};

const enableButton = () => {
  [
    "add50",
    "add500",
    "add2000",
    "confirm-betting-price",
    "confirm-time-selection",
  ].forEach((id) => {
    document.getElementById(id).disabled = false;
  });
};

// Display the inputted price to each individual player for themselves

const bettingPriceFrom = (e) => {
  e.preventDefault();
  const inputVal = document.querySelector("#price");

  sock.emit("selections", `Betting price input is ${inputVal.value}`);
  sock.emit("turn", `${inputVal.value}`);
};

// Display the Betting Time each individual player for themselves

const bettingTimeForm = (e) => {
  e.preventDefault();

  const inputVal = document.querySelector("#time");

  sock.emit("selections", `Betting time input is ${inputVal.value}`);
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
  // window.setTimeout(enableButton, eta_ms);

  console.log(`setTime is ${setTime}`);
  console.log(`currentTime is ${currentTime}`);
  console.log(`eta_ms is ${eta_ms}`);
};

const main = () => {
  appendMessage("Welcome to RT Gambling!");

  const name = prompt("What is your name?");
  console.log(`your name is ${name}`);

  sock = io();

  sock.on("initialMessage", appendMessage);

  sock.on("player2Identifier", appendMessage);

  sock.emit("new-user", name);

  sock.on("user-connected", (name) => {
    appendMessage(`${name} connected`);
  });

  sock.on("chat-message", (data) => {
    console.log(`data is ${data}`);

    appendMessage(`${data.name}: ${data.message}`);
  });

  sock.on("selections", appendMessage);

  sock.on("timer", () => {
    enableButton();
  });

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
