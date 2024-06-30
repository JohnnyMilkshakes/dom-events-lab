/*-------------------------------- Constants --------------------------------*/
const numsAndOps = []
/*-------------------------------- Variables --------------------------------*/
let num1 = "",
  num2 = "",
  op = "",
  typedNumber = "";

let equalsPressed = false
/*------------------------ Cached Element References ------------------------*/
const calculator = document.querySelector("#calculator");
const display = document.querySelector(".display");

/*----------------------------- Event Listeners -----------------------------*/
calculator.addEventListener("click", (event) => {

    // if user clicks C, clear the display and data in memory
    if (event.target.innerText === "C") {
        updateDisplay("")
        resetData()

        // Logic for when user clicks a number
    } else if (event.target.classList.contains("number")) {

        if (display.innerText === "Error") {
            clearText()
        }

        if (equalsPressed === true) {
            clearText()
            resetData()
            equalsPressed = false
        }

        if (display.innerText === '+' || 
            display.innerText === '-' || 
            display.innerText === '*' || 
            display.innerText === '/') {
                numsAndOps.push(display.innerText)
                clearText()

        }

        typedNumber = event.target.innerText;
        updateDisplay(display.innerText + typedNumber)


        // Logic for when user clicks an operator 
    } else if (event.target.classList.contains("operator")) {

        console.log(typeof display.innerText)

        if (!display.innerText) {
            updateDisplay("Error")
        } else {

            numsAndOps.push(display.innerText)

            clearText();
    
            op = event.target.innerText;
            updateDisplay(display.innerText + op)
        }

        

        // Logic for when user clicks equals sign
    } else if (event.target.classList.contains("equals")) {
        equalsPressed = true

        numsAndOps.push(display.innerText)

        num1 = +numsAndOps[0] // unary plus operators to convert string to number, 
        num2 = +numsAndOps[2] // i asked chatgpt how to make that conversion 
        op = numsAndOps[1] 

        updateDisplay(basicCalculator(num1, num2, op))
        numsAndOps.length = 0
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

function clearText() {
    display.innerText = ''
}

function resetData() {
    num1 = "";
    num2 = "";
    numsAndOps.length = 0
}

function updateDisplay(info) {
    display.innerText = info
}