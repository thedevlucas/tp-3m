const items = document.getElementById("items");

for (let x of orders)
{
    let date = (new Date(x.date)).toLocaleDateString('es-AR');
    let html = `<tr>
        <td>${x.name}</td>
        <td>${x.quantity}</td>
        <td>${date}</td>
        <td><span class="status ${statusList[x.status]}">${statusList[x.status].capitalize()}</span></td>
        <td><a href="/user/pedidos/view/${x.id}"><i class='bx bx-edit'></i></a></td>
    </tr>`

    items.insertAdjacentHTML('beforebegin', html);
}