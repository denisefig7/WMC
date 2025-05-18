document.getElementById('runButton').addEventListener('click', function() {
    document.getElementById('output').innerHTML = '';
    runFizzBuzz();
});

function runFizzBuzz() {
    const outputDiv = document.getElementById('output');
    let number = 1;
    
    while (true) {
        let result = '';
        let className = 'number-btn';
  
        if (number % 3 === 0) result += 'Fizz';
        if (number % 5 === 0) result += 'Buzz';
        if (number % 7 === 0) result += 'Whizz';
        if (number % 11 === 0) result += 'Bang';
        if (result === '') {
            result = number.toString();
            className += ' regular';
        } else {
            if (result === 'FizzBuzzWhizzBang') {
                className += ' fizzbuzzwhizzbang';
            } else if (result === 'FizzBuzz') {
                className += ' fizzbuzz';
            } else if (result.includes('Fizz')) className += ' fizz';
            if (result.includes('Buzz')) className += ' buzz';
            if (result.includes('Whizz')) className += ' whizz';
            if (result.includes('Bang')) className += ' bang';
        }
        
        const btn = document.createElement('button');
        btn.textContent = result;
        btn.className = className;
        btn.title = "Number: " + number;
        outputDiv.appendChild(btn);
        
        if (result === 'FizzBuzzWhizzBang') {
            const message = document.createElement('div');
            message.textContent = 'Found FizzBuzzWhizzBang at number ' + number + '!';
            message.style.width = '100%';
            message.style.marginTop = '10px';
            message.style.fontWeight = 'bold';
            outputDiv.appendChild(message);
            break;
        }
        
        number++;
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
}