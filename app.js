// Class to manage the state of the calculator
class State {
    constructor(err = false, previousPress = '', history = []) {
        this.err = err; // boolean to track if there is an error
        this.history = history; // array to store calculation history
        this.previousPress = previousPress;
    }

    getPreviousX() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].x;
    }

    getPreviousY() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].y;
    }

    getPreviousOp() {
        return this.history.length === 0 ? '' : this.history[this.history.length - 1].op;
    }

    // Method to get the result of the previous calculation
    getPreviousOutput() {
        // If there is no history, return 0, otherwise return the result of the last calculation
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
    }

    // Method to add a new calculation to the history
    addToHistory(calcObj) {
        // Create a new calculation object and add it to the history array
        this.history.push(new Calculation(calcObj.x, calcObj.op, calcObj.y, calcObj.result));
        console.log(this.history)
    }
}

// Class to create a calculation object
class Calculation {
    constructor(x = 0, op = '', y = 0, result = null) {
        this.x = x; // first operand
        this.op = op; // operator
        this.y = y; // second operand
        this.result = result; // result of the calculation
    }

    // Method to perform the calculation based on the operator
    calculate() {
        switch (this.op) {
            case '+': return this.add();
            case '-': return this.sub();
            case '*': return this.mul();
            case '/': return this.div();
            default: throw new Error("Unknown operator");
        }
    }

    // Method to perform addition
    add() {
        this.result = this.x + this.y;
        return this.result
    }

    // Method to perform subtraction
    sub() {
        this.result = this.x - this.y;
        return this.result
    }

    // Method to perform multiplication
    mul() {
        this.result = this.x * this.y;
        return this.result
    }

    // Method to perform division
    div() {
        if (this.y === 0) {
            throw new Error("Division by zero");
        }

        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
            this.result = this.x / this.y;
        } else {
            this.result = this.preciseDivide(this.x, this.y, 10)
        }

        return this.result
    }

    /*
        The preciseDivide function is designed to handle division operations with higher precision,
        mitigating the common issue of floating-point arithmetic errors. 
        JavaScript's native handling of floating-point numbers can lead to imprecise results, 
        especially when dealing with very small or very large numbers. 
        The preciseDivide function aims to address this by scaling the numbers to integers 
        before performing the division, thus avoiding the precision loss that can occur 
        with floating-point arithmetic.

        How to Use:

        To use the preciseDivide function, you need to provide three parameters:

        a: The numerator (the number to be divided).
        b: The denominator (the number by which the numerator is to be divided).
        precision: The number of decimal places to be used for scaling the numbers to integers. 
    */
    preciseDivide(a, b, precision) {
        // Determine a scaling factor based on the desired precision. 
        // e.g., for precision 10, factor = 10^10 = 10000000000.
        const factor = Math.pow(10, precision);
    
        // Scale the numerator (a) and denominator (b) by the factor and round them.
        // This converts them to integers to avoid floating-point precision issues.
        // Math.round(a * factor) scales 'a' and rounds it to the nearest integer.
        // Math.round(b * factor) scales 'b' and rounds it to the nearest integer.
        const scaledA = Math.round(a * factor);
        const scaledB = Math.round(b * factor);
    
        // Perform the division on the scaled and rounded values to get a precise result.
        // Since both scaledA and scaledB are integers, this avoids precision issues.
        const answer = scaledA / scaledB;
    
        // Return the result of the division.
        // The result is already scaled down appropriately because we divided scaledA by scaledB.
        return answer;
    }

    setX(number) {
        this.x = number;
        return this.x
    }

    setY(number) {
        this.y = number;
        return this.y
    }

    setNumber(number) {
        this.op ? this.setY(number) : this.setX(number)
    }

    // Method to set the operator
    setOperator(operator) {
        this.op = operator;
        return this.op
    }

    isCalcReady() {
        if (this.x && this.y && this.op) return true

        return false
    }
}

// CalculatorController function to manage the calculator's operations and UI
// This function is a closure that encapsulates the calculator state and logic
const CalculatorController = () => {
    let state = new State(); // Initialize state
    let currentCalculation = new Calculation(); // Initialize current calculation object
    let userInput = [0]; // Array to store user input
    const display = document.querySelector(".display"); // Display element
    const operators = document.querySelectorAll(".operator"); // Operator buttons
    const plusStyle = document.querySelector(".plus").style;
    const minusStyle = document.querySelector(".minus").style;
    const multiplyStyle = document.querySelector(".multiply").style;
    const divideStyle = document.querySelector(".divide").style;

    // Function to initialize event listeners
    const initEventListeners = () => {
        const calculator = document.querySelector("#calculator");
        calculator.addEventListener("click", handleInput);
        document.addEventListener("keydown", handleInput);
    };



// Function to handle input events
const handleInput = (event) => {
    const { inputType, inputText, inputStyle } = normalizeInputEvent(event);

    if (!inputType) return;

    if (state.previousPress === "operator") {
        resetOperatorColor();
    }

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

    console.log(currentCalculation)

    state.previousPress = inputType;
};

// Function to normalize the input event and return the type, text, and style
const normalizeInputEvent = (event) => {
    let inputType, inputText, inputStyle;

    // Define key mapping for keydown events
    const keyMap = {
        '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
        '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
        '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
        'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
    };

    if (event.type === "click") {
        const button = event.target;
        inputType = getButtonType(button);
        inputText = button.innerText;
        inputStyle = getButtonStyle(button);
    } else if (event.type === "keydown" && keyMap[event.key]) {
        inputType = keyMap[event.key];
        inputText = event.key === 'Enter' ? '=' : event.key;
        inputStyle = getButtonStyle(event.key);
    }

    return { inputType, inputText, inputStyle };
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

    // Function to get the style of the operator clicked
    const getButtonStyle = (button) => {
        if ((button.classList?.contains("plus") ?? false) || button === '+') return plusStyle;
        if ((button.classList?.contains("minus") ?? false) || button === '-') return minusStyle;
        if ((button.classList?.contains("multiply") ?? false) || button === '*') return multiplyStyle;
        if ((button.classList?.contains("divide") ?? false) || button === '/') return divideStyle;
        return "";
    };

    // Function to handle number input
    // Uses closure to modify and access userInput array and state object
    const handleNumberInput = (buttonText) => {
        // If there is an error, reset the input
        if (state.err) {
            userInput.length = 0;
        } 
        
        userInput.push(buttonText); // Add the new number to the input

        const fullInput = getNumber()

        currentCalculation.setNumber(fullInput)

        updateDisplay(fullInput); // Update the display
    };

    // Function to handle operator input
    // Uses closure to modify and access currentCalculation and userInput array
    const handleOperatorInput = (buttonText, buttonStyle) => {

        if (state.previousPress === "equals") {
            currentCalculation.setX(state.getPreviousOutput())
        }

        // this if statement enables chaining of previous output with new operator
        if (currentCalculation.isCalcReady()) {
            const result = currentCalculation.calculate();
            updateDisplay(result); // Update the display
            state.addToHistory(currentCalculation); // Add the calculation to history
            currentCalculation = new Calculation(); // Reset the current calculation
            currentCalculation.x = state.getPreviousOutput();
        }

        currentCalculation.setOperator(buttonText); // Set the operator
        userInput = []; // Reset user input
        
        buttonStyle.backgroundColor = 'white'; // Highlight the operator button
        buttonStyle.color = 'orange';
        
    };

    // Function to handle equals input
    // Uses closure to modify and access currentCalculation, state, and userInput
    const handleEqualsInput = () => {
        try {
            if (state.previousPress === "equals") {
                currentCalculation.setX(state.getPreviousOutput())
                currentCalculation.setOperator(state.getPreviousOp())
                currentCalculation.setY(state.getPreviousY())
            } 
            const result = currentCalculation.calculate(); // Perform the calculation
            updateDisplay(result); // Update the display
            state.addToHistory(currentCalculation); // Add the calculation to history
            currentCalculation = new Calculation(); // Reset the current calculation
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
        state.err = false; // Set error state to false
        currentCalculation = new Calculation(); // Reset the current calculation
    };

    // Function to handle negate input
    // Uses closure to modify and access userInput array and state object
    const handleNegate = () => {

        if (state.previousPress === "equals") {
            userInput = [state.getPreviousOutput()]
            userInput.unshift('-')
        } else if (userInput[0] === '-') {
            userInput.shift(); // Remove the negative sign
        } else if (getNumber() >= 0) {
            userInput.unshift('-'); // Add the negative sign
        }
        const fullInput = getNumber()

        currentCalculation.setNumber(fullInput)
        updateDisplay(fullInput); // Update the display
        state.err = false; // Set error state to false
    };

    // Function to handle percent input
    // Uses closure to modify and access userInput array and state object
    const handlePercent = () => {
        if (state.err) {
            return updateDisplay("Error");
        } else if (state.previousPress === "equals") {
            userInput = [currentCalculation.preciseDivide(state.getPreviousOutput(), 100, 10)]
        } else if (state.previousPress === "percent") {
            userInput = [currentCalculation.preciseDivide(getNumber(), 100, 10)]
        } else {
            userInput = [currentCalculation.preciseDivide(getNumber(), 100, 10)]
        }
        updateDisplay(getNumber())
        state.err = false;
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

};

/*-------------------------------- Initialize Calculator --------------------------------*/

// Initialize the calculator controller
CalculatorController();






























































// // State function to manage the state of the calculator
// // This function returns an object that keeps track of the calculator's state
// const State = (err = false, previousPress = '', history = []) => ({
//     err, // boolean to track if there is an error
//     history, // array to store calculation history
//     previousPress,

//     // Method to get the result of the previous calculation
//     getPreviousOutput() {
//         // If there is no history, return 0, otherwise return the result of the last calculation
//         return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
//     },

//     // Method to add a new calculation to the history
//     addToHistory(calcObj) {
//         // Create a new calculation object and add it to the history array
//         const previousCalculation = CalculationObject(calcObj.x, calcObj.op, calcObj.y, calcObj.result);
//         this.history.push(previousCalculation);
//     }
// });

// // CalculationObject function to create a calculation object
// // This function returns an object representing a single calculation
// const CalculationObject = (x = 0, op = '', y = 0, result = null) => ({
//     x, // first operand
//     y, // second operand
//     op, // operator
//     result, // result of the calculation

//     // Method to perform the calculation based on the operator
//     calculate() {
//         switch (this.op) {
//             case '+': return this.add();
//             case '-': return this.sub();
//             case '*': return this.mul();
//             case '/': return this.div();
//             default: throw new Error("Unknown operator");
//         }
//     },

//     // Method to perform addition
//     add() {
//         this.result = this.x + this.y;
//         return this.result
//     },

//     // Method to perform subtraction
//     sub() {
//         this.result = this.x - this.y;
//         return this.result
//     },

//     // Method to perform multiplication
//     mul() {
//         this.result = this.x * this.y;
//         return this.result
//     },

//     // Method to perform division
//     div() {
//         if (this.y === 0) {
//             throw new Error("Division by zero");
//         }
//         this.result = this.x / this.y;
//         return this.result
//     },

//     // Method to set the operator
//     setOperator(operator) {
//         this.op = operator;
//     },

//     // Method to reset the calculation object
//     reset() {
//         this.x = 0;
//         this.y = 0;
//         this.op = '';
//         this.result = null;
//     }
// });

// // CalculatorController function to manage the calculator's operations and UI
// // This function is a closure that encapsulates the calculator state and logic
// const CalculatorController = () => {
//     let state = State(); // Initialize state
//     let currentCalculation = CalculationObject(); // Initialize current calculation object
//     let userInput = [0]; // Array to store user input
//     const display = document.querySelector(".display"); // Display element
//     const operators = document.querySelectorAll(".operator"); // Operator buttons
//     const plusStyle = document.querySelector(".plus").style
//     const minusStyle = document.querySelector(".minus").style
//     const multiplyStyle = document.querySelector(".multiply").style
//     const divideStyle = document.querySelector(".divide").style

//     // Function to initialize event listeners
//     const initEventListeners = () => {
//         const calculator = document.querySelector("#calculator");
//         calculator.addEventListener("click", handleButtonClick);
//         document.addEventListener("keydown", handleKeyPress);
//     };

//     // Function to handle button clicks and key presses
//     // This function demonstrates closure as it captures and uses state and currentCalculation
//     const handleInput = (inputType, inputText, inputStyle = null) => {
//         resetOperatorColor();

//         switch (inputType) {
//             case "number":
//                 handleNumberInput(inputText);
//                 break;
//             case "operator":
//                 handleOperatorInput(inputText, inputStyle);
//                 break;
//             case "equals":
//                 handleEqualsInput();
//                 break;
//             case "clear":
//                 handleClear();
//                 break;
//             case "negate":
//                 handleNegate();
//                 break;
//             case "percent":
//                 handlePercent();
//                 break;
//         }
//         state.previousPress = inputType
//     };

//     // Function to handle button clicks
//     const handleButtonClick = (event) => {
//         const buttonType = getButtonType(event.target);
//         const buttonText = event.target.innerText;
//         const buttonStyle = getButtonStyle(event.target)
//         handleInput(buttonType, buttonText, buttonStyle);
//     };

//     // Function to handle key presses
//     const handleKeyPress = (event) => {
//         const keyMap = {
//             '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
//             '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
//             '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
//             'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
//         };

//         const buttonType = keyMap[event.key];
//         if (!buttonType) return;

//         const buttonText = event.key === 'Enter' ? '=' : event.key;

//         const buttonStyle = getButtonStyle(event.key)
//         handleInput(buttonType, buttonText, buttonStyle);
//     };

//     // Function to get the type of the button clicked
//     const getButtonType = (button) => {
//         if (button.classList.contains("number")) return "number";
//         if (button.classList.contains("operator")) return "operator";
//         if (button.classList.contains("equals")) return "equals";
//         if (button.classList.contains("clear")) return "clear";
//         if (button.classList.contains("negate")) return "negate";
//         if (button.classList.contains("percent")) return "percent";
//         return "";
//     };

//     // Function to get the style of the operator clicked
//     const getButtonStyle = (button) => {
//         if ((button?.classList?.contains("plus") ?? false) || button === '+') return plusStyle;
//         if ((button?.classList?.contains("minus") ?? false) || button === '-') return minusStyle;
//         if ((button?.classList?.contains("multiply") ?? false) || button === '*') return multiplyStyle;
//         if ((button?.classList?.contains("divide") ?? false) || button === '/') return divideStyle;
//         return "";
//     };

//     // Function to handle number input
//     // Uses closure to modify and access userInput array and state object
//     const handleNumberInput = (buttonText) => {
//         // If the user input starts with zero or there is an error, reset the input
//         if (userInput[0] === 0 || state.err) {
//             userInput.length = 0;
//         } else if (userInput[0] === '-' && userInput[1] === 0) {
//             userInput.pop();
//         }
//         userInput.push(buttonText); // Add the new number to the input
//         updateDisplay(userInput.join('')); // Update the display
//     };

//     // Function to handle operator input
//     // Uses closure to modify and access currentCalculation and userInput array
//     const handleOperatorInput = (buttonText, buttonStyle) => {
//         console.log(state.getPreviousOutput())
//         currentCalculation.x = state.previousPress === "equals" ? state.getPreviousOutput() : getNumber();
//         currentCalculation.setOperator(buttonText); // Set the operator
//         userInput = []; // Reset user input
//         if (buttonStyle) {
//             buttonStyle.backgroundColor = 'white'; // Highlight the operator button
//             buttonStyle.color = 'orange';
//         }
//     };

//     // Function to handle equals input
//     // Uses closure to modify and access currentCalculation, state, and userInput
//     const handleEqualsInput = () => {
//         try {
//             currentCalculation.y = userInput.length === 0 ? currentCalculation.x : getNumber();
//             const result = currentCalculation.calculate(); // Perform the calculation
//             updateDisplay(result); // Update the display
//             state.addToHistory(currentCalculation); // Add the calculation to history
//             currentCalculation.reset(); // Reset the current calculation
//             userInput = [0]; // Reset user input
//         } catch (error) {
//             updateDisplay(error.message); // Display error message
//             state.err = true; // Set error state to true
//         }
//     };

//     // Function to handle clear input
//     // Uses closure to reset userInput, state, and currentCalculation
//     const handleClear = () => {
//         userInput = [0]; // Reset user input
//         updateDisplay('0'); // Update the display
//         state.err = false; // Set error state to false
//         currentCalculation.reset(); // Reset the current calculation
//     };

//     // Function to handle negate input
//     // Uses closure to modify and access userInput array and state object
//     const handleNegate = () => {
//         if (userInput[0] === '-') {
//             userInput.shift(); // Remove the negative sign
//         } else if (getNumber() >= 0) {
//             userInput.unshift('-'); // Add the negative sign
//         }
//         updateDisplay(userInput.join('')); // Update the display
//         state.err = false; // Set error state to false
//     };

//     // Function to handle percent input
//     // Uses closure to modify and access userInput array and state object
//     const handlePercent = () => {
//         if (state.err) {
//             updateDisplay("Error")
//         } else {
//             userInput = [getNumber() / 100]; // Convert the number to percentage
//             updateDisplay(userInput.join('')); // Update the display
//             state.err = false
//         }
//     };

//     // Function to get the number from user input
//     // Uses closure to access userInput array
//     const getNumber = () => {
//         return userInput.length === 0 ? 0 : parseFloat(userInput.join(''));
//     };

//     // Function to update the display
//     const updateDisplay = (input) => {
//         display.innerText = input;
//     };

//     // Function to reset operator button colors
//     const resetOperatorColor = () => {
//         operators.forEach((button) => {
//             button.style.backgroundColor = 'rgb(252, 139, 0)'; // Default color
//             button.style.color = 'rgb(255, 255, 255)'; // Default text color
//         });
//     };

//     // Initialize the event listeners
//     initEventListeners();

//     // Return the functions to manage calculator operations and UI
//     return {
//         handleButtonClick,
//         handleKeyPress,
//         handleNumberInput,
//         handleOperatorInput,
//         handleEqualsInput,
//         handleClear,
//         getNumber,
//         updateDisplay,
//         resetOperatorColor,
//         initEventListeners
//     };
// };

// /*-------------------------------- Initialize Calculator --------------------------------*/

// // Initialize the calculator controller
// const calculatorController = CalculatorController();

// console.log(calculatorController);































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