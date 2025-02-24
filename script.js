function checkPrime() {
    const number = parseInt(document.getElementById('numberInput').value);
    const resultDiv = document.getElementById('result');
    
    // Clear previous result
    resultDiv.textContent = '';
    
    // Check if input is valid
    if (isNaN(number) || number < 1) {
        resultDiv.textContent = 'Please enter a valid positive number';
        resultDiv.style.color = 'red';
        return;
    }
    
    // Check if number is prime
    if (isPrime(number)) {
        resultDiv.textContent = `${number} is a prime number!`;
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = `${number} is not a prime number.`;
        resultDiv.style.color = 'red';
    }
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    const sqrt = Math.sqrt(num);
    for (let i = 3; i <= sqrt; i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}