/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let numsAndOps = []

let num1 = "",
  num2 = "",
  op = "",
  typedNumber = "";

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
        numsAndOps = []

  } else if (event.target.classList.contains("number")) {

        if (display.innerText === "Error") {
            display.innerText = "";
        }

        if (display.innerText === '+' || 
            display.innerText === '-' || 
            display.innerText === '*' || 
            display.innerText === '/') {
                numsAndOps.push(display.innerText)
                display.innerText = "";

        }

        // Do something with a typedNumber
        typedNumber = event.target.innerText;
        display.innerText = display.innerText + typedNumber;

  } else if (event.target.classList.contains("operator")) {
        if (!display.innerText) {
            display.innerText = "Error";
        }

        numsAndOps.push(display.innerText)

        display.innerText = ''

        op = event.target.innerText;
        display.innerText = display.innerText + op;

  } else if (event.target.classList.contains("equals")) {
        numsAndOps.push(display.innerText)

        console.log(numsAndOps)
        basicCalculator(numsAndOps[0], numsAndOps[2], numsAndOps[1])

        num1 = +numsAndOps[0] // unary plus operators to convert string to number, 
        num2 = +numsAndOps[2] // i asked chatgpt how to make that conversion 
        op = numsAndOps[1] 

        console.log(num1, op, num2)

        display.innerText = basicCalculator(num1, num2, op)
        numsAndOps = []
  }
});

/*-------------------------------- Functions --------------------------------*/

function basicCalculator(num1, num2, operation) {
    if (operation === "+") {
        return num1 + num2
    } 
    
    if (operation === "-") {
        return num1 - num2
    } 
    
    if (operation === "*") {
        return num1 * num2
    } 
    
    if (operation === "/") {
        return num1 / num2
    }
}
