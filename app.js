// State function to manage the state of the calculator
// This function returns an object that keeps track of the calculator's state
const State = (displayingOutput = false, err = false, history = []) => ({
    displayingOutput, // boolean to check if the output is currently being displayed
    err, // boolean to track if there is an error
    history, // array to store calculation history

    // Method to get the result of the previous calculation
    getPreviousOutput() {
        // If there is no history, return 0, otherwise return the result of the last calculation
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
    },

    // Method to add a new calculation to the history
    addToHistory(calcObj) {
        // Create a new calculation object and add it to the history array
        const previousCalculation = CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result);
        this.history.push(previousCalculation);
    }
});

// CalculationObject function to create a calculation object
// This function returns an object representing a single calculation
const CalculationObject = (x = 0, op = '', y = 0, result = null) => ({
    x, // first operand
    y, // second operand
    op, // operator
    result, // result of the calculation

    // Method to perform the calculation based on the operator
    calculate() {
        switch (this.op) {
            case '+': return this.add();
            case '-': return this.sub();
            case '*': return this.mul();
            case '/': return this.div();
            default: throw new Error("Unknown operator");
        }
    },

    // Method to perform addition
    add() {
        return this.x + this.y;
    },

    // Method to perform subtraction
    sub() {
        return this.x - this.y;
    },

    // Method to perform multiplication
    mul() {
        return this.x * this.y;
    },

    // Method to perform division
    div() {
        if (this.y === 0) {
            throw new Error("Division by zero");
        }
        return this.x / this.y;
    },

    // Method to set the operator
    setOperator(operator) {
        this.op = operator;
    },

    // Method to reset the calculation object
    reset() {
        this.x = 0;
        this.y = 0;
        this.op = '';
        this.result = null;
    }
});

// CalculatorController function to manage the calculator's operations and UI
// This function is a closure that encapsulates the calculator state and logic
const CalculatorController = () => {
    let state = State(); // Initialize state
    let currentCalculation = CalculationObject(); // Initialize current calculation object
    let userInput = [0]; // Array to store user input
    const display = document.querySelector(".display"); // Display element
    const operators = document.querySelectorAll(".operator"); // Operator buttons

    // Function to initialize event listeners
    const initEventListeners = () => {
        const calculator = document.querySelector("#calculator");
        calculator.addEventListener("click", handleButtonClick);
        document.addEventListener("keydown", handleKeyPress);
    };

    // Function to handle button clicks and key presses
    // This function demonstrates closure as it captures and uses state and currentCalculation
    const handleInput = (inputType, inputText, inputStyle = null) => {
        resetOperatorColor();

        switch (inputType) {
            case "number":
                handleNumberInput(inputText);
                break;
            case "operator":
                handleOperatorInput(inputText, inputStyle);
                break;
            case "equals":
                handleEqualsInput();
                break;
            case "clear":
                handleClear();
                break;
            case "negate":
                handleNegate();
                break;
            case "percent":
                handlePercent();
                break;
        }
    };

    // Function to handle button clicks
    const handleButtonClick = (event) => {
        const buttonType = getButtonType(event.target);
        const buttonText = event.target.innerText;
        const buttonStyle = event.target.style;
        handleInput(buttonType, buttonText, buttonStyle);
    };

    // Function to handle key presses
    const handleKeyPress = (event) => {
        const keyMap = {
            '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
            '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
            '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
            'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
        };

        const buttonType = keyMap[event.key];
        if (!buttonType) return;

        const buttonText = event.key === 'Enter' ? '=' : event.key;
        handleInput(buttonType, buttonText);
    };

    // Function to get the type of the button clicked
    const getButtonType = (button) => {
        if (button.classList.contains("number")) return "number";
        if (button.classList.contains("operator")) return "operator";
        if (button.classList.contains("equals")) return "equals";
        if (button.classList.contains("clear")) return "clear";
        if (button.classList.contains("negate")) return "negate";
        if (button.classList.contains("percent")) return "percent";
        return "";
    };

    // Function to handle number input
    // Uses closure to modify and access userInput array and state object
    const handleNumberInput = (buttonText) => {
        // If the user input starts with zero or there is an error, reset the input
        if (userInput[0] === 0 || state.err) {
            userInput.length = 0;
        } else if (userInput[0] === '-' && userInput[1] === 0) {
            userInput.pop();
        }
        userInput.push(buttonText); // Add the new number to the input
        updateDisplay(userInput.join('')); // Update the display
        state.displayingOutput = false; // Set displayingOutput to false
    };

    // Function to handle operator input
    // Uses closure to modify and access currentCalculation and userInput array
    const handleOperatorInput = (buttonText, buttonStyle) => {
        currentCalculation.x = state.displayingOutput ? state.getPreviousOutput() : getNumber();
        currentCalculation.setOperator(buttonText); // Set the operator
        userInput = []; // Reset user input
        if (buttonStyle) {
            buttonStyle.backgroundColor = 'white'; // Highlight the operator button
            buttonStyle.color = 'orange';
        }
    };

    // Function to handle equals input
    // Uses closure to modify and access currentCalculation, state, and userInput
    const handleEqualsInput = () => {
        try {
            currentCalculation.y = userInput.length === 0 ? currentCalculation.x : getNumber();
            const result = currentCalculation.calculate(); // Perform the calculation
            updateDisplay(result); // Update the display
            state.addToHistory(currentCalculation); // Add the calculation to history
            state.displayingOutput = true; // Set displayingOutput to true
            currentCalculation.reset(); // Reset the current calculation
            userInput = [0]; // Reset user input
        } catch (error) {
            updateDisplay(error.message); // Display error message
            state.err = true; // Set error state to true
        }
    };

    // Function to handle clear input
    // Uses closure to reset userInput, state, and currentCalculation
    const handleClear = () => {
        userInput = [0]; // Reset user input
        updateDisplay('0'); // Update the display
        state.displayingOutput = false; // Set displayingOutput to false
        state.err = false; // Set error state to false
        currentCalculation.reset(); // Reset the current calculation
    };

    // Function to handle negate input
    // Uses closure to modify and access userInput array and state object
    const handleNegate = () => {
        if (userInput[0] === '-') {
            userInput.shift(); // Remove the negative sign
        } else if (getNumber() >= 0) {
            userInput.unshift('-'); // Add the negative sign
        }
        updateDisplay(userInput.join('')); // Update the display
        state.displayingOutput = false; // Set displayingOutput to false
    };

    // Function to handle percent input
    // Uses closure to modify and access userInput array and state object
    const handlePercent = () => {
        userInput = [getNumber() / 100]; // Convert the number to percentage
        updateDisplay(userInput.join('')); // Update the display
        state.displayingOutput = false; // Set displayingOutput to false
    };

    // Function to get the number from user input
    // Uses closure to access userInput array
    const getNumber = () => {
        return userInput.length === 0 ? 0 : parseFloat(userInput.join(''));
    };

    // Function to update the display
    const updateDisplay = (input) => {
        display.innerText = input;
    };

    // Function to reset operator button colors
    const resetOperatorColor = () => {
        operators.forEach((button) => {
            button.style.backgroundColor = 'rgb(252, 139, 0)'; // Default color
            button.style.color = 'rgb(255, 255, 255)'; // Default text color
        });
    };

    // Initialize the event listeners
    initEventListeners();

    // Return the functions to manage calculator operations and UI
    return {
        handleButtonClick,
        handleKeyPress,
        handleNumberInput,
        handleOperatorInput,
        handleEqualsInput,
        handleClear,
        getNumber,
        updateDisplay,
        resetOperatorColor,
        initEventListeners
    };
};

/*-------------------------------- Initialize Calculator --------------------------------*/

// Initialize the calculator controller
const calculatorController = CalculatorController();

console.log(calculatorController);































// class State {
//     constructor(displayingOutput = false, err = false, history = []) {
//         this.displayingOutput = displayingOutput;
//         this.err = err;
//         this.history = history;
//     }

//     getPreviousOutput() {
//         if (this.history.length === 0) return 0;
//         return this.history[this.history.length - 1].result;
//     }

//     addToHistory(calcObj) {
//         const previousCalculation = new CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result);
//         this.history.push(previousCalculation);
//     }
// }

// class CalculationObject {
//     constructor(x = 0, op = '', y = 0, result = null) {
//         this.x = x;
//         this.y = y;
//         this.op = op;
//         this.result = result;
//     }

//     calculate() {
//         switch (this.op) {
//             case '+':
//                 this.result = this.add();
//                 break;
//             case '-':
//                 this.result = this.sub();
//                 break;
//             case '*':
//                 this.result = this.mul();
//                 break;
//             case '/':
//                 this.result = this.div();
//                 break;
//         }
//         return this.result;
//     }

//     add() {
//         return +this.x + +this.y;
//     }

//     sub() {
//         return +this.x - +this.y;
//     }

//     mul() {
//         return +this.x * +this.y;
//     }

//     div() {
//         return +this.x / +this.y;
//     }

//     setOperator(operator) {
//         this.op = operator;
//     }

//     reset() {
//         this.x = 0;
//         this.y = 0;
//         this.op = '';
//         this.result = null;
//     }
// }

// class CalculatorController {
//     constructor() {
//         this.state = new State();
//         this.currentCalculation = new CalculationObject();
//         this.userInput = [];
//         this.display = document.querySelector(".display");
//         this.operators = document.querySelectorAll(".operator");
//         this.initEventListeners();
//     }

//     initEventListeners() {
//         const calculator = document.querySelector("#calculator");
//         calculator.addEventListener("click", (event) => this.handleButtonClick(event));
//     }

//     handleButtonClick(event) {
//         const buttonType = this.getButtonType(event.target);
//         const buttonText = event.target.innerText;
//         this.resetOperatorColor()

//         if (buttonType === "number") {
//             this.handleNumberInput(buttonText);
//         } else if (buttonType === "operator") {
//             this.handleOperatorInput(buttonText);
//         } else if (buttonType === "equals") {
//             this.handleEqualsInput();
//         } else if (buttonText === "C") {
//             this.handleClear();
//         }
//     }

//     getButtonType(button) {
//         if (button.classList.contains("number")) return "number";
//         if (button.classList.contains("operator")) return "operator";
//         if (button.classList.contains("equals")) return "equals";
//         return "";
//     }

//     handleNumberInput(buttonText) {
//         this.userInput.push(buttonText);
//         this.updateDisplay(this.userInput.join(''));
//         this.state.displayingOutput = false;
//     }

//     handleOperatorInput(buttonText) {
//         if (this.state.displayingOutput) {
//             this.currentCalculation.x = this.state.getPreviousOutput();
//         } else {
//             this.currentCalculation.x = this.getNumber();
//         }
//         this.currentCalculation.setOperator(buttonText);
//         this.userInput = [];
//         event.target.style.backgroundColor = 'white';
//         event.target.style.color = 'orange';
//     }

//     handleEqualsInput() {
//         this.currentCalculation.y = this.userInput.length === 0 ? this.currentCalculation.x : this.getNumber();
//         const result = this.currentCalculation.calculate();
//         this.updateDisplay(result);
//         this.state.addToHistory(this.currentCalculation);
//         this.state.displayingOutput = true;
//         this.currentCalculation.reset();
//         this.userInput = [];
//     }

//     handleClear() {
//         this.userInput = [];
//         this.updateDisplay('0');
//         this.state.displayingOutput = false;
//         this.currentCalculation.reset();
//     }

//     getNumber() {
//         return this.userInput.length === 0 ? 0 : parseFloat(this.userInput.join(''));
//     }

//     updateDisplay(input) {
//         this.display.innerText = input;
//     }

//     resetOperatorColor() {
//         this.operators.forEach((button) => {
//             button.style.backgroundColor = 'rgb(252, 139, 0)';
//             button.style.color = 'rgb(255, 255, 255)';
//         });
//     }
// }

// /*-------------------------------- Initialize Calculator --------------------------------*/

// const calculatorController = new CalculatorController();





































// class State {
//     constructor(newCalculation = true, displayingOutput = false, operatorPressed = false, err = false, history = []) {
//         this.newCalculation = newCalculation
//         this.displayingOutput = displayingOutput
//         this.operatorPressed = operatorPressed
//         this.err = err
//         this.history = history
//     }

//     getPreviousOutput() {
        
//         const highestIndex = this.history.length - 1
//         const lastCalc = this.history[highestIndex]

//         return lastCalc.result
//     }

//     addToHistory(calcObj) {
//         let previousCalculation = new CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result)
//         this.history.push(previousCalculation)
//     }
// }

// class CalculationObject {
//     constructor(x = 0, op = '', y = 0, result = null) {
//         this.x = x
//         this.y = y
//         this.op = op
//         this.result = result
//     }

//     calculate() {

//         switch(this.op) {
//             case '+':
//                 this.result = this.add()
//                 break
    
//             case '-':
//                 this.result = this.sub()
//                 break
    
//             case '*':
//                 this.result = this.mul()
//                 break
    
//             case '/':
//                 this.result = this.div()
//                 break
//         }
//         return this.result
//     }

//     add() {
//         return +this.x + +this.y
//     }
    
//     sub() {
//         return +this.x - +this.y
//     }
    
//     mul() {
//         return +this.x * +this.y
//     }
    
//     div() {
//         return +this.x / +this.y
//     }

//     setOperator(operator) {
//         this.op = operator

//         event.target.style.backgroundColor = 'white'
//         event.target.style.color = 'orange'
//     }

//     reset() {
//         this.x = 0
//         this.y = 0
//         this.op = ''
//         this.result = null
//     }
// }

// /*-------------------------------- Constants --------------------------------*/

// /*-------------------------------- Variables --------------------------------*/

// let userInput = []
// let state = new State()
// let currentCalculation = new CalculationObject()

// /*------------------------ Cached Element References ------------------------*/

// const calculator = document.querySelector("#calculator");
// const display = document.querySelector(".display");
// const operators = document.querySelectorAll(".operator")

// /*----------------------------- Event Listeners -----------------------------*/

// calculator.addEventListener("click", (event) => {

//     // state.operatorPressed will always start as false
//     // we assume the user will type a number first so that logic is handled first
//     if (!state.operatorPressed) {
    
//         if (buttonType("number")) {

//             // push each number press to the userInput array
//             userInput.push(getButtonInnerText())

//             // do a .join('') on the array to get the entire number and display it 
//             updateDisplay(getNumber())

//             // its possible that output from a previous calculation was displaying when 
//             // the number was typed but since we overwrite that with the new input
//             // restore the displayingOutput state to false
//             state.displayingOutput = false
//         }

//         if (buttonType("operator")) {

//             // in the case that the calculator is displaying a previous result 
//             // set the previous result to the x value of the current calculation
//             if (state.displayingOutput) {
//                 currentCalculation.x = state.getPreviousOutput()

//             // Otherwise set the x value to be the user input
//             // if the user has no input before clicking an operator x gets set to 0
//             } else {
//                 currentCalculation.x = getNumber()
//             }

//             // get the operator and change color of button associated with it
//             currentCalculation.setOperator(getButtonInnerText())

//             // this ensures the else branch of logic executes on next button press
//             state.operatorPressed = true 

//             // reset user input for next number
//             userInput = []
//         }

//         if (getButtonInnerText() === "C") {
//             userInput = []
//             updateDisplay('0')
//             state.displayingOutput = false
//         }

//         // x input set and operator currently selected
//     } else {

//         resetOperatorColor()

//         if (buttonType("operator")) {
//             currentCalculation.setOperator(getButtonInnerText())
//         } 

//         if (buttonType("number")) {
//             userInput.push(getButtonInnerText())
//             updateDisplay(getNumber())
//         }

//         if (buttonType("equals")) {

//             if (userInput.length === 0) {
//                 currentCalculation.y = currentCalculation.x

//             } else {
//                 currentCalculation.y = getNumber()
//             }

//             let output = currentCalculation.calculate()
//             updateDisplay(output)

//             state.addToHistory(currentCalculation)
            
//             state.displayingOutput = true
//             state.operatorPressed = false
//             currentCalculation.reset()
//             userInput = []
//             console.log(state.history)
//         }

//         if (getButtonInnerText() === "C") {
//             currentCalculation.op = ''
//             state.operatorPressed = false
//         }
//     }
// });

// /*-------------------------------- Functions --------------------------------*/

// function getButtonInnerText() {
//     return this.event.target.innerText
// }

// function buttonType(cssClass) {
//     return this.event.target.classList.contains(cssClass)
// }

// function getNumber() {
//     if (userInput.length === 0) {
//         return 0
//     } else {
//         return +userInput.join('')
//     }
    
// }

// function updateDisplay(input) {
//     display.innerText = input
// }

// function resetOperatorColor() {
//     operators.forEach((button) => {
//         button.style.backgroundColor = 'rgb(252, 139, 0)'
//         button.style.color = 'rgb(255, 255, 255)'
//     })
// }