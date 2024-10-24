//Steps
let step = 0;

setStep(order.status);

//Confirmation
const form = document.getElementById('form');

if (order.status != 1)
{
    form.querySelector('button').remove();
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}