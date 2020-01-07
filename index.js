const DECIMAL_POINT_COMMA = false;

function calculateExpression(expression) {
    var errors = []
    var result

    /* Catch any mathematical errors */
    // divide by zero
    if (( expression.operator == 'DIVIDE') && (expression.rightTerm == 0))
    {
        errors.push('Cannot divide by zero!')
    }

    if (errors.length != 0)
    {
        return [result, errors]
    }

    switch (expression.operator) {
        case 'PLUS':
            result = expression.leftTerm + expression.rightTerm;
            break;
        case 'MINUS':
            result = expression.leftTerm - expression.rightTerm;
            break;
        case 'DIVIDE':
            result = expression.leftTerm / expression.rightTerm;
            break;
        case 'MULTIPLY':
            result = expression.leftTerm * expression.rightTerm;
            break;
        default:
            errors.push('Internal Error')
            console.log('Internal Error (expression.operator = ' + expression.operator + ')')
      }
      return [result, errors]
}

function parseTerm(input, errors, sideOfOperator, decimalComma)
{
    var termString = input.replace(/\s/g, '');

    if (decimalComma)
    {
        var deciamlPoints = (termString.match(/\,/g)||[]).length
    }
    else
    {
        var deciamlPoints = (termString.match(/\./g)||[]).length
    }

    if (deciamlPoints > 1)
    {
        errors.push('Multiple decimal points in ' + sideOfOperator + ' term')
        return [termString, errors]
    }

    if (deciamlPoints > 1)
    {
        errors.push('Multiple decimal points in ' + sideOfOperator + ' term')
        return [termString, errors]
    }
    
    var numberDigitCharacters = (termString.match(/\d/g)||[]).length

    if (numberDigitCharacters == 0)
    {
        errors.push('Blank ' + sideOfOperator + ' term')
        return [termString, errors]
    }

    if (numberDigitCharacters + deciamlPoints != termString.length)
    {
        errors.push('Invalid Characters in ' + sideOfOperator + ' term')
        return [termString, errors]
    }

    var term = parseFloat(termString)
    
    return [term, errors]
}


function parseExpression(input, decimalComma)
{
    var errors = []
    var expression = {
        leftTerm: null,
        rightTerm: null,
        operator: '',
    }

    var plusOperators = (input.match(/\+/g)||[]).length
    var minusOperators = (input.match(/\-/g)||[]).length
    var multiplyOperators = (input.match(/\*/g)||[]).length
    var divideOperators = (input.match(/\//g)||[]).length

    var totalNumberOperators = plusOperators + minusOperators + multiplyOperators + divideOperators

    if (totalNumberOperators == 0)
    {
        errors.push('No mathematical operators')

        return [expression, errors]
    }

    if (totalNumberOperators > 1)
    {
        errors.push('More than one mathematical operator')

        return [expression, errors]
    }

    var inputAfterSplit = []

    if (plusOperators == 1)
    {
        expression.operator = 'PLUS'
        inputAfterSplit = input.split('+');
    }
        
    if (minusOperators == 1)
    {
        expression.operator = 'MINUS'
        inputAfterSplit = input.split('-');
    }
        
    if (multiplyOperators == 1)
    {
        expression.operator = 'MULTIPLY'
        inputAfterSplit = input.split('*');
    }

    if (divideOperators == 1)
    {
        expression.operator = 'DIVIDE'
        inputAfterSplit = input.split('/');
    }

    if (inputAfterSplit.length != 2)
    {
        errors.push('Internal Error')
        console.log('Internal Error (inputAfterSplit = ' + inputAfterSplit.length + ')')

        return [expression, errors]
    }

    var parseLeft = parseTerm(inputAfterSplit[0], errors, 'left', decimalComma)
    expression.leftTerm = parseLeft[0]
    errors = parseLeft[1]

    var parseRight = parseTerm(inputAfterSplit[1], errors, 'right', decimalComma)
    expression.rightTerm = parseRight[0]
    errors = parseRight[1]

    return [expression, errors]

    console.log('plus', plusOperators, '\nminus', minusOperators, '\ndivide', divideOperators, '\nmultiply', multiplyOperators)
}

function calculator(input, decimalComma)
{
    if (input == '')
    {
        return 'None'
    }

    var parsedExpression = parseExpression(input, decimalComma)
    var expression = parsedExpression[0]
    var errors = parsedExpression[1]
    var result

    if (errors.length == 0)
    {
        var calculated = calculateExpression(expression)
        result = calculated[0]
        errors = calculated[1] 
    }

    console.log({result: result, errors: errors, hasErrors: (errors.length > 0)})
    return {result: result, errors: errors, hasErrors: (errors.length > 0)}
}


var vm = new Vue({
    el: '#calculator-app',
    data: {
        input: '',
        decimalComma: false
    },
    methods: {
        swapTypeDecimal: function() {
            this.decimalComma = !this.decimalComma
        }
    },
    computed: {
        output: function () {
            return calculator(this.input, this.decimalComma)
        },
        decimalTypeDisplay: function () {
            if (this.decimalComma)
            {
                return 'comma (,)'
            }
            else 
            {
                return 'full stop (.)'
            }
            
        },
    }
})