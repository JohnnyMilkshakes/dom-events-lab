/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let num1 = "",
  num2 = "",
  op = "",
  typedNumber = "";

let fullInput = "";

/*------------------------ Cached Element References ------------------------*/
const calculator = document.querySelector("#calculator");
const display = document.querySelector(".display");

/*----------------------------- Event Listeners -----------------------------*/
calculator.addEventListener("click", (event) => {
  // This log is for testing purposes to verify we're getting the correct value
  // You have to click a button to see this log
  // console.log(event);

  if (event.target.innerText === "C") {
        display.innerText = "";
        num1 = "";
        num2 = "";
  } else if (event.target.classList.contains("number")) {
        if (display.innerText === "Error") {
        display.innerText = "";
        }
        // Do something with a typedNumber
        typedNumber = event.target.innerText;
        display.innerText = display.innerText + typedNumber;

        fullInput = fullInput + typedNumber;

  } else if (event.target.classList.contains("operator")) {
        if (!display.innerText) {
            display.innerText = "Error";
        }

        op = event.target.innerText;
        display.innerText = display.innerText + op;

        fullInput = fullInput + op;

        // console.log(fullInput);
  } else if (event.target.classList.contains("equals")) {
        console.log(fullInput)
        display.innerText = ''
        fullInput = ''
  }

  // Example
  if (event.target.innerText === "*") {
    // Do something with this operator
  }
});

/*-------------------------------- Functions --------------------------------*/
