// Calculator class to handle all calculator operations
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    // Clear all values and reset calculator
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    // Delete the last digit entered
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    // Append a number to the current operand
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand.toString() + number.toString();
    }

    // Choose an operation (+, -, ×, /)
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Perform the calculation based on the chosen operation
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Toggle the sign of the current number (positive/negative)
    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    // Convert the current number to a percentage
    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    // Format the number for display (add commas for thousands, etc.)
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update the calculator display
    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Select DOM elements
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-action]');
const equalsButton = document.querySelector('[data-action="calculate"]');
const clearButton = document.querySelector('[data-action="clear"]');
const toggleSignButton = document.querySelector('[data-action="toggle-sign"]');
const percentageButton = document.querySelector('[data-action="percentage"]');
const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');

// Create calculator instance
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Add event listeners for number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Add event listeners for operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.action === 'add' || button.dataset.action === 'subtract' || 
            button.dataset.action === 'multiply' || button.dataset.action === 'divide') {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        }
    });
});

// Add event listener for equals button
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Add event listener for clear button
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Add event listener for toggle sign button
toggleSignButton.addEventListener('click', () => {
    calculator.toggleSign();
    calculator.updateDisplay();
});

// Add event listener for percentage button
percentageButton.addEventListener('click', () => {
    calculator.percentage();
    calculator.updateDisplay();
});

// Add keyboard support
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') calculator.appendNumber(event.key);
    if (event.key === '+') calculator.chooseOperation('+');
    if (event.key === '-') calculator.chooseOperation('-');
    if (event.key === '*') calculator.chooseOperation('×');
    if (event.key === '/') calculator.chooseOperation('/');
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
    }
    if (event.key === 'Escape') calculator.clear();
    if (event.key === 'Backspace') calculator.delete();
    calculator.updateDisplay();
});