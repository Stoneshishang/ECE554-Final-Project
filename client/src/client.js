let sock = io();

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
  // input.value = "";

  sock.emit("message", text);
};

// Display the inputted price
const bettingPrice = () => {
  const price = document.getElementById("price");
  price.addEventListener("keyup", (e) => {
    if (e.key === 13) {
      event.preventDefault();
      const input = document.querySelector("#price");
      // const text = input.value;

      console.log(`betting price input is ${input}`);

      sock.emit("turn", `You have selected betting price of ${input}`);
    }
  });
};

const bettingPriceForm = (e) => {
  e.preventDefault();

  const inputVal = document.querySelector("#price");

  sock.emit("message", inputVal.value);
};

// Display the Betting Time
const bettingTime = () => {
  const price = document.getElementById("time");
  price.addEventListener("keyup", (e) => {
    if (e.key === 13) {
      event.preventDefault();
      const selection = document.querySelector("#time");
      // const text = input.value;

      console.log(`betting time input is ${selection}`);
      sock.emit("turn", selection);
    }
  });
};

const bettingTimeForm = (e) => {
  e.preventDefault();

  const inputVal = document.querySelector("#time");

  sock.emit("message", inputVal.value);
};

//Display the selected betting amount
const addPriceButtonListeners = () => {
  ["add50", "add500", "add2000"].forEach((id) => {
    const button = document.getElementById(id);
    button.addEventListener("click", () => {
      sock.emit("turn", id);
    });
  });
};

const main = () => {
  writeEvent("Welcome to RT Gambling!");

  const sock = io();
  sock.on("message", writeEvent);

  document
    .querySelector("#chat-form")
    .addEventListener("submit", onFormSubmitted);

  document
    .querySelector("#betting-price-form")
    .addEventListener("submit", bettingPriceForm);

  document
    .querySelector("#time-form")
    .addEventListener("submit", bettingTimeForm);

  addPriceButtonListeners();
  bettingPrice();
  bettingTime();
};

document.onreadystatechange = () => {
  if (document.readyState === "complete") main();
};
