import  { State }  from './state.js';
import  { normalizeInput, getNumber, updateDisplay, resetOperatorColor }  from './utils.js';
import  { Calculation }  from './calculation.js';

let state = new State(); // Initialize state
let currentCalculation = new Calculation(); // Initialize current calculation object
let userInput = [0]; // Array to store user input

/**
 * Function to initialize event listeners
 */
const initEventListeners = () => {
    const calculator = document.querySelector("#calculator");
    calculator.addEventListener("click", handleInput);
    document.addEventListener("keydown", handleInput);
};

/**
 * Function to handle input events
 * @param {Event} event - input event (click or keydown)
 */
const handleInput = (event) => {
    const { inputType, inputText, inputStyle } = normalizeInput(event);

    if (!inputType) return;

    if (state.previousPress === "operator") resetOperatorColor();

    if (inputType === "number") handleNumberInput(inputText);
    if (inputType === "operator") handleOperatorInput(inputText, inputStyle);
    if (inputType === "equals") handleEqualsInput();
    if (inputType === "clear") handleClear();
    if (inputType === "negate") handleNegate();
    if (inputType === "percent") handlePercent();

    console.log(currentCalculation);

    state.previousPress = inputType;
};

/**
 * Function to handle number input
 * @param {string} buttonText - text of the button clicked or key pressed
 */
const handleNumberInput = (buttonText) => {
    if (state.err) {
        userInput.length = 0; // If there is an error, reset the input
        state.err = false
    }

    userInput.push(buttonText); // Add the new number to the input

    const fullInput = getNumber(userInput);

    currentCalculation.setNumber(fullInput);

    updateDisplay(fullInput); // Update the display
};

/**
 * Function to handle operator input
 * @param {string} buttonText - text of the button clicked or key pressed
 * @param {CSSStyleDeclaration} buttonStyle - style of the operator button
 */
const handleOperatorInput = (buttonText, buttonStyle) => {
    if (state.previousPress === "equals") {
        currentCalculation.setX(state.getPreviousOutput());
    }

    // This if statement enables chaining of previous output with new operator
    if (currentCalculation.isCalcReady()) {
        const result = currentCalculation.calculate();
        updateDisplay(result); // Update the display
        state.addToHistory(currentCalculation); // Add the calculation to history
        currentCalculation = new Calculation(); // Reset the current calculation
        currentCalculation.setX(state.getPreviousOutput());
    }

    currentCalculation.setOperator(buttonText); // Set the operator
    userInput.length = 0; // Reset user input

    buttonStyle.backgroundColor = 'white'; // Highlight the operator button
    buttonStyle.color = 'orange';
};

/**
 * Function to handle equals input
 */
const handleEqualsInput = () => {
    try {
        if (state.previousPress === "equals") {
            currentCalculation.setX(state.getPreviousOutput());
            currentCalculation.setOperator(state.getPreviousOp());
            currentCalculation.setY(state.getPreviousY());
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

/**
 * Function to handle clear input
 */
const handleClear = () => {
    userInput = [0]; // Reset user input
    updateDisplay('0'); // Update the display
    state.err = false; // Set error state to false
    currentCalculation = new Calculation(); // Reset the current calculation
};

/**
 * Function to handle negate input
 */
const handleNegate = () => {
    if (state.previousPress === "equals") {
        userInput = [state.getPreviousOutput()];
        userInput.unshift('-');
    } else if (userInput[0] === '-') {
        userInput.shift(); // Remove the negative sign
    } else if (getNumber(userInput) >= 0) {
        userInput.unshift('-'); // Add the negative sign
    }
    const fullInput = getNumber(userInput);

    currentCalculation.setNumber(fullInput);
    updateDisplay(fullInput); // Update the display
    state.err = false; // Set error state to false
};

/**
 * Function to handle percent input
*/
const handlePercent = () => {
    if (state.err) {
        return updateDisplay("Error");
    } else if (state.previousPress === "equals") {
        userInput = [currentCalculation.preciseDivide(state.getPreviousOutput(), 100, 10)];
    } else if (state.previousPress === "percent") {
        userInput = [currentCalculation.preciseDivide(getNumber(userInput), 100, 10)];
    } else {
        userInput = [currentCalculation.preciseDivide(getNumber(userInput), 100, 10)];
    }
    updateDisplay(getNumber(userInput));
     state.err = false;
};

initEventListeners();
