let step = -1;

for (let i = 0; i < trips.length; i++) {
    const x = trips[i];
    
    if (x.status == 3 && i == 0) step += 1;
    if (x.status == 4)
    {
        step += 1;
        if (i == 0) {
            step += 1;
        }
        if (i === trips.length - 1) {
            step += 1;
        }
    }
}

setStep(step);

const form = document.getElementById('form');
const inputs = document.getElementById('inputs');
const button = document.getElementById('button');
const active = document.querySelectorAll(".stepper-item");
const text = document.getElementById("orderText");
const comment = document.getElementById('comment');

let currentTrip = 0;
for (let e of active)
{
    if (e.classList.contains("active")) currentTrip = e.getAttribute('value');
}

if (step < 0)
{
    inputs.style.display = "none";
    inputs.querySelector('input').value = "start";
    button.innerText = "Iniciar viaje";
}

const id = window.location.pathname.split('/').pop();
if (currentTrip == 0)
{
    currentTrip = id;
    text.innerText = "Viaje terminado";
    inputs.style.display = "none";
    button.style.display = "none";
}
else if (currentTrip != null) 
{
    let order = trips.find(e => e.id == currentTrip);
    text.innerText = order.order
    comment.innerText = order.comments
}

form.action += `${id}/${currentTrip}`