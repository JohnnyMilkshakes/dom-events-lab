 /**
     * Function to normalize the input event and return the type, text, and style
     * @param {Event} event - input event (click or keydown)
     * @returns {Object} - normalized input event details
     */
 export const normalizeInput = (event) => {
    let buttonElement, keyPress, inputType, inputText, inputStyle;

    buttonElement = event.type === "click" ? event.target : null
    keyPress = event.type === "keydown" ? event.key : null

    inputText = getButtonText(buttonElement || keyPress);

    inputType = getButtonClassName(buttonElement || keyPress); 

    inputStyle = getButtonStyle(buttonElement || keyPress);

    return { inputType, inputText, inputStyle };
};



const plusStyle = document.querySelector(".plus").style;
const minusStyle = document.querySelector(".minus").style;
const multiplyStyle = document.querySelector(".multiply").style;
const divideStyle = document.querySelector(".divide").style;

  /**
     * Function to get the text of the button clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {string} - type of the button
     */
  const getButtonText = (buttonElementOrKeyPress) => {
    return buttonElementOrKeyPress.innerText || buttonElementOrKeyPress;
};

    /**
     * Function to get the type of the button clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {string} - type of the button
     */
    const getButtonClassName = (button) => {
        const keyMap = {
          '0': 'number', '1': 'number', '2': 'number', '3': 'number', '4': 'number',
          '5': 'number', '6': 'number', '7': 'number', '8': 'number', '9': 'number',
          '+': 'operator', '-': 'operator', '*': 'operator', '/': 'operator',
          'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear'
        };
      
        const classTypes = ['number', 'operator', 'equals', 'clear', 'negate', 'percent'];
        
        if (button.classList) {
          return classTypes.find(type => button.classList.contains(type)) || '';
        } else {
          return keyMap[button] || '';
        }
      };
      

    /**
     * Function to get the style of the operator clicked
     * @param {HTMLElement|string} button - clicked button element or key
     * @returns {CSSStyleDeclaration} - style of the operator button
     */
    const getButtonStyle = (button) => {
        if (button?.classList?.contains("plus") || button === '+') return plusStyle;
        if (button?.classList?.contains("minus") || button === '-') return minusStyle;
        if (button?.classList?.contains("multiply") || button === '*') return multiplyStyle;
        if (button?.classList?.contains("divide") || button === '/') return divideStyle;
        return "";
    };


    const display = document.querySelector(".display"); // Display element
    const operators = document.querySelectorAll(".operator"); // Operator buttons

        /**
     * Function to get the number from user input
     * @returns {number} - number from user input array
     */
        export const getNumber = (userInput) => {
            return userInput.length === 0 ? 0 : parseFloat(userInput.join(''));
        };
    
        /**
         * Function to update the display
         * @param {number|string} input - input to display
         */
        export const updateDisplay = (input) => {
            display.innerText = input;
        };
    
        /**
         * Function to reset operator button colors
         */
        export const resetOperatorColor = () => {
            operators.forEach((button) => {
                button.style.backgroundColor = 'rgb(252, 139, 0)'; // Default color
                button.style.color = 'rgb(255, 255, 255)'; // Default text color
            });
        }