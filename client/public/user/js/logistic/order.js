//Steps
let step = 0;

if (order.status == 1) step = 1
else if (order.status == 3) step = 2
else if (order.status == 4) step = 3;

setStep(step);

//Confirmation
const commentsText = document.getElementById('comments');
const form = document.getElementById('form');
const select = document.getElementById('vehicle');

if (order.status >= 2)
{
    commentsText.value = comments;
    commentsText.disabled = true;
    form.querySelector('button').remove();
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}
console.log(order)