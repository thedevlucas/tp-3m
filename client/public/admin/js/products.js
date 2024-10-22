const inputs = document.querySelectorAll('.input');
inputs.forEach(e => {
    const decreaseButton = e.querySelector('.decrease');
    const increaseButton = e.querySelector('.increase');
    const quantitySpan = e.querySelector('.quantity');
    const quantityInput = e.querySelector('.quantity-input');

    decreaseButton.addEventListener('click', function() {
        let currentValue = parseInt(quantitySpan.textContent);
        if (currentValue > 0) {
            currentValue--;
            quantitySpan.textContent = currentValue;
            quantityInput.value = currentValue;
        }
    });

    increaseButton.addEventListener('click', function() {
        let currentValue = parseInt(quantitySpan.textContent);
        currentValue++;
        quantitySpan.textContent = currentValue;
        quantityInput.value = currentValue;
    });
})

const form = document.getElementById('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
})