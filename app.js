/*-------------------------------- Constants --------------------------------*/
const numsAndOps = []
/*-------------------------------- Variables --------------------------------*/
let num1 = "",
  num2 = "",
  op = "",
  userInput = [],
  previousPress = ""

let numberPressed = false
let equalsPressed = false
let operatorPressed = false
let chaining = false
/*------------------------ Cached Element References ------------------------*/
const calculator = document.querySelector("#calculator");
const display = document.querySelector(".display");


/*----------------------------- Event Listeners -----------------------------*/
calculator.addEventListener("click", (event) => {

    // if user clicks C, clear the display and data in memory
    if (getButtonInnerText() === "C") {
        clearText()
        resetData()
        previousPress = 'C'

        // Logic for when user clicks a number
    } else if (buttonType("number")) {

        // Error may persist from previous button clicks, if so clear it
        if (display.innerText === "Error") {
            clearText()
        }

        // if the most recent button pressed is the equals, then reset the calculator state
        if (previousPress === 'equals') {
            clearText()
            resetData()
            
        }

        // if most recent button pressed is an operator,
        // add the operator to the array and reset display
        if (previousPress === 'operator') {
            console.log(op)
            numsAndOps.push(op)
            clearText()
            op = ''
        }

        if (chaining) {
            clearText()
        }


        userInput.push(getButtonInnerText())
        updateDisplay(userInput.join(''))
        previousPress = 'number'


        

        // Logic for when user clicks an operator 
    } else if (buttonType("operator")) {

        op = getButtonInnerText()

        // if the user tries to type an operator without any numbers display an error
        if (!display.innerText) {
            updateDisplay("Error")

        } else if (numsAndOps.length === 2 || chaining) {
            console.log('Chaining logic now')
            chaining = true
            numsAndOps.push(userInput.join('')) // add userIpnput to the array
            num1 = +numsAndOps[0] // unary plus operators to convert string to number, 
            num2 = +numsAndOps[2] // i asked chatgpt how to make that conversion 
            op = numsAndOps[1] 
            console.log(numsAndOps)

            computedValue = basicCalculator(num1, num2, op)
            console.log(computedValue)
            updateDisplay(computedValue)
            numsAndOps.length = 0
            numsAndOps.push(computedValue)
            console.log(numsAndOps)
            previousPress = 'operator'

        } else {

            // at this point the array should contain a series of numbers consistent with what is 
            // showing on the screen, join the user input array into one number and push it as 
            // a value into the nums and ops array 
            numsAndOps.push(userInput.join(''))

            clearText()
    
            updateDisplay(op)

            previousPress = 'operator'
        }

        userInput = []

        

        // Logic for when user clicks equals sign
    } else if (buttonType("equals")) {

        // if the user tries to click the equals sign without any numbers display an error
        if (!display.innerText) {
            updateDisplay("Error")
        } else {

            console.log(previousPress)


            // at this point the display should be showing a number, add it to the array
            numsAndOps.push(display.innerText)

            num1 = +numsAndOps[0] // unary plus operators to convert string to number, 
            num2 = +numsAndOps[2] // i asked chatgpt how to make that conversion 
            op = numsAndOps[1] 

            updateDisplay(basicCalculator(num1, num2, op))

            previousPress = 'equals'
        }
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
    equalsPressed = false
    operatorPressed = false
    chaining = false
    userInput = []
}

function updateDisplay(input) {
    display.innerText = input
}

function getButtonInnerText() {
    return this.event.target.innerText
}

function buttonType(cssClass) {
    return this.event.target.classList.contains(cssClass)
}
