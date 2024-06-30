/*-------------------------------- Constants --------------------------------*/
const numsAndOps = []
/*-------------------------------- Variables --------------------------------*/
let num1 = "",
  num2 = "",
  op = "",
  userInput = "";

let equalsPressed = false
let operatorPressed = false
/*------------------------ Cached Element References ------------------------*/
const calculator = document.querySelector("#calculator");
const display = document.querySelector(".display");


/*----------------------------- Event Listeners -----------------------------*/
calculator.addEventListener("click", (event) => {

    // if user clicks C, clear the display and data in memory
    if (getInnerText() === "C") {
        updateDisplay("")
        resetData()

        // Logic for when user clicks a number
    } else if (buttonType("number")) {

        if (display.innerText === "Error") {
            clearText()
        }

        if (equalsPressed) {
            clearText()
            resetData()
            equalsPressed = false
        }

        if (operatorPressed) {
            numsAndOps.push(display.innerText) // add the operator to the array
            clearText()
            operatorPressed = false
        }

        userInput = getInnerText()
        updateDisplay(display.innerText + userInput)


        // Logic for when user clicks an operator 
    } else if (buttonType("operator")) {

        operatorPressed = true

        if (!display.innerText) {
            updateDisplay("Error")
        } else {

            numsAndOps.push(display.innerText)

            clearText();
    
            op = getInnerText()
            updateDisplay(display.innerText + op)
        }

        

        // Logic for when user clicks equals sign
    } else if (buttonType("equals")) {
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

    switch(operation) {
        case '+':
            return add(num1, num2)

        case '-':
            return sub(num1, num2)

        case '*':
            return mul(num1, num2)

        case '/':
            return div(num1, num2)
        
    }
}

function add(x, y) {
    return x + y
}

function sub(x, y) {
    return x - y
}

function mul(x, y) {
    return x * y
}

function div(x, y) {
    return x / y
}

function clearText() {
    display.innerText = ''
}

function resetData() {
    num1 = "";
    num2 = "";
    numsAndOps.length = 0
}

function updateDisplay(input) {
    display.innerText = input
}

function getInnerText() {
    return event.target.innerText;
}

function buttonType(cssClass) {
    return event.target.classList.contains(cssClass)
}