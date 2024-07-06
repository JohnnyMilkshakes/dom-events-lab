import  { Calculation }  from './calculation.js';

// Class to manage the state of the calculator
export class State {
    /** 
     * Constructor to initialize the state
     * @param {boolean} err - boolean to track if there is an error
     * @param {string} previousPress - stores the last pressed button type
     * @param {Array} history - array to store calculation history
     */
    constructor(err = false, previousPress = '', history = []) {
        this.err = err; // boolean to track if there is an error
        this.history = history; // array to store calculation history
        this.previousPress = previousPress; // stores the last pressed button type
    }

    /**
     * Method to get the x value of the previous calculation
     * @returns {number} - x value of the previous calculation or 0 if no history
     */
    getPreviousX() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].x;
    }

    /**
     * Method to get the y value of the previous calculation
     * @returns {number} - y value of the previous calculation or 0 if no history
     */
    getPreviousY() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].y;
    }

    /**
     * Method to get the operator of the previous calculation
     * @returns {string} - operator of the previous calculation or empty string if no history
     */
    getPreviousOp() {
        return this.history.length === 0 ? '' : this.history[this.history.length - 1].op;
    }

    /**
     * Method to get the result of the previous calculation
     * @returns {number} - result of the previous calculation or 0 if no history
     */
    getPreviousOutput() {
        return this.history.length === 0 ? 0 : this.history[this.history.length - 1].result;
    }

    /**
     * Method to add a new calculation to the history
     * @param {Object} calcObj - object containing x, op, y, and result of a calculation
     */
    addToHistory(calcObj) {
        // Create a new Calculation object and add it to the history array
        this.history.push(new Calculation(calcObj.x, calcObj.op, calcObj.y, calcObj.result));
        console.log(this.history);
    }
}