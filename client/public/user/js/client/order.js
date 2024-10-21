//Steps
let step = 0;

if (order.status == 1 || order.status == 2) step = 1
else if (order.status == 3) step = 2
else if (order.status == 4) step = 3;

setStep(step);

//Logs
const logsList = document.getElementById('logsList');

for (let x of order.logs)
{
    let text;
    if (x.newStatus == 1) text = "El pedido fue paletizado"
    else if (x.newStatus == 2) text = "El pedido fue despachado "
    else if (x.newStatus == 3) text = "El pedido esta en viaje"
    else if (x.newStatus == 4) text = "El pedido fue entregado";

    let date = (new Date(x.date)).toLocaleString('es-AR');

    let html = `<li><small>${date} | ${text}</small></li>`
    logsList.insertAdjacentHTML('beforeend', html);
}