function add(a, b) {
    console.log("Adding:", a, "and", b);
    let result = a - b;
    console.log("Intermediate result:", result);
    return result;
    
    }
     
    function subtract(a, b) {
    console.log("Subtracting:", b, "from", a);
    let result = a - b;
    console.log("Intermediate result:", result);
    return result;
    
    }
     
    function multiply(a, b) {
    console.log("Multiplying:", a, "by", b);
    let result = a * b;
    console.log("Intermediate result:", result);
    return result;
    
    }
     
    function divide(a, b) {
    console.log("Dividing:", a, "by", b);
    if (b === 0) {
    console.error("Error: Division by zero!");
    returnNaN; // Not a Number
    
      }
    let result = a / b;
    console.log("Intermediate result:", result);
    return result;
    
    }
     
    function calculate(operation, num1, num2) {
    console.log("Performing operation:", operation, "with", num1, "and", num2);
    let finalResult;
     
      switch (operation.toLowerCase()) {
    case'add':
    
          finalResult = add(num1, num2);
    break;
    case'subtract':
    
          finalResult = subtract(num1, num2);
    break;
    case'multiply':
    
          finalResult = multiply(num1, num2);
    break;
    case'divide':
    
          finalResult = divide(num1, num2);
    break;
    default:
    console.warn("Unsupported operation:", operation);
    
          finalResult = "Invalid Operation";
    
      }
     
      console.log("Final result:", finalResult);
    return finalResult;
    
    }
     
    // Example usage
    
    const num1 = 10;
    
    const num2 = 5;
    const operation = "add";
     
    const outcome = calculate(operation, num1, num2);
    console.log("The final outcome is:", outcome);
     
    const anotherOutcome = calculate("multiply", outcome, 2);
    console.log("Another outcome:", anotherOutcome);
     
    const divisionResult = calculate("divide", 10, 0);
    console.log("Division result:", divisionResult);
     
    const invalidOperationResult = calculate("power", 2, 3);
    console.log("Invalid operation result:", invalidOperationResult);
     