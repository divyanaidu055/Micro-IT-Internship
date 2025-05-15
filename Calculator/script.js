document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const basicMode = document.getElementById('basicMode');
    const advancedMode = document.getElementById('advancedMode');
    const basicButtons = document.getElementById('basicButtons');
    const advancedButtons = document.getElementById('advancedButtons');

    let currentInput = '';
    let currentOperation = null;
    let previousInput = '';
    let shouldResetDisplay = false;
    let isFunctionEntered = false;
    let expression = '';
    let displayExpression = '';
    let isAdvancedMode = false;
    let lastResult = '';
    let history = '';
    let lastDisplayInput = '';
    let lastDisplayOperation = '';
    let lastDisplayOperand = '';
    let justCalculated = false;

    // Helper to wrap the last number in the expression with a function
    function wrapLastNumber(expr, funcWrap) {
        // Find the last number or parenthesis group
        let match = expr.match(/(\d*\.?\d+|\([^()]*\))$/);
        if (match) {
            const last = match[0];
            const start = expr.lastIndexOf(last);
            return expr.substring(0, start) + funcWrap(last);
        } else {
            // If nothing found, just wrap the whole expr
            return funcWrap(expr);
        }
    }

    // Mode switching
    basicMode.addEventListener('click', () => {
        basicMode.classList.add('active');
        advancedMode.classList.remove('active');
        basicButtons.classList.remove('hidden');
        advancedButtons.classList.add('hidden');
        isAdvancedMode = false;
        clearCalculator();
    });

    advancedMode.addEventListener('click', () => {
        advancedMode.classList.add('active');
        basicMode.classList.remove('active');
        advancedButtons.classList.remove('hidden');
        basicButtons.classList.add('hidden');
        isAdvancedMode = true;
        clearCalculator();
    });

    // Button click handlers
    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (button.classList.contains('number')) {
                handleNumber(value);
            } else if (button.classList.contains('operator')) {
                handleOperator(value);
            } else if (button.classList.contains('equals')) {
                calculate();
            } else if (button.classList.contains('clear')) {
                clearCalculator();
            } else if (button.classList.contains('decimal')) {
                handleDecimal();
            } else if (button.classList.contains('backspace')) {
                handleBackspace();
            }
        });
    });

    function handleNumber(num) {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        if (isFunctionEntered) {
            currentInput = num;
            isFunctionEntered = false;
            if (isAdvancedMode) {
                expression = num;
                displayExpression = num;
            } else {
                displayExpression = num;
            }
        } else if (isAdvancedMode && justCalculated) {
            // Start new expression after calculation if a number is pressed
            expression = num;
            displayExpression = num;
            currentInput = num;
            justCalculated = false;
        } else {
            currentInput += num;
            if (isAdvancedMode) {
                expression += num;
                displayExpression += num;
            } else {
                displayExpression += num;
            }
        }
        updateDisplay();
    }

    function handleOperator(op) {
        if (isAdvancedMode && justCalculated) {
            // Continue from result if operator is pressed after calculation
            expression = lastResult;
            displayExpression = lastResult;
            justCalculated = false;
        }
        if (currentInput === '' && !isAdvancedMode) return;

        if (previousInput !== '' && !isAdvancedMode) {
            calculate();
        }

        switch (op) {
            case '+':
            case '-':
            case '×':
            case '÷':
                if (isAdvancedMode) {
                    const operator = op === '×' ? '*' : op === '÷' ? '/' : op;
                    expression += operator;
                    displayExpression += ` ${op} `;
                    currentInput = '';
                } else {
                    currentOperation = op;
                    previousInput = currentInput;
                    displayExpression = `${currentInput} ${op} `;
                    lastDisplayInput = currentInput;
                    lastDisplayOperation = op;
                    shouldResetDisplay = true;
                }
                break;
            case '±':
                if (isAdvancedMode) {
                    expression = `-(${expression})`;
                    displayExpression = `-(${displayExpression})`;
                    currentInput = `-(${currentInput})`;
                } else {
                    currentInput = (-parseFloat(currentInput)).toString();
                    displayExpression = currentInput;
                }
                updateDisplay();
                break;
            case '%':
                if (isAdvancedMode) {
                    expression = `(${expression})/100`;
                    displayExpression = `(${displayExpression})%`;
                    currentInput = `(${currentInput})%`;
                } else {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                    displayExpression = currentInput;
                }
                updateDisplay();
                break;
            // Advanced operations
            case 'sin':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.sin(${x} * Math.PI / 180)`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `sin(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `sin(${currentInput})`;
                    currentInput = Math.sin(parseFloat(currentInput) * Math.PI / 180).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'cos':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.cos(${x} * Math.PI / 180)`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `cos(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `cos(${currentInput})`;
                    currentInput = Math.cos(parseFloat(currentInput) * Math.PI / 180).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'tan':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.tan(${x} * Math.PI / 180)`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `tan(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `tan(${currentInput})`;
                    currentInput = Math.tan(parseFloat(currentInput) * Math.PI / 180).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case '√':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.sqrt(${x})`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `√(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `√(${currentInput})`;
                    currentInput = Math.sqrt(parseFloat(currentInput)).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'x²':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.pow(${x}, 2)`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `${x}²`);
                    currentInput = '';
                } else {
                    displayExpression = `${currentInput}²`;
                    currentInput = Math.pow(parseFloat(currentInput), 2).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'xʸ':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.pow(${x}, `);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `${x}^`);
                    currentInput = '';
                } else {
                    currentOperation = '^';
                    previousInput = currentInput;
                    displayExpression = `${currentInput} ^ `;
                    lastDisplayInput = currentInput;
                    lastDisplayOperation = '^';
                    shouldResetDisplay = true;
                }
                break;
            case 'log':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.log10(${x})`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `log(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `log(${currentInput})`;
                    currentInput = Math.log10(parseFloat(currentInput)).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'ln':
                if (isAdvancedMode) {
                    expression = wrapLastNumber(expression, (x) => `Math.log(${x})`);
                    displayExpression = wrapLastNumber(displayExpression, (x) => `ln(${x})`);
                    currentInput = '';
                } else {
                    displayExpression = `ln(${currentInput})`;
                    currentInput = Math.log(parseFloat(currentInput)).toString();
                }
                isFunctionEntered = false;
                updateDisplay();
                break;
            case 'π':
                if (isAdvancedMode) {
                    expression += 'Math.PI';
                    displayExpression += 'π';
                    currentInput += 'π';
                } else {
                    currentInput = Math.PI.toString();
                    displayExpression = currentInput;
                }
                updateDisplay();
                break;
            case 'e':
                if (isAdvancedMode) {
                    expression += 'Math.E';
                    displayExpression += 'e';
                    currentInput += 'e';
                } else {
                    currentInput = Math.E.toString();
                    displayExpression = currentInput;
                }
                updateDisplay();
                break;
            case '(':
            case ')':
                if (isAdvancedMode) {
                    expression += op;
                    displayExpression += op;
                    currentInput += op;
                } else {
                    currentInput += op;
                    displayExpression += op;
                }
                updateDisplay();
                break;
        }
    }

    function handleDecimal() {
        if (shouldResetDisplay) {
            currentInput = '0';
            shouldResetDisplay = false;
        }
        if (!currentInput.includes('.')) {
            currentInput += '.';
            if (isAdvancedMode) {
                expression += '.';
                displayExpression += '.';
            } else {
                displayExpression += '.';
            }
            updateDisplay();
        }
    }

    function handleBackspace() {
        currentInput = currentInput.slice(0, -1);
        if (isAdvancedMode) {
            expression = expression.slice(0, -1);
            displayExpression = displayExpression.slice(0, -1);
        } else {
            displayExpression = displayExpression.slice(0, -1);
        }
        history = '';
        updateDisplay();
    }

    function calculate() {
        if (isAdvancedMode) {
            try {
                // Replace any remaining display symbols with their JavaScript equivalents
                let evalExpression = expression
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/π/g, 'Math.PI')
                    .replace(/e/g, 'Math.E');

                // Add missing closing parentheses
                const openCount = (evalExpression.match(/\(/g) || []).length;
                const closeCount = (evalExpression.match(/\)/g) || []).length;
                if (openCount > closeCount) {
                    evalExpression += ')'.repeat(openCount - closeCount);
                }

                const result = eval(evalExpression);
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid result');
                }
                lastResult = result.toString();
                history = `${displayExpression} = ${lastResult}`;
                currentInput = lastResult;
                expression = lastResult;
                displayExpression = lastResult;
                justCalculated = true;
                updateDisplay();
            } catch (error) {
                display.value = 'Error';
                setTimeout(clearCalculator, 1000);
            }
        } else {
            if (currentOperation === null || shouldResetDisplay) return;

            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;

            switch (currentOperation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    result = prev / current;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
            }

            currentInput = result.toString();
            history = `${lastDisplayInput} ${lastDisplayOperation} ${current} = ${result}`;
            displayExpression = history;
            currentOperation = null;
            previousInput = '';
            shouldResetDisplay = true;
            updateDisplay();
        }
    }

    function clearCalculator() {
        currentInput = '';
        previousInput = '';
        currentOperation = null;
        shouldResetDisplay = false;
        isFunctionEntered = false;
        expression = '';
        displayExpression = '';
        lastResult = '';
        history = '';
        lastDisplayInput = '';
        lastDisplayOperation = '';
        lastDisplayOperand = '';
        justCalculated = false;
        updateDisplay();
    }

    function updateDisplay() {
        if (history) {
            display.value = history;
        } else {
            display.value = displayExpression || '0';
        }
    }

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if (/[0-9]/.test(key)) {
            handleNumber(key);
        } else if (key === '.') {
            handleDecimal();
        } else if (key === '+' || key === '-') {
            handleOperator(key);
        } else if (key === '*') {
            handleOperator('×');
        } else if (key === '/') {
            handleOperator('÷');
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape') {
            clearCalculator();
        } else if (key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            if (isAdvancedMode) {
                expression = expression.slice(0, -1);
                displayExpression = displayExpression.slice(0, -1);
            } else {
                displayExpression = displayExpression.slice(0, -1);
            }
            history = '';
            updateDisplay();
        }
    });
}); 