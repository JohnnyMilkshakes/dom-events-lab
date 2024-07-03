class State {
    constructor(newCalculation = true, displayingOutput = false, operatorPressed = false, err = false, history = []) {
        this.newCalculation = newCalculation
        this.displayingOutput = displayingOutput
        this.operatorPressed = operatorPressed
        this.err = err
        this.history = history
    }

    getPreviousOutput() {
        
        const highestIndex = this.history.length - 1
        const lastCalc = this.history[highestIndex]

        return lastCalc.result
    }
}

class CalculationObject {
    constructor(x = 0, op = '', y = 0, result = null) {
        this.x = x
        this.y = y
        this.op = op
        this.result = result
    }

    calculate() {

        switch(this.op) {
            case '+':
                this.result = this.add()
                return this.result
    
            case '-':
                this.result = this.sub()
                return this.result
    
            case '*':
                this.result = this.mul()
                return this.result
    
            case '/':
                this.result = this.div()
                return this.result
        }
    }

    add() {
        return +this.x + +this.y
    }
    
    sub() {
        return +this.x - +this.y
    }
    
    mul() {
        return +this.x * +this.y
    }
    
    div() {
        return +this.x / +this.y
    }

    setOperator(operator) {
        this.op = operator

        event.target.style.backgroundColor = 'white'
        event.target.style.color = 'orange'
    }

    reset() {
        this.x = 0
        this.y = 0
        this.op = ''
        this.result = null
    }
}

/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/

let userInput = []
let state = new State()
let currentCalculation = new CalculationObject()

/*------------------------ Cached Element References ------------------------*/

const calculator = document.querySelector("#calculator");
const display = document.querySelector(".display");
const operators = document.querySelectorAll(".operator")

/*----------------------------- Event Listeners -----------------------------*/

calculator.addEventListener("click", (event) => {

    // This will always start as false and we assume the user will type a number first 
    // so that logic is handled first
    if (!state.operatorPressed) {
    
        if (buttonType("number")) {

            // push each number press to the userInput array
            userInput.push(getButtonInnerText())

            // do a .join('') on the array to get the entire number and display it 
            updateDisplay(getNumber())

            // its possible that output from a previous calculation was displaying when 
            // the number was typed but since we overwrite that with the new input
            // restore the displayingOutput state to false
            state.displayingOutput = false
        }

        if (buttonType("operator")) {

            // in the case that the calculator is displaying a previous result 
            // set the previous result to the x value of the current calculation
            if (state.displayingOutput) {
                currentCalculation.x = state.getPreviousOutput()

            // Otherwise set the x value to be the user input
            // if the user has no input before clicking an operator x gets set to 0
            } else {
                currentCalculation.x = getNumber()
            }

            // get the operator and change color of button associated with it
            currentCalculation.setOperator(getButtonInnerText())

            // this ensures the else branch of logic executes on next button press
            state.operatorPressed = true 

            // reset user input for next number
            userInput = []
        }

        if (getButtonInnerText() === "C") {
            userInput = []
            updateDisplay('0')
            state.displayingOutput = false
        }

        // x input set and operator currently selected
    } else {

        resetOperatorColor()

        if (buttonType("operator")) {
            currentCalculation.setOperator(getButtonInnerText())
        } 

        if (buttonType("number")) {
            userInput.push(getButtonInnerText())
            updateDisplay(getNumber())
        }

        if (buttonType("equals")) {

            if (userInput.length === 0) {
                currentCalculation.y = currentCalculation.x

            } else {
                currentCalculation.y = getNumber()
            }

            let output = currentCalculation.calculate()
            updateDisplay(output)

            addToHistory(currentCalculation)
            
            state.displayingOutput = true
            state.operatorPressed = false
            currentCalculation.reset()
            userInput = []
            console.log(state.history)
        }

        if (getButtonInnerText() === "C") {
            currentCalculation.op = ''
            state.operatorPressed = false
        }
    }
});

/*-------------------------------- Functions --------------------------------*/

function getButtonInnerText() {
    return this.event.target.innerText
}

function buttonType(cssClass) {
    return this.event.target.classList.contains(cssClass)
}

function getNumber() {
    if (userInput.length === 0) {
        return 0
    } else {
        return userInput.join('')
    }
    
}

function updateDisplay(input) {
    display.innerText = input
}

function addToHistory(calcObj) {
    let previousCalculation = new CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result)
    state.history.push(previousCalculation)
}

function resetOperatorColor() {
    operators.forEach((button) => {
        button.style.backgroundColor = 'rgb(252, 139, 0)'
        button.style.color = 'rgb(255, 255, 255)'
    })
}