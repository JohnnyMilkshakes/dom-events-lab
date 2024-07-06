export class Calculation {
    /**
     * Constructor to initialize a calculation
     * @param {number} x - first operand
     * @param {string} op - operator
     * @param {number} y - second operand
     * @param {number|null} result - result of the calculation
     */
    constructor(x = 0, op = '', y = 0, result = null) {
        this.x = x; // first operand
        this.op = op; // operator
        this.y = y; // second operand
        this.result = result; // result of the calculation
    }

    /**
     * Method to perform the calculation based on the operator
     * @returns {number} - result of the calculation
     * @throws {Error} - if the operator is unknown
     */
    calculate() {
        switch (this.op) {
            case '+': return this.add();
            case '-': return this.sub();
            case '*': return this.mul();
            case '/': return this.div();
            default: throw new Error("Unknown operator");
        }
    }

    /**
     * Method to perform addition
     * @returns {number} - sum of x and y
     */
    add() {
        this.result = this.x + this.y;
        return this.result;
    }

    /**
     * Method to perform subtraction
     * @returns {number} - difference of x and y
     */
    sub() {
        this.result = this.x - this.y;
        return this.result;
    }

    /**
     * Method to perform multiplication
     * @returns {number} - product of x and y
     */
    mul() {
        this.result = this.x * this.y;
        return this.result;
    }

    /**
     * Method to perform division
     * @returns {number} - quotient of x and y
     * @throws {Error} - if division by zero occurs
     */
    div() {
        if (this.y === 0) {
            throw new Error("Division by zero");
        }

        // If both operands are integers, perform normal division
        if (Number.isInteger(this.x) && Number.isInteger(this.y)) {
            this.result = this.x / this.y;
        } else {
            // Use precise division for floating-point numbers
            this.result = this.preciseDivide(this.x, this.y, 10);
        }

        return this.result;
    }

    /**
     * The preciseDivide function is designed to handle division operations with higher precision,
     * mitigating the common issue of floating-point arithmetic errors.
     * It scales the numbers to integers before performing the division to avoid precision loss.
     * 
     * @param {number} a - The numerator (the number to be divided).
     * @param {number} b - The denominator (the number by which the numerator is to be divided).
     * @param {number} precision - The number of decimal places to be used for scaling the numbers to integers.
     * @returns {number} - Result of the division with higher precision
     */
    preciseDivide(a, b, precision) {
        const factor = Math.pow(10, precision); // Scaling factor based on precision
        const scaledA = Math.round(a * factor); // Scale and round the numerator
        const scaledB = Math.round(b * factor); // Scale and round the denominator
        const answer = scaledA / scaledB; // Perform division on scaled values
        return answer; // Return the precise result
    }

    /**
     * Method to set the x value
     * @param {number} number - value to set as x
     * @returns {number} - updated x value
     */
    setX(number) {
        this.x = number;
        return this.x;
    }

    /**
     * Method to set the y value
     * @param {number} number - value to set as y
     * @returns {number} - updated y value
     */
    setY(number) {
        this.y = number;
        return this.y;
    }

    /**
     * Method to set either x or y value based on the operator
     * @param {number} number - value to set as x or y
     */
    setNumber(number) {
        this.op ? this.setY(number) : this.setX(number);
    }

    /**
     * Method to set the operator
     * @param {string} operator - operator to set
     * @returns {string} - updated operator
     */
    setOperator(operator) {
        this.op = operator;
        return this.op;
    }

    /**
     * Method to check if the calculation is ready to be performed
     * @returns {boolean} - true if x, y, and op are set, false otherwise
     */
    isCalcReady() {
        if (this.x && this.y && this.op) return true;
        return false;
    }
}
